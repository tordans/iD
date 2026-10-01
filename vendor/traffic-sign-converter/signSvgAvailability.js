import { SvgLoadersAT, SvgLoadersAU, SvgLoadersBE, SvgLoadersBR, SvgLoadersCA, SvgLoadersDE, SvgLoadersFR, SvgLoadersPL, } from './data-svgs/index.js';
import { isSignImageMissing } from './signImage.js';
import { createSvgImportname } from './utils/createSvgImportname.js';
const svgLoaderMaps = {
    AT: SvgLoadersAT,
    AU: SvgLoadersAU,
    BE: SvgLoadersBE,
    BR: SvgLoadersBR,
    CA: SvgLoadersCA,
    DE: SvgLoadersDE,
    FR: SvgLoadersFR,
    PL: SvgLoadersPL,
};
/** Wiki SVG file is known absent (`image: 'missing'` in catalogue). */
export const isSignSvgMissing = (sign) => 'image' in sign && isSignImageMissing(sign.image);
export const hasBundledSvg = (countryPrefix, signOrOsmValuePart) => {
    const osmValuePart = typeof signOrOsmValuePart === 'string' ? signOrOsmValuePart : signOrOsmValuePart.osmValuePart;
    const svgName = createSvgImportname(countryPrefix, osmValuePart);
    return svgName in svgLoaderMaps[countryPrefix];
};
/** No bundled SVG in the tool (missing loader), regardless of wiki flag. */
export const isSignSvgUnavailable = (countryPrefix, sign) => isSignSvgMissing(sign) || !hasBundledSvg(countryPrefix, sign);
//# sourceMappingURL=signSvgAvailability.js.map