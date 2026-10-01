import { actionDeleteWay } from './delete_way';
import { distanceToLineMeters, lineLengthMeters } from '../sidepath/offset_line';
import {
    combinedPathTags, commonTags, mergeSelection, reverseTags,
    type JoinSigns, type MergeSelection, type MergeWay, type PartKind, type SignRecommend
} from '../sidepath/merge_tags';
import type { Action } from '../core/history';
import type { coreGraph } from '../core';
import type { osmWay, WayId } from '../osm';

export interface ActionMergeSidepaths extends Action {
    /** the ways that stay, as paths (known after the action ran once) */
    survivorIds(): WayId[];
    /** `key=value` tags of the deleted ways that lost against the surviving way's value */
    dropped(): string[];
}

type Loc = [number, number];

/** Ways that run side by side: every node is at most this far from a way of the other kind */
const MAX_APART_METERS = 25;

export type MergeSidepathsSelection = MergeSelection | { disabled: 'apart' };


function wayLocs(graph: coreGraph, way: osmWay) {
    return graph.childNodes(way).map(node => node.loc as Loc);
}

/** From the first to the last node */
function direction(locs: Loc[]): Loc {
    return [locs[locs.length - 1][0] - locs[0][0], locs[locs.length - 1][1] - locs[0][1]];
}

function dot(a: Loc, b: Loc) {
    return a[0] * b[0] + a[1] * b[1];
}


/** A surviving way's tags with the other kind's tags, which are turned into its direction first */
function mergedTags(
    graph: coreGraph, survivor: osmWay, deleted: osmWay[], surviving: PartKind,
    recommend: SignRecommend | undefined, joinSigns: JoinSigns | undefined
) {
    const along = direction(wayLocs(graph, survivor));
    const other = commonTags(deleted.map(way => dot(along, direction(wayLocs(graph, way))) < 0 ? reverseTags(way.tags) : way.tags));
    const [bike, foot] = surviving === 'bike' ? [survivor.tags, other] : [other, survivor.tags];
    return combinedPathTags(bike, foot, { recommend, joinSigns, primary: surviving });
}


/** A deleted way's place in its relations goes to the surviving ways, ordered along the deleted way */
function moveMemberships(graph: coreGraph, way: osmWay, survivorIds: WayId[], replaced: Set<string>) {
    const locs = wayLocs(graph, way);
    const along = direction(locs);
    const position = new Map(survivorIds.map(id => {
        const other = wayLocs(graph, graph.entity(id));
        const middle = other[Math.floor(other.length / 2)];
        return [id, dot(along, [middle[0] - locs[0][0], middle[1] - locs[0][1]])];
    }));
    const ordered = [...survivorIds].sort((a, b) => position.get(a)! - position.get(b)!);

    for (const parent of graph.parentRelations(way)) {
        const relation = graph.entity(parent.id);
        const members = [];
        for (const member of relation.members) {
            if (member.id !== way.id) {
                members.push(member);
                continue;
            }
            for (const id of ordered) {
                const key = `${relation.id}/${id}/${member.role}`;
                if (replaced.has(key) || relation.memberByIdAndRole(id, member.role)) continue;
                replaced.add(key);
                members.push({ id, type: 'way' as const, role: member.role });
            }
        }
        graph = graph.replace(relation.update({ members }));
    }
    return graph;
}


/**
 * How the selected ways merge (see `mergeSelection`), or `undefined` when they are not cycleways
 * plus footways. Also checks that they run side by side.
 */
export function mergeSidepathsSelection(graph: coreGraph, wayIDs: WayId[]): MergeSidepathsSelection | undefined {
    const ways: MergeWay[] = [];
    for (const id of wayIDs) {
        const way = graph.hasEntity(id);
        if (!way || way.isClosed()) return undefined;
        if (!way.nodes.every(nodeID => graph.hasEntity(nodeID))) return undefined;
        ways.push({
            id,
            tags: way.tags,
            changeset: way.isNew() ? undefined : Number(way.changeset) || 0,
            lengthMeters: lineLengthMeters(wayLocs(graph, way))
        });
    }
    const selection = mergeSelection(ways);
    if (!selection || selection.disabled) return selection;

    // a footway that turns the corner is not the cycleway's other half
    const lines = (list: MergeWay[]) => list.map(way => wayLocs(graph, graph.entity(way.id as WayId)));
    const [survivors, deleted] = [lines(selection.survivors), lines(selection.deleted)];
    const apart = (from: Loc[][], to: Loc[][]) => from.some(line => line.some(
        loc => Math.min(...to.map(other => distanceToLineMeters(loc, other))) > MAX_APART_METERS
    ));
    if (apart(survivors, deleted) || apart(deleted, survivors)) return { disabled: 'apart' };
    return selection;
}


/**
 * Merge a cycleway and a footway that run side by side into one foot and cycle path (WORKDOC
 * feature 28). The older kind keeps its geometry and gets the tags of both; the other ways are
 * deleted, and their relation memberships move to the surviving ways.
 */
export function actionMergeSidepaths(
    wayIDs: WayId[],
    recommend: SignRecommend | undefined,
    joinSigns: JoinSigns | undefined
): ActionMergeSidepaths {
    let _survivorIds: WayId[] = [];
    let _dropped: string[] = [];

    const action: ActionMergeSidepaths = function(graph: coreGraph) {
        const selection = mergeSidepathsSelection(graph, wayIDs);
        if (!selection || selection.disabled) return graph;
        const { surviving } = selection;
        const survivors = selection.survivors.map(way => graph.entity(way.id as WayId));
        const deleted = selection.deleted.map(way => graph.entity(way.id as WayId));
        _survivorIds = survivors.map(way => way.id);
        const dropped = new Set<string>();

        for (const survivor of survivors) {
            const result = mergedTags(graph, survivor, deleted, surviving, recommend, joinSigns);
            for (const tag of result.dropped) dropped.add(tag);
            graph = graph.replace(survivor.update({ tags: result.tags }));
        }
        _dropped = [...dropped];

        const replaced = new Set<string>();
        for (const way of deleted) {
            graph = moveMemberships(graph, way, _survivorIds, replaced);
            graph = actionDeleteWay(way.id)(graph);
        }
        return graph;
    };

    action.disabled = function(graph: coreGraph) {
        const selection = mergeSidepathsSelection(graph, wayIDs);
        if (!selection) return 'not_eligible';
        return selection.disabled;
    };

    action.survivorIds = () => _survivorIds;
    action.dropped = () => _dropped;

    return action;
}
