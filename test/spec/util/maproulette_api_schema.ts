import {
  challengeIsVisible,
  parseMrBoxTasks,
  parseMrChallenge,
  parseMrEarmarkList,
  parseMrTaskDetails,
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

  describe('parseMrEarmarkList', () => {
    it('fills defaults and coerces ids', () => {
      const list = parseMrEarmarkList([
        { taskID: 42, _status: '5', loc: ['1', '2'] },
        { /* missing taskID */ title: 'x' },
      ]);
      expect(list).toHaveLength(1);
      expect(list[0]).toMatchObject({
        taskID: '42',
        challengeID: '',
        _status: 5,
        includeInUpload: true,
        loc: [1, 2],
        elems: [],
        newComment: '',
      });
    });
  });
});
