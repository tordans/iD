import { signHasHighwayQuestion } from './collectQuestionTags.js';
import { getRecommendations } from './getRecommendations.js';
import { uniqueArray } from './uniqueArray.js';
export const collectHighwayValues = (signs, geometry) => {
    if (!Array.isArray(signs))
        return [];
    const all = [];
    for (const sign of signs) {
        if (!sign.recodgnizedSign)
            continue;
        if (signHasHighwayQuestion(sign))
            continue;
        const recs = getRecommendations(sign, geometry);
        if (recs?.highwayValues) {
            all.push(...recs.highwayValues);
        }
    }
    const deduplicated = uniqueArray(all);
    return deduplicated;
};
//# sourceMappingURL=collectHighwayValues.js.map