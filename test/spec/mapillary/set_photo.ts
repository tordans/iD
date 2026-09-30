import { describe, expect, it } from 'vitest';
import { appendImageId, disabledReason, hasImageId, resolveTargetKey, targetKeys } from '../../../modules/mapillary/set_photo';
import { activeTargetEvents, clearActiveTarget, getActiveTarget, setActiveTarget } from '../../../modules/mapillary/active_target';

describe('resolveTargetKey', () => {
    it('defaults to mapillary', () => {
        expect(resolveTargetKey(undefined)).toBe('mapillary');
        expect(resolveTargetKey('cycleway:right:mapillary')).toBe('cycleway:right:mapillary');
    });
});

describe('appendImageId', () => {
    it('sets a key without images', () => {
        expect(appendImageId({}, 'mapillary', '5')).toBe('5');
    });
    it('appends to the list', () => {
        expect(appendImageId({ mapillary: '1;2' }, 'mapillary', '5')).toBe('1;2;5');
    });
    it('adds no duplicates', () => {
        expect(appendImageId({ mapillary: '1;5' }, 'mapillary', '5')).toBe('1;5');
    });
    it('only touches the target key', () => {
        expect(appendImageId({ mapillary: '1' }, 'cycleway:right:mapillary', '5')).toBe('5');
    });
});

describe('hasImageId', () => {
    it('checks the list of the key', () => {
        expect(hasImageId({ mapillary: '1; 2' }, 'mapillary', '2')).toBe(true);
        expect(hasImageId({ mapillary: '1' }, 'cycleway:right:mapillary', '1')).toBe(false);
    });
});

describe('targetKeys', () => {
    it('lists existing and likely keys', () => {
        const keys = targetKeys({ highway: 'cycleway', 'cycleway:right': 'lane', 'source:mapillary': '3' });
        expect(keys).toContain('mapillary');
        expect(keys).toContain('source:mapillary');
        expect(keys).toContain('cycleway:right:mapillary');
        expect(keys).not.toContain('sidewalk:left:mapillary');
    });
});

describe('disabledReason', () => {
    const tags = { mapillary: '1', 'cycleway:right:mapillary': '2' };
    it('is per target key', () => {
        expect(disabledReason([tags], 'mapillary', '1', false)).toBe('already_set');
        expect(disabledReason([tags], 'cycleway:right:mapillary', '1', false)).toBe(false);
    });
    it('needs every entity to have the id', () => {
        expect(disabledReason([tags, {}], 'mapillary', '1', false)).toBe(false);
    });
    it('reports too far after already set', () => {
        expect(disabledReason([tags], 'mapillary', '9', true)).toBe('too_far');
        expect(disabledReason([tags], 'mapillary', '1', true)).toBe('already_set');
    });
});

describe('active target store', () => {
    it('is kept per selection and notifies', () => {
        let calls = 0;
        activeTargetEvents.on('change.test', () => calls++);
        setActiveTarget('w1', 'mapillary:forward');
        expect(getActiveTarget('w1')).toBe('mapillary:forward');
        expect(getActiveTarget('w2')).toBeUndefined();
        setActiveTarget('w2', 'mapillary');
        expect(getActiveTarget('w1')).toBeUndefined();
        clearActiveTarget();
        expect(getActiveTarget('w2')).toBeUndefined();
        expect(calls).toBe(3);
        activeTargetEvents.on('change.test', undefined);
    });
});
