export const trafficSignCatalogueCategories = [
    'traffic_sign',
    'object_sign',
    'surface_sign',
    'hazard_sign',
    'signpost',
    'speed',
];
export const modifierSignCatalogueCategories = [
    'exception_modifier',
    'condition_modifier',
    'direction_modifier',
];
/** Sign-picker section order; must list every catalogue category exactly once. */
export const signCategories = [
    'traffic_sign',
    'exception_modifier',
    'condition_modifier',
    'direction_modifier',
    'speed',
    'hazard_sign',
    'surface_sign',
    'object_sign',
    'signpost',
];
export const signFocusTags = ['bike_foot', 'parking', 'highway'];
export const catalogueFocusViews = ['default', ...signFocusTags];
export const focusAreas = ['default', ...signFocusTags, 'all'];
export const taggingSuggestionsQaStatuses = ['none'];
export const QUESTION_NIL_ANSWER_ID = 'nil';
//# sourceMappingURL=TrafficSignDataTypes.js.map