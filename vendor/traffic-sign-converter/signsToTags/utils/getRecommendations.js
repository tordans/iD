export function getRecommendations(sign, geometry) {
    if (sign.tagRecommendationsByGeometry === 'none') {
        return undefined;
    }
    return sign.tagRecommendationsByGeometry.find((recommendation) => recommendation.geometries.includes(geometry));
}
//# sourceMappingURL=getRecommendations.js.map