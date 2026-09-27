import { splitIntoSignGroups } from './utils/splitIntoSignGroups.js';
export const showSignsToTagsWarning = (signs) => {
    const signGroups = splitIntoSignGroups(signs);
    return signGroups.some((group) => group.filter((s) => s.kind !== 'traffic_sign').length > 1);
};
//# sourceMappingURL=showSignsToTagsWarning.js.map