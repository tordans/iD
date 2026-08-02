import { collectOsmEntityIds } from '../../../modules/util/maproulette_osm_ids';

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

    it('skips bulky geometry blobs but still reads other properties', function() {
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
});
