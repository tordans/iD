import { getRecommendations } from './utils/getRecommendations.js';
export const signsToComments = (signs, geometry) => {
    const signCommentsMap = new Map();
    for (const sign of signs) {
        if (sign.recodgnizedSign === false)
            continue;
        const recommendations = getRecommendations(sign, geometry);
        if (recommendations?.comments?.length) {
            signCommentsMap.set(sign.osmValuePart, recommendations.comments);
        }
    }
    return signCommentsMap;
};
//# sourceMappingURL=signsToComments.js.map