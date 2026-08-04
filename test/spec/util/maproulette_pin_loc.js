import {
    mapRouletteLineFeatures,
    snapMapRoulettePinLoc
} from '../../../modules/util/maproulette_pin_loc';


describe('maproulette_pin_loc', function() {
    var curvedLine;

    beforeEach(function() {
        // C-shaped line: geometric center of the endpoints/bbox sits off the line.
        curvedLine = {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: [
                        [0, 0],
                        [0, 2],
                        [2, 2],
                        [2, 0]
                    ]
                }
            }]
        };
    });

    describe('mapRouletteLineFeatures', function() {
        it('returns only LineString and MultiLineString features', function() {
            var mixed = {
                type: 'FeatureCollection',
                features: [
                    { type: 'Feature', geometry: { type: 'Point', coordinates: [1, 1] }, properties: {} },
                    { type: 'Feature', geometry: { type: 'LineString', coordinates: [[0, 0], [1, 1]] }, properties: {} },
                    { type: 'Feature', geometry: { type: 'MultiLineString', coordinates: [[[0, 0], [1, 0]]] }, properties: {} }
                ]
            };
            var lines = mapRouletteLineFeatures(mixed);
            expect(lines).toHaveLength(2);
            expect(lines[0].geometry.type).toBe('LineString');
            expect(lines[1].geometry.type).toBe('MultiLineString');
        });

        it('returns empty when there are no line features', function() {
            expect(mapRouletteLineFeatures(null)).toEqual([]);
            expect(mapRouletteLineFeatures({
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: [1, 1] },
                    properties: {}
                }]
            })).toEqual([]);
        });
    });

    describe('snapMapRoulettePinLoc', function() {
        it('returns the original loc when there is no line geometry', function() {
            expect(snapMapRoulettePinLoc([1, 1], null)).toEqual([1, 1]);
            expect(snapMapRoulettePinLoc([1, 1], {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: [9, 9] },
                    properties: {}
                }]
            })).toEqual([1, 1]);
        });

        it('snaps an off-line centerpoint onto the LineString', function() {
            // Center of the C sits near (1,1), off the vertical/horizontal segments.
            var snapped = snapMapRoulettePinLoc([1, 1], curvedLine);
            expect(snapped[0]).toBeCloseTo(0, 5); // on left vertical segment, or
            // turf may snap to top or side — must lie on the polyline.
            // Valid on-line points: x=0 with y in [0,2], y=2 with x in [0,2], x=2 with y in [0,2]
            var onLeft = Math.abs(snapped[0] - 0) < 1e-6 && snapped[1] >= -1e-6 && snapped[1] <= 2 + 1e-6;
            var onTop = Math.abs(snapped[1] - 2) < 1e-6 && snapped[0] >= -1e-6 && snapped[0] <= 2 + 1e-6;
            var onRight = Math.abs(snapped[0] - 2) < 1e-6 && snapped[1] >= -1e-6 && snapped[1] <= 2 + 1e-6;
            expect(onLeft || onTop || onRight).toBe(true);
            // And not the off-line center.
            expect(snapped[0] === 1 && snapped[1] === 1).toBe(false);
        });

        it('ignores Point features when snapping mixed collections', function() {
            var mixed = {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        geometry: { type: 'Point', coordinates: [5, 5] },
                        properties: {}
                    },
                    curvedLine.features[0]
                ]
            };
            var snapped = snapMapRoulettePinLoc([1, 1], mixed);
            expect(snapped[0] === 5 && snapped[1] === 5).toBe(false);
            var onLeft = Math.abs(snapped[0] - 0) < 1e-6;
            var onTop = Math.abs(snapped[1] - 2) < 1e-6;
            var onRight = Math.abs(snapped[0] - 2) < 1e-6;
            expect(onLeft || onTop || onRight).toBe(true);
        });

        it('leaves a point already on the line unchanged (within snap)', function() {
            var snapped = snapMapRoulettePinLoc([0, 1], curvedLine);
            expect(snapped[0]).toBeCloseTo(0, 5);
            expect(snapped[1]).toBeCloseTo(1, 5);
        });
    });
});
