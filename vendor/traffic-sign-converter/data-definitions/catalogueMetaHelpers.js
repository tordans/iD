import { betaQaCapabilities } from '../referenceLinks/types.js';
export const createBetaCatalogueMeta = (input) => ({
    countryPrefix: input.countryPrefix,
    iconicSignOsmValuePart: input.iconicSignOsmValuePart,
    catalogueName: input.catalogueName,
    maturity: 'alpha',
    osmTrafficSignPrefix: input.osmTrafficSignPrefix ?? input.countryPrefix,
    catalogueLocale: input.catalogueLocale,
    defaultCommentLang: input.defaultCommentLang,
    osmWikiOverviewUrl: input.osmWikiOverviewUrl,
    referenceLinks: input.referenceLinks,
    qaCapabilities: betaQaCapabilities,
});
//# sourceMappingURL=catalogueMetaHelpers.js.map