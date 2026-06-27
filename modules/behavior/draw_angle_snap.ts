import { geoVecAngle, geoVecLength } from '../geo';
import type { Vec2 } from '../geo/vector';

/**
 * Angle snapping while drawing and editing lines and areas.
 *
 * Holding a modifier key constrains a node to a "pretty" angle, similar to how
 * presentation/vector tools (PowerPoint, Google Slides, Adobe
 * Illustrator/Photoshop, Figma, Inkscape) constrain shapes while a modifier is
 * held. Two steps are offered:
 *
 *   - no modifier      → free, any angle (unchanged default behaviour)
 *   - Shift            → coarse 45° steps
 *   - Shift + Alt/Opt  → fine 10° steps
 *
 * The single entry point `snapNodeAngleLoc` snaps one node of a way relative to
 * its neighbours. It is used both for the temporary draw node (which is already
 * inserted into the way being drawn) and for an existing node being dragged:
 *
 *   - With one neighbour (e.g. a line endpoint, or the first segment of a way)
 *     the new edge snaps relative to the previous edge — or to the screen
 *     horizontal when there is no previous edge.
 *   - With two neighbours (a corner, including an area's draw node, which sits
 *     between the last placed node and the closing first node) each adjacent
 *     edge snaps to a pretty angle and, when the cursor is within a search
 *     radius of where both rays meet, the node locks onto that "perfect corner"
 *     — e.g. snapping into a true 90° rectangle corner.
 *
 * All maths is done in projected screen pixels (like the rest of iD's drawing
 * code) and the result is projected back to a `[lon, lat]` location.
 */

/** Coarse snapping step in degrees (single modifier). */
export const DRAW_ANGLE_SNAP_COARSE_DEG = 45;

/** Fine snapping step in degrees (modifier combination). */
export const DRAW_ANGLE_SNAP_FINE_DEG = 10;

/**
 * Search radius (in screen pixels) within which a node with two neighbours
 * locks onto the "perfect corner" formed by snapping against both of them.
 */
export const NODE_ANGLE_SNAP_RADIUS_PX = 30;

type LngLat = [lon: number, lat: number];

interface Projection {
    (lonlat: LngLat): Vec2;
    invert(point: Vec2): LngLat;
}

interface SnapEntity {
    loc?: LngLat;
    nodes?: string[];
}

interface SnapWay {
    nodes: string[];
    isClosed(): boolean;
}

interface SnapGraph {
    parentWays(entity: unknown): SnapWay[];
}

interface SnapContext {
    projection: Projection;
    hasEntity(id: string): SnapEntity | undefined;
    graph(): SnapGraph;
}

/** Anything with the modifier-key flags of a DOM keyboard/pointer event. */
interface ModifierEvent {
    shiftKey?: boolean;
    altKey?: boolean;
}

/** One side of a node: the adjacent node and (optionally) the node beyond it. */
interface NodeSide {
    anchor: LngLat;
    reference: LngLat | null;
}

/**
 * Map the modifier keys of an event to an angle-snap step (in degrees), or
 * `null` when no snapping should be applied.
 */
export function drawAngleSnapStep(d3_event: ModifierEvent | null | undefined): number | null {
    if (!d3_event || !d3_event.shiftKey) return null;
    return d3_event.altKey ? DRAW_ANGLE_SNAP_FINE_DEG : DRAW_ANGLE_SNAP_COARSE_DEG;
}

function degToRad(deg: number): number {
    return (deg * Math.PI) / 180;
}

/**
 * Snap `cursorPx` so the segment `anchorPx → cursorPx` lands on a multiple of
 * `stepRad`, measured relative to `refPx → anchorPx` (the previous segment) or
 * to the screen horizontal when `refPx` is null. The distance from the anchor
 * is preserved; only the direction is constrained.
 */
function snapAnglePx(cursorPx: Vec2, anchorPx: Vec2, refPx: Vec2 | null, stepRad: number): Vec2 {
    const dist = geoVecLength(anchorPx, cursorPx);
    if (dist === 0) return [cursorPx[0], cursorPx[1]];

    const baseAngle = refPx ? geoVecAngle(refPx, anchorPx) : 0;
    const cursorAngle = geoVecAngle(anchorPx, cursorPx);
    const snappedAngle = baseAngle + Math.round((cursorAngle - baseAngle) / stepRad) * stepRad;

    return [
        anchorPx[0] + dist * Math.cos(snappedAngle),
        anchorPx[1] + dist * Math.sin(snappedAngle)
    ];
}

/** Intersection of the two infinite lines a1a2 and b1b2, or null if parallel. */
function intersectLines(a1: Vec2, a2: Vec2, b1: Vec2, b2: Vec2): Vec2 | null {
    const d = (a1[0] - a2[0]) * (b1[1] - b2[1]) - (a1[1] - a2[1]) * (b1[0] - b2[0]);
    if (Math.abs(d) < 1e-9) return null;

    const pa = a1[0] * a2[1] - a1[1] * a2[0];
    const pb = b1[0] * b2[1] - b1[1] * b2[0];
    return [
        (pa * (b1[0] - b2[0]) - (a1[0] - a2[0]) * pb) / d,
        (pa * (b1[1] - b2[1]) - (a1[1] - a2[1]) * pb) / d
    ];
}

/**
 * Return a snapped `[lon, lat]` for `nodeID` so that its adjacent edge(s) land
 * on multiples of `stepDeg`. If the geometry needed to snap isn't available the
 * original `loc` is returned unchanged, so callers can use it unconditionally.
 *
 * @param context        the iD context (needs `projection`, `hasEntity`, `graph`)
 * @param nodeID         id of the node to snap (a draw node or a dragged node)
 * @param loc            current cursor location `[lon, lat]`
 * @param stepDeg        snapping step in degrees (e.g. 45 or 10)
 * @param searchRadiusPx corner-lock search radius in screen pixels
 */
export function snapNodeAngleLoc(
    context: SnapContext,
    nodeID: string,
    loc: LngLat,
    stepDeg: number,
    searchRadiusPx: number = NODE_ANGLE_SNAP_RADIUS_PX
): LngLat {
    const node = context.hasEntity(nodeID);
    if (!node || !node.loc || !(stepDeg > 0)) return loc;

    const sides = nodeSides(context, nodeID, node);
    if (sides.length === 0) return loc;

    const cursorPx = context.projection(loc);
    const stepRad = degToRad(stepDeg);

    // snap each adjacent edge independently → one candidate ray per neighbour
    const rays = sides.map(function(side) {
        const anchorPx = context.projection(side.anchor);
        const refPx = side.reference ? context.projection(side.reference) : null;
        return { anchorPx, snappedPx: snapAnglePx(cursorPx, anchorPx, refPx, stepRad) };
    });

    // two neighbours: try locking to the perfect corner = ray intersection
    if (rays.length >= 2) {
        const cross = intersectLines(rays[0].anchorPx, rays[0].snappedPx, rays[1].anchorPx, rays[1].snappedPx);
        if (cross && geoVecLength(cross, cursorPx) <= searchRadiusPx) {
            return context.projection.invert(cross);
        }
    }

    // otherwise snap to whichever single-edge ray is closest to the cursor
    let best = rays[0].snappedPx;
    let bestDist = geoVecLength(best, cursorPx);
    for (let i = 1; i < rays.length; i++) {
        const dist = geoVecLength(rays[i].snappedPx, cursorPx);
        if (dist < bestDist) {
            best = rays[i].snappedPx;
            bestDist = dist;
        }
    }
    return context.projection.invert(best);
}

/**
 * Resolve up to two distinct sides (neighbour + the node beyond it) around
 * `nodeID`, using the first parent way in which the node has a neighbour.
 */
function nodeSides(context: SnapContext, nodeID: string, node: SnapEntity): NodeSide[] {
    const ways = context.graph().parentWays(node);
    for (const way of ways) {
        const sides = sidesForWay(context, way, nodeID);
        if (sides.length) return sides;
    }
    return [];
}

function sidesForWay(context: SnapContext, way: SnapWay, nodeID: string): NodeSide[] {
    if (!way || !way.nodes) return [];

    // for a closed way the first id is repeated as the last; treat as a cycle
    const closed = way.isClosed();
    const ids = closed ? way.nodes.slice(0, -1) : way.nodes;
    const n = ids.length;
    const i = ids.indexOf(nodeID);
    if (i === -1) return [];

    const sides: NodeSide[] = [];
    const seenAnchors = new Set<string>();

    // previous side: neighbour `prev`, reference = the node before `prev`
    const prev = neighbourIndex(i, -1, n, closed);
    if (prev !== -1) {
        addSide(context, sides, seenAnchors, ids[prev], pickReference(ids, neighbourIndex(prev, -1, n, closed), i), nodeID);
    }
    // next side: neighbour `next`, reference = the node after `next`
    const next = neighbourIndex(i, 1, n, closed);
    if (next !== -1) {
        addSide(context, sides, seenAnchors, ids[next], pickReference(ids, neighbourIndex(next, 1, n, closed), i), nodeID);
    }

    return sides;
}

function neighbourIndex(i: number, dir: number, n: number, closed: boolean): number {
    const j = i + dir;
    if (j >= 0 && j < n) return j;
    return closed && n > 0 ? (j + n) % n : -1;
}

/** The reference node id, unless it falls back onto the node itself. */
function pickReference(ids: string[], refIndex: number, selfIndex: number): string | null {
    if (refIndex === -1 || refIndex === selfIndex) return null;
    return ids[refIndex] ?? null;
}

function addSide(
    context: SnapContext,
    sides: NodeSide[],
    seenAnchors: Set<string>,
    anchorID: string,
    referenceID: string | null,
    nodeID: string
): void {
    if (!anchorID || anchorID === nodeID || seenAnchors.has(anchorID)) return;
    const anchor = context.hasEntity(anchorID);
    if (!anchor || !anchor.loc) return;

    let reference: LngLat | null = null;
    if (referenceID && referenceID !== nodeID && referenceID !== anchorID) {
        const ref = context.hasEntity(referenceID);
        if (ref && ref.loc) reference = ref.loc;
    }
    seenAnchors.add(anchorID);
    sides.push({ anchor: anchor.loc, reference });
}
