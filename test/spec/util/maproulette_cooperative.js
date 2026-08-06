import {
    applyTagFixBag,
    extractCooperativeWork,
    getMapRouletteTagFixes,
    isMapRouletteTagFix,
    matchMapRouletteTagFixes,
    parseMapRouletteElementId,
    tagFixesToApply
} from '../../../modules/util/maproulette_cooperative';
import { actionChangeTags } from '../../../modules/actions/change_tags';

function tagFixTask(operations, meta) {
    return {
        id: '99',
        cooperativeWork: {
            meta: meta || { version: 2, type: 1 },
            operations: operations
        }
    };
}

function modifyElement(id, childOps) {
    return {
        operationType: 'modifyElement',
        data: {
            id: id,
            operations: childOps
        }
    };
}

describe('maproulette_cooperative', function() {
    describe('isMapRouletteTagFix / extractCooperativeWork', function() {
        it('returns false without cooperativeWork', function() {
            expect(isMapRouletteTagFix(null)).toBe(false);
            expect(isMapRouletteTagFix({})).toBe(false);
            expect(getMapRouletteTagFixes({})).toEqual([]);
        });

        it('detects v2 type 1 Tag Fix', function() {
            const task = tagFixTask([]);
            expect(isMapRouletteTagFix(task)).toBe(true);
        });

        it('ignores OSC change-file type 2', function() {
            const task = tagFixTask([], { version: 2, type: 2 });
            expect(isMapRouletteTagFix(task)).toBe(false);
            expect(getMapRouletteTagFixes(task)).toEqual([]);
        });

        it('detects legacy v1 operations without type', function() {
            const task = {
                cooperativeWork: {
                    meta: { version: 1 },
                    operations: [modifyElement('way/1', [{ operation: 'setTags', data: { a: '1' } }])]
                }
            };
            expect(isMapRouletteTagFix(task)).toBe(true);
        });

        it('reads cooperativeWork from geometries FeatureCollection root', function() {
            const cw = { meta: { version: 2, type: 1 }, operations: [] };
            const task = { geometries: { type: 'FeatureCollection', features: [], cooperativeWork: cw } };
            expect(extractCooperativeWork(task)).toBe(cw);
            expect(isMapRouletteTagFix(task)).toBe(true);
        });
    });

    describe('parseMapRouletteElementId', function() {
        it('parses way/node/relation and short forms', function() {
            expect(parseMapRouletteElementId('way/123')).toBe('w123');
            expect(parseMapRouletteElementId('node/456')).toBe('n456');
            expect(parseMapRouletteElementId('relation/789')).toBe('r789');
            expect(parseMapRouletteElementId('w10')).toBe('w10');
        });

        it('returns null for invalid ids', function() {
            expect(parseMapRouletteElementId(null)).toBe(null);
            expect(parseMapRouletteElementId('not-an-id')).toBe(null);
        });
    });

    describe('getMapRouletteTagFixes', function() {
        it('folds setTags and unsetTags in order', function() {
            const task = tagFixTask([
                modifyElement('way/1', [
                    { operation: 'setTags', data: { amenity: 'pharmacy', name: 'Old' } },
                    { operation: 'setTags', data: { name: 'New' } },
                    { operation: 'unsetTags', data: ['old_tag', 'name'] },
                    { operation: 'setTags', data: { name: 'Final' } }
                ])
            ]);
            expect(getMapRouletteTagFixes(task)).toEqual([{
                entityId: 'w1',
                setTags: { amenity: 'pharmacy', name: 'Final' },
                unsetTags: ['old_tag']
            }]);
        });

        it('returns one entry per distinct entity id', function() {
            const task = tagFixTask([
                modifyElement('way/1', [{ operation: 'setTags', data: { a: '1' } }]),
                modifyElement('node/2', [{ operation: 'unsetTags', data: ['b'] }])
            ]);
            expect(getMapRouletteTagFixes(task)).toEqual([
                { entityId: 'w1', setTags: { a: '1' }, unsetTags: [] },
                { entityId: 'n2', setTags: {}, unsetTags: ['b'] }
            ]);
        });

        it('merges same-id blocks in array order', function() {
            const task = tagFixTask([
                modifyElement('way/5', [{ operation: 'setTags', data: { x: '1', y: '1' } }]),
                modifyElement('way/5', [
                    { operation: 'unsetTags', data: ['y'] },
                    { operation: 'setTags', data: { z: '3' } }
                ])
            ]);
            expect(getMapRouletteTagFixes(task)).toEqual([{
                entityId: 'w5',
                setTags: { x: '1', z: '3' },
                unsetTags: ['y']
            }]);
        });

        it('skips invalid element ids', function() {
            const task = tagFixTask([
                modifyElement('nope', [{ operation: 'setTags', data: { a: '1' } }]),
                modifyElement('way/9', [{ operation: 'setTags', data: { a: '1' } }])
            ]);
            expect(getMapRouletteTagFixes(task)).toEqual([{
                entityId: 'w9',
                setTags: { a: '1' },
                unsetTags: []
            }]);
        });
    });

    describe('applyTagFixBag', function() {
        it('sets and unsets on current tags', function() {
            expect(applyTagFixBag(
                { highway: 'residential', old_tag: 'x', name: 'A' },
                { amenity: 'pharmacy', name: 'B' },
                ['old_tag']
            )).toEqual({
                highway: 'residential',
                amenity: 'pharmacy',
                name: 'B'
            });
        });
    });

    describe('matchMapRouletteTagFixes / tagFixesToApply', function() {
        var context;
        var way;

        beforeEach(function() {
            way = new iD.osmWay({ id: 'w1', tags: { highway: 'residential', old_tag: 'x' } });
            context = {
                hasEntity: function(id) {
                    return id === 'w1' ? way : undefined;
                }
            };
        });

        it('splits matched vs unmatched targets', function() {
            const task = tagFixTask([
                modifyElement('way/1', [
                    { operation: 'setTags', data: { amenity: 'pharmacy' } },
                    { operation: 'unsetTags', data: ['old_tag'] }
                ]),
                modifyElement('way/999', [{ operation: 'setTags', data: { a: '1' } }])
            ]);
            const result = matchMapRouletteTagFixes(context, task);
            expect(result.unmatched).toEqual(['w999']);
            expect(result.matched).toEqual([{
                entityId: 'w1',
                currentTags: { highway: 'residential', old_tag: 'x' },
                proposedTags: { highway: 'residential', amenity: 'pharmacy' }
            }]);
            expect(tagFixesToApply(context, task)).toEqual([{
                entityId: 'w1',
                tags: { highway: 'residential', amenity: 'pharmacy' }
            }]);
        });

        it('returns empty apply list when nothing matches', function() {
            const task = tagFixTask([
                modifyElement('way/999', [{ operation: 'setTags', data: { a: '1' } }])
            ]);
            expect(matchMapRouletteTagFixes(context, task).matched).toEqual([]);
            expect(tagFixesToApply(context, task)).toEqual([]);
        });

        it('applies proposed tags onto the graph via actionChangeTags', function() {
            const task = tagFixTask([
                modifyElement('way/1', [
                    { operation: 'setTags', data: { amenity: 'pharmacy' } },
                    { operation: 'unsetTags', data: ['old_tag'] }
                ])
            ]);
            const toApply = tagFixesToApply(context, task);
            expect(toApply.length).toBe(1);

            var graph = new iD.coreGraph([way]);
            graph = actionChangeTags(toApply[0].entityId, toApply[0].tags)(graph);
            expect(graph.entity('w1').tags).toEqual({
                highway: 'residential',
                amenity: 'pharmacy'
            });
        });

        it('returns empty apply list until cooperativeWork is present (Fixed race guard)', function() {
            // Box payloads often omit cooperativeWork; Accept must not be assumed yet.
            const bare = { id: '99', title: 'w1@0' };
            expect(isMapRouletteTagFix(bare)).toBe(false);
            expect(tagFixesToApply(context, bare)).toEqual([]);

            const withFix = tagFixTask([
                modifyElement('way/1', [{ operation: 'setTags', data: { amenity: 'pharmacy' } }])
            ]);
            expect(tagFixesToApply(context, withFix).length).toBe(1);
        });
    });
});
