import RBush from 'rbush';

import { dispatch as d3_dispatch } from 'd3-dispatch';
import { json as d3_json } from 'd3-fetch';

import { geoExtent, geoSphericalDistance } from '../geo';
import { QAItem } from '../osm';
import { collectOsmEntityIds } from '../util/maproulette_osm_ids';
import { snapMapRoulettePinLoc } from '../util/maproulette_pin_loc';
import { utilRebind, utilStringQs, utilTiler } from '../util';

/** MapRoulette task status codes (see MapRoulette Task Lifecycle). */
export const MR_STATUS = {
  CREATED: 0,
  FIXED: 1,
  FALSE_POSITIVE: 2,
  SKIPPED: 3,
  DELETED: 4,
  ALREADY_FIXED: 5,
  TOO_HARD: 6,
};

/** Terminal “done” statuses — shown gray for 24h, then hidden. */
const RESOLVED_STATUSES = new Set([
  MR_STATUS.FIXED,
  MR_STATUS.FALSE_POSITIVE,
  MR_STATUS.ALREADY_FIXED,
  MR_STATUS.TOO_HARD,
]);

/** Still actionable on the map / “go to nearby”. */
const OPEN_STATUSES = new Set([
  MR_STATUS.CREATED,
  MR_STATUS.SKIPPED,
]);

const RESOLVED_VISIBLE_MS = 24 * 60 * 60 * 1000;
/** Re-fetch a tile after this so remote Fixed/Already Fixed propagate. */
const TILE_RELOAD_MS = 2 * 60 * 1000;

/** Statuses requested from `/tasks/box` (omit Deleted). */
const BOX_STATUSES = '0,1,2,3,5,6';

export function taskStatusOf(d: any): number {
  if (!d) return MR_STATUS.CREATED;
  if (d.taskStatus !== undefined && d.taskStatus !== null && Number.isFinite(Number(d.taskStatus))) {
    return Number(d.taskStatus);
  }
  if (d.task && d.task.status !== undefined && d.task.status !== null
    && Number.isFinite(Number(d.task.status))) {
    return Number(d.task.status);
  }
  return MR_STATUS.CREATED;
}

export function mappedOnOf(d: any): string | null {
  if (!d) return null;
  if (d.mappedOn) return String(d.mappedOn);
  if (d.task && d.task.mappedOn) return String(d.task.mappedOn);
  return null;
}

export function isResolvedStatus(status: number): boolean {
  return RESOLVED_STATUSES.has(Number(status));
}

export function isOpenTask(d: any): boolean {
  return OPEN_STATUSES.has(taskStatusOf(d));
}

/** Resolved terminal status and mappedOn within the last 24 hours. */
export function isRecentlyResolved(d: any): boolean {
  if (!isResolvedStatus(taskStatusOf(d))) return false;
  const raw = mappedOnOf(d);
  // Missing mappedOn: do not keep the pin forever (stamp on ingest instead).
  if (!raw) return false;
  const t = Date.parse(raw);
  if (!Number.isFinite(t)) return false;
  return (Date.now() - t) < RESOLVED_VISIBLE_MS;
}

export function shouldDisplayTask(d: any): boolean {
  if (!d) return false;
  if (isOpenTask(d)) return true;
  return isRecentlyResolved(d);
}

interface CacheEntry {
  data: Record<string, any>;
  /** Reverse index: iD entity id → set of MapRoulette task ids. */
  byEntity: Record<string, Set<string>>;
  loadedTile: Record<string, boolean>;
  /** When each tile was last successfully fetched (for soft reload). */
  tileLoadedAt: Record<string, number>;
  inflightTile: Record<string, AbortController>;
  inflightPost: Record<string, AbortController>;
  inflightChallenge: Record<string, AbortController>;
  inflightChallengePromise: Record<string, Promise<any>>;
  inflightTask: Record<string, AbortController>;
  inflightTaskPromise: Record<string, Promise<any>>;
  loadedChallenge: Record<string, { isVisible: boolean }>;
  challengeDetails: Record<string, any>;
  taskDetails: Record<string, any>;
  /** Tasks successfully submitted this session (for changeset suggestions). */
  closed: Array<{ challengeID: string; taskID: string }>;
  /**
   * Tasks marked “Resolve with upload” — Fixed after the OSM changeset lands.
   * Kept on the map until post-upload resolve (not in `closed` yet).
   */
  earmarked: Record<string, MapRouletteEarmark>;
  rtree: RBush<any>;
}

export type MapRouletteEarmark = {
  taskID: string;
  challengeID: string;
  parentName: string;
  title: string;
  elems: string[];
  loc: [number, number] | null;
  newComment: string;
  /** Always 1 (Fixed) for resolve-with-upload. */
  _status: number;
  /**
   * Whether this earmark is included in the next OSM upload / closed:maproulette
   * tag. Toggled on the commit checklist without dropping the row.
   */
  includeInUpload: boolean;
};

const tiler = utilTiler();
const dispatch = d3_dispatch('loaded', 'earmarked');
const _tileZoom = 14;
/** Survives `reset`/flush so failed post-upload resolves can be retried. */
const EARMARK_STORAGE_KEY = 'iD-maproulette-earmarks';

function readPersistedEarmarks(): MapRouletteEarmark[] {
  try {
    const raw = window.sessionStorage.getItem(EARMARK_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(function(e) {
      return e && e.taskID;
    }) : [];
  } catch {
    return [];
  }
}

function writePersistedEarmarks(list: MapRouletteEarmark[]): void {
  try {
    if (!list || !list.length) {
      window.sessionStorage.removeItem(EARMARK_STORAGE_KEY);
    } else {
      window.sessionStorage.setItem(EARMARK_STORAGE_KEY, JSON.stringify(list));
    }
  } catch {
    // Ignore quota / private-mode failures.
  }
}

function applyPersistedEarmarks(): void {
  if (!_cache) return;
  readPersistedEarmarks().forEach(function(entry) {
    _cache.earmarked[String(entry.taskID)] = entry;
  });
}
const _mrUrlRoot = 'https://maproulette.org/api/v2';

let _cache: CacheEntry;
let _challengeIDs = new Set<string>();

function abortRequest(controller: AbortController): void {
  if (controller) {
    controller.abort();
  }
}

function abortUnwantedRequests(cache: CacheEntry, tiles: any[]): void {
  Object.keys(cache.inflightTile).forEach(function(k) {
    const wanted = tiles.find(function(tile) { return k === tile.id; });
    if (!wanted) {
      abortRequest(cache.inflightTile[k]);
      delete cache.inflightTile[k];
    }
  });
}

function encodeIssueRtree(d: any) {
  return {
    minX: d.loc[0],
    minY: d.loc[1],
    maxX: d.loc[0],
    maxY: d.loc[1],
    data: d,
  };
}

function updateRtree(item: any, replace: boolean): void {
  _cache.rtree.remove(item, function(a: any, b: any) { return a.data.id === b.data.id; });
  if (replace) {
    _cache.rtree.insert(item);
  }
}

/** Drop a task from the entity→task reverse index. */
function unindexTaskElems(taskId: string): void {
  if (!_cache || !_cache.byEntity) return;
  Object.keys(_cache.byEntity).forEach(function(entityId) {
    const set = _cache.byEntity[entityId];
    if (!set) return;
    set.delete(taskId);
    if (set.size === 0) delete _cache.byEntity[entityId];
  });
}

/** (Re)index a task's `elems` into the entity→task reverse index. */
function indexTaskElems(item: any): void {
  if (!_cache || !item || !item.id) return;
  unindexTaskElems(item.id);
  const elems: string[] = Array.isArray(item.elems) ? item.elems : [];
  elems.forEach(function(entityId) {
    if (!entityId) return;
    if (!_cache.byEntity[entityId]) _cache.byEntity[entityId] = new Set();
    _cache.byEntity[entityId].add(item.id);
  });
}

/**
 * Merge newly discovered OSM entity ids onto a cached task and refresh the
 * reverse index. Returns true if the elems list changed.
 */
function mergeTaskElems(item: any, more: string[]): boolean {
  if (!item) return false;
  const prev: string[] = Array.isArray(item.elems) ? item.elems : [];
  const merged = Array.from(new Set(prev.concat(more || [])));
  if (merged.length === prev.length && merged.every(function(id, i) { return id === prev[i]; })) {
    return false;
  }
  item.elems = merged;
  indexTaskElems(item);
  return true;
}


type QAItemVisible = QAItem & {
  id: string;
  parentId: string;
  loc: [number, number];
  isVisible: boolean;
};

function setItemVisibility(item: QAItem, isVisible: boolean): void {
  (item as QAItemVisible).isVisible = isVisible;
}

/** Clear tile cache and in-flight tile requests so the next load uses the current filter. */
function clearTileCache(): void {
  if (!_cache) return;
  Object.values(_cache.inflightTile).forEach(abortRequest);
  _cache.inflightTile = {};
  _cache.loadedTile = {};
  _cache.tileLoadedAt = {};
  _cache.data = {};
  _cache.byEntity = {};
  _cache.rtree = new RBush();
}

function applyTaskStatusFields(qaItem: any, task: any): void {
  if (!qaItem) return;
  const status = (task && task.status !== undefined && task.status !== null)
    ? Number(task.status)
    : taskStatusOf(qaItem);
  let mappedOn = (task && task.mappedOn) || mappedOnOf(qaItem);
  // Resolved tasks without mappedOn would never age out — stamp first sight.
  if (isResolvedStatus(status) && !mappedOn) {
    mappedOn = new Date().toISOString();
  }
  const priority = (task && task.priority !== undefined && task.priority !== null
    && Number.isFinite(Number(task.priority)))
    ? Number(task.priority)
    : (qaItem.taskPriority !== undefined && qaItem.taskPriority !== null
      ? Number(qaItem.taskPriority)
      : undefined);
  qaItem.taskStatus = status;
  qaItem.mappedOn = mappedOn || undefined;
  if (priority !== undefined && Number.isFinite(priority)) {
    qaItem.taskPriority = priority;
  }
  if (task) qaItem.task = task;
  if (qaItem.task) {
    qaItem.task.status = status;
    if (mappedOn) qaItem.task.mappedOn = mappedOn;
    if (priority !== undefined && Number.isFinite(priority)) {
      qaItem.task.priority = priority;
    }
  }
}

/**
 * Re-place a cached pin if MapRoulette geometries allow snapping onto a line.
 * Updates the spatial index when the coordinate changes.
 */
function applyPinLocFromTask(qaItem: any, taskOrGeometries: any): boolean {
  if (!_cache || !qaItem || !qaItem.loc) return false;
  const geometries = (taskOrGeometries && taskOrGeometries.geometries)
    ? taskOrGeometries.geometries
    : taskOrGeometries;
  if (!geometries) return false;

  const prev = qaItem.loc as [number, number];
  const next = snapMapRoulettePinLoc(prev, geometries);
  if (next[0] === prev[0] && next[1] === prev[1]) return false;

  updateRtree(encodeIssueRtree(qaItem), false);
  qaItem.loc = next;
  updateRtree(encodeIssueRtree(qaItem), true);
  return true;
}

/**
 * Keep a task on the map as resolved (gray) instead of removing it.
 * Used after a successful local Fixed / Can’t complete / etc.
 */
function markTaskResolvedInCache(item: any, status: number): void {
  if (!_cache || !item || !item.id) return;
  const id = String(item.id);
  const cached = _cache.data[id] || item;
  const mappedOn = new Date().toISOString();
  cached.taskStatus = status;
  cached.mappedOn = mappedOn;
  if (cached.task) {
    cached.task.status = status;
    cached.task.mappedOn = mappedOn;
  }
  cached.earmarked = false;
  if (_cache.earmarked[id]) {
    delete _cache.earmarked[id];
    writePersistedEarmarks(
      Object.keys(_cache.earmarked).map(function(k) { return _cache.earmarked[k]; }),
    );
  }
  _cache.data[id] = cached;
  // Drop from display immediately if somehow already outside the 24h window.
  if (!shouldDisplayTask(cached)) {
    unindexTaskElems(id);
    updateRtree(encodeIssueRtree(cached), false);
    delete _cache.data[id];
  }
}

export default {
  title: 'maproulette',

  init() {
    if (!_cache) {
      this.reset();
    }
    // Restore a challenge-ID filter from the URL hash at startup (the
    // `maproulette` param carries either 'true' or a comma-separated id
    // list). Layer params are startup-only and owned by their own modules,
    // like `notes=` in svg/notes.js; the enabled flag itself is read in
    // svg/maproulette.ts.
    const hashParam = utilStringQs(window.location.hash).maproulette;
    if (hashParam && hashParam !== 'true') {
      this.challengeIDs(hashParam);
    }
    const service = this as { event?: unknown };
    service.event = utilRebind(this, dispatch, 'on');
  },

  reset() {
    if (_cache) {
      Object.values(_cache.inflightTile).forEach(abortRequest);
    }

    _cache = {
      data: {},
      byEntity: {},
      loadedTile: {},
      tileLoadedAt: {},
      inflightTile: {},
      inflightPost: {},
      inflightChallenge: {},
      inflightChallengePromise: {},
      inflightTask: {},
      inflightTaskPromise: {},
      loadedChallenge: {},
      challengeDetails: {},
      taskDetails: {},
      closed: [],
      earmarked: {},
      rtree: new RBush(),
    };
    applyPersistedEarmarks();
  },

  challengeIDs(val?: string | null) {
    if (val === undefined) {
      return Array.from(_challengeIDs).join(',');
    }
    const str =
      val === null || val === undefined ? '' : val.toString().trim();
    const nextIds = !str || str.toLowerCase() === 'true'
      ? new Set<string>()
      : new Set(
          str
            .split(',')
            .map(function(s) { return s.trim(); })
            .filter(Boolean)
            .filter(function(s) { return s.toLowerCase() !== 'true'; }),
        );
    const same = _challengeIDs.size === nextIds.size &&
      [..._challengeIDs].every(function(id) { return nextIds.has(id); });
    if (!same) {
      _challengeIDs = nextIds;
      clearTileCache();
    }
    // Prefetch challenge metadata (checkinComment / checkinSource) so the
    // commit panel can suggest those tags while a filter is active.
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    _challengeIDs.forEach(function(chID) {
      self.getChallengeDetails(chID);
    });
    dispatch.call('loaded');
    return this;
  },

  /** Tasks submitted this session (Rapid-compatible shape). */
  getClosed(): Array<{ challengeID: string; taskID: string }> {
    return _cache ? _cache.closed.slice() : [];
  },

  /**
   * Snapshot a task for resolve-with-upload. Does not call the MapRoulette API
   * or remove the pin — that happens after the OSM changeset ID is known.
   */
  earmarkTask(qaItem: any): MapRouletteEarmark | null {
    if (!_cache || !qaItem || !qaItem.id) return null;
    const taskID = String(qaItem.id);
    const challengeID = String(qaItem.parentId || (qaItem.task && qaItem.task.parentId) || '');
    const challenge = challengeID ? _cache.challengeDetails[challengeID] : null;
    const elems = Array.isArray(qaItem.elems)
      ? qaItem.elems.slice()
      : collectOsmEntityIds(qaItem.task, qaItem.task && qaItem.task.title, qaItem);
    const loc = Array.isArray(qaItem.loc) && qaItem.loc.length >= 2
      ? [Number(qaItem.loc[0]), Number(qaItem.loc[1])] as [number, number]
      : null;
    const earmark: MapRouletteEarmark = {
      taskID,
      challengeID,
      parentName: (challenge && challenge.name) || '',
      title: (qaItem.task && qaItem.task.title) || '',
      elems,
      loc,
      newComment: (qaItem.newComment || (qaItem.task && qaItem.task.newComment) || '').trim(),
      _status: 1,
      includeInUpload: true,
    };
    _cache.earmarked[taskID] = earmark;
    // Keep a flag on the live QAItem for marker classing / UI toggles.
    qaItem.earmarked = true;
    const cached = _cache.data[taskID];
    if (cached) cached.earmarked = true;
    writePersistedEarmarks(this.getEarmarked());
    dispatch.call('earmarked');
    dispatch.call('loaded');
    return earmark;
  },

  unearmarkTask(taskId: string): void {
    if (!_cache || !taskId) return;
    const id = String(taskId);
    delete _cache.earmarked[id];
    const cached = _cache.data[id];
    if (cached) cached.earmarked = false;
    writePersistedEarmarks(this.getEarmarked());
    dispatch.call('earmarked');
    dispatch.call('loaded');
  },

  isEarmarked(taskId: string): boolean {
    if (!_cache || !taskId) return false;
    return !!_cache.earmarked[String(taskId)];
  },

  /** Earmarks pending resolve-with-upload (stable order by task id). */
  getEarmarked(): MapRouletteEarmark[] {
    if (!_cache) return [];
    return Object.keys(_cache.earmarked)
      .sort()
      .map(function(id) { return _cache.earmarked[id]; })
      .filter(Boolean);
  },

  /** Earmarks checked for inclusion on the next upload. */
  getEarmarkedForUpload(): MapRouletteEarmark[] {
    return this.getEarmarked().filter(function(e) {
      return e && e.includeInUpload !== false;
    });
  },

  /**
   * Commit-checklist toggle: keep the earmark (and pin), but include/exclude
   * from closed:maproulette + post-upload Fixed.
   */
  setEarmarkedChecked(taskId: string, checked: boolean): void {
    if (!_cache || !taskId) return;
    const entry = _cache.earmarked[String(taskId)];
    if (!entry) return;
    entry.includeInUpload = !!checked;
    writePersistedEarmarks(this.getEarmarked());
    dispatch.call('earmarked');
  },

  /**
   * Snapshot earmarks checked for this upload. Removes those from the live
   * earmark map (unchecked rows stay earmarked for a later upload). Callers
   * restore any that fail to resolve.
   */
  takeEarmarkedSnapshot(): MapRouletteEarmark[] {
    const list = this.getEarmarkedForUpload();
    if (_cache) {
      list.forEach(function(entry) {
        const id = String(entry.taskID);
        delete _cache.earmarked[id];
        const cached = _cache.data[id];
        if (cached) cached.earmarked = false;
      });
      writePersistedEarmarks(this.getEarmarked());
    } else {
      writePersistedEarmarks([]);
    }
    dispatch.call('earmarked');
    dispatch.call('loaded');
    return list;
  },

  /**
   * Re-queue earmarks after a failed post-upload Fixed (also persists across flush).
   */
  restoreEarmarks(list: MapRouletteEarmark[]): void {
    if (!_cache || !Array.isArray(list) || !list.length) return;
    list.forEach(function(entry) {
      if (!entry || !entry.taskID) return;
      const id = String(entry.taskID);
      if (entry.includeInUpload === undefined) entry.includeInUpload = true;
      _cache.earmarked[id] = entry;
      const cached = _cache.data[id];
      if (cached) cached.earmarked = true;
    });
    writePersistedEarmarks(this.getEarmarked());
    dispatch.call('earmarked');
    dispatch.call('loaded');
  },

  /** Cached challenge object from `/challenge/{id}`, if loaded. */
  getChallenge(challengeID: string): any {
    if (!_cache || !challengeID) return undefined;
    return _cache.challengeDetails[challengeID];
  },

  loadIssues(projection: any) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    const rawTiles = tiler
      .zoomExtent([_tileZoom, _tileZoom])
      .getTiles(projection);
    if (!Array.isArray(rawTiles)) return;
    const tiles = rawTiles as Array<{ id: string; extent: { rectangle: () => number[] } }>;

    // Pins start from MapRoulette task.point, then snap onto LineString
    // geometries when present (see snapMapRoulettePinLoc / issue 2891).
    // Include recently completed statuses so Fixed / Already Fixed / etc.
    // can render as gray “resolved” for 24h. Challenge-ID filtering is
    // applied in getItems / getNearestItem.
    abortUnwantedRequests(_cache, tiles);

    tiles.forEach(function(tile: any) {
      const loadedAt = _cache.tileLoadedAt[tile.id] || 0;
      const fresh = _cache.loadedTile[tile.id]
        && (Date.now() - loadedAt) < TILE_RELOAD_MS;
      if (fresh || _cache.inflightTile[tile.id]) return;

      // rectangle() returns [minLng, minLat, maxLng, maxLat] = left/bottom/right/top.
      const [left, bottom, right, top] = tile.extent.rectangle();
      const bbox = [left, bottom, right, top].join('/');
      // includeGeometries so we can snap pins onto ways (MR centerpoint is often off-line).
      const url = `${_mrUrlRoot}/tasks/box/${bbox}?tStatus=${BOX_STATUSES}&includeGeometries=true`;
      const controller = new AbortController();
      _cache.inflightTile[tile.id] = controller;

      d3_json(url, { signal: controller.signal })
        .then(function(data: any) {
          delete _cache.inflightTile[tile.id];
          _cache.loadedTile[tile.id] = true;
          _cache.tileLoadedAt[tile.id] = Date.now();
          const list = Array.isArray(data) ? data : (data && data.tasks) || [];
          if (!list.length) return;

          const unseenChallenges = new Set<string>();
          list.forEach(function(task: any) {
            const taskID = String(task.id);
            const parentId = String(task.parentId);
            const existing = _cache.data[taskID];
            if (existing) {
              applyTaskStatusFields(existing, task);
              applyPinLocFromTask(existing, task);
              if (!shouldDisplayTask(existing)) {
                unindexTaskElems(taskID);
                updateRtree(encodeIssueRtree(existing), false);
                delete _cache.data[taskID];
              }
              return;
            }

            const loc: [number, number] = [task.point?.lng, task.point?.lat];
            // Number.isFinite, not truthiness: 0 is a valid lng/lat
            // (prime meridian / equator).
            if (!Number.isFinite(loc[0]) || !Number.isFinite(loc[1])) return;

            const taskProps = {
              parentId: parentId,
              severity: 'warning',
              task: task,
              taskStatus: (task.status !== undefined && task.status !== null)
                ? Number(task.status)
                : MR_STATUS.CREATED,
              taskPriority: (task.priority !== undefined && task.priority !== null
                && Number.isFinite(Number(task.priority)))
                ? Number(task.priority)
                : undefined,
              mappedOn: task.mappedOn || undefined,
              elems: collectOsmEntityIds(task, task.title, task.name),
            };
            const d = new QAItem(
              snapMapRoulettePinLoc(loc, task.geometries),
              self,
              'task',
              taskID,
              taskProps as any,
            );
            applyTaskStatusFields(d, task);
            if (!shouldDisplayTask(d)) return;

            const chState = _cache.loadedChallenge[parentId];
            setItemVisibility(d, chState ? !!chState.isVisible : false);
            if (_cache.earmarked[taskID]) (d as any).earmarked = true;
            _cache.data[taskID] = d;
            indexTaskElems(d);
            _cache.rtree.insert(encodeIssueRtree(d));

            if (
              !_cache.loadedChallenge[parentId] &&
              !_cache.inflightChallenge[parentId]
            ) {
              unseenChallenges.add(parentId);
            }
          });

          dispatch.call('loaded');

          unseenChallenges.forEach(function(chID) {
            const urlC = `${_mrUrlRoot}/challenge/${chID}`;
            const cController = new AbortController();
            _cache.inflightChallenge[chID] = cController;
            _cache.inflightChallengePromise[chID] = d3_json(urlC, {
              signal: cController.signal,
            })
              .then(function(challenge: any) {
                delete _cache.inflightChallenge[chID];
                delete _cache.inflightChallengePromise[chID];
                const isVisible = !!(
                  challenge &&
                  challenge.enabled &&
                  !challenge.deleted
                );
                _cache.loadedChallenge[chID] = { isVisible: isVisible };
                _cache.challengeDetails[chID] = challenge || {};
                Object.values(_cache.data).forEach(function(item) {
                  if (item.parentId === chID) setItemVisibility(item, isVisible);
                });
                dispatch.call('loaded');
              })
              .catch(function() {
                delete _cache.inflightChallenge[chID];
                delete _cache.inflightChallengePromise[chID];
                // Don't cache a visibility verdict on failure - leaving
                // loadedChallenge unset lets the next tile load retry, so a
                // transient network error doesn't hide the challenge's tasks
                // for the rest of the session.
              });
          });
        })
        .catch(function() {
          delete _cache.inflightTile[tile.id];
          _cache.loadedTile[tile.id] = true;
        });
    });
  },

  getItems(projection: any) {
    const viewport = projection.clipExtent();
    const min = [viewport[0][0], viewport[1][1]];
    const max = [viewport[1][0], viewport[0][1]];
    const bbox = geoExtent(
      projection.invert(min),
      projection.invert(max),
    ).bbox();

    const items = _cache.rtree.search(bbox).map(function(d: any) { return d.data; });
    return items.filter(function(d: any) {
      if (!shouldDisplayTask(d)) return false;
      if (_challengeIDs.size > 0) return _challengeIDs.has(d.parentId);
      return d.isVisible;
    });
  },

  /**
   * Nearest open (unresolved) cached task to `loc`.
   * Used by Map Data “Go to next nearby” and post-submit navigation.
   */
  getNearestItem(loc: [number, number], excludeId?: string | null) {
    if (!_cache || !loc) return null;
    let best: any = null;
    let bestDist = Infinity;
    Object.keys(_cache.data).forEach(function(id) {
      const d = _cache.data[id];
      if (!d || !d.loc) return;
      if (excludeId && d.id === excludeId) return;
      if (!isOpenTask(d)) return;
      if (_challengeIDs.size > 0) {
        if (!_challengeIDs.has(d.parentId)) return;
      } else if (!d.isVisible) {
        return;
      }
      const dist = geoSphericalDistance(loc, d.loc);
      if (dist < bestDist) {
        bestDist = dist;
        best = d;
      }
    });
    return best;
  },

  /**
   * Tasks linked to an OSM entity id (w/n/r…), including recently resolved.
   */
  getTasksForEntity(entityId: string) {
    if (!_cache || !entityId) return [];
    const taskIds = _cache.byEntity[entityId];
    if (!taskIds || !taskIds.size) return [];
    const out: any[] = [];
    taskIds.forEach(function(taskId) {
      const d = _cache.data[taskId];
      if (!d || !shouldDisplayTask(d)) return;
      if (_challengeIDs.size > 0) {
        if (!_challengeIDs.has(d.parentId)) return;
      } else if (!d.isVisible) {
        return;
      }
      out.push(d);
    });
    return out;
  },

  isOpenTask,
  isRecentlyResolved,
  taskStatusOf,
  shouldDisplayTask,

  // NOTE: Don't change method name until UI v3 is merged
  getError(id: string) {
    return _cache.data[id];
  },

  replaceItem(item: any) {
    if (!(item instanceof QAItem) || !item.id) return;
    _cache.data[item.id] = item;
    indexTaskElems(item);
    updateRtree(encodeIssueRtree(item), true);
    return item;
  },

  removeItem(item: any) {
    if (!item || !item.id) return;
    const id = String(item.id);
    unindexTaskElems(id);
    const cached = _cache.data[id];
    if (cached) {
      updateRtree(encodeIssueRtree(cached), false);
    }
    delete _cache.data[id];
    if (_cache.earmarked[id]) {
      delete _cache.earmarked[id];
      writePersistedEarmarks(
        Object.keys(_cache.earmarked).map(function(k) { return _cache.earmarked[k]; }),
      );
    }
  },

  /**
   * After OSM upload: mark each snapshotted earmark Fixed with a changeset
   * comment. `onProgress({ index, total, taskID, error? })` is called before
   * each task and once at the end.
   */
  resolveEarmarksAfterChangeset(
    earmarks: MapRouletteEarmark[],
    options: {
      comment: string;
      mapRouletteApiKey?: string;
      onProgress?: (p: {
        index: number;
        total: number;
        taskID?: string;
        error?: any;
        done?: boolean;
      }) => void;
      timeoutMs?: number;
    },
  ): Promise<{ ok: number; failed: number; failedEarmarks: MapRouletteEarmark[] }> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    const list = Array.isArray(earmarks) ? earmarks.slice() : [];
    const total = list.length;
    const timeoutMs = (options && options.timeoutMs) || 30000;
    const comment = (options && options.comment) || '';
    const apiKey = options && options.mapRouletteApiKey;
    const onProgress = options && options.onProgress;

    let ok = 0;
    let failed = 0;
    let index = 0;
    const failedEarmarks: MapRouletteEarmark[] = [];

    function commentFor(entry: MapRouletteEarmark): string {
      const extra = (entry.newComment || '').trim();
      if (!extra) return comment;
      if (!comment) return extra;
      return `${comment}\n\n${extra}`;
    }

    function next(): Promise<void> {
      if (index >= total) {
        if (onProgress) onProgress({ index: total, total, done: true });
        return Promise.resolve();
      }
      const entry = list[index];
      const current = index;
      index += 1;
      if (onProgress) {
        onProgress({ index: current + 1, total, taskID: entry.taskID });
      }

      const payload: any = {
        id: entry.taskID,
        parentId: entry.challengeID,
        _status: 1,
        comment: commentFor(entry),
        mapRouletteApiKey: apiKey,
      };

      return new Promise<void>(function(resolve) {
        self.postUpdate(payload, function(err: any) {
          if (err) {
            failed += 1;
            failedEarmarks.push(entry);
            if (onProgress) {
              onProgress({
                index: current + 1,
                total,
                taskID: entry.taskID,
                error: err,
              });
            }
          } else {
            ok += 1;
          }
          resolve();
        }, { timeoutMs });
      }).then(next);
    }

    if (!total) {
      if (onProgress) onProgress({ index: 0, total: 0, done: true });
      return Promise.resolve({ ok: 0, failed: 0, failedEarmarks: [] });
    }
    return next().then(function() { return { ok, failed, failedEarmarks }; });
  },

  issueURL(item: any): string {
    return `https://maproulette.org/challenge/${item.parentId}/task/${item.id}`;
  },

  /**
   * Submit a task status update to MapRoulette.
   * @param options.timeoutMs  Abort the whole submit after this many ms
   *                           (default 30000). Calls back with status -1.
   */
  postUpdate(
    d: any,
    callback: (err: any, d?: any) => void,
    options?: { timeoutMs?: number },
  ) {
    // Reject a second submission while one is still in flight
    // (e.g. a double-clicked Submit button), like osmose does.
    if (_cache.inflightPost[d.id]) {
      return callback({ message: 'Task update already inflight', status: -2 }, d);
    }
    const commentUrl = `${_mrUrlRoot}/task/${d.id}/comment`;
    const updateTaskUrl = `${_mrUrlRoot}/task/${d.id}/${d._status}`;
    const releaseTaskUrl = `${_mrUrlRoot}/task/${d.id}/release`;
    const timeoutMs = (options && options.timeoutMs) || 30000;

    const controller = new AbortController();
    _cache.inflightPost[d.id] = controller;

    let timedOut = false;
    const timeoutId = setTimeout(function() {
      timedOut = true;
      controller.abort();
    }, timeoutMs);

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (d.mapRouletteApiKey) headers.apiKey = d.mapRouletteApiKey;

    // Release only needs the API key. Sending Content-Type on a GET triggers an
    // unnecessary CORS preflight and has been observed to fail in browsers even
    // after a successful status update (matching Rapid's header set).
    const releaseHeaders: Record<string, string> = {};
    if (d.mapRouletteApiKey) releaseHeaders.apiKey = d.mapRouletteApiKey;

    function checkedFetch(url: string, opts: RequestInit): Promise<Response> {
      return fetch(url, { ...opts, signal: controller.signal }).then(function(response) {
        if (!response.ok) {
          const err: any = new Error(response.statusText || 'Request failed');
          err.status = response.status;
          return response.json()
            .catch(function() { return null; })
            .then(function(body) {
              err.body = body;
              throw err;
            });
        }
        return response;
      });
    }

    function finishSuccess(): void {
      clearTimeout(timeoutId);
      delete _cache.inflightPost[d.id];
      if (d.parentId) {
        _cache.closed.push({
          challengeID: String(d.parentId),
          taskID: String(d.id),
        });
      }
      // Keep pin as gray “resolved” for 24h instead of removing immediately.
      const status = (d._status !== undefined && d._status !== null)
        ? Number(d._status)
        : MR_STATUS.FIXED;
      markTaskResolvedInCache(d, status);
      dispatch.call('loaded');
      if (callback) callback(null, d);
    }

    function doComment(): Promise<void> {
      if (!d.comment) return Promise.resolve();
      // Per the MapRoulette API, POST /task/:id/comment takes `actionId` as a
      // query parameter (Option[Long]) and only `comment` in the JSON body.
      // Sending actionId in the body makes the server silently ignore it.
      return checkedFetch(`${commentUrl}?actionId=2`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ comment: d.comment }),
      }).then(function() {});
    }

    doComment()
      .then(function() { return checkedFetch(updateTaskUrl, { method: 'PUT', headers }); })
      // Release is best-effort: the status update above is what marks the task
      // done. A failed release should not undo a successful submission (HAR
      // showed PUT 204 followed by a browser-level release failure).
      .then(function() {
        return checkedFetch(releaseTaskUrl, { method: 'GET', headers: releaseHeaders })
          .catch(function() { /* ignore release failures */ });
      })
      .then(function() { finishSuccess(); })
      .catch(function(err: any) {
        clearTimeout(timeoutId);
        delete _cache.inflightPost[d.id];
        if (!callback) return;
        if (timedOut || (err && err.name === 'AbortError')) {
          callback({ message: 'MapRoulette submit timed out', status: -1 }, d);
          return;
        }
        callback(err, d);
      });
  },

  loadTaskDetailAsync(qaItem: any) {
    if (!qaItem || !qaItem.id || !qaItem.parentId) return Promise.resolve(null);
    const chID = qaItem.parentId;
    const baseTask = qaItem.task || {};
    const getCh = this.getChallengeDetails(chID);
    const getTd = this.getTaskDetails(qaItem.id);
    return Promise.all([getCh, getTd]).then(function([ch, td]: [any, any]) {
      const cooperativeWork =
        (td && td.cooperativeWork)
        || (td && td.geometries && td.geometries.cooperativeWork)
        || baseTask.cooperativeWork
        || (baseTask.geometries && baseTask.geometries.cooperativeWork)
        || undefined;
      const detail = {
        ...baseTask,
        id: qaItem.id,
        parentId: qaItem.parentId,
        parentName: (ch && ch.name) || '',
        title: (td && td.title) || baseTask.title || '',
        instruction: (ch && ch.instruction) || '',
        description: (ch && ch.description) || '',
        taskFeatures: (td && td.geometries && td.geometries.features) || [],
        // Keep Tag Fix / OSC cooperative payload for the editor (not dropped).
        ...(cooperativeWork ? { cooperativeWork } : {}),
      };
      // Keep Tag Fix payload on the live QAItem even if the pin is not cached yet.
      if (cooperativeWork) {
        if (!qaItem.task) qaItem.task = Object.assign({}, baseTask);
        qaItem.task.cooperativeWork = cooperativeWork;
      }
      // Strengthen entity↔task links once title / feature props are known.
      const cached = _cache.data[qaItem.id];
      if (cached) {
        if (cooperativeWork) {
          if (!cached.task) cached.task = {};
          cached.task.cooperativeWork = cooperativeWork;
          qaItem.task = cached.task;
        }
        mergeTaskElems(
          cached,
          collectOsmEntityIds(
            detail.title,
            detail.taskFeatures,
            td,
            baseTask,
            cooperativeWork,
          ),
        );
        cached.elemsResolved = true;
        // Keep the live QAItem's elems in sync for callers holding qaItem.
        qaItem.elems = cached.elems;
        qaItem.elemsResolved = true;
        // Snap pin onto line geometry if /task/{id} has features and box did not.
        if (td && td.geometries && applyPinLocFromTask(cached, td.geometries)) {
          qaItem.loc = cached.loc;
          dispatch.call('loaded');
        }
      }
      return detail;
    });
  },

  getChallengeDetails(chID: string): Promise<any> {
    if (!chID) return Promise.resolve({});
    if (chID in _cache.challengeDetails) return Promise.resolve(_cache.challengeDetails[chID]);
    if (chID in _cache.inflightChallengePromise) {
      return _cache.inflightChallengePromise[chID];
    }
    const urlC = `${_mrUrlRoot}/challenge/${chID}`;
    const cController = new AbortController();
    _cache.inflightChallenge[chID] = cController;
    _cache.inflightChallengePromise[chID] = d3_json(urlC, {
      signal: cController.signal,
    })
      .then(function(challenge: any) {
        delete _cache.inflightChallenge[chID];
        delete _cache.inflightChallengePromise[chID];
        const isVisible = !!(
          challenge &&
          challenge.enabled &&
          !challenge.deleted
        );
        _cache.loadedChallenge[chID] = { isVisible: isVisible };
        _cache.challengeDetails[chID] = challenge || {};
        return _cache.challengeDetails[chID];
      })
      .catch(function() {
        delete _cache.inflightChallenge[chID];
        delete _cache.inflightChallengePromise[chID];
        // As above: no verdict on failure, so a later request can retry.
        return {};
      });
    return _cache.inflightChallengePromise[chID];
  },

  getTaskDetails(taskID: string): Promise<any> {
    if (!taskID) return Promise.resolve({});
    if (taskID in _cache.taskDetails) return Promise.resolve(_cache.taskDetails[taskID]);
    if (taskID in _cache.inflightTaskPromise) {
      return _cache.inflightTaskPromise[taskID];
    }
    const urlT = `${_mrUrlRoot}/task/${taskID}`;
    const tController = new AbortController();
    _cache.inflightTask[taskID] = tController;
    _cache.inflightTaskPromise[taskID] = d3_json(urlT, {
      signal: tController.signal,
    })
      .then(function(task: any) {
        delete _cache.inflightTask[taskID];
        delete _cache.inflightTaskPromise[taskID];
        _cache.taskDetails[taskID] = task || {};
        return _cache.taskDetails[taskID];
      })
      .catch(function() {
        delete _cache.inflightTask[taskID];
        delete _cache.inflightTaskPromise[taskID];
        return {};
      });
    return _cache.inflightTaskPromise[taskID];
  },
};
