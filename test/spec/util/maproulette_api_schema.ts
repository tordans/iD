import {
  asParsedOrNull,
  buildMrTaskDetailView,
  challengeIsVisible,
  extractMrCooperativeWork,
  isMrTagFixCooperativeWork,
  parseMrBoxTasks,
  parseMrChallenge,
  parseMrEarmarkList,
  parseMrModifyElementOps,
  parseMrSetTagsData,
  parseMrTaskDetails,
  parseMrUnsetTagKeys,
  unwrapMrGeometries,
} from '../../../modules/util/maproulette_api_schema';

describe('iD.util.maproulette_api_schema', () => {
  describe('parseMrBoxTasks', () => {
    it('accepts a bare array and coerces ids / point', () => {
      const tasks = parseMrBoxTasks([
        {
          id: 10,
          parentId: 20,
          point: { lng: '13.4', lat: 52.5 },
          status: '1',
          priority: null,
          title: 'w1@0',
        },
        {
          // missing point — dropped
          id: 11,
          parentId: 20,
        },
      ]);
      expect(tasks).toHaveLength(1);
      expect(tasks[0]).toMatchObject({
        id: '10',
        parentId: '20',
        point: { lng: 13.4, lat: 52.5 },
        status: 1,
      });
      expect(tasks[0].priority).toBeUndefined();
    });

    it('accepts { tasks: [...] } envelopes', () => {
      const tasks = parseMrBoxTasks({
        tasks: [{ id: '1', parentId: '2', point: { lng: 0, lat: 0 } }],
      });
      expect(tasks).toHaveLength(1);
      expect(tasks[0].point.lng).toBe(0);
    });

    it('returns [] for garbage', () => {
      expect(parseMrBoxTasks(null)).toEqual([]);
      expect(parseMrBoxTasks('nope')).toEqual([]);
    });
  });

  describe('parseMrChallenge', () => {
    it('normalizes visibility fields', () => {
      const ch = parseMrChallenge({
        id: 9,
        name: 'Demo',
        enabled: true,
        deleted: false,
        instruction: 'Do the thing',
      });
      expect(ch).toMatchObject({
        id: '9',
        name: 'Demo',
        enabled: true,
        deleted: false,
      });
      expect(challengeIsVisible(ch)).toBe(true);
      expect(challengeIsVisible({ enabled: true, deleted: true })).toBe(false);
      expect(challengeIsVisible(null)).toBe(false);
    });
  });

  describe('parseMrTaskDetails', () => {
    it('keeps geometries.features for detail merge', () => {
      const td = parseMrTaskDetails({
        id: 3,
        title: 'way/1',
        geometries: {
          type: 'FeatureCollection',
          features: [{ type: 'Feature', properties: { '@id': 'way/1' } }],
        },
      });
      expect(td?.id).toBe('3');
      expect(td?.title).toBe('way/1');
      expect(td?.geometries?.features).toHaveLength(1);
    });
  });

  describe('cooperativeWork + detail view', () => {
    it('extracts Tag Fix cooperativeWork and rejects OSC type 2', () => {
      const tagFix = {
        cooperativeWork: {
          meta: { type: 1, version: 2 },
          operations: [{
            operationType: 'modifyElement',
            data: {
              id: 'way/1',
              operations: [{ operation: 'setTags', data: { highway: 'path' } }],
            },
          }],
        },
      };
      const cw = extractMrCooperativeWork(tagFix);
      expect(isMrTagFixCooperativeWork(cw)).toBe(true);
      expect(parseMrModifyElementOps(cw!).map((o) => o.data.id)).toEqual(['way/1']);

      expect(isMrTagFixCooperativeWork(extractMrCooperativeWork({
        cooperativeWork: { meta: { type: 2 }, operations: [] },
      }))).toBe(false);
    });

    it('buildMrTaskDetailView merges challenge + task strings', () => {
      const detail = buildMrTaskDetailView({
        id: 9,
        parentId: 3,
        baseTask: { title: 'old' },
        challenge: { name: 'Ch', instruction: 'Do it', description: 'Desc' },
        taskDetails: {
          title: 'way/9',
          geometries: { features: [{ type: 'Feature' }] },
        },
      });
      expect(detail).toMatchObject({
        id: '9',
        parentId: '3',
        parentName: 'Ch',
        title: 'way/9',
        instruction: 'Do it',
        description: 'Desc',
      });
      expect(detail.taskFeatures).toHaveLength(1);
    });

    it('buildMrTaskDetailView prefers task instruction over challenge', () => {
      const detail = buildMrTaskDetailView({
        id: 9,
        parentId: 3,
        baseTask: { instruction: 'Base task text' },
        challenge: { name: 'Ch', instruction: 'Challenge text', description: 'Desc' },
        taskDetails: {
          title: 'way/9',
          instruction: 'Task-specific text',
        },
      });
      expect(detail.instruction).toBe('Task-specific text');
      expect(detail.description).toBe('Desc');
    });

    it('parses earmarks with boolean completionResponses', () => {
      const earmarks = parseMrEarmarkList([
        {
          taskID: '1',
          challengeID: '2',
          parentName: '',
          title: 't',
          elems: [],
          loc: null,
          newComment: '',
          completionResponses: { box: true },
        },
      ]);
      expect(earmarks).toHaveLength(1);
      expect(earmarks[0].completionResponses).toEqual({ box: true });
    });

    it('parses setTags/unsetTags child data and unwraps geometries', () => {
      expect(parseMrSetTagsData({ highway: 'path', lanes: 2 })).toEqual({
        highway: 'path',
        lanes: 2,
      });
      expect(parseMrSetTagsData(['not', 'a', 'map'])).toBeNull();
      expect(parseMrUnsetTagKeys(['name', 1, ''])).toEqual(['name', '1']);
      expect(unwrapMrGeometries({
        geometries: { type: 'FeatureCollection', features: [] },
      })).toEqual({ type: 'FeatureCollection', features: [] });
      expect(asParsedOrNull({})).toBeNull();
      expect(asParsedOrNull({ id: '1' })).toEqual({ id: '1' });
    });
  });
});
