import {
    MAJOR_ROAD_CLASSES,
    MINOR_ROAD_CLASSES,
    TRUNK_MOTORWAY_CLASSES,
    writeKeyForSide,
    type BikelaneResult
} from '@tilda-geo/bicycle-infrastructure';

/**
 * Tags the Radnetz Berlin dataset (infraVelo) needs for each TILDA category.
 * Derived from `infravelo-radnetz/scripts/translate_attributes_tilda_to_rvn.py` and the
 * TILDA sanitizers; see WORKDOC feature 16 ("Data index") for the full table.
 * Keys are written for the own way (`width`) and turned into side keys
 * (`cycleway:right:width`) with `writeKeyForSide`.
 */

/** infraVelo attribute a tag feeds */
export type InfraveloAttribute = 'verkehrsri' | 'fuehr' | 'pflicht' | 'breite' | 'ofm' | 'farbe' | 'protek' | 'trennstreifen' | 'nutz_beschr';

/**
 * - `ok`: tagged, TILDA reads it
 * - `inherited`: not tagged here, but TILDA gets a value elsewhere (road surface, `parking:*`, category)
 * - `guess`: not tagged, TILDA guesses (oneway)
 * - `ignored`: tagged, but TILDA drops the value
 * - `missing`: not tagged
 */
export type AttributeState = 'ok' | 'inherited' | 'guess' | 'ignored' | 'missing';

export type RequiredAttribute = {
    /** id for the label: `inspector.tilda.attribute.<id>` */
    id: string;
    /** the OSM key to write, for this side of the way (e.g. `cycleway:right:width`) */
    key: string;
    /** the tagged value (also found via `:both` or the plain key, like TILDA reads it) */
    value: string | undefined;
    /** the value TILDA reads, after sanitizing (may come from the parent road) */
    tilda: string | undefined;
    state: AttributeState;
    /** values TILDA accepts, offered as buttons */
    options: string[];
    /** conditional attributes: a missing value is not an error */
    optional: boolean;
    feeds: InfraveloAttribute[];
};

type Side = BikelaneResult['_side'];

type RuleContext = {
    tags: Tags;
    result: BikelaneResult | undefined;
    side: Side;
    prefix: string | null;
    /** the target category, or the current one */
    category: string;
    /** `category` is a target the mapper chose, not what TILDA reads now */
    isTarget: boolean;
    /** tagged value for an own-way key on this side */
    value: (key: string) => string | undefined;
};

type Rule = {
    id: string;
    key: string;
    feeds: InfraveloAttribute[];
    options?: readonly string[] | ((ctx: RuleContext) => readonly string[]);
    /** only values in `options` are valid (else any value, e.g. numbers); for rules without `tilda` */
    strict?: boolean;
    /** other keys that also count as tagged; the value shows all of them (`left=no, right=lane`) */
    alsoKeys?: string[];
    /** what TILDA reads for this attribute */
    tilda?: (ctx: RuleContext) => string | number | null | undefined;
    /** TILDA values that are only a guess, not tagged information */
    guesses?: readonly string[];
    when?: (ctx: RuleContext) => boolean;
    optional?: boolean | ((ctx: RuleContext) => boolean);
};


// Values TILDA accepts (`sanitize-road-tags.ts`, `sanitize-surface.ts` in @tilda-geo/bicycle-infrastructure)
const SURFACE_OPTIONS = [
    'asphalt', 'paving_stones', 'sett', 'concrete', 'concrete:plates', 'concrete:lanes', 'bricks', 'stone',
    'compacted', 'fine_gravel', 'gravel', 'pebblestone', 'ground', 'grass', 'sand', 'unpaved', 'paved',
    'wood', 'metal', 'grass_paver'
];
const SURFACE_COLOUR_OPTIONS = ['no', 'red', 'green', 'red;green'];
const SEPARATION_OPTIONS = [
    'no', 'bollard', 'flex_post', 'vertical_panel', 'studs', 'bump', 'kerb', 'planter', 'fence',
    'jersey_barrier', 'guard_rail', 'structure', 'greenery', 'hedge', 'tree_row', 'ditch', 'cone'
];
const MARKING_OPTIONS = ['no', 'solid_line', 'dashed_line', 'double_solid_line', 'barred_area', 'pictogram', 'surface'];
const TRAFFIC_MODE_OPTIONS = ['no', 'motor_vehicle', 'parking', 'psv', 'bicycle', 'foot'];
const BUFFER_OPTIONS = ['no', '0.25', '0.5', '0.75', '1'];

/** Traffic signs that set the infraVelo type (`fuehr`) or mandatory use (`pflicht`) */
function trafficSignOptions(ctx: RuleContext): string[] {
    const category = ctx.category;
    if (category.startsWith('bicycleRoad')) return ['DE:244.1', 'DE:244.1,1020-30'];
    if (category.startsWith('footAndCyclewayShared')) return ['DE:240', 'none'];
    if (category.startsWith('footAndCyclewaySegregated')) return ['DE:241', 'none'];
    if (category.startsWith('footwayBicycleYes')) return ['DE:239,1022-10', 'none'];
    if (category === 'pedestrianAreaBicycleYes') return ['DE:242.1,1022-10'];
    if (category === 'sharedBusLaneBusWithBike') return ['DE:245,1022-10'];
    if (category === 'sharedBusLaneBikeWithBus') return ['DE:237,1024-14'];
    return ['DE:237', 'none'];
}


function isSeparateWayCategory(category: string) {
    return /^(cycleway_|footAndCycleway|footwayBicycleYes)/.test(category) || category === 'needsClarification';
}

function isOnRoadLaneCategory(category: string) {
    return category.startsWith('cyclewayOnHighway_') ||
        category === 'cyclewayOnHighwayBetweenLanes' ||
        category.startsWith('sharedBusLane');
}

function sidepathFromCategory(category: string) {
    if (category.endsWith('_adjoining')) return 'yes';
    if (category.endsWith('_isolated')) return 'no';
    return undefined;
}


function field(name: keyof BikelaneResult) {
    return (ctx: RuleContext) => ctx.result?.[name] as string | number | null | undefined;
}

/** `traffic_mode` on this side is parking (tagged, or inferred from `parking:*` by TILDA) */
function parkingOn(side: 'left' | 'right') {
    return (ctx: RuleContext) => (ctx.value(`traffic_mode:${side}`) ?? ctx.result?.[`traffic_mode_${side}`]) === 'parking';
}


const COMMON: Rule[] = [
    { id: 'traffic_sign', key: 'traffic_sign', feeds: ['pflicht', 'fuehr', 'nutz_beschr'], options: trafficSignOptions, tilda: field('traffic_sign') },
    { id: 'width', key: 'width', feeds: ['breite'], options: [], tilda: field('width') },
    { id: 'source_width', key: 'source:width', feeds: ['breite'], options: ['survey', 'measured', 'estimate', 'aerial imagery'], optional: true,
        when: ctx => ctx.value('width') !== undefined },
    { id: 'surface', key: 'surface', feeds: ['ofm'], options: SURFACE_OPTIONS, tilda: field('surface') },
    { id: 'sett_length', key: 'sett:length', feeds: ['ofm'], options: ['0.05', '0.1', '0.16'],
        when: ctx => ctx.value('surface') === 'sett' },
    { id: 'surface_colour', key: 'surface:colour', feeds: ['farbe'], options: SURFACE_COLOUR_OPTIONS, strict: true, tilda: field('surface_color'), optional: true },
    { id: 'oneway', key: 'oneway', feeds: ['verkehrsri'], options: ['yes', 'no', '-1'], tilda: field('oneway'), guesses: ['assumed_no', 'implicit_yes'],
        // lanes on the road run with the traffic; TILDA's guess is reliable there
        optional: ctx => ctx.side !== 'self' && isOnRoadLaneCategory(ctx.category) }
];

const SEPARATE_WAY: Rule[] = [
    { id: 'is_sidepath', key: 'is_sidepath', feeds: ['fuehr'], options: ['yes', 'no'], strict: true,
        // TILDA derives it from `footway=sidewalk` and similar; a chosen target category is no source
        tilda: ctx => ctx.isTarget ? undefined : sidepathFromCategory(ctx.category),
        when: ctx => ctx.side === 'self' && isSeparateWayCategory(ctx.category) },
    { id: 'segregated', key: 'segregated', feeds: ['fuehr'], options: ['yes', 'no'], strict: true,
        when: ctx => ctx.category.startsWith('footAndCycleway') }
];

const LANE: Rule[] = [
    // TILDA has `_advisory` / `_exclusive` only from this tag, so the category is no source for it
    { id: 'lane', key: 'lane', feeds: ['fuehr'], options: ['advisory', 'exclusive'], strict: true,
        when: ctx => ctx.category.startsWith('cyclewayOnHighway_') }
];

/** Parking next to the lane: needs a buffer (`trennstreifen`); TILDA infers parking from `parking:<side>` */
const NEXT_TO_PARKING: Rule[] = [
    // without parking TILDA has "entfällt"; so only needed where parking is not tagged on the road
    { id: 'traffic_mode_right', key: 'traffic_mode:right', feeds: ['trennstreifen'], options: TRAFFIC_MODE_OPTIONS, strict: true, tilda: field('traffic_mode_right'), optional: true },
    { id: 'buffer_right', key: 'buffer:right', feeds: ['trennstreifen'], options: BUFFER_OPTIONS, tilda: field('buffer_right'), when: parkingOn('right') },
    { id: 'marking_right', key: 'marking:right', feeds: ['trennstreifen'], options: MARKING_OPTIONS, strict: true, tilda: field('marking_right'), when: parkingOn('right') }
];

const PROTECTION: Rule[] = (['left', 'right'] as const).flatMap(side => [
    { id: `separation_${side}`, key: `separation:${side}`, feeds: ['protek'], options: SEPARATION_OPTIONS, strict: true, tilda: field(`separation_${side}`) },
    { id: `marking_${side}`, key: `marking:${side}`, feeds: ['protek', 'trennstreifen'], options: MARKING_OPTIONS, strict: true, tilda: field(`marking_${side}`) },
    { id: `buffer_${side}`, key: `buffer:${side}`, feeds: ['protek', 'trennstreifen'], options: BUFFER_OPTIONS, tilda: field(`buffer_${side}`) },
    { id: `traffic_mode_${side}`, key: `traffic_mode:${side}`, feeds: ['protek', 'trennstreifen'], options: TRAFFIC_MODE_OPTIONS, strict: true, tilda: field(`traffic_mode_${side}`) }
] as Rule[]);

/** Bicycle roads need a buffer to parking on both sides */
const BICYCLE_ROAD: Rule[] = [
    { id: 'oneway_bicycle', key: 'oneway:bicycle', feeds: ['verkehrsri'], options: ['no', 'yes'], strict: true,
        when: ctx => ctx.value('oneway') === 'yes' },
    ...(['left', 'right'] as const).flatMap(side => [
        { id: `traffic_mode_${side}`, key: `traffic_mode:${side}`, feeds: ['trennstreifen'], options: TRAFFIC_MODE_OPTIONS, strict: true, tilda: field(`traffic_mode_${side}`), optional: true },
        { id: `buffer_${side}`, key: `buffer:${side}`, feeds: ['trennstreifen'], options: BUFFER_OPTIONS, tilda: field(`buffer_${side}`), when: parkingOn(side) },
        { id: `marking_${side}`, key: `marking:${side}`, feeds: ['trennstreifen'], options: MARKING_OPTIONS, strict: true, tilda: field(`marking_${side}`), when: parkingOn(side) }
    ] as Rule[])
];


function rulesForCategory(category: string): Rule[] {
    if (category === 'cyclewayOnHighwayProtected') return [...COMMON, ...PROTECTION];
    if (isOnRoadLaneCategory(category)) return [...COMMON, ...LANE, ...NEXT_TO_PARKING];
    if (category.startsWith('bicycleRoad')) return [...COMMON, ...BICYCLE_ROAD];
    return [...COMMON, ...SEPARATE_WAY];
}


/**
 * Keys that TILDA reads for an own-way key on one side, most specific first:
 * `separation:left` → `separation:both` → `separation` (left only), and on a road side
 * `cycleway:right:<key>` → `cycleway:both:<key>` → `cycleway:<key>`.
 */
export function lookupKeys(key: string, side: Side, prefix: string | null) {
    const sided = key.match(/^(.*):(left|right)$/);
    const ownKeys = sided
        ? [key, `${sided[1]}:both`, ...(sided[2] === 'left' ? [sided[1]] : [])]
        : [key];
    if (side === 'self' || !prefix) return ownKeys;
    return ownKeys.flatMap(ownKey => [`${prefix}:${side}:${ownKey}`, `${prefix}:both:${ownKey}`, `${prefix}:${ownKey}`]);
}


function displayValue(value: unknown) {
    return value === null || value === undefined ? undefined : String(value);
}


/** `key=value` of all tagged keys, without their common prefix */
function summary(ctx: RuleContext, keys: string[]) {
    const tagged = keys.filter(key => ctx.value(key) !== undefined);
    if (!tagged.length) return undefined;
    if (tagged.length === 1) return ctx.value(tagged[0]);
    return tagged.map(key => `${key.split(':').pop()}=${ctx.value(key)}`).join(', ');
}


function evaluate(rules: Rule[], ctx: RuleContext): RequiredAttribute[] {
    return rules
        .filter(rule => !rule.when || rule.when(ctx))
        .map(rule => {
            const value = rule.alsoKeys ? summary(ctx, [rule.key, ...rule.alsoKeys]) : ctx.value(rule.key);
            const tilda = displayValue(rule.tilda?.(ctx));
            const options = [...(typeof rule.options === 'function' ? rule.options(ctx) : rule.options ?? [])];
            const optional = typeof rule.optional === 'function' ? rule.optional(ctx) : !!rule.optional;

            let state: AttributeState;
            if (value !== undefined) {
                const dropped = rule.tilda !== undefined && tilda === undefined;
                const invalid = rule.tilda === undefined && rule.strict && !options.includes(value);
                state = dropped || invalid ? 'ignored' : 'ok';
            } else if (tilda !== undefined) {
                state = rule.guesses?.includes(tilda) ? 'guess' : 'inherited';
            } else {
                state = 'missing';
            }

            return {
                id: rule.id,
                key: writeKeyForSide(rule.key, ctx.side, ctx.prefix),
                value,
                tilda,
                state,
                options,
                optional,
                feeds: rule.feeds
            };
        });
}


function contextFor(tags: Tags, result: BikelaneResult | undefined, side: Side, prefix: string | null, category: string,
    isTarget = false): RuleContext {
    return {
        tags, result, side, prefix, category, isTarget,
        value: key => lookupKeys(key, side, prefix).map(k => tags[k]).find(v => v !== undefined)
    };
}


/**
 * Required attributes for one TILDA result (one side of the way).
 * With a `targetCategory`, the list is for that category (the mapper is changing the way to it).
 */
export function requiredAttributes(result: BikelaneResult, tags: Tags, targetCategory?: string): RequiredAttribute[] {
    const category = targetCategory ?? result.category;
    if (!targetCategory && !result._infrastructureExists) return [];
    if (category === 'cyclewayLink' || category === 'data_no' || category === 'separate_geometry' || category === 'not_expected') return [];

    const ctx = contextFor(tags, result, result._side, result._prefix, category, category !== result.category);
    return evaluate(rulesForCategory(category), ctx);
}


const ROAD_CLASSES = new Set<string>([...TRUNK_MOTORWAY_CLASSES, ...MAJOR_ROAD_CLASSES, ...MINOR_ROAD_CLASSES]);
ROAD_CLASSES.delete('pedestrian');

export function isRoad(tags: Tags) {
    return !!tags.highway && ROAD_CLASSES.has(tags.highway);
}

const ROAD: Rule[] = [
    { id: 'oneway', key: 'oneway', feeds: ['verkehrsri'], options: ['yes', 'no', '-1'], optional: true },
    { id: 'oneway_bicycle', key: 'oneway:bicycle', feeds: ['verkehrsri'], options: ['no', 'yes'], strict: true,
        when: ctx => ctx.value('oneway') === 'yes',
        optional: ctx => ctx.value('dual_carriageway') === 'yes' },
    { id: 'dual_carriageway', key: 'dual_carriageway', feeds: ['verkehrsri'], options: ['yes', 'no'], strict: true, optional: true,
        when: ctx => ctx.value('oneway') === 'yes' },
    { id: 'width', key: 'width', feeds: ['breite'], options: [] },
    { id: 'surface', key: 'surface', feeds: ['ofm'], options: SURFACE_OPTIONS },
    { id: 'sett_length', key: 'sett:length', feeds: ['ofm'], options: ['0.05', '0.1', '0.16'],
        when: ctx => ctx.value('surface') === 'sett' },
    { id: 'cycleway', key: 'cycleway:both', feeds: ['fuehr'], options: ['no', 'separate', 'lane', 'track'],
        // any of `cycleway`, `cycleway:both`, `cycleway:left`, `cycleway:right` says what is on the sides
        alsoKeys: ['cycleway', 'cycleway:left', 'cycleway:right'] }
];

/**
 * Attributes for the road itself (TILDA `roads` export → infraVelo "Mischverkehr").
 * Only for roads; bicycle roads get their checklist from their bike infrastructure card.
 */
export function roadAttributes(tags: Tags): RequiredAttribute[] {
    if (!isRoad(tags)) return [];
    return evaluate(ROAD, contextFor(tags, undefined, 'self', null, 'road'));
}
