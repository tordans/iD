export const taggingSuggestionsQaStatuses = ['none'];
export const taggingSuggestionsQaFilters = ['all', 'with', 'missing', 'explicit_none'];
const hasSingleRecommendationContent = (recommendation) => Object.entries(recommendation).some(([key, value]) => {
    if (key === 'geometries') {
        return false;
    }
    if (value === undefined) {
        return false;
    }
    if (Array.isArray(value)) {
        return value.length > 0;
    }
    if (typeof value === 'boolean') {
        return value;
    }
    return true;
});
export const hasTagRecommendationsContent = (tagRecommendationsByGeometry) => tagRecommendationsByGeometry !== 'none' &&
    tagRecommendationsByGeometry.some((recommendation) => hasSingleRecommendationContent(recommendation));
export const classifyTaggingSuggestionsQa = (sign) => {
    if (hasTagRecommendationsContent(sign.tagRecommendationsByGeometry)) {
        return 'withSuggestions';
    }
    if (sign.taggingSuggestionsQa === 'none' || sign.tagRecommendationsByGeometry === 'none') {
        return 'explicitNoSuggestions';
    }
    return 'missingSuggestions';
};
export const matchesTaggingSuggestionsQaFilter = (sign, filter) => {
    if (filter === 'all') {
        return true;
    }
    const category = classifyTaggingSuggestionsQa(sign);
    switch (filter) {
        case 'with':
            return category === 'withSuggestions';
        case 'missing':
            return category === 'missingSuggestions';
        case 'explicit_none':
            return category === 'explicitNoSuggestions';
        default:
            return true;
    }
};
export const filterSignsByTaggingSuggestionsQa = (signs, filter) => signs.filter((sign) => matchesTaggingSuggestionsQaFilter(sign, filter));
export const countSignsByTaggingSuggestionsQa = (signs) => {
    const counts = {
        all: signs.length,
        with: 0,
        missing: 0,
        explicit_none: 0,
    };
    for (const sign of signs) {
        const category = classifyTaggingSuggestionsQa(sign);
        if (category === 'withSuggestions') {
            counts.with++;
        }
        else if (category === 'missingSuggestions') {
            counts.missing++;
        }
        else {
            counts.explicit_none++;
        }
    }
    return counts;
};
//# sourceMappingURL=taggingSuggestionsQa.js.map