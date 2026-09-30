import { localizer, t } from '../core/localizer';

/**
 * Groups of TILDA categories for the "Change to" select, in the order mappers need them.
 * Categories the library offers that are in no group end up in `other`.
 */
export const CATEGORY_GROUPS: { id: string; categories: string[] }[] = [
    { id: 'track', categories: ['cycleway_adjoining', 'cycleway_isolated', 'cycleway_adjoiningOrIsolated'] },
    { id: 'lane', categories: [
        'cyclewayOnHighway_advisory',
        'cyclewayOnHighway_exclusive',
        'cyclewayOnHighway_advisoryOrExclusive',
        'cyclewayOnHighwayProtected',
        'cyclewayOnHighwayBetweenLanes',
        'sharedMotorVehicleLane'
    ] },
    { id: 'foot', categories: [
        'footAndCyclewayShared_adjoining',
        'footAndCyclewayShared_isolated',
        'footAndCyclewayShared_adjoiningOrIsolated',
        'footAndCyclewaySegregated_adjoining',
        'footAndCyclewaySegregated_isolated',
        'footAndCyclewaySegregated_adjoiningOrIsolated',
        'footwayBicycleYes_adjoining',
        'footwayBicycleYes_isolated',
        'footwayBicycleYes_adjoiningOrIsolated',
        'pedestrianAreaBicycleYes'
    ] },
    { id: 'bus', categories: ['sharedBusLaneBikeWithBus', 'sharedBusLaneBusWithBike'] },
    { id: 'bicycle_road', categories: ['bicycleRoad', 'bicycleRoad_vehicleDestination'] },
    { id: 'special', categories: ['cyclewayLink', 'crossing'] }
];


/**
 * German category names as TILDA shows them
 * (tilda-geo `topic-docs/roads_bikelanes/bikelanes.yaml`, attribute `category`).
 * Our UI strings exist only in English (`data/core.yaml`), so German users get these instead.
 */
const CATEGORY_LABELS_DE: Record<string, string> = {
    bicycleRoad: 'Fahrradstraße',
    bicycleRoad_vehicleDestination: 'Fahrradstraße mit Anlieger/Kfz frei',
    crossing: 'Straßenquerung',
    cycleway_adjoining: 'Radweg (straßenbegleitend)',
    cycleway_adjoiningOrIsolated: 'Radweg (straßenbegleitend oder selbstständig geführt; Kategorisierung unklar)',
    cycleway_isolated: 'Radweg, selbstständig geführt',
    cyclewayLink: 'Radweg-Verbindungsstück',
    cyclewayOnHighway_advisory: 'Schutzstreifen',
    cyclewayOnHighway_advisoryOrExclusive: 'Radfahrstreifen oder Schutzstreifen (Kategorisierung unklar)',
    cyclewayOnHighway_exclusive: 'Radfahrstreifen',
    cyclewayOnHighwayBetweenLanes: 'Radfahrstreifen in Mittellage (Fahrradweiche)',
    cyclewayOnHighwayProtected: 'Geschützter Radfahrstreifen (PBL)',
    footAndCyclewaySegregated_adjoining: 'Getrennter Rad- und Gehweg, straßenbegleitend',
    footAndCyclewaySegregated_adjoiningOrIsolated: 'Getrennter Rad- und Gehweg (straßenbegleitend oder selbstständig geführt; Kategorisierung unklar)',
    footAndCyclewaySegregated_isolated: 'Getrennter Rad- und Gehweg, selbstständig geführt',
    footAndCyclewayShared_adjoining: 'Gemeinsamer Geh- und Radweg, straßenbegleitend',
    footAndCyclewayShared_adjoiningOrIsolated: 'Gemeinsamer Geh- und Radweg (straßenbegleitend oder selbstständig geführt; Kategorisierung unklar)',
    footAndCyclewayShared_isolated: 'Gemeinsamer Geh- und Radweg, selbstständig geführt',
    footwayBicycleYes_adjoining: 'Gehweg mit Radfahrer frei, straßenbegleitend',
    footwayBicycleYes_adjoiningOrIsolated: 'Gehweg mit Radfahrer frei (straßenbegleitend oder selbstständig geführt; Kategorisierung unklar)',
    footwayBicycleYes_isolated: 'Gehweg mit Radfahrer frei, selbstständig geführt',
    pedestrianAreaBicycleYes: 'Fußgängerzone, Fahrrad frei',
    sharedBusLaneBikeWithBus: 'Radfahrstreifen mit Freigabe Busverkehr',
    sharedBusLaneBusWithBike: 'Bussonderfahrstreifen mit Fahrrad frei',
    sharedMotorVehicleLane: 'Anteilig genutzter Fahrstreifen (Sharrows)',
    needsClarification: 'Führungsform unklar'
};

const GROUP_LABELS_DE: Record<string, string> = {
    track: 'Radwege',
    lane: 'Auf der Fahrbahn',
    foot: 'Mit dem Fußverkehr',
    bus: 'Mit dem Busverkehr',
    bicycle_road: 'Fahrradstraßen',
    special: 'Sonderfälle: Verbindungsstücke und Querungen',
    other: 'Weitere'
};


function isGerman() {
    return localizer.languageCode() === 'de';
}


export function categoryLabel(category: string | undefined) {
    if (!category) return t('inspector.tilda.no_category');
    if (isGerman() && CATEGORY_LABELS_DE[category]) return CATEGORY_LABELS_DE[category];
    return t(`inspector.tilda.category.${category}`, { default: category });
}


export function categoryGroupLabel(group: string) {
    if (isGerman() && GROUP_LABELS_DE[group]) return GROUP_LABELS_DE[group];
    return t(`inspector.tilda.category_group.${group}`, { default: group });
}


/** `categories` sorted into `CATEGORY_GROUPS` (empty groups left out); the rest goes to `other` */
export function groupCategories(categories: string[]) {
    const grouped = CATEGORY_GROUPS
        .map(group => ({ id: group.id, categories: group.categories.filter(category => categories.includes(category)) }));
    const known = new Set(CATEGORY_GROUPS.flatMap(group => group.categories));
    grouped.push({ id: 'other', categories: categories.filter(category => !known.has(category)) });
    return grouped.filter(group => group.categories.length);
}
