import { writeKeyForSide, type BikelaneResult } from '@tilda-geo/bicycle-infrastructure';

/**
 * Attributes the Radnetz Berlin dataset needs for each kind of bike infrastructure.
 * Based on the infravelo QA rules
 * (~/Development/FMC/infravelo-radnetz/inspector/QA.md and `inspector/src/components/shared/*Style.ts`).
 */

export type RequiredAttribute = {
    /** id for the label: `inspector.tilda.attribute.<id>` */
    id: string;
    /** the OSM key to write, for this side of the way (e.g. `cycleway:right:width`) */
    key: string;
    /** the value TILDA derived, if any (may come from the parent road) */
    value: string | undefined;
    /** common values offered as buttons */
    quickValues: string[];
};

type ResultField = keyof BikelaneResult;

type AttributeRule = {
    id: string;
    /** key in TILDA's per-side tag space, written with `writeKeyForSide` */
    key: string;
    field: ResultField;
    quickValues?: string[];
};

const COMMON: AttributeRule[] = [
    { id: 'width', key: 'width', field: 'width' },
    { id: 'surface', key: 'surface', field: 'surface', quickValues: ['asphalt', 'paving_stones', 'sett', 'concrete'] },
    { id: 'traffic_sign', key: 'traffic_sign', field: 'traffic_sign', quickValues: ['none'] }
];

const SEPARATION: AttributeRule[] = [
    { id: 'separation_left', key: 'separation:left', field: 'separation_left', quickValues: ['no', 'bollard', 'flex_post', 'kerb'] },
    { id: 'separation_right', key: 'separation:right', field: 'separation_right', quickValues: ['no', 'bollard', 'flex_post', 'kerb'] },
    { id: 'traffic_mode_right', key: 'traffic_mode:right', field: 'traffic_mode_right', quickValues: ['parking', 'foot', 'motor_vehicle'] }
];

const BUFFER_MARKING: AttributeRule[] = [
    { id: 'buffer_left', key: 'buffer:left', field: 'buffer_left', quickValues: ['no'] },
    { id: 'buffer_right', key: 'buffer:right', field: 'buffer_right', quickValues: ['no'] },
    { id: 'marking_left', key: 'marking:left', field: 'marking_left', quickValues: ['solid_line', 'dashed_line', 'no'] },
    { id: 'marking_right', key: 'marking:right', field: 'marking_right', quickValues: ['solid_line', 'dashed_line', 'no'] }
];

function rulesForCategory(category: string): AttributeRule[] {
    if (category === 'cyclewayOnHighwayProtected') return [...COMMON, ...SEPARATION, ...BUFFER_MARKING];
    if (category.startsWith('cyclewayOnHighway_') || category.startsWith('bicycleRoad')) return [...COMMON, ...BUFFER_MARKING];
    return COMMON;
}


function displayValue(value: unknown) {
    return value === null || value === undefined ? undefined : String(value);
}


/**
 * Required attributes for one TILDA result (one side of the way).
 * Separate ways (`self` without prefix) also need an explicit `oneway`.
 */
export function requiredAttributes(result: BikelaneResult, tags: Tags): RequiredAttribute[] {
    if (!result._infrastructureExists) return [];

    const attributes = rulesForCategory(result.category).map(rule => ({
        id: rule.id,
        key: writeKeyForSide(rule.key, result._side, result._prefix),
        value: displayValue(result[rule.field]),
        quickValues: rule.quickValues ?? []
    }));

    if (result._side === 'self') {
        attributes.push({ id: 'oneway', key: 'oneway', value: tags.oneway, quickValues: ['yes', 'no'] });
    }

    return attributes;
}
