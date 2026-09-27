import { fillTemplate } from './fillTemplate.js';
const isModifierSign = (sign) => sign.kind === 'exception_modifier' || sign.kind === 'condition_modifier';
export const buildSignReferenceLinks = (sign, config) => {
    const isModifier = isModifierSign(sign);
    const hashPrefix = isModifier ? config.hashPrefixes.modifier : config.hashPrefixes.main;
    const textLabel = isModifier
        ? config.wikipediaTextFragmentLabels.modifier
        : config.wikipediaTextFragmentLabels.main;
    const textFragment = encodeURIComponent(`${textLabel} ${sign.signId}`);
    return {
        osmWikiTableUrl: fillTemplate(config.osmWikiTableUrl, { hashPrefix, signId: sign.signId }),
        wikipediaTableUrl: config.wikipediaTableUrl
            ? fillTemplate(config.wikipediaTableUrl, { textFragment })
            : undefined,
    };
};
//# sourceMappingURL=buildSignReferenceLinks.js.map