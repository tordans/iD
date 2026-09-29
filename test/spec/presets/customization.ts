import { describe, expect, it } from 'vitest';

import { applyPresetCustomization, RADNETZ_PRESET_CUSTOMIZATION } from '../../../modules/presets/customization';

describe('applyPresetCustomization', () => {
    const raw = {
        fields: { name: { key: 'name', type: 'text' } } as any,
        presets: {
            'highway/primary': { tags: { highway: 'primary' }, geometry: ['line'], fields: ['name'], moreFields: ['dual_carriageway', 'lit'] },
            'highway/secondary': { tags: { highway: 'secondary' }, geometry: ['line'], fields: ['{highway/primary}'] }
        } as any
    };

    it('returns the input without a customization', () => {
        expect(applyPresetCustomization(undefined, raw)).toBe(raw);
    });

    it('adds fields and moves them from moreFields to fields', () => {
        const result = applyPresetCustomization({
            fields: { dual_carriageway: { key: 'dual_carriageway', type: 'check' } as any },
            addFields: { 'highway/primary': ['dual_carriageway'], 'highway/missing': ['dual_carriageway'] }
        }, raw);
        expect(result.fields!.dual_carriageway.type).toBe('check');
        expect(result.presets!['highway/primary'].fields).toEqual(['name', 'dual_carriageway']);
        expect(result.presets!['highway/primary'].moreFields).toEqual(['lit']);
        expect(result.presets!['highway/missing']).toBeUndefined();
        // does not change the input
        expect(raw.presets['highway/primary'].fields).toEqual(['name']);
    });

    it('appends moreFields without duplicates', () => {
        const result = applyPresetCustomization({ addMoreFields: { 'highway/primary': ['lit', 'width'] } }, raw);
        expect(result.presets!['highway/primary'].moreFields).toEqual(['dual_carriageway', 'lit', 'width']);
    });

    it('Radnetz: dual_carriageway is a check field on the road presets', () => {
        expect(RADNETZ_PRESET_CUSTOMIZATION.fields!.dual_carriageway.type).toBe('check');
        expect(RADNETZ_PRESET_CUSTOMIZATION.addFields!['highway/residential']).toEqual(['dual_carriageway']);
    });
});
