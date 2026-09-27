export const signsToApplicability = (signs, geometry) => {
    const applicable = [];
    const notApplicable = [];
    for (const sign of signs) {
        if (!sign.recodgnizedSign) {
            notApplicable.push(sign);
            continue;
        }
        if (sign.tagRecommendationsByGeometry === 'none') {
            notApplicable.push(sign);
            continue;
        }
        const hasGeometry = sign.tagRecommendationsByGeometry.some((recommendation) => recommendation.geometries.includes(geometry));
        if (hasGeometry) {
            applicable.push(sign);
        }
        else {
            notApplicable.push(sign);
        }
    }
    return { applicable, notApplicable };
};
//# sourceMappingURL=signsToApplicability.js.map