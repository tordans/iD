import type { Field, Fields, Presets } from '@openstreetmap/id-tagging-schema';

/**
 * Project-specific changes to the tagging schema, applied while the presets load.
 * iD itself only offers `presetManager.merge()`, which replaces whole presets; this
 * adds fields and puts them into existing presets without copying their definitions.
 *
 * Set it from the page that loads iD, before `context.init()`:
 *   iD.presetManager.customize(iD.RADNETZ_PRESET_CUSTOMIZATION);
 */
export interface PresetCustomization {
    /** New fields (or replacements), like in id-tagging-schema's `fields.json`. `label` is used as is, not translated. */
    fields?: Record<string, Field>;
    /** preset id → field ids to append to the preset's `fields` (shown by default) */
    addFields?: Record<string, string[]>;
    /** preset id → field ids to append to the preset's `moreFields` */
    addMoreFields?: Record<string, string[]>;
}


/** Returns copies of the raw fields and presets with the customization applied */
export function applyPresetCustomization(
    customization: PresetCustomization | undefined,
    raw: { fields?: Fields; presets?: Presets }
) {
    if (!customization) return raw;

    const fields = raw.fields && { ...raw.fields, ...customization.fields };

    let presets = raw.presets;
    if (presets) {
        presets = { ...presets };
        const append = (list: Record<string, string[]> | undefined, prop: 'fields' | 'moreFields') => {
            for (const [presetID, fieldIDs] of Object.entries(list ?? {})) {
                const preset = presets![presetID];
                if (!preset) continue;
                const existing = preset[prop] ?? [];
                const missing = fieldIDs.filter(id => !existing.includes(id));
                // the field may already come from `moreFields`; `fields` wins
                const moreFields = prop === 'fields'
                    ? preset.moreFields?.filter(id => !fieldIDs.includes(id))
                    : preset.moreFields;
                presets![presetID] = { ...preset, moreFields, [prop]: [...existing, ...missing] };
            }
        };
        append(customization.addFields, 'fields');
        append(customization.addMoreFields, 'moreFields');
    }

    return { fields, presets };
}


/** Presets for normal roads that Radnetz Berlin and TILDA classify; `{…}` references in other presets inherit these */
const ROAD_PRESETS = [
    'highway/trunk',
    'highway/primary',       // also secondary and tertiary via `{highway/primary}`
    'highway/secondary',
    'highway/tertiary',
    'highway/residential',   // also unclassified and road via `{highway/residential}`
    'highway/unclassified',
    'highway/living_street'
];

/** Customization used by the Radnetz Berlin editor */
export const RADNETZ_PRESET_CUSTOMIZATION: PresetCustomization = {
    fields: {
        dual_carriageway: {
            key: 'dual_carriageway',
            type: 'check',
            label: 'Dual Carriageway',
            geometry: ['line']
        } as Field
    },
    addFields: Object.fromEntries(ROAD_PRESETS.map(id => [id, ['dual_carriageway']]))
};
