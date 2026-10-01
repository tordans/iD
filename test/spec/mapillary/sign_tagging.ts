import { describe, expect, it } from 'vitest';
import { bearingAlongLine, changeLabel, changesNothing, defaultSignTargetKey, directionalTags, sideOfLine, signDirectionOnWay, signTagChanges, signTargetKeys } from '../../../modules/mapillary/sign_tagging';

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

    it('uses the direction the sign applies to, unless the way is one-way that way', () => {
        expect(defaultSignTargetKey({}, { direction: 'backward' })).toBe('traffic_sign:backward');
        expect(defaultSignTargetKey({ oneway: 'yes' }, { direction: 'forward' })).toBe('traffic_sign');
        expect(defaultSignTargetKey({ oneway: 'yes' }, { direction: 'backward' })).toBe('traffic_sign:backward');
        expect(defaultSignTargetKey({ 'cycleway:right': 'lane' }, { bikeSign: true, side: 'right', direction: 'forward' })).toBe('cycleway:right:traffic_sign');
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

describe('sign direction', () => {
    // a way going north, like Karl-Marx-Straße at the 237 sign
    const north: [number, number][] = [[13.4412, 52.4720], [13.4413, 52.4730]];

    it('reads the way bearing near the sign', () => {
        expect(bearingAlongLine(north, [13.4413, 52.4725])).toBeCloseTo(3.9, 0);
    });

    it('turns the face direction into the travel direction along the way', () => {
        // the sign faces south (177°), so northbound traffic reads it
        expect(signDirectionOnWay(north, [13.4413, 52.4725], 176.9)).toBe('forward');
        expect(signDirectionOnWay(north, [13.4413, 52.4725], 10)).toBe('backward');
        expect(signDirectionOnWay(north, [13.4413, 52.4725], 90)).toBeUndefined();
        expect(signDirectionOnWay(north, [13.4413, 52.4725], undefined)).toBeUndefined();
    });

    it('makes speed tags directional', () => {
        expect(directionalTags({ maxspeed: '30', 'source:maxspeed': 'sign' }, 'forward'))
            .toEqual({ 'maxspeed:forward': '30', 'source:maxspeed:forward': 'sign' });
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

describe('changeLabel', () => {
    const changes = { maxspeed: '30', 'source:maxspeed': 'sign' };

    it('shows new, present and replaced values', () => {
        expect(changeLabel({}, changes)).toEqual({ label: 'maxspeed=30', present: false });
        expect(changeLabel({ maxspeed: '30', 'source:maxspeed': 'sign' }, changes)).toEqual({ label: '✓ maxspeed=30', present: true });
        expect(changeLabel({ maxspeed: '50' }, changes)).toEqual({ label: 'maxspeed=50→30', present: false, replaces: '50' });
        // the value is there, only the source is missing
        expect(changeLabel({ maxspeed: '30' }, changes)).toEqual({ label: 'maxspeed=30', present: false });
    });

    it('leaves out the key for sign buttons', () => {
        expect(changeLabel({ traffic_sign: 'DE:240' }, { traffic_sign: 'DE:237' }, false).label).toBe('DE:240→DE:237');
    });
});
