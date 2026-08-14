/**
 * Post-done next-task challenge scope + pickers.
 * Overview: docs/maproulette.md — pool detail: docs/maproulette-post-done-sidebar.md
 */
import { geoSphericalDistance } from '../geo/geo';

/** Session: last challenge the user completed a task in (not the Map Data filter). */
let _lastWorkedChallengeId: string | null = null;

export function getLastWorkedChallengeId(): string | null {
  return _lastWorkedChallengeId;
}

export function setLastWorkedChallengeId(id: string | null | undefined): void {
  if (id === undefined || id === null || id === '') {
    _lastWorkedChallengeId = null;
    return;
  }
  _lastWorkedChallengeId = String(id);
}

/** Test helper — clear session state. */
export function resetLastWorkedChallengeId(): void {
  _lastWorkedChallengeId = null;
}

export type NextTaskPoolMode = 'primary' | 'fallback' | 'empty';

export type NextTaskPool = {
  mode: NextTaskPoolMode;
  tasks: any[];
  /** Challenge ids that define the preferred (primary) scope, when known. */
  preferredChallengeIds: string[];
};

function parseChallengeFilter(mr: any): string[] {
  if (!mr || typeof mr.challengeIDs !== 'function') return [];
  const raw = mr.challengeIDs();
  if (!raw || raw === true || String(raw).toLowerCase() === 'true') return [];
  return String(raw)
    .split(',')
    .map(function(s) { return s.trim(); })
    .filter(Boolean)
    .filter(function(s) { return s.toLowerCase() !== 'true'; });
}

/**
 * Preferred challenge scope: Map Data filter → last worked → current task challenge.
 */
export function preferredChallengeIds(
  mr: any,
  options: {
    currentChallengeId?: string | null;
    lastChallengeId?: string | null;
  } = {},
): string[] {
  const filter = parseChallengeFilter(mr);
  if (filter.length) return filter;

  const last = options.lastChallengeId !== undefined
    ? options.lastChallengeId
    : _lastWorkedChallengeId;
  if (last) return [String(last)];

  if (options.currentChallengeId) return [String(options.currentChallengeId)];
  return [];
}

function openTasksForChallenges(
  mr: any,
  challengeIds: string[] | null,
  excludeId?: string | null,
  ignoreChallengeFilter?: boolean,
): any[] {
  if (!mr || typeof mr.getOpenTasks !== 'function') return [];
  return mr.getOpenTasks({
    challengeIds: challengeIds && challengeIds.length ? challengeIds : null,
    excludeId: excludeId !== undefined && excludeId !== null ? String(excludeId) : null,
    ignoreChallengeFilter: !!ignoreChallengeFilter,
  }) || [];
}

/**
 * Challenge-scope decision tree for post-done next-task buttons.
 * - primary: preferred scope has open tasks → Nearest + Priority
 * - fallback: preferred empty but other cache tasks exist → Random only
 * - empty: nothing available
 */
export function resolveCandidatePool(
  mr: any,
  options: {
    excludeId?: string | null;
    currentChallengeId?: string | null;
    lastChallengeId?: string | null;
  } = {},
): NextTaskPool {
  const preferred = preferredChallengeIds(mr, options);
  const primary = openTasksForChallenges(
    mr,
    preferred.length ? preferred : null,
    options.excludeId,
    false,
  );

  if (primary.length) {
    return {
      mode: 'primary',
      tasks: primary,
      preferredChallengeIds: preferred,
    };
  }

  // Preferred scope empty — widen to all visible open tasks in cache
  // (ignore Map Data challenge filter so Random can leave an empty challenge).
  const all = openTasksForChallenges(mr, null, options.excludeId, true);
  if (all.length) {
    return {
      mode: 'fallback',
      tasks: all,
      preferredChallengeIds: preferred,
    };
  }

  return {
    mode: 'empty',
    tasks: [],
    preferredChallengeIds: preferred,
  };
}

function taskPriority(d: any): number {
  const raw = (d && d.taskPriority !== undefined && d.taskPriority !== null)
    ? d.taskPriority
    : (d && d.task && d.task.priority);
  const n = Number(raw);
  // Missing priority sorts after High/Medium/Low (0/1/2).
  return Number.isFinite(n) ? n : 99;
}

function distanceTo(loc: [number, number], d: any): number {
  if (!d || !d.loc || !loc) return Infinity;
  return geoSphericalDistance(loc, d.loc);
}

/** Nearest task in the pool to `loc`. */
export function pickNearest(pool: any[], loc: [number, number]): any | null {
  if (!pool || !pool.length || !loc) return null;
  let best: any = null;
  let bestDist = Infinity;
  pool.forEach(function(d) {
    const dist = distanceTo(loc, d);
    if (dist < bestDist) {
      bestDist = dist;
      best = d;
    }
  });
  return best;
}

/**
 * Highest priority (lowest number) in the pool; ties broken by nearest to `loc`.
 */
export function pickPriority(pool: any[], loc: [number, number]): any | null {
  if (!pool || !pool.length) return null;
  let best: any = null;
  let bestPri = Infinity;
  let bestDist = Infinity;
  pool.forEach(function(d) {
    const pri = taskPriority(d);
    const dist = distanceTo(loc, d);
    if (pri < bestPri || (pri === bestPri && dist < bestDist)) {
      bestPri = pri;
      bestDist = dist;
      best = d;
    }
  });
  return best;
}

/**
 * Random among viewport-overlapping pool tasks when any exist; else random in pool.
 * `random` injectable for tests (0 ≤ r < 1).
 */
export function pickRandomNearby(
  pool: any[],
  viewportTasks?: any[] | null,
  random: () => number = Math.random,
): any | null {
  if (!pool || !pool.length) return null;
  const poolIds = new Set(pool.map(function(d) { return String(d.id); }));
  const inView = (viewportTasks || []).filter(function(d) {
    return d && poolIds.has(String(d.id));
  });
  const candidates = inView.length ? inView : pool;
  const idx = Math.floor(random() * candidates.length);
  return candidates[Math.min(idx, candidates.length - 1)] || null;
}

/** Which post-done next-task buttons to show. */
export function nextTaskActionsForPool(pool: NextTaskPool): {
  showNearest: boolean;
  showPriority: boolean;
  showRandom: boolean;
} {
  if (pool.mode === 'primary') {
    return { showNearest: true, showPriority: true, showRandom: false };
  }
  if (pool.mode === 'fallback') {
    return { showNearest: false, showPriority: false, showRandom: true };
  }
  return { showNearest: false, showPriority: false, showRandom: false };
}

export type MapDataNextAction = 'nearest' | 'random';

/** Single Map Data pin action derived from the post-done pool tree. */
export function mapDataNextAction(pool: NextTaskPool): MapDataNextAction | null {
  const actions = nextTaskActionsForPool(pool);
  if (actions.showNearest) return 'nearest';
  if (actions.showRandom) return 'random';
  return null;
}
