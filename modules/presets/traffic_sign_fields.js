const TRAFFIC_SIGN_TAG_KEY_PATTERN = /traffic_sign(?::(?:forward|backward|left|right))?$/;

const TRAFFIC_SIGN_KEY_PATTERN = /^traffic_sign(?::(?:forward|backward|left|right))?$/;

export const EXTRA_TRAFFIC_SIGN_FIELDS = {
    'traffic_sign/forward': {
        key: 'traffic_sign:forward',
        type: 'trafficSign',
        label: 'Traffic Sign (Forward)',
        snake_case: false,
        caseSensitive: true
    },
    'traffic_sign/backward': {
        key: 'traffic_sign:backward',
        type: 'trafficSign',
        label: 'Traffic Sign (Backward)',
        snake_case: false,
        caseSensitive: true
    }
};

const FIELD_ID_BY_TAG_KEY = {
    'traffic_sign': 'traffic_sign',
    'traffic_sign:forward': 'traffic_sign/forward',
    'traffic_sign:backward': 'traffic_sign/backward',
    'traffic_sign:left': 'traffic_sign/left',
    'traffic_sign:right': 'traffic_sign/right'
};

const LABEL_BY_TAG_KEY = {
    'traffic_sign': 'Traffic Sign',
    'traffic_sign:forward': 'Traffic Sign (Forward)',
    'traffic_sign:backward': 'Traffic Sign (Backward)',
    'traffic_sign:left': 'Traffic Sign (Left)',
    'traffic_sign:right': 'Traffic Sign (Right)'
};


export function applyTrafficSignFieldTypes(fields) {
    for (const fieldID of Object.keys(fields)) {
        const fieldData = fields[fieldID];
        if (fieldData && fieldData.key && TRAFFIC_SIGN_KEY_PATTERN.test(fieldData.key)) {
            fieldData.type = 'trafficSign';
        }
    }
}


export function isTrafficSignValueTagKey(tagKey) {
    return TRAFFIC_SIGN_TAG_KEY_PATTERN.test(tagKey);
}


export function trafficSignTagKeysFromTags(tags) {
    if (!tags) return [];

    return Object.keys(tags)
        .filter(tagKey => {
            const value = tags[tagKey];
            if (Array.isArray(value)) return false;
            if (value === undefined || value === null || value === '') return false;
            return isTrafficSignValueTagKey(tagKey);
        })
        .sort((a, b) => trafficSignTagKeySortRank(a) - trafficSignTagKeySortRank(b) || a.localeCompare(b));
}


function trafficSignTagKeySortRank(tagKey) {
    if (tagKey === 'traffic_sign') return 0;
    if (tagKey === 'traffic_sign:forward') return 1;
    if (tagKey === 'traffic_sign:backward') return 2;
    if (tagKey === 'traffic_sign:left') return 3;
    if (tagKey === 'traffic_sign:right') return 4;
    return 10;
}


export function fieldIdForTrafficSignTagKey(tagKey) {
    return FIELD_ID_BY_TAG_KEY[tagKey] || `traffic_sign/${tagKey.replace(/[:/]/g, '_')}`;
}


export function labelForTrafficSignTagKey(tagKey) {
    if (LABEL_BY_TAG_KEY[tagKey]) return LABEL_BY_TAG_KEY[tagKey];

    const suffix = tagKey.split('traffic_sign').pop() || '';
    if (suffix.startsWith(':')) {
        const direction = suffix.slice(1);
        return `Traffic Sign (${direction})`;
    }

    return tagKey;
}
