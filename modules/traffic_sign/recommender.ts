import { importableAssetUrl } from './asset_url';
import type { Recommend, SignTags } from './sign_tag_plan';

type RecommenderModule = {
    trafficSignTagToSigns: (value: string, countryPrefix: string) => unknown[];
    signsToTags: (signs: unknown[], countryPrefix: string, geometry: string) => Map<string, string | string[]>;
};

export type SignDescription = { value: string; name: string; svgName: string | null; known: boolean };
export type DescribeSigns = (trafficSignValue: string) => SignDescription[];

let _promise: Promise<Recommend> | null = null;
let _loaded: Recommend | undefined;
let _describe: DescribeSigns | undefined;
let _failed = false;


/**
 * Loads `dist/traffic-sign-converter/recommender.js` once (see `scripts/traffic_sign_recommender_entry.js`)
 * and returns a function from a `traffic_sign` value to the tags the sign implies for a way.
 * Only German signs (`DE:`) for now, like the rest of this editor.
 */
export function loadSignRecommender(context: iD.Context): Promise<Recommend> {
    if (_promise) return _promise;

    _promise = (import(importableAssetUrl(context, 'traffic-sign-converter/recommender.js')) as Promise<RecommenderModule>)
        .then(module => {
            _loaded = (value: string): SignTags => {
                const signs = module.trafficSignTagToSigns(value, 'DE');
                return Object.fromEntries(module.signsToTags(signs, 'DE', 'way'));
            };
            _describe = (value: string) => (module.trafficSignTagToSigns(value, 'DE') as {
                osmValuePart: string; descriptiveName: string; svgName: string | null; recodgnizedSign: boolean;
            }[]).map(sign => ({ value: sign.osmValuePart, name: sign.descriptiveName, svgName: sign.svgName, known: sign.recodgnizedSign }));
            return _loaded;
        })
        .catch((err: unknown) => {
            _promise = null;
            _failed = true;
            throw err;
        });

    return _promise;
}


/**
 * The recommender if it has loaded already, for synchronous code (edit menu operations).
 * `undefined` while loading, `null` when loading failed (work without sign recommendations).
 */
export function loadedSignRecommender(): Recommend | undefined | null {
    if (_loaded) return _loaded;
    return _failed ? null : undefined;
}


/** Names and icons of the signs of a value (WORKDOC feature 26), once the bundle has loaded */
export function loadedSignDescriber(): DescribeSigns | undefined {
    return _describe;
}
