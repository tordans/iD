import { countryDefinitions, } from '../data-definitions/countryDefinitions.js';
export const tagsToSigns = (countryPrefix, osmTags) => {
    const signCandidates = [];
    for (const sign of countryDefinitions[countryPrefix]) {
        const identifyingTags = sign.identifyingTags?.map((tag) => `${tag.key}=${tag.value}`) || [];
        if (osmTags.every((tag) => identifyingTags.includes(tag))) {
            signCandidates.push(sign);
        }
    }
    return signCandidates;
};
//# sourceMappingURL=tagsToSigns.js.map