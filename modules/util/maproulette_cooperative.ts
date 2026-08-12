/**
 * MapRoulette cooperative Tag Fix (cooperativeWork meta.type === 1).
 * Parses modifyElement setTags/unsetTags ops; OSC change-files (type 2) are ignored.
 *
 * @see https://learn.maproulette.org/en-US/documentation/creating-cooperative-challenges/
 */

import {
  extractMrCooperativeWork,
  isMrTagFixCooperativeWork,
  parseMrModifyElementOps,
  parseMrSetTagsData,
  parseMrUnsetTagKeys,
  type MrCooperativeChildOp,
  type MrCooperativeWork,
} from './maproulette_api_schema';
import { collectOsmEntityIds } from './maproulette_osm_ids';

export type MapRouletteTagFixTarget = {
  /** iD entity id, e.g. `w123` */
  entityId: string;
  setTags: Record<string, string>;
  unsetTags: string[];
};

export type MapRouletteMatchedTagFix = {
  entityId: string;
  /** Current tags on the graph entity */
  currentTags: Record<string, string>;
  /** Tags after applying set/unset onto currentTags */
  proposedTags: Record<string, string>;
};

export type MapRouletteTagFixMatch = {
  matched: MapRouletteMatchedTagFix[];
  unmatched: string[];
};

/** Pull cooperativeWork from common task / geometry payload shapes. */
export function extractCooperativeWork(task: unknown): MrCooperativeWork | null {
  return extractMrCooperativeWork(task);
}

/**
 * True when cooperativeWork is a Tag Fix (v2 type 1, or legacy v1 with operations).
 * OSC / change-file (type 2) returns false.
 */
export function isMapRouletteTagFix(task: unknown): boolean {
  return isMrTagFixCooperativeWork(extractMrCooperativeWork(task));
}

/** Resolve MapRoulette element id (`way/123`, `w123`, …) to an iD id. */
export function parseMapRouletteElementId(raw: unknown): string | null {
  if (raw === null || raw === undefined) return null;
  const ids = collectOsmEntityIds(String(raw));
  return ids.length ? ids[0] : null;
}

function emptyBag(): { setTags: Record<string, string>; unsetTags: string[] } {
  return { setTags: {}, unsetTags: [] };
}

function applyChildOp(
  bag: { setTags: Record<string, string>; unsetTags: string[] },
  child: MrCooperativeChildOp,
): void {
  const op = child.operation || child.operationType;
  if (op === 'setTags') {
    const data = parseMrSetTagsData(child.data);
    if (!data) return;
    Object.keys(data).forEach(function(key) {
      const val = data[key];
      if (val === null || val === undefined) return;
      bag.setTags[key] = String(val);
      bag.unsetTags = bag.unsetTags.filter(function(k) { return k !== key; });
    });
    return;
  }
  if (op === 'unsetTags') {
    parseMrUnsetTagKeys(child.data).forEach(function(k) {
      delete bag.setTags[k];
      if (bag.unsetTags.indexOf(k) === -1) bag.unsetTags.push(k);
    });
  }
}

/**
 * Parse every modifyElement into `{ entityId, setTags, unsetTags }`.
 * Same-id blocks are merged in array order. Invalid ids are skipped.
 * Returns [] when not a Tag Fix.
 */
export function getMapRouletteTagFixes(task: unknown): MapRouletteTagFixTarget[] {
  const cw = extractMrCooperativeWork(task);
  if (!isMrTagFixCooperativeWork(cw) || !cw) return [];

  const byId = new Map<string, { setTags: Record<string, string>; unsetTags: string[] }>();
  const order: string[] = [];

  parseMrModifyElementOps(cw).forEach(function(top) {
    const entityId = parseMapRouletteElementId(top.data.id);
    if (!entityId) return;

    let bag = byId.get(entityId);
    if (!bag) {
      bag = emptyBag();
      byId.set(entityId, bag);
      order.push(entityId);
    }

    const children = Array.isArray(top.data.operations) ? top.data.operations : [];
    children.forEach(function(child) {
      applyChildOp(bag!, child);
    });
  });

  return order.map(function(entityId) {
    const bag = byId.get(entityId)!;
    return {
      entityId,
      setTags: Object.assign({}, bag.setTags),
      unsetTags: bag.unsetTags.slice(),
    };
  });
}

/** Apply a Tag Fix bag onto current entity tags → proposed tags. */
export function applyTagFixBag(
  currentTags: Record<string, string> | null | undefined,
  setTags: Record<string, string>,
  unsetTags: string[],
): Record<string, string> {
  const next: Record<string, string> = Object.assign({}, currentTags || {});
  Object.keys(setTags).forEach(function(key) {
    next[key] = setTags[key];
  });
  unsetTags.forEach(function(key) {
    delete next[key];
  });
  return next;
}

type HasEntity = { hasEntity: (id: string) => { tags?: Record<string, string> } | null | undefined };

/**
 * Split Tag Fix targets into those present in the graph vs missing.
 * Proposed tags are computed from each matched entity's current tags.
 */
export function matchMapRouletteTagFixes(
  context: HasEntity,
  task: unknown,
): MapRouletteTagFixMatch {
  const fixes = getMapRouletteTagFixes(task);
  const matched: MapRouletteMatchedTagFix[] = [];
  const unmatched: string[] = [];

  fixes.forEach(function(fix) {
    const entity = context.hasEntity && context.hasEntity(fix.entityId);
    if (!entity) {
      unmatched.push(fix.entityId);
      return;
    }
    const currentTags = Object.assign({}, entity.tags || {});
    matched.push({
      entityId: fix.entityId,
      currentTags,
      proposedTags: applyTagFixBag(currentTags, fix.setTags, fix.unsetTags),
    });
  });

  return { matched, unmatched };
}

/**
 * Build final tag maps for Accept (matched only). Pure — does not mutate the graph.
 * Returns [] when nothing can be applied.
 */
export function tagFixesToApply(
  context: HasEntity,
  task: unknown,
): Array<{ entityId: string; tags: Record<string, string> }> {
  return matchMapRouletteTagFixes(context, task).matched.map(function(m) {
    return { entityId: m.entityId, tags: m.proposedTags };
  });
}
