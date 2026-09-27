import { createSvgImportname } from './createSvgImportname.js';
/** @description Optimize name to be used as JS import/export names and filename. */
export const createSvgFilename = (countryPrefix, input) => {
    return `${createSvgImportname(countryPrefix, input)}.svg`;
};
//# sourceMappingURL=createSvgFilename.js.map