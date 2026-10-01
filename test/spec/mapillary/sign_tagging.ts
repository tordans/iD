import { describe, expect, it } from 'vitest';
import { changesNothing, defaultSignTargetKey, sideOfLine, signTagChanges, signTargetKeys } from '../../../modules/mapillary/sign_tagging';

describe('signTargetKeys', () => {
    it('offers the way\'s keys, tagged sign keys and the sides with bike infrastructure', () => {
        const tags = {
            highway: 'residential',
            'cycleway:right': 'track',
            'cycleway:left': 'no',
            'sidewalk:left:bicycle': 'yes',
            'cycleway:right:traffic_sign:forward': 'DE:237'
        };
        expect(signTargetKeys(tags)).toEqual([
            'traffic_sign', 'traffic_sign:forward', 'traffic_sign:backward',
            'cycleway:right:traffic_sign:forward',
            'sidewalk:left:traffic_sign',
            'cycleway:right:traffic_sign'
        ]);
    });

    it('starts with the last used key, for bike signs the side the sign stands on', () => {
        const tags = { 'cycleway:right': 'track', 'cycleway:left:traffic_sign': 'none' };
        expect(defaultSignTargetKey(tags)).toBe('traffic_sign');
        expect(defaultSignTargetKey(tags, { lastUsed: 'traffic_sign:backward' })).toBe('traffic_sign:backward');
        expect(defaultSignTargetKey(tags, { lastUsed: 'sidewalk:left:traffic_sign' })).toBe('traffic_sign');
        expect(defaultSignTargetKey(tags, { bikeSign: true, side: 'right' })).toBe('cycleway:right:traffic_sign');
        expect(defaultSignTargetKey(tags, { bikeSign: true, side: 'left' })).toBe('cycleway:left:traffic_sign');
        expect(defaultSignTargetKey({}, { bikeSign: true, side: 'left' })).toBe('traffic_sign');
    });
});

describe('sideOfLine', () => {
    it('finds the side of a point along the way direction', () => {
        const line: [number, number][] = [[13.0, 52.0], [13.001, 52.0], [13.002, 52.0]];
        expect(sideOfLine(line, [13.0015, 52.0001])).toBe('left');
        expect(sideOfLine(line, [13.0015, 51.9999])).toBe('right');
        expect(sideOfLine([[13, 52]], [13, 52.1])).toBeUndefined();
    });
});

describe('signTagChanges', () => {
    it('writes the sign and the image as source', () => {
        expect(signTagChanges({}, 'traffic_sign', 'DE:237', '123')).toEqual({
            traffic_sign: 'DE:237',
            'source:traffic_sign:mapillary': '123'
        });
        expect(signTagChanges({ 'cycleway:right:traffic_sign': 'DE:239', 'source:cycleway:right:traffic_sign:mapillary': '1' },
            'cycleway:right:traffic_sign', 'DE:1022-10', '2')).toEqual({
            'cycleway:right:traffic_sign': 'DE:239,1022-10',
            'source:cycleway:right:traffic_sign:mapillary': '1;2'
        });
    });

    it('knows when nothing changes', () => {
        const tags = { traffic_sign: 'DE:237', 'source:traffic_sign:mapillary': '123' };
        expect(changesNothing(tags, signTagChanges(tags, 'traffic_sign', 'DE:237', '123'))).toBe(true);
    });
});
