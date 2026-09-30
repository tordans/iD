import { processBikelanes } from '@tilda-geo/bicycle-infrastructure';
import { describe, expect, it } from 'vitest';

import { lookupKeys, requiredAttributes, roadAttributes } from '../../../modules/tilda/required_attributes';

function resultFor(tags: Record<string, string>, side: 'self' | 'left' | 'right') {
    const result = processBikelanes(tags).find(r => r._side === side);
    if (!result) throw new Error(`no ${side} result`);
    return result;
}

function byId(attributes: ReturnType<typeof requiredAttributes>) {
    return Object.fromEntries(attributes.map(a => [a.id, a]));
}

describe('lookupKeys', () => {
    it('reads sided keys like TILDA: side, both, plain (left only)', () => {
        expect(lookupKeys('separation:left', 'self', null)).toEqual(['separation:left', 'separation:both', 'separation']);
        expect(lookupKeys('separation:right', 'self', null)).toEqual(['separation:right', 'separation:both']);
        expect(lookupKeys('width', 'right', 'cycleway')).toEqual(['cycleway:right:width', 'cycleway:both:width', 'cycleway:width']);
    });
});

describe('requiredAttributes', () => {
    it('advisory lane on the right: side keys, surface from the road, parking inferred', () => {
        const tags = {
            highway: 'secondary', surface: 'asphalt', 'parking:right': 'lane',
            'cycleway:right': 'lane', 'cycleway:right:lane': 'advisory'
        };
        const attributes = byId(requiredAttributes(resultFor(tags, 'right'), tags));

        expect(attributes.width.key).toBe('cycleway:right:width');
        expect(attributes.width.state).toBe('missing');
        expect(attributes.surface.state).toBe('inherited');
        expect(attributes.surface.tilda).toBe('asphalt');
        expect(attributes.lane.state).toBe('ok');
        expect(attributes.traffic_mode_right.state).toBe('inherited');
        expect(attributes.traffic_mode_right.tilda).toBe('parking');
        // parking on the right → the buffer to it is needed
        expect(attributes.buffer_right.key).toBe('cycleway:right:buffer:right');
        expect(attributes.oneway.optional).toBe(true);
    });

    it('a chosen target category is no source for the tag that makes it', () => {
        const tags = { highway: 'secondary', 'cycleway:both': 'no' };
        const attributes = byId(requiredAttributes(resultFor(tags, 'left'), tags, 'cyclewayOnHighway_advisory'));

        expect(attributes.lane.key).toBe('cycleway:left:lane');
        expect(attributes.lane.state).toBe('missing');
    });

    it('separate cycleway needs is_sidepath', () => {
        const without = { highway: 'cycleway', 'cycleway': 'track' };
        expect(byId(requiredAttributes(resultFor(without, 'self'), without)).is_sidepath.state).toBe('missing');

        const withSidepath = { ...without, is_sidepath: 'yes' };
        expect(byId(requiredAttributes(resultFor(withSidepath, 'self'), withSidepath)).is_sidepath.state).toBe('ok');
    });

    it('shows how TILDA sanitizes values', () => {
        const tags = { highway: 'cycleway', cycleway: 'track', is_sidepath: 'yes', surface: 'cobblestone', 'surface:colour': 'orange' };
        const attributes = byId(requiredAttributes(resultFor(tags, 'self'), tags));
        expect(attributes.surface.state).toBe('ok');
        expect(attributes.surface.tilda).toBe('large_sett');
        expect(attributes.surface_colour.tilda).toBe('red');
        expect(attributes.oneway.state).toBe('guess');

        const unknown = { ...tags, surface: 'lava' };
        expect(byId(requiredAttributes(resultFor(unknown, 'self'), unknown)).surface.state).toBe('ignored');
    });

    it('asks for sett:length on sett', () => {
        const tags = { highway: 'cycleway', cycleway: 'track', is_sidepath: 'yes', surface: 'sett' };
        expect(byId(requiredAttributes(resultFor(tags, 'self'), tags)).sett_length.state).toBe('missing');
    });

    it('lists the attributes of the target category', () => {
        const tags = { highway: 'cycleway', cycleway: 'track', is_sidepath: 'yes' };
        const attributes = byId(requiredAttributes(resultFor(tags, 'self'), tags, 'cyclewayOnHighwayProtected'));
        expect(Object.keys(attributes)).toEqual(expect.arrayContaining(['separation_left', 'separation_right', 'buffer_left', 'marking_right', 'traffic_mode_left']));
        expect(attributes.is_sidepath).toBeUndefined();
    });
});

describe('roadAttributes', () => {
    it('one-way road: oneway:bicycle and dual_carriageway, cycleway presence from any side key', () => {
        const attributes = byId(roadAttributes({ highway: 'residential', oneway: 'yes', 'cycleway:left': 'no' }));
        expect(attributes.oneway_bicycle.state).toBe('missing');
        expect(attributes.dual_carriageway.optional).toBe(true);
        expect(attributes.cycleway.state).toBe('ok');
        expect(attributes.cycleway.value).toBe('no');
        expect(byId(roadAttributes({ highway: 'residential', 'cycleway:left': 'no', 'cycleway:right': 'lane' })).cycleway.value).toBe('left=no, right=lane');
    });

    it('not for paths', () => {
        expect(roadAttributes({ highway: 'cycleway' })).toEqual([]);
    });
});
