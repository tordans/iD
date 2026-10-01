import { generalRedirects } from '../data-definitions/generalRedirects.js';
/**
 * Builds a redirect map from sign definitions, including general redirects.
 */
export const buildRedirectMap = (signs) => {
    const redirectMap = new Map();
    // Add sign-specific redirects
    for (const sign of signs) {
        if (sign.redirects) {
            for (const redirect of sign.redirects) {
                redirectMap.set(redirect.from, redirect.to);
            }
        }
    }
    // Add general redirects
    for (const redirect of generalRedirects) {
        redirectMap.set(redirect.from, redirect.to);
    }
    return redirectMap;
};
//# sourceMappingURL=buildRedirectMap.js.map