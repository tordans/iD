/**
 * MapRoulette cooperative Tag Fix (cooperativeWork meta.type === 1).
 * Parses modifyElement setTags/unsetTags ops; OSC change-files (type 2) are ignored.
 *
 * @see https://learn.maproulette.org/en-US/documentation/creating-cooperative-challenges/
 */

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
export function extractCooperativeWork(task: any): any | null {
  if (!task || typeof task !== 'object') return null;
  if (task.cooperativeWork && typeof task.cooperativeWork === 'object') {
    return task.cooperativeWork;
  }
  const geom = task.geometries;
  if (geom && typeof geom === 'object') {
    if (geom.cooperativeWork && typeof geom.cooperativeWork === 'object') {
      return geom.cooperativeWork;
    }
  }
  return null;
}

/**
 * True when cooperativeWork is a Tag Fix (v2 type 1, or legacy v1 with operations).
 * OSC / change-file (type 2) returns false.
 */
export function isMapRouletteTagFix(task: any): boolean {
  const cw = extractCooperativeWork(task);
  if (!cw || typeof cw !== 'object') return false;
  const meta = cw.meta || {};
  const type = meta.type;
  if (Number(type) === 2) return false;
  if (Number(type) === 1) return true;
  // Legacy v1: no type (or version 1) but has modifyElement operations
  const version = Number(meta.version);
  if (version === 1 || (type === undefined && Array.isArray(cw.operations))) {
    return Array.isArray(cw.operations) && cw.operations.some(isModifyElementOp);
  }
  return false;
}

function isModifyElementOp(op: any): boolean {
  return !!(
    op
    && op.operationType === 'modifyElement'
    && op.data
    && typeof op.data === 'object'
  );
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
  child: any,
): void {
  if (!child || typeof child !== 'object') return;
  const op = child.operation || child.operationType;
  if (op === 'setTags' && child.data && typeof child.data === 'object' && !Array.isArray(child.data)) {
    Object.keys(child.data).forEach(function(key) {
      const val = child.data[key];
      if (val === null || val === undefined) return;
      bag.setTags[key] = String(val);
      bag.unsetTags = bag.unsetTags.filter(function(k) { return k !== key; });
    });
    return;
  }
  if (op === 'unsetTags') {
    const keys = Array.isArray(child.data) ? child.data : [];
    keys.forEach(function(key: unknown) {
      const k = String(key);
      if (!k) return;
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
export function getMapRouletteTagFixes(task: any): MapRouletteTagFixTarget[] {
  if (!isMapRouletteTagFix(task)) return [];
  const cw = extractCooperativeWork(task);
  if (!cw || !Array.isArray(cw.operations)) return [];

  const byId = new Map<string, { setTags: Record<string, string>; unsetTags: string[] }>();
  const order: string[] = [];

  cw.operations.forEach(function(top: any) {
    if (!isModifyElementOp(top)) return;
    const entityId = parseMapRouletteElementId(top.data.id);
    if (!entityId) return;

    let bag = byId.get(entityId);
    if (!bag) {
      bag = emptyBag();
      byId.set(entityId, bag);
      order.push(entityId);
    }

    const children = Array.isArray(top.data.operations) ? top.data.operations : [];
    children.forEach(function(child: any) {
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
  Object.keys(setTags || {}).forEach(function(key) {
    next[key] = setTags[key];
  });
  (unsetTags || []).forEach(function(key) {
    delete next[key];
  });
  return next;
}

type HasEntity = { hasEntity: (id: string) => any };

/**
 * Split Tag Fix targets into those present in the graph vs missing.
 * Proposed tags are computed from each matched entity's current tags.
 */
export function matchMapRouletteTagFixes(
  context: HasEntity,
  task: any,
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
  task: any,
): Array<{ entityId: string; tags: Record<string, string> }> {
  return matchMapRouletteTagFixes(context, task).matched.map(function(m) {
    return { entityId: m.entityId, tags: m.proposedTags };
  });
}
