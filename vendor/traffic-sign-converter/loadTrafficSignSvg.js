import { createSvgImportname } from './utils/createSvgImportname.js';
const countrySvgLoaderCache = new Map();
const countrySvgLoaderImports = {
    DE: () => import('@osm-traffic-signs/converter/data-svgs/DE/loaders').then((module) => ({
        default: module.SvgLoadersDE,
    })),
    BE: () => import('@osm-traffic-signs/converter/data-svgs/BE/loaders').then((module) => ({
        default: module.SvgLoadersBE,
    })),
    AT: () => import('@osm-traffic-signs/converter/data-svgs/AT/loaders').then((module) => ({
        default: module.SvgLoadersAT,
    })),
    CA: () => import('@osm-traffic-signs/converter/data-svgs/CA/loaders').then((module) => ({
        default: module.SvgLoadersCA,
    })),
    PL: () => import('@osm-traffic-signs/converter/data-svgs/PL/loaders').then((module) => ({
        default: module.SvgLoadersPL,
    })),
    FR: () => import('@osm-traffic-signs/converter/data-svgs/FR/loaders').then((module) => ({
        default: module.SvgLoadersFR,
    })),
    AU: () => import('@osm-traffic-signs/converter/data-svgs/AU/loaders').then((module) => ({
        default: module.SvgLoadersAU,
    })),
    BR: () => import('@osm-traffic-signs/converter/data-svgs/BR/loaders').then((module) => ({
        default: module.SvgLoadersBR,
    })),
};
const loadCountrySvgLoaders = (countryPrefix) => {
    const activeLoad = countrySvgLoaderCache.get(countryPrefix);
    if (activeLoad)
        return activeLoad;
    const importLoader = countrySvgLoaderImports[countryPrefix];
    const loadPromise = importLoader().then((module) => module.default);
    countrySvgLoaderCache.set(countryPrefix, loadPromise);
    return loadPromise;
};
const loadedSvgCache = new Map();
const loadingSvgCache = new Map();
export const loadTrafficSignSvg = async (countryPrefix, signOrOsmValuePart) => {
    const osmValuePart = typeof signOrOsmValuePart === 'string' ? signOrOsmValuePart : signOrOsmValuePart.osmValuePart;
    const svgName = createSvgImportname(countryPrefix, osmValuePart);
    const cacheKey = `${countryPrefix}:${svgName}`;
    const cachedSvg = loadedSvgCache.get(cacheKey);
    if (cachedSvg)
        return cachedSvg;
    const activeLoad = loadingSvgCache.get(cacheKey);
    if (activeLoad)
        return activeLoad;
    const countryLoaders = await loadCountrySvgLoaders(countryPrefix);
    const loader = countryLoaders?.[svgName];
    if (!loader)
        return undefined;
    const loadPromise = loader()
        .then((module) => {
        loadedSvgCache.set(cacheKey, module.default);
        return module.default;
    })
        .finally(() => {
        loadingSvgCache.delete(cacheKey);
    });
    loadingSvgCache.set(cacheKey, loadPromise);
    return loadPromise;
};
//# sourceMappingURL=loadTrafficSignSvg.js.map