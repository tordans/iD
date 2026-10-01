import { getRecommendations } from './getRecommendations.js';
import { normalizeOptionalTags } from './normalizeOptionalTags.js';
export const collectOptionalTags = (signs, geometry) => {
    const merged = new Map();
    for (const sign of signs) {
        if (!sign.recodgnizedSign) {
            continue;
        }
        const recs = getRecommendations(sign, geometry);
        const { tags } = normalizeOptionalTags(recs?.optionalTags);
        if (!tags.length) {
            continue;
        }
        for (const tag of tags) {
            merged.set(tag.key, tag);
        }
    }
    return Array.from(merged.values());
};
//# sourceMappingURL=collectOptionalTags.js.map