import { fn } from '@vitest/spy';
import fetchMock from 'fetch-mock';

const EARMARK_STORAGE_KEY = 'iD-maproulette-earmarks';
const MR_API = 'https://maproulette.org/api/v2';

describe('iD.serviceMapRoulette', function() {
    var maproulette;

    function clearEarmarkStorage() {
        window.sessionStorage.removeItem(EARMARK_STORAGE_KEY);
    }

    function makeQAItem(overrides) {
        overrides = overrides || {};
        var id = overrides.id || '100';
        var parentId = overrides.parentId || '200';
        var loc = overrides.loc || [10, 0];
        return new iD.QAItem(loc, maproulette, 'task', id, {
            parentId: parentId,
            severity: 'warning',
            task: Object.assign({
                id: id,
                parentId: parentId,
                title: overrides.title || 'Test task',
            }, overrides.task || {}),
            elems: overrides.elems || ['w1'],
            newComment: overrides.newComment,
        });
    }

    function mockPostUpdateSuccess(taskId, status) {
        status = status || 1;
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

    function mockPostUpdateCommentFailure(taskId) {
        fetchMock.mock(new RegExp(`${MR_API}/task/${taskId}/comment`), {
            status: 500,
            body: '{"message":"comment failed"}',
        });
    }

    function readStoredEarmarks() {
        var raw = window.sessionStorage.getItem(EARMARK_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    }

    beforeEach(function() {
        iD.services.maproulette = iD.serviceMapRoulette;
        fetchMock.reset();
        clearEarmarkStorage();
    });

    afterEach(function() {
        delete iD.services.maproulette;
        fetchMock.reset();
        clearEarmarkStorage();
    });

    beforeEach(function() {
        maproulette = iD.services.maproulette;
        maproulette.reset();
    });

    describe('#init / #reset', function() {
        it('initializes cache once', function() {
            maproulette.earmarkTask(makeQAItem({ id: '1' }));
            var first = maproulette.getEarmarked();

            maproulette.init();
            maproulette.earmarkTask(makeQAItem({ id: '2' }));

            expect(maproulette.getEarmarked().map(function(e) { return e.taskID; }))
                .toEqual(['1', '2']);
            expect(first.length).toBe(1);
        });

        it('reset clears live cache but restores persisted earmarks', function() {
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
            }]);
            expect(readStoredEarmarks()).toHaveLength(1);
        });
    });

    describe('earmark lifecycle', function() {
        it('earmarkTask, isEarmarked, getEarmarked, and unearmarkTask', function() {
            var item = makeQAItem({
                id: '10',
                parentId: '20',
                newComment: ' fixed locally',
                title: 'Missing tag',
            });

            var earmark = maproulette.earmarkTask(item);

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

        it('setEarmarkedChecked toggles upload inclusion without dropping the earmark', function() {
            maproulette.earmarkTask(makeQAItem({ id: '10' }));
            maproulette.earmarkTask(makeQAItem({ id: '11' }));

            maproulette.setEarmarkedChecked('10', false);

            expect(maproulette.isEarmarked('10')).toBe(true);
            expect(maproulette.getEarmarked()).toHaveLength(2);
            expect(maproulette.getEarmarkedForUpload().map(function(e) {
                return e.taskID;
            })).toEqual(['11']);

            maproulette.setEarmarkedChecked('10', true);
            expect(maproulette.getEarmarkedForUpload().map(function(e) {
                return e.taskID;
            })).toEqual(['10', '11']);
        });

        it('takeEarmarkedSnapshot returns checked earmarks and leaves unchecked ones', function() {
            maproulette.earmarkTask(makeQAItem({ id: '1' }));
            maproulette.earmarkTask(makeQAItem({ id: '2' }));
            maproulette.setEarmarkedChecked('2', false);

            var snapshot = maproulette.takeEarmarkedSnapshot();

            expect(snapshot.map(function(e) { return e.taskID; })).toEqual(['1']);
            expect(maproulette.getEarmarked().map(function(e) {
                return e.taskID;
            })).toEqual(['2']);
            expect(maproulette.isEarmarked('2')).toBe(true);
        });

        it('restoreEarmarks re-queues earmarks and persists them', function() {
            var list = [
                {
                    taskID: '7',
                    challengeID: '8',
                    parentName: 'Challenge',
                    title: 'Retry me',
                    elems: ['n1'],
                    loc: [1, 2],
                    newComment: 'note',
                    _status: 1,
                },
            ];

            maproulette.restoreEarmarks(list);

            expect(maproulette.getEarmarked()).toEqual(list);
            expect(readStoredEarmarks()).toEqual(list);
        });
    });

    describe('#removeItem', function() {
        it('clears earmark persistence when removing an earmarked task', function() {
            var item = makeQAItem({ id: '55', parentId: '66' });
            maproulette.replaceItem(item);
            maproulette.earmarkTask(item);

            expect(readStoredEarmarks()).toHaveLength(1);

            maproulette.removeItem(item);

            expect(maproulette.isEarmarked('55')).toBe(false);
            expect(maproulette.getError('55')).toBeUndefined();
            expect(readStoredEarmarks()).toEqual([]);
        });
    });

    describe('#resolveEarmarksAfterChangeset', function() {
        it('resolves earmarks as Fixed with merged comments and progress callbacks', async function() {
            mockPostUpdateSuccess('101');
            mockPostUpdateSuccess('102');

            var earmarks = [
                {
                    taskID: '101',
                    challengeID: '201',
                    parentName: '',
                    title: 'One',
                    elems: [],
                    loc: null,
                    newComment: 'Per-task note',
                    _status: 1,
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
                },
            ];

            var progress = fn();
            var result = await maproulette.resolveEarmarksAfterChangeset(earmarks, {
                comment: 'Fixed in OSM changeset 123',
                mapRouletteApiKey: 'test-key',
                onProgress: progress,
            });

            expect(result).toEqual({ ok: 2, failed: 0, failedEarmarks: [] });
            expect(progress).toHaveBeenCalledWith({ index: 1, total: 2, taskID: '101' });
            expect(progress).toHaveBeenCalledWith({ index: 2, total: 2, taskID: '102' });
            expect(progress).toHaveBeenCalledWith({ index: 2, total: 2, done: true });

            var commentCalls = fetchMock.calls().filter(function(call) {
                return call[0].includes('/comment');
            });
            expect(commentCalls).toHaveLength(2);
            expect(JSON.parse(commentCalls[0][1].body)).toEqual({
                comment: 'Fixed in OSM changeset 123\n\nPer-task note',
            });
            expect(JSON.parse(commentCalls[1][1].body)).toEqual({
                comment: 'Fixed in OSM changeset 123',
            });

            var statusCalls = fetchMock.calls().filter(function(call) {
                return /\/task\/\d+\/1$/.test(call[0]) && call[1].method === 'PUT';
            });
            expect(statusCalls).toHaveLength(2);
            expect(statusCalls[0][1].headers.apiKey).toBe('test-key');
        });

        it('returns failed earmarks when postUpdate fails', async function() {
            mockPostUpdateSuccess('201');
            mockPostUpdateCommentFailure('202');

            var earmarks = [
                {
                    taskID: '201',
                    challengeID: '301',
                    parentName: '',
                    title: 'Ok',
                    elems: [],
                    loc: null,
                    newComment: '',
                    _status: 1,
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
                },
            ];

            var progress = fn();
            var result = await maproulette.resolveEarmarksAfterChangeset(earmarks, {
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

        it('handles an empty earmark list', async function() {
            var progress = fn();
            var result = await maproulette.resolveEarmarksAfterChangeset([], {
                onProgress: progress,
            });

            expect(result).toEqual({ ok: 0, failed: 0, failedEarmarks: [] });
            expect(progress).toHaveBeenCalledWith({ index: 0, total: 0, done: true });
            expect(fetchMock.calls()).toHaveLength(0);
        });
    });

    describe('#postUpdate', function() {
        it('submits comment, Fixed status, and release', async function() {
            mockPostUpdateSuccess('999', 1);

            var payload = {
                id: '999',
                parentId: '888',
                _status: 1,
                comment: 'Resolved via upload',
                mapRouletteApiKey: 'secret',
            };

            var err = await new Promise(function(resolve) {
                maproulette.postUpdate(payload, function(e) { resolve(e); });
            });

            expect(err).toBeNull();
            expect(maproulette.getClosed()).toEqual([{
                challengeID: '888',
                taskID: '999',
            }]);
            // Stays on the map as recently resolved (not removed).
            var kept = maproulette.getError('999');
            expect(kept).toBeTruthy();
            expect(maproulette.isRecentlyResolved(kept)).toBe(true);
            expect(maproulette.isOpenTask(kept)).toBe(false);

            var methods = fetchMock.calls().map(function(call) {
                return [call[0], call[1].method];
            });
            expect(methods).toEqual(expect.arrayContaining([
                [expect.stringMatching(/\/task\/999\/comment/), 'POST'],
                [expect.stringMatching(/\/task\/999\/1$/), 'PUT'],
                [expect.stringMatching(/\/task\/999\/release/), 'GET'],
            ]));
        });
    });

    describe('resolved visibility', function() {
        it('treats Created as open and Fixed within 24h as recently resolved', function() {
            var open = makeQAItem({ id: '1', parentId: '2' });
            open.taskStatus = 0;
            expect(maproulette.isOpenTask(open)).toBe(true);
            expect(maproulette.shouldDisplayTask(open)).toBe(true);

            var fixed = makeQAItem({ id: '3', parentId: '2' });
            fixed.taskStatus = 1;
            fixed.mappedOn = new Date().toISOString();
            expect(maproulette.isOpenTask(fixed)).toBe(false);
            expect(maproulette.isRecentlyResolved(fixed)).toBe(true);
            expect(maproulette.shouldDisplayTask(fixed)).toBe(true);

            var old = makeQAItem({ id: '4', parentId: '2' });
            old.taskStatus = 1;
            old.mappedOn = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();
            expect(maproulette.isRecentlyResolved(old)).toBe(false);
            expect(maproulette.shouldDisplayTask(old)).toBe(false);

            var noDate = makeQAItem({ id: '5', parentId: '2' });
            noDate.taskStatus = 1;
            delete noDate.mappedOn;
            if (noDate.task) delete noDate.task.mappedOn;
            expect(maproulette.isRecentlyResolved(noDate)).toBe(false);
            expect(maproulette.shouldDisplayTask(noDate)).toBe(false);
        });
    });

    describe('#loadTaskDetailAsync cooperativeWork', function() {
        it('retains FeatureCollection-root cooperativeWork on the detail and QAItem', async function() {
            var cw = {
                meta: { version: 2, type: 1 },
                operations: [{
                    operationType: 'modifyElement',
                    data: {
                        id: 'way/1',
                        operations: [{ operation: 'setTags', data: { amenity: 'pharmacy' } }]
                    }
                }]
            };
            var item = makeQAItem({ id: '501', parentId: '502', elems: ['w1'] });
            // Seed pin into the service cache via replaceItem if available.
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
                            properties: { '@id': 'way/1' }
                        }],
                        cooperativeWork: cw,
                    },
                }),
            });

            var detail = await maproulette.loadTaskDetailAsync(item);
            expect(detail).toBeTruthy();
            expect(detail.cooperativeWork).toEqual(cw);
            expect(item.task && item.task.cooperativeWork).toEqual(cw);
        });
    });
});
