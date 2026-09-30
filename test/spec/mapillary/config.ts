import { describe, expect, it } from 'vitest';

import { effectiveList, mapillaryConfig, parseList } from '../../../modules/mapillary/config';

describe('mapillary/config', () => {
    it('parses lists', () => {
        expect(parseList('radinfra, foo;bar,,radinfra')).toEqual(['radinfra', 'foo', 'bar']);
        expect(parseList('')).toEqual([]);
        expect(parseList(undefined)).toEqual([]);
    });

    it('lets the URL win over the config', () => {
        expect(effectiveList('a,b', ['c'])).toEqual(['a', 'b']);
        expect(effectiveList(undefined, ['c'])).toEqual(['c']);
        expect(effectiveList('', ['c'])).toEqual(['c']);
    });

    it('has defaults and merges changes', () => {
        expect(mapillaryConfig().defaultFromDate).toBe('2024-01-01');
        mapillaryConfig({ highlightOrgs: ['x'] });
        expect(mapillaryConfig().highlightOrgs).toEqual(['x']);
        expect(mapillaryConfig().defaultFromDate).toBe('2024-01-01');
        mapillaryConfig({ highlightOrgs: [] });
    });
});
