import serviceMapRoulette, { MR_STATUS } from '../../../modules/services/maproulette';
import {
  getLastWorkedChallengeId,
  mapDataNextAction,
  nextTaskActionsForPool,
  pickNearest,
  pickPriority,
  pickRandomNearby,
  preferredChallengeIds,
  resetLastWorkedChallengeId,
  resolveCandidatePool,
  setLastWorkedChallengeId,
} from '../../../modules/util/maproulette_next_task';

function seedTask(opts: {
  id: string;
  parentId: string;
  loc: [number, number];
  priority?: number;
  status?: number;
}) {
  const id = opts.id;
  const parentId = opts.parentId;
  const item = new (iD as any).QAItem(opts.loc, serviceMapRoulette, 'task', id, {
    parentId,
    severity: 'warning',
    taskStatus: opts.status !== undefined ? opts.status : MR_STATUS.CREATED,
    taskPriority: opts.priority,
    isVisible: true,
    task: {
      id,
      parentId,
      status: opts.status !== undefined ? opts.status : MR_STATUS.CREATED,
      priority: opts.priority,
    },
  });
  serviceMapRoulette.replaceItem(item);
  return item;
}

describe('iD.util.maproulette_next_task', () => {
  beforeEach(() => {
    sessionStorage.clear();
    resetLastWorkedChallengeId();
    (iD.services as any).maproulette = serviceMapRoulette;
    serviceMapRoulette.reset();
    serviceMapRoulette.challengeIDs('');
  });

  afterEach(() => {
    delete (iD.services as any).maproulette;
    serviceMapRoulette.reset();
    resetLastWorkedChallengeId();
    sessionStorage.clear();
  });

  describe('last worked challenge', () => {
    it('stores and clears session last-worked challenge', () => {
      expect(getLastWorkedChallengeId()).toBe(null);
      setLastWorkedChallengeId('99');
      expect(getLastWorkedChallengeId()).toBe('99');
      setLastWorkedChallengeId(null);
      expect(getLastWorkedChallengeId()).toBe(null);
    });
  });

  describe('preferredChallengeIds', () => {
    it('prefers Map Data filter over last worked and current', () => {
      serviceMapRoulette.challengeIDs('10,20');
      setLastWorkedChallengeId('99');
      expect(preferredChallengeIds(serviceMapRoulette, {
        currentChallengeId: '5',
        lastChallengeId: '99',
      })).toEqual(['10', '20']);
    });

    it('uses last worked when no filter', () => {
      expect(preferredChallengeIds(serviceMapRoulette, {
        currentChallengeId: '5',
        lastChallengeId: '99',
      })).toEqual(['99']);
    });

    it('uses current challenge when no filter or last', () => {
      expect(preferredChallengeIds(serviceMapRoulette, {
        currentChallengeId: '5',
      })).toEqual(['5']);
    });
  });

  describe('resolveCandidatePool', () => {
    it('returns primary when preferred challenge has open tasks', () => {
      seedTask({ id: '1', parentId: '7', loc: [0, 0], priority: 1 });
      seedTask({ id: '2', parentId: '7', loc: [0.01, 0], priority: 0 });
      seedTask({ id: '3', parentId: '8', loc: [0.02, 0], priority: 0 });

      const pool = resolveCandidatePool(serviceMapRoulette, {
        excludeId: '1',
        currentChallengeId: '7',
      });
      expect(pool.mode).toBe('primary');
      expect(pool.tasks.map((d: any) => String(d.id)).sort()).toEqual(['2']);
      expect(nextTaskActionsForPool(pool)).toEqual({
        showNearest: true,
        showPriority: true,
        showRandom: false,
      });
    });

    it('returns fallback (random only) when preferred challenge is empty', () => {
      seedTask({ id: '1', parentId: '7', loc: [0, 0] });
      seedTask({ id: '2', parentId: '8', loc: [0.01, 0] });

      const pool = resolveCandidatePool(serviceMapRoulette, {
        excludeId: '1',
        currentChallengeId: '7',
      });
      expect(pool.mode).toBe('fallback');
      expect(pool.tasks.map((d: any) => String(d.id))).toEqual(['2']);
      expect(nextTaskActionsForPool(pool)).toEqual({
        showNearest: false,
        showPriority: false,
        showRandom: true,
      });
    });

    it('returns empty when no other open tasks exist', () => {
      seedTask({ id: '1', parentId: '7', loc: [0, 0] });
      const pool = resolveCandidatePool(serviceMapRoulette, {
        excludeId: '1',
        currentChallengeId: '7',
      });
      expect(pool.mode).toBe('empty');
      expect(pool.tasks).toEqual([]);
      expect(nextTaskActionsForPool(pool)).toEqual({
        showNearest: false,
        showPriority: false,
        showRandom: false,
      });
    });

    it('respects Map Data challenge filter for primary scope', () => {
      serviceMapRoulette.challengeIDs('8');
      seedTask({ id: '1', parentId: '7', loc: [0, 0] });
      seedTask({ id: '2', parentId: '8', loc: [0.01, 0] });

      const pool = resolveCandidatePool(serviceMapRoulette, {
        excludeId: '1',
        currentChallengeId: '7',
      });
      expect(pool.mode).toBe('primary');
      expect(pool.tasks.map((d: any) => String(d.id))).toEqual(['2']);
    });
  });

  describe('mapDataNextAction', () => {
    it('returns nearest for primary pool', () => {
      seedTask({ id: '1', parentId: '7', loc: [0, 0] });
      seedTask({ id: '2', parentId: '7', loc: [0.01, 0] });
      const pool = resolveCandidatePool(serviceMapRoulette, {
        excludeId: '1',
        currentChallengeId: '7',
      });
      expect(pool.mode).toBe('primary');
      expect(mapDataNextAction(pool)).toBe('nearest');
    });

    it('returns random for fallback pool', () => {
      seedTask({ id: '1', parentId: '7', loc: [0, 0] });
      seedTask({ id: '2', parentId: '8', loc: [0.01, 0] });
      const pool = resolveCandidatePool(serviceMapRoulette, {
        excludeId: '1',
        currentChallengeId: '7',
      });
      expect(pool.mode).toBe('fallback');
      expect(mapDataNextAction(pool)).toBe('random');
    });

    it('returns null for empty pool', () => {
      seedTask({ id: '1', parentId: '7', loc: [0, 0] });
      const pool = resolveCandidatePool(serviceMapRoulette, {
        excludeId: '1',
        currentChallengeId: '7',
      });
      expect(pool.mode).toBe('empty');
      expect(mapDataNextAction(pool)).toBe(null);
    });

    it('returns random when filter is set but preferred scope is empty', () => {
      serviceMapRoulette.challengeIDs('7');
      seedTask({ id: '1', parentId: '7', loc: [0, 0] });
      seedTask({ id: '2', parentId: '8', loc: [0.01, 0] });
      const pool = resolveCandidatePool(serviceMapRoulette, {
        excludeId: '1',
      });
      expect(pool.mode).toBe('fallback');
      expect(mapDataNextAction(pool)).toBe('random');
    });
  });

  describe('pickers', () => {
    it('pickNearest chooses closest loc', () => {
      const a = { id: 'a', loc: [0, 0] };
      const b = { id: 'b', loc: [1, 0] };
      expect(pickNearest([a, b], [0.9, 0]).id).toBe('b');
    });

    it('pickPriority prefers lower priority number, then nearer', () => {
      const farHigh = { id: 'far', loc: [1, 0], taskPriority: 0 };
      const nearMed = { id: 'near', loc: [0.1, 0], taskPriority: 1 };
      expect(pickPriority([farHigh, nearMed], [0, 0]).id).toBe('far');

      const nearHigh = { id: 'nearHigh', loc: [0.1, 0], taskPriority: 0 };
      const farHigh2 = { id: 'farHigh', loc: [1, 0], taskPriority: 0 };
      expect(pickPriority([farHigh2, nearHigh], [0, 0]).id).toBe('nearHigh');
    });

    it('pickRandomNearby prefers viewport intersection', () => {
      const a = { id: 'a', loc: [0, 0] };
      const b = { id: 'b', loc: [1, 0] };
      const picked = pickRandomNearby([a, b], [b], function() { return 0; });
      expect(picked.id).toBe('b');
    });
  });
});
