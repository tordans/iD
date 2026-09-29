import {
  applyTagFixBag,
  extractCooperativeWork,
  getMapRouletteTagFixes,
  isMapRouletteTagFix,
  matchMapRouletteTagFixes,
  parseMapRouletteElementId,
  tagFixesToApply,
} from '../../../modules/util/maproulette_cooperative';
import { actionChangeTags } from '../../../modules/actions/change_tags';
import type { EntityId } from '../../../modules/osm';

function tagFixTask(operations: any[], meta?: Record<string, unknown>) {
  return {
    id: '99',
    cooperativeWork: {
      meta: meta || { version: 2, type: 1 },
      operations,
    },
  };
}

function modifyElement(id: string, childOps: any[]) {
  return {
    operationType: 'modifyElement',
    data: {
      id,
      operations: childOps,
    },
  };
}

describe('maproulette_cooperative', () => {
  describe('isMapRouletteTagFix / extractCooperativeWork', () => {
    it('returns false without cooperativeWork', () => {
      expect(isMapRouletteTagFix(null)).toBe(false);
      expect(isMapRouletteTagFix({})).toBe(false);
      expect(getMapRouletteTagFixes({})).toEqual([]);
    });

    it('detects v2 type 1 Tag Fix', () => {
      const task = tagFixTask([]);
      expect(isMapRouletteTagFix(task)).toBe(true);
    });

    it('ignores OSC change-file type 2', () => {
      const task = tagFixTask([], { version: 2, type: 2 });
      expect(isMapRouletteTagFix(task)).toBe(false);
      expect(getMapRouletteTagFixes(task)).toEqual([]);
    });

    it('detects legacy v1 operations without type', () => {
      const task = {
        cooperativeWork: {
          meta: { version: 1 },
          operations: [modifyElement('way/1', [{ operation: 'setTags', data: { a: '1' } }])],
        },
      };
      expect(isMapRouletteTagFix(task)).toBe(true);
    });

    it('reads cooperativeWork from geometries FeatureCollection root', () => {
      const cw = { meta: { version: 2, type: 1 }, operations: [] as any[] };
      const task = {
        geometries: { type: 'FeatureCollection', features: [], cooperativeWork: cw },
      };
      expect(extractCooperativeWork(task)).toEqual(cw);
      expect(isMapRouletteTagFix(task)).toBe(true);
    });
  });

  describe('parseMapRouletteElementId', () => {
    it('parses way/node/relation and short forms', () => {
      expect(parseMapRouletteElementId('way/123')).toBe('w123');
      expect(parseMapRouletteElementId('node/456')).toBe('n456');
      expect(parseMapRouletteElementId('relation/789')).toBe('r789');
      expect(parseMapRouletteElementId('w10')).toBe('w10');
    });

    it('returns null for invalid ids', () => {
      expect(parseMapRouletteElementId(null)).toBe(null);
      expect(parseMapRouletteElementId('not-an-id')).toBe(null);
    });
  });

  describe('getMapRouletteTagFixes', () => {
    it('folds setTags and unsetTags in order', () => {
      const task = tagFixTask([
        modifyElement('way/1', [
          { operation: 'setTags', data: { amenity: 'pharmacy', name: 'Old' } },
          { operation: 'setTags', data: { name: 'New' } },
          { operation: 'unsetTags', data: ['old_tag', 'name'] },
          { operation: 'setTags', data: { name: 'Final' } },
        ]),
      ]);
      expect(getMapRouletteTagFixes(task)).toEqual([{
        entityId: 'w1',
        setTags: { amenity: 'pharmacy', name: 'Final' },
        unsetTags: ['old_tag'],
      }]);
    });

    it('returns one entry per distinct entity id', () => {
      const task = tagFixTask([
        modifyElement('way/1', [{ operation: 'setTags', data: { a: '1' } }]),
        modifyElement('node/2', [{ operation: 'unsetTags', data: ['b'] }]),
      ]);
      expect(getMapRouletteTagFixes(task)).toEqual([
        { entityId: 'w1', setTags: { a: '1' }, unsetTags: [] },
        { entityId: 'n2', setTags: {}, unsetTags: ['b'] },
      ]);
    });

    it('merges same-id blocks in array order', () => {
      const task = tagFixTask([
        modifyElement('way/5', [{ operation: 'setTags', data: { x: '1', y: '1' } }]),
        modifyElement('way/5', [
          { operation: 'unsetTags', data: ['y'] },
          { operation: 'setTags', data: { z: '3' } },
        ]),
      ]);
      expect(getMapRouletteTagFixes(task)).toEqual([{
        entityId: 'w5',
        setTags: { x: '1', z: '3' },
        unsetTags: ['y'],
      }]);
    });

    it('skips invalid element ids', () => {
      const task = tagFixTask([
        modifyElement('nope', [{ operation: 'setTags', data: { a: '1' } }]),
        modifyElement('way/9', [{ operation: 'setTags', data: { a: '1' } }]),
      ]);
      expect(getMapRouletteTagFixes(task)).toEqual([{
        entityId: 'w9',
        setTags: { a: '1' },
        unsetTags: [],
      }]);
    });
  });

  describe('applyTagFixBag', () => {
    it('sets and unsets on current tags', () => {
      expect(applyTagFixBag(
        { highway: 'residential', old_tag: 'x', name: 'A' },
        { amenity: 'pharmacy', name: 'B' },
        ['old_tag'],
      )).toEqual({
        highway: 'residential',
        amenity: 'pharmacy',
        name: 'B',
      });
    });
  });

  describe('matchMapRouletteTagFixes / tagFixesToApply', () => {
    let context: Parameters<typeof matchMapRouletteTagFixes>[0];
    let way: any;

    beforeEach(() => {
      way = new iD.osmWay({ id: 'w1', tags: { highway: 'residential', old_tag: 'x' } });
      context = {
        hasEntity(entityId: string) {
          return entityId === 'w1' ? way : undefined;
        },
      };
    });

    it('splits matched vs unmatched targets', () => {
      const task = tagFixTask([
        modifyElement('way/1', [
          { operation: 'setTags', data: { amenity: 'pharmacy' } },
          { operation: 'unsetTags', data: ['old_tag'] },
        ]),
        modifyElement('way/999', [{ operation: 'setTags', data: { a: '1' } }]),
      ]);
      const result = matchMapRouletteTagFixes(context, task);
      expect(result.unmatched).toEqual(['w999']);
      expect(result.matched).toEqual([{
        entityId: 'w1',
        currentTags: { highway: 'residential', old_tag: 'x' },
        proposedTags: { highway: 'residential', amenity: 'pharmacy' },
      }]);
      expect(tagFixesToApply(context, task)).toEqual([{
        entityId: 'w1',
        tags: { highway: 'residential', amenity: 'pharmacy' },
      }]);
    });

    it('returns empty apply list when nothing matches', () => {
      const task = tagFixTask([
        modifyElement('way/999', [{ operation: 'setTags', data: { a: '1' } }]),
      ]);
      expect(matchMapRouletteTagFixes(context, task).matched).toEqual([]);
      expect(tagFixesToApply(context, task)).toEqual([]);
    });

    it('applies proposed tags onto the graph via actionChangeTags', () => {
      const task = tagFixTask([
        modifyElement('way/1', [
          { operation: 'setTags', data: { amenity: 'pharmacy' } },
          { operation: 'unsetTags', data: ['old_tag'] },
        ]),
      ]);
      const toApply = tagFixesToApply(context, task);
      expect(toApply.length).toBe(1);

      let graph = new (iD.coreGraph as any)([way]);
      graph = actionChangeTags(toApply[0].entityId as EntityId, toApply[0].tags)(graph);
      expect(graph.entity('w1' as EntityId).tags).toEqual({
        highway: 'residential',
        amenity: 'pharmacy',
      });
    });

    it('returns empty apply list until cooperativeWork is present (Fixed race guard)', () => {
      // Box payloads often omit cooperativeWork; Accept must not be assumed yet.
      const bare = { id: '99', title: 'w1@0' };
      expect(isMapRouletteTagFix(bare)).toBe(false);
      expect(tagFixesToApply(context, bare)).toEqual([]);

      const withFix = tagFixTask([
        modifyElement('way/1', [{ operation: 'setTags', data: { amenity: 'pharmacy' } }]),
      ]);
      expect(tagFixesToApply(context, withFix).length).toBe(1);
    });
  });
});
