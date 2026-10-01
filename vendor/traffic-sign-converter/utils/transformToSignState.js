import { normalizeSignImage } from '../signImage.js';
import { createSvgImportname } from './createSvgImportname.js';
export const transformToSignState = (countryPrefix, sign) => {
    const { image, ...rest } = sign;
    return {
        ...rest,
        image: normalizeSignImage(image),
        recodgnizedSign: true,
        svgName: createSvgImportname(countryPrefix, sign.osmValuePart),
    };
};
//# sourceMappingURL=transformToSignState.js.map