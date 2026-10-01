import { catalogueMetaAT } from './AT/catalogueMetaAT.js';
import { catalogueMetaAU } from './AU/catalogueMetaAU.js';
import { catalogueMetaBE } from './BE/catalogueMetaBE.js';
import { catalogueMetaBR } from './BR/catalogueMetaBR.js';
import { catalogueMetaCA } from './CA/catalogueMetaCA.js';
import { catalogueMetaDE } from './DE/catalogueMetaDE.js';
import { catalogueMetaFR } from './FR/catalogueMetaFR.js';
import { catalogueMetaPL } from './PL/catalogueMetaPL.js';
export const countryCatalogueMeta = {
    DE: catalogueMetaDE,
    BE: catalogueMetaBE,
    AT: catalogueMetaAT,
    CA: catalogueMetaCA,
    PL: catalogueMetaPL,
    FR: catalogueMetaFR,
    AU: catalogueMetaAU,
    BR: catalogueMetaBR,
};
export const getCountryCatalogueMeta = (countryPrefix) => countryCatalogueMeta[countryPrefix];
export const getCatalogueIconicSignOsmValuePart = (countryPrefix) => getCountryCatalogueMeta(countryPrefix).iconicSignOsmValuePart;
export const getCatalogueDisplayName = (countryPrefix) => getCountryCatalogueMeta(countryPrefix).catalogueName;
export const getCatalogueMaturity = (countryPrefix) => getCountryCatalogueMeta(countryPrefix).maturity;
export const hasQaCapability = (countryPrefix, capability) => getCountryCatalogueMeta(countryPrefix).qaCapabilities[capability];
//# sourceMappingURL=countryCatalogueMeta.js.map