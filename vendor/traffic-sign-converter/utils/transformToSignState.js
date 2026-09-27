import { createSvgImportname } from './createSvgImportname.js';
export const transformToSignState = (countryPrefix, sign) => {
    return {
        ...sign,
        recodgnizedSign: true,
        svgName: createSvgImportname(countryPrefix, sign.osmValuePart),
    };
};
//# sourceMappingURL=transformToSignState.js.map