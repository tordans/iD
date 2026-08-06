import {
    collectOsmEntityIds,
    collectOsmEntityIdsFromGeometries,
    parseOsmEntityIdFromFeatureProperties
} from '../../../modules/util/maproulette_osm_ids';

describe('collectOsmEntityIds', function() {
    it('returns empty array for empty or invalid inputs', function() {
        expect(collectOsmEntityIds()).toEqual([]);
        expect(collectOsmEntityIds(null, undefined, '', '   ')).toEqual([]);
        expect(collectOsmEntityIds(false, {}, [])).toEqual([]);
        expect(collectOsmEntityIds('no osm ids here', 12345)).toEqual([]);
    });

    it('parses MapRoulette title forms', function() {
        expect(collectOsmEntityIds('w123@0')).toEqual(['w123']);
        expect(collectOsmEntityIds('n456@1')).toEqual(['n456']);
        expect(collectOsmEntityIds('r789@42')).toEqual(['r789']);
        expect(collectOsmEntityIds('W123@0')).toEqual(['w123']);
    });

    it('parses long-form way/node/relation ids', function() {
        expect(collectOsmEntityIds('way/123')).toEqual(['w123']);
        expect(collectOsmEntityIds('node/456')).toEqual(['n456']);
        expect(collectOsmEntityIds('relation/789')).toEqual(['r789']);
        expect(collectOsmEntityIds('Fix way/111 and relation/222 nearby')).toEqual(['w111', 'r222']);
    });

    it('parses short-form w/n/r ids in free text', function() {
        expect(collectOsmEntityIds('w123')).toEqual(['w123']);
        expect(collectOsmEntityIds('see n456 and r789')).toEqual(['n456', 'r789']);
    });

    it('uses title regex only for exact title strings', function() {
        expect(collectOsmEntityIds('w123@0')).toEqual(['w123']);
        expect(collectOsmEntityIds('prefix w123@0')).toEqual(['w123']);
    });

    it('deduplicates ids across values and nested fields', function() {
        const result = collectOsmEntityIds(
            'w123@0',
            'way/123',
            { title: 'w123', osmId: 'w123', name: 'way/123' },
            ['w123', 'n456'],
            'n456'
        );
        expect(result.sort()).toEqual(['n456', 'w123']);
    });

    it('collects ids from nested objects via preferred identity keys', function() {
        const task = {
            title: 'w100@0',
            name: 'node/200',
            osmId: 'r300',
            osm_id: 'w400',
            osmid: 'n500',
            id: 'r600',
            identifier: 'way/700',
        };
        expect(collectOsmEntityIds(task).sort()).toEqual(
            ['n200', 'n500', 'r300', 'r600', 'w100', 'w400', 'w700']
        );
    });

    it('walks nested arrays and trims string values', function() {
        const payload = [
            '  w111@0  ',
            [{ title: 'n222@1' }, 'relation/333'],
        ];
        expect(collectOsmEntityIds(payload).sort()).toEqual(['n222', 'r333', 'w111']);
    });

    it('skips coordinate blobs but still reads feature properties and titles', function() {
        const feature = {
            geometry: {
                type: 'Point',
                coordinates: [0, 0],
                properties: { id: 'w999' },
            },
            geometries: [{ id: 'n888' }],
            coordinates: [[0, 0]],
            properties: { osmId: 'w123' },
            title: 'n456@0',
        };
        // Nested geometry.properties and geometries[{id}] are not V4 feature props.
        expect(collectOsmEntityIds(feature).sort()).toEqual(['n456', 'w123']);
    });

    it('stops walking beyond the depth limit', function() {
        let deep = 'w123';
        for (let i = 0; i < 6; i++) {
            deep = { nested: deep };
        }
        expect(collectOsmEntityIds(deep)).toEqual([]);

        let reachable = 'w123';
        for (let i = 0; i < 5; i++) {
            reachable = { nested: reachable };
        }
        expect(collectOsmEntityIds(reachable)).toEqual(['w123']);
    });

    it('collects from mixed MapRoulette-like sources in one call', function() {
        const task = {
            id: 987654,
            title: 'w42@0',
            name: 'Crossing at way/99',
            properties: {
                comment: 'Also check n77',
                tags: { source: 'survey' },
            },
        };
        const feature = {
            id: 'feature/1',
            properties: { osm_id: 'r55' },
        };

        expect(collectOsmEntityIds(task, feature, 'relation/11').sort()).toEqual(
            ['n77', 'r11', 'r55', 'w42', 'w99']
        );
    });

    it('reads @id from task.geometries features (V4)', function() {
        const task = {
            title: 'unrelated',
            geometries: {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    properties: { '@id': 'way/12345' },
                    geometry: { type: 'LineString', coordinates: [[0, 0], [1, 1]] }
                }]
            }
        };
        expect(collectOsmEntityIds(task)).toEqual(['w12345']);
    });

    it('infers node/way from numeric osmid + geometry type (V4)', function() {
        expect(collectOsmEntityIds({
            type: 'Feature',
            properties: { osmid: 111 },
            geometry: { type: 'Point', coordinates: [1, 2] }
        })).toEqual(['n111']);

        expect(collectOsmEntityIds({
            type: 'Feature',
            properties: { osm_id: 222 },
            geometry: { type: 'LineString', coordinates: [[0, 0], [1, 0]] }
        })).toEqual(['w222']);
    });

    it('merges title, V4 @id, and body text without duplicates', function() {
        const task = {
            title: 'w1@0',
            instruction: 'Also fix way/1 and check n9',
            geometries: {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    properties: { '@id': 'way/1' },
                    geometry: { type: 'LineString', coordinates: [[0, 0], [1, 1]] }
                }]
            }
        };
        expect(collectOsmEntityIds(task).sort()).toEqual(['n9', 'w1']);
    });

    it('does not invent ids from bare numeric properties.id', function() {
        expect(collectOsmEntityIds({
            type: 'Feature',
            properties: { id: 123 },
            geometry: { type: 'Point', coordinates: [0, 0] }
        })).toEqual([]);
    });
});

describe('parseOsmEntityIdFromFeatureProperties', function() {
    it('parses typed @id / id / osm_id strings', function() {
        expect(parseOsmEntityIdFromFeatureProperties({ '@id': 'way/12345' })).toBe('w12345');
        expect(parseOsmEntityIdFromFeatureProperties({ id: 'node/1' })).toBe('n1');
        expect(parseOsmEntityIdFromFeatureProperties({ osm_id: 'relation/789' })).toBe('r789');
    });

    it('uses explicit @type / osm_type with numeric ids', function() {
        expect(parseOsmEntityIdFromFeatureProperties({
            osmid: 111,
            '@type': 'Node'
        })).toBe('n111');
        expect(parseOsmEntityIdFromFeatureProperties({
            osm_id: 222,
            osm_type: 'way'
        })).toBe('w222');
    });

    it('rejects short forms and bare numeric id for the V4 path', function() {
        expect(parseOsmEntityIdFromFeatureProperties({ '@id': 'w123' })).toBe(null);
        expect(parseOsmEntityIdFromFeatureProperties({ id: 123 }, 'Point')).toBe(null);
        expect(parseOsmEntityIdFromFeatureProperties({ osmid: 0 }, 'Point')).toBe(null);
    });
});

describe('collectOsmEntityIdsFromGeometries', function() {
    it('collects from every feature, not only the first', function() {
        expect(collectOsmEntityIdsFromGeometries({
            type: 'FeatureCollection',
            features: [
                { type: 'Feature', properties: { '@id': 'way/1' }, geometry: { type: 'LineString', coordinates: [] } },
                { type: 'Feature', properties: { '@id': 'node/2' }, geometry: { type: 'Point', coordinates: [0, 0] } }
            ]
        }).sort()).toEqual(['n2', 'w1']);
    });
});
