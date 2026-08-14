import { fn } from '@vitest/spy';
import fetchMock from 'fetch-mock';

import type { MapRouletteEarmark } from '../../../modules/services/maproulette';

const EARMARK_STORAGE_KEY = 'iD-maproulette-earmarks';
const MR_API = 'https://maproulette.org/api/v2';

describe('iD.serviceMapRoulette', () => {
  let maproulette: any;

  function clearEarmarkStorage() {
    window.sessionStorage.removeItem(EARMARK_STORAGE_KEY);
  }

  function makeQAItem(overrides: Record<string, any> = {}): any {
    const id = overrides.id || '100';
    const parentId = overrides.parentId || '200';
    const loc = overrides.loc || [10, 0];
    return new iD.QAItem(loc, maproulette, 'task', id, {
      parentId,
      severity: 'warning',
      task: Object.assign({
        id,
        parentId,
        title: overrides.title || 'Test task',
      }, overrides.task || {}),
      elems: overrides.elems || ['w1'],
      newComment: overrides.newComment,
    } as any);
  }

  function mockPostUpdateSuccess(taskId: string, status: number = 1) {
    fetchMock.mock(new RegExp(`${MR_API}/task/${taskId}/comment`), {
      status: 200,
      body: '{}',
    });
    fetchMock.mock(new RegExp(`${MR_API}/task/${taskId}/${status}$`), {
      status: 204,
    });
    fetchMock.mock(new RegExp(`${MR_API}/task/${taskId}/release`), {
      status: 200,
    });
  }

  function mockPostUpdateCommentFailure(taskId: string) {
    fetchMock.mock(new RegExp(`${MR_API}/task/${taskId}/comment`), {
      status: 500,
      body: '{"message":"comment failed"}',
    });
  }

  function readStoredEarmarks(): MapRouletteEarmark[] {
    const raw = window.sessionStorage.getItem(EARMARK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  beforeEach(() => {
    (iD.services as any).maproulette = iD.serviceMapRoulette;
    fetchMock.reset();
    clearEarmarkStorage();
  });

  afterEach(() => {
    delete (iD.services as any).maproulette;
    fetchMock.reset();
    clearEarmarkStorage();
  });

  beforeEach(() => {
    maproulette = iD.services.maproulette;
    maproulette.reset();
  });

  describe('#init / #reset', () => {
    it('initializes cache once', () => {
      maproulette.earmarkTask(makeQAItem({ id: '1' }));
      const first = maproulette.getEarmarked();

      maproulette.init();
      maproulette.earmarkTask(makeQAItem({ id: '2' }));

      expect(maproulette.getEarmarked().map((e: MapRouletteEarmark) => e.taskID))
        .toEqual(['1', '2']);
      expect(first.length).toBe(1);
    });

    it('reset clears live cache but restores persisted earmarks', () => {
      maproulette.earmarkTask(makeQAItem({ id: '42', parentId: '99' }));
      expect(readStoredEarmarks()).toHaveLength(1);

      maproulette.reset();

      expect(maproulette.getEarmarked()).toEqual([{
        taskID: '42',
        challengeID: '99',
        parentName: '',
        title: 'Test task',
        elems: ['w1'],
        loc: [10, 0],
        newComment: '',
        _status: 1,
        includeInUpload: true,
        localDone: false,
      }]);
      expect(readStoredEarmarks()).toHaveLength(1);
    });
  });

  describe('earmark lifecycle', () => {
    it('earmarkTask, isEarmarked, getEarmarked, and unearmarkTask', () => {
      const item = makeQAItem({
        id: '10',
        parentId: '20',
        newComment: ' fixed locally',
        title: 'Missing tag',
      });

      const earmark = maproulette.earmarkTask(item);

      expect(earmark).toMatchObject({
        taskID: '10',
        challengeID: '20',
        title: 'Missing tag',
        elems: ['w1'],
        loc: [10, 0],
        newComment: 'fixed locally',
        _status: 1,
        includeInUpload: true,
      });
      expect(item.earmarked).toBe(true);
      expect(maproulette.isEarmarked('10')).toBe(true);
      expect(maproulette.getEarmarked()).toHaveLength(1);
      expect(readStoredEarmarks()).toHaveLength(1);

      maproulette.unearmarkTask('10');

      expect(maproulette.isEarmarked('10')).toBe(false);
      expect(maproulette.getEarmarked()).toEqual([]);
      expect(readStoredEarmarks()).toEqual([]);
    });

    it('earmarkTask stores non-Fixed statuses and can mark local done', () => {
      const item = makeQAItem({ id: '44', parentId: '55' });
      maproulette.replaceItem(item);

      const earmark = maproulette.earmarkTask(item, 6, { markLocalDone: true });

      expect(earmark?._status).toBe(6);
      expect(earmark?.localDone).toBe(true);
      expect(maproulette.isEarmarked('44')).toBe(true);
      expect(maproulette.isRecentlyResolved(maproulette.getError('44'))).toBe(true);

      maproulette.unearmarkTask('44');
      expect(maproulette.isEarmarked('44')).toBe(false);
      expect(maproulette.isRecentlyResolved(maproulette.getError('44'))).toBe(false);
    });

    it('soft earmark does not mark the task locally resolved', () => {
      const item = makeQAItem({ id: '45', parentId: '55' });
      maproulette.replaceItem(item);

      const earmark = maproulette.earmarkTask(item);

      expect(earmark?.localDone).toBe(false);
      expect(maproulette.isEarmarked('45')).toBe(true);
      expect(maproulette.isRecentlyResolved(maproulette.getError('45'))).toBe(false);
      expect(maproulette.isOpenTask(maproulette.getError('45'))).toBe(true);
    });

    it('earmarkTask stores completionResponses when present', () => {
      const item = makeQAItem({ id: '46', parentId: '56' });
      item.completionResponses = { source: 'survey' };
      const earmark = maproulette.earmarkTask(item);
      expect(earmark?.completionResponses).toEqual({ source: 'survey' });
    });

    it('earmarkTask omits completionResponses when absent', () => {
      const item = makeQAItem({ id: '47', parentId: '57' });
      const earmark = maproulette.earmarkTask(item);
      expect(earmark).not.toHaveProperty('completionResponses');
    });

    it('clearClosed drops session-immediate outcomes after upload', async () => {
      mockPostUpdateSuccess('999', 1);
      const payload = {
        id: '999',
        parentId: '888',
        _status: 1,
        comment: '',
        mapRouletteApiKey: 'secret',
      };
      await new Promise((resolve) => {
        maproulette.postUpdate(payload, () => resolve(null));
      });
      expect(maproulette.getClosed()).toHaveLength(1);
      maproulette.clearClosed();
      expect(maproulette.getClosed()).toEqual([]);
    });

    it('setEarmarkedChecked toggles upload inclusion without dropping the earmark', () => {
      maproulette.earmarkTask(makeQAItem({ id: '10' }));
      maproulette.earmarkTask(makeQAItem({ id: '11' }));

      maproulette.setEarmarkedChecked('10', false);

      expect(maproulette.isEarmarked('10')).toBe(true);
      expect(maproulette.getEarmarked()).toHaveLength(2);
      expect(maproulette.getEarmarkedForUpload().map((e: MapRouletteEarmark) => e.taskID))
        .toEqual(['11']);

      maproulette.setEarmarkedChecked('10', true);
      expect(maproulette.getEarmarkedForUpload().map((e: MapRouletteEarmark) => e.taskID))
        .toEqual(['10', '11']);
    });

    it('takeEarmarkedSnapshot returns checked earmarks and leaves unchecked ones', () => {
      maproulette.earmarkTask(makeQAItem({ id: '1' }));
      maproulette.earmarkTask(makeQAItem({ id: '2' }));
      maproulette.setEarmarkedChecked('2', false);

      const snapshot = maproulette.takeEarmarkedSnapshot();

      expect(snapshot.map((e: MapRouletteEarmark) => e.taskID)).toEqual(['1']);
      expect(maproulette.getEarmarked().map((e: MapRouletteEarmark) => e.taskID))
        .toEqual(['2']);
      expect(maproulette.isEarmarked('2')).toBe(true);
    });

    it('restoreEarmarks re-queues earmarks and persists them', () => {
      const list: MapRouletteEarmark[] = [
        {
          taskID: '7',
          challengeID: '8',
          parentName: 'Challenge',
          title: 'Retry me',
          elems: ['n1'],
          loc: [1, 2],
          newComment: 'note',
          _status: 1,
          includeInUpload: true,
        },
      ];

      maproulette.restoreEarmarks(list);

      const expected = [Object.assign({}, list[0], { localDone: true })];
      expect(maproulette.getEarmarked()).toEqual(expected);
      expect(readStoredEarmarks()).toEqual(expected);
    });
  });

  describe('#removeItem', () => {
    it('clears earmark persistence when removing an earmarked task', () => {
      const item = makeQAItem({ id: '55', parentId: '66' });
      maproulette.replaceItem(item);
      maproulette.earmarkTask(item);

      expect(readStoredEarmarks()).toHaveLength(1);

      maproulette.removeItem(item);

      expect(maproulette.isEarmarked('55')).toBe(false);
      expect(maproulette.getError('55')).toBeUndefined();
      expect(readStoredEarmarks()).toEqual([]);
    });
  });

  describe('#resolveEarmarksAfterChangeset', () => {
    it('resolves earmarks with auto changeset comment and progress callbacks', async () => {
      mockPostUpdateSuccess('101');
      mockPostUpdateSuccess('102');

      const earmarks: MapRouletteEarmark[] = [
        {
          taskID: '101',
          challengeID: '201',
          parentName: '',
          title: 'One',
          elems: [],
          loc: null,
          newComment: 'Per-task note',
          _status: 1,
          includeInUpload: true,
        },
        {
          taskID: '102',
          challengeID: '201',
          parentName: '',
          title: 'Two',
          elems: [],
          loc: null,
          newComment: '',
          _status: 1,
          includeInUpload: true,
        },
      ];

      const progress = fn();
      const result = await maproulette.resolveEarmarksAfterChangeset(earmarks, {
        comment: 'Fixed in OSM changeset 123',
        mapRouletteApiKey: 'test-key',
        onProgress: progress,
      });

      expect(result).toEqual({ ok: 2, failed: 0, failedEarmarks: [] });
      expect(progress).toHaveBeenCalledWith({ index: 1, total: 2, taskID: '101' });
      expect(progress).toHaveBeenCalledWith({ index: 2, total: 2, taskID: '102' });
      expect(progress).toHaveBeenCalledWith({ index: 2, total: 2, done: true });

      const commentCalls = fetchMock.calls().filter((call) => {
        return String(call[0]).includes('/comment');
      });
      expect(commentCalls).toHaveLength(2);
      expect(JSON.parse(String(commentCalls[0][1]?.body))).toEqual({
        comment: 'Fixed in OSM changeset 123',
      });
      expect(JSON.parse(String(commentCalls[1][1]?.body))).toEqual({
        comment: 'Fixed in OSM changeset 123',
      });

      const statusCalls = fetchMock.calls().filter((call) => {
        return /\/task\/\d+\/1$/.test(String(call[0])) && call[1]?.method === 'PUT';
      });
      expect(statusCalls).toHaveLength(2);
      const headers = statusCalls[0][1]?.headers as Record<string, string>;
      expect(headers.apiKey).toBe('test-key');
    });

    it('sends earmarked completionResponses in status PUT body', async () => {
      mockPostUpdateSuccess('501');

      const earmarks: MapRouletteEarmark[] = [
        {
          taskID: '501',
          challengeID: '601',
          parentName: '',
          title: 'With responses',
          elems: [],
          loc: null,
          newComment: '',
          _status: 1,
          includeInUpload: true,
          completionResponses: { myDropdown: 'bar' },
        },
      ];

      const result = await maproulette.resolveEarmarksAfterChangeset(earmarks, {
        comment: 'Fixed in OSM changeset 456',
      });

      expect(result).toEqual({ ok: 1, failed: 0, failedEarmarks: [] });

      const statusCalls = fetchMock.calls().filter((call) => {
        return /\/task\/501\/1$/.test(String(call[0])) && call[1]?.method === 'PUT';
      });
      expect(statusCalls).toHaveLength(1);
      expect(JSON.parse(String(statusCalls[0][1]?.body))).toEqual({ myDropdown: 'bar' });
    });

    it('posts each earmark’s queued status (not only Fixed)', async () => {
      mockPostUpdateSuccess('301', 6);

      const earmarks: MapRouletteEarmark[] = [
        {
          taskID: '301',
          challengeID: '401',
          parentName: '',
          title: 'Hard',
          elems: [],
          loc: null,
          newComment: '',
          _status: 6,
          includeInUpload: true,
        },
      ];

      const result = await maproulette.resolveEarmarksAfterChangeset(earmarks, {
        comment: 'Updated in changeset',
      });

      expect(result.ok).toBe(1);
      const statusCalls = fetchMock.calls().filter((call) => {
        return /\/task\/301\/6$/.test(String(call[0])) && call[1]?.method === 'PUT';
      });
      expect(statusCalls).toHaveLength(1);
    });

    it('returns failed earmarks when postUpdate fails', async () => {
      mockPostUpdateSuccess('201');
      mockPostUpdateCommentFailure('202');

      const earmarks: MapRouletteEarmark[] = [
        {
          taskID: '201',
          challengeID: '301',
          parentName: '',
          title: 'Ok',
          elems: [],
          loc: null,
          newComment: '',
          _status: 1,
          includeInUpload: true,
        },
        {
          taskID: '202',
          challengeID: '301',
          parentName: '',
          title: 'Bad',
          elems: [],
          loc: null,
          newComment: 'will fail',
          _status: 1,
          includeInUpload: true,
        },
      ];

      const progress = fn();
      const result = await maproulette.resolveEarmarksAfterChangeset(earmarks, {
        comment: 'base',
        onProgress: progress,
      });

      expect(result.ok).toBe(1);
      expect(result.failed).toBe(1);
      expect(result.failedEarmarks).toEqual([earmarks[1]]);
      expect(progress).toHaveBeenCalledWith(expect.objectContaining({
        taskID: '202',
        error: expect.anything(),
      }));
    });

    it('handles an empty earmark list', async () => {
      const progress = fn();
      const result = await maproulette.resolveEarmarksAfterChangeset([], {
        onProgress: progress,
      });

      expect(result).toEqual({ ok: 0, failed: 0, failedEarmarks: [] });
      expect(progress).toHaveBeenCalledWith({ index: 0, total: 0, done: true });
      expect(fetchMock.calls()).toHaveLength(0);
    });
  });

  describe('#postUpdate', () => {
    it('submits comment, Fixed status, and release', async () => {
      mockPostUpdateSuccess('999', 1);

      const payload = {
        id: '999',
        parentId: '888',
        _status: 1,
        comment: 'Resolved via upload',
        mapRouletteApiKey: 'secret',
      };

      const err = await new Promise((resolve) => {
        maproulette.postUpdate(payload, (e: unknown) => { resolve(e); });
      });

      expect(err).toBeNull();
      expect(maproulette.getClosed()).toEqual([{
        challengeID: '888',
        taskID: '999',
        _status: 1,
      }]);
      // Stays on the map as recently resolved (not removed).
      const kept = maproulette.getError('999');
      expect(kept).toBeTruthy();
      expect(maproulette.isRecentlyResolved(kept)).toBe(true);
      expect(maproulette.isOpenTask(kept)).toBe(false);

      const methods = fetchMock.calls().map((call) => {
        return [call[0], call[1]?.method];
      });
      expect(methods).toEqual(expect.arrayContaining([
        [expect.stringMatching(/\/task\/999\/comment/), 'POST'],
        [expect.stringMatching(/\/task\/999\/1$/), 'PUT'],
        [expect.stringMatching(/\/task\/999\/release/), 'GET'],
      ]));
    });

    it('sends completionResponses as JSON body on status PUT', async () => {
      mockPostUpdateSuccess('777', 1);

      const err = await new Promise((resolve) => {
        maproulette.postUpdate({
          id: '777',
          parentId: '666',
          _status: 1,
          completionResponses: { myDropdown: 'foo' },
        }, (e: unknown) => { resolve(e); });
      });

      expect(err).toBeNull();

      const statusCalls = fetchMock.calls().filter((call) => {
        return /\/task\/777\/1$/.test(String(call[0])) && call[1]?.method === 'PUT';
      });
      expect(statusCalls).toHaveLength(1);
      expect(JSON.parse(String(statusCalls[0][1]?.body))).toEqual({ myDropdown: 'foo' });
    });

    it('sends boolean completionResponses in status PUT body', async () => {
      mockPostUpdateSuccess('778', 1);

      const err = await new Promise((resolve) => {
        maproulette.postUpdate({
          id: '778',
          parentId: '666',
          _status: 1,
          completionResponses: { myCheckbox: true },
        }, (e: unknown) => { resolve(e); });
      });

      expect(err).toBeNull();

      const statusCalls = fetchMock.calls().filter((call) => {
        return /\/task\/778\/1$/.test(String(call[0])) && call[1]?.method === 'PUT';
      });
      expect(statusCalls).toHaveLength(1);
      expect(JSON.parse(String(statusCalls[0][1]?.body))).toEqual({ myCheckbox: true });
    });
  });

  describe('tile merge status preservation', () => {
    const dimensions: [number, number] = [640, 480];

    function testProjection() {
      return iD.geoRawMercator()
        .scale(iD.geoZoomToScale(14))
        .translate([-116508, 0])
        .clipExtent([[0, 0], dimensions]);
    }

    function mockTileWithTask(task: Record<string, any>) {
      fetchMock.mock(/tasks\/box\//, [task]);
      const parentId = String(task.parentId);
      fetchMock.mock(new RegExp(`${MR_API}/challenge/${parentId}`), {
        status: 200,
        body: JSON.stringify({
          id: Number(parentId),
          name: 'Test challenge',
          enabled: true,
          deleted: false,
        }),
      });
    }

    it('keeps earmarked Fixed when API still returns Created', async () => {
      const item = makeQAItem({ id: '77', parentId: '88', loc: [10, 0] });
      item.taskStatus = 0;
      maproulette.replaceItem(item);
      maproulette.earmarkTask(item, 1, { markLocalDone: true });

      mockTileWithTask({
        id: 77,
        parentId: 88,
        status: 0,
        point: { lng: 10, lat: 0 },
      });

      maproulette.loadIssues(testProjection());
      await vi.waitFor(() => {
        const cached = maproulette.getError('77');
        expect(cached?.taskStatus).toBe(1);
        expect(maproulette.isRecentlyResolved(cached)).toBe(true);
      });
    });

    it('keeps session-resolved Fixed when API still returns Created', async () => {
      const item = makeQAItem({ id: '78', parentId: '89', loc: [10, 0] });
      item.taskStatus = 0;
      maproulette.replaceItem(item);
      mockPostUpdateSuccess('78', 1);

      await new Promise((resolve) => {
        maproulette.postUpdate({
          id: '78',
          parentId: '89',
          _status: 1,
          comment: 'Fixed',
        }, () => resolve(null));
      });

      mockTileWithTask({
        id: 78,
        parentId: 89,
        status: 0,
        point: { lng: 10, lat: 0 },
      });

      maproulette.loadIssues(testProjection());
      await vi.waitFor(() => {
        const cached = maproulette.getError('78');
        expect(cached?.taskStatus).toBe(1);
        expect(maproulette.isRecentlyResolved(cached)).toBe(true);
      });
    });

    it('restores earmark resolved fields when tasks load after reset', async () => {
      const item = makeQAItem({ id: '79', parentId: '90', loc: [10, 0] });
      item.taskStatus = 0;
      maproulette.replaceItem(item);
      maproulette.earmarkTask(item, 5, { markLocalDone: true });
      maproulette.reset();

      expect(maproulette.getEarmarked()).toHaveLength(1);
      expect(maproulette.getError('79')).toBeUndefined();

      mockTileWithTask({
        id: 79,
        parentId: 90,
        status: 0,
        point: { lng: 10, lat: 0 },
      });

      maproulette.loadIssues(testProjection());
      await vi.waitFor(() => {
        const cached = maproulette.getError('79');
        expect(cached?.taskStatus).toBe(5);
        expect(cached?.earmarked).toBe(true);
      });
    });
  });

  describe('resolved visibility', () => {
    it('treats Created as open and Fixed within 24h as recently resolved', () => {
      const open = makeQAItem({ id: '1', parentId: '2' });
      open.taskStatus = 0;
      expect(maproulette.isOpenTask(open)).toBe(true);
      expect(maproulette.shouldDisplayTask(open)).toBe(true);

      const fixed = makeQAItem({ id: '3', parentId: '2' });
      fixed.taskStatus = 1;
      fixed.mappedOn = new Date().toISOString();
      expect(maproulette.isOpenTask(fixed)).toBe(false);
      expect(maproulette.isRecentlyResolved(fixed)).toBe(true);
      expect(maproulette.shouldDisplayTask(fixed)).toBe(true);

      const old = makeQAItem({ id: '4', parentId: '2' });
      old.taskStatus = 1;
      old.mappedOn = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();
      expect(maproulette.isRecentlyResolved(old)).toBe(false);
      expect(maproulette.shouldDisplayTask(old)).toBe(false);

      const noDate = makeQAItem({ id: '5', parentId: '2' });
      noDate.taskStatus = 1;
      delete noDate.mappedOn;
      if (noDate.task) delete noDate.task.mappedOn;
      expect(maproulette.isRecentlyResolved(noDate)).toBe(false);
      expect(maproulette.shouldDisplayTask(noDate)).toBe(false);
    });
  });

  describe('#isLoadingIssues', () => {
    const dimensions: [number, number] = [640, 480];

    function testProjection() {
      return iD.geoRawMercator()
        .scale(iD.geoZoomToScale(14))
        .translate([-116508, 0])
        .clipExtent([[0, 0], dimensions]);
    }

    beforeEach(() => {
      maproulette.init();
    });

    it('is false below the minimum load zoom', () => {
      const projection = testProjection();
      expect(maproulette.isLoadingIssues(projection, 11)).toBe(false);
    });

    it('is true while viewport tiles are unloaded at load zoom', () => {
      const projection = testProjection();
      expect(maproulette.isLoadingIssues(projection, 14)).toBe(true);
    });

    it('is true synchronously after loadIssues starts a fetch', () => {
      const projection = testProjection();
      fetchMock.mock(/tasks\/box\//, () => new Promise(() => {}));

      maproulette.loadIssues(projection);
      expect(maproulette.isLoadingIssues(projection, 14)).toBe(true);
    });

    it('is false after an empty tile response and dispatches loaded', async () => {
      const projection = testProjection();
      const loaded = fn();
      maproulette.on('loaded', loaded);

      fetchMock.mock(/tasks\/box\//, []);

      maproulette.loadIssues(projection);
      await vi.waitFor(() => {
        expect(maproulette.isLoadingIssues(projection, 14)).toBe(false);
      });
      expect(loaded).toHaveBeenCalled();
    });

    it('is false after a tile fetch error and dispatches loaded', async () => {
      const projection = testProjection();
      const loaded = fn();
      maproulette.on('loaded', loaded);

      fetchMock.mock(/tasks\/box\//, { status: 500, body: '{}' });

      maproulette.loadIssues(projection);
      await vi.waitFor(() => {
        expect(maproulette.isLoadingIssues(projection, 14)).toBe(false);
      });
      expect(loaded).toHaveBeenCalled();
    });

    it('is true when viewport tiles are stale and need refetch', async () => {
      vi.useFakeTimers();
      try {
        const projection = testProjection();
        fetchMock.mock(/tasks\/box\//, []);

        maproulette.loadIssues(projection);
        await vi.waitFor(() => {
          expect(maproulette.isLoadingIssues(projection, 14)).toBe(false);
        });

        vi.advanceTimersByTime(2 * 60 * 1000 + 1);
        expect(maproulette.isLoadingIssues(projection, 14)).toBe(true);
      } finally {
        vi.useRealTimers();
      }
    });

    it('does not mark tiles loaded when a fetch is aborted', async () => {
      const projection = testProjection();
      const farProjection = iD.geoRawMercator()
        .scale(iD.geoZoomToScale(14))
        .translate([0, 0])
        .clipExtent([[0, 0], dimensions]);

      fetchMock.mock(/tasks\/box\//, () => new Promise(() => {}));

      maproulette.loadIssues(projection);
      expect(maproulette.isLoadingIssues(projection, 14)).toBe(true);

      maproulette.loadIssues(farProjection);
      await vi.waitFor(() => {
        expect(maproulette.isLoadingIssues(farProjection, 14)).toBe(true);
      });

      maproulette.loadIssues(projection);
      expect(maproulette.isLoadingIssues(projection, 14)).toBe(true);
    });

    it('ignores superseded tile fetch responses', async () => {
      const projection = testProjection();
      const farProjection = iD.geoRawMercator()
        .scale(iD.geoZoomToScale(14))
        .translate([0, 0])
        .clipExtent([[0, 0], dimensions]);

      let abortResolve!: () => void;
      const hangingPromise = new Promise((resolve) => {
        abortResolve = () => resolve([]);
      });

      fetchMock.mock(/tasks\/box\//, () => hangingPromise);

      maproulette.loadIssues(projection);
      expect(maproulette.isLoadingIssues(projection, 14)).toBe(true);

      maproulette.loadIssues(farProjection);
      fetchMock.reset();
      fetchMock.mock(/tasks\/box\//, []);

      maproulette.loadIssues(projection);
      await vi.waitFor(() => {
        expect(maproulette.isLoadingIssues(projection, 14)).toBe(false);
      });

      abortResolve();
      await Promise.resolve();
      expect(maproulette.isLoadingIssues(projection, 14)).toBe(false);
    });
  });

  describe('#loadTaskDetailAsync cooperativeWork', () => {
    it('retains FeatureCollection-root cooperativeWork on the detail and QAItem', async () => {
      const cw = {
        meta: { version: 2, type: 1 },
        operations: [{
          operationType: 'modifyElement',
          data: {
            id: 'way/1',
            operations: [{ operation: 'setTags', data: { amenity: 'pharmacy' } }],
          },
        }],
      };
      const item = makeQAItem({ id: '501', parentId: '502', elems: ['w1'] });
      if (typeof maproulette.replaceItem === 'function') {
        maproulette.replaceItem(item);
      }

      fetchMock.mock(new RegExp(`${MR_API}/challenge/502`), {
        status: 200,
        body: JSON.stringify({
          id: 502,
          name: 'Coop challenge',
          enabled: true,
          deleted: false,
          instruction: 'Fix tags',
          description: 'Desc',
        }),
      });
      fetchMock.mock(new RegExp(`${MR_API}/task/501$`), {
        status: 200,
        body: JSON.stringify({
          id: 501,
          parentId: 502,
          title: 'w1@0',
          geometries: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              geometry: { type: 'LineString', coordinates: [[0, 0], [1, 1]] },
              properties: { '@id': 'way/1' },
            }],
            cooperativeWork: cw,
          },
        }),
      });

      const detail = await maproulette.loadTaskDetailAsync(item);
      expect(detail).toBeTruthy();
      expect(detail.cooperativeWork).toEqual(cw);
      expect(item.task && item.task.cooperativeWork).toEqual(cw);
    });
  });
});
