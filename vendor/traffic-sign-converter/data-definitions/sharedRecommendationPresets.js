const way = (rec) => ({
    geometries: ['way'],
    ...rec,
});
const node = (rec) => ({
    geometries: ['node'],
    ...rec,
});
/** Dedicated cycleway (bicycle=designated, highway=cycleway). */
export const sharedCyclewayRecommendation = () => [
    way({
        highwayValues: ['cycleway'],
        uniqueTags: [{ key: 'bicycle', value: 'designated' }],
    }),
];
/** Dedicated footway (foot=designated, highway=footway). */
export const sharedFootwayRecommendation = () => [
    way({
        highwayValues: ['footway'],
        uniqueTags: [{ key: 'foot', value: 'designated' }],
    }),
];
/** Shared foot and cycle path (segregated=no). */
export const sharedSharedFootCyclePathRecommendation = () => [
    way({
        highwayValues: ['path'],
        uniqueTags: [
            { key: 'bicycle', value: 'designated' },
            { key: 'foot', value: 'designated' },
            { key: 'segregated', value: 'no' },
        ],
    }),
];
/** Segregated foot and cycle path (segregated=yes). */
export const sharedSegregatedFootCyclePathRecommendation = () => [
    way({
        highwayValues: ['path'],
        uniqueTags: [
            { key: 'bicycle', value: 'designated' },
            { key: 'foot', value: 'designated' },
            { key: 'segregated', value: 'yes' },
        ],
    }),
];
/** Bridleway. */
export const sharedBridlewayRecommendation = () => [
    way({ highwayValues: ['bridleway'] }),
];
const accessBanTags = {
    vehicle: [{ key: 'vehicle', value: 'no' }],
    motor_vehicle: [{ key: 'motor_vehicle', value: 'no' }],
    motorcar: [{ key: 'motorcar', value: 'no' }],
    hgv: [{ key: 'hgv', value: 'no' }],
    bicycle: [{ key: 'bicycle', value: 'no' }],
    motorcycle: [{ key: 'motorcycle', value: 'no' }],
    mofa: [{ key: 'mofa', value: 'no' }],
    horse: [{ key: 'horse', value: 'no' }],
    bus: [
        { key: 'bus', value: 'no' },
        { key: 'tourist_bus', value: 'no' },
    ],
};
export const sharedAccessBanRecommendation = (kind) => [
    way({ highwayValues: [], accessTags: accessBanTags[kind] }),
];
export const sharedPriorityRecommendation = (kind) => {
    if (kind === 'stop') {
        return [node({ uniqueTags: [{ key: 'highway', value: 'stop' }] })];
    }
    return [{ geometries: ['node'] }];
};
/** Maxspeed on way; use conditionalTags with literal or valuePrompt on sign. */
export const sharedMaxspeedRecommendation = (speed) => [
    way({
        highwayValues: [],
        uniqueTags: [{ key: 'source:maxspeed', value: 'sign' }],
        conditionalTags: speed
            ? [{ key: 'maxspeed', value: speed }]
            : [{ key: 'maxspeed', value: '$' }],
    }),
];
/** Oneway street. */
export const sharedOnewayRecommendation = () => [
    way({ highwayValues: [], uniqueTags: [{ key: 'oneway', value: 'yes' }] }),
];
/** No parking / no stopping on way. */
export const sharedParkingRestrictionRecommendation = (kind) => [
    way({
        highwayValues: [],
        uniqueTags: [{ key: kind, value: 'yes' }],
    }),
];
//# sourceMappingURL=sharedRecommendationPresets.js.map