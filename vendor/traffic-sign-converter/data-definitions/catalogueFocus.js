export const focusLevel = (sign, view) => {
    const f = sign.catalogue.focus;
    if (f === undefined)
        return view === 'default' ? true : undefined;
    return f[view];
};
export const isInCatalogueView = (sign, view) => focusLevel(sign, view) !== undefined;
export const isHighlightedInView = (sign, view) => focusLevel(sign, view) === 'highlight';
export const isAlleOnlySign = (sign) => sign.catalogue.focus?.all === true;
export const isAllFocus = (focuses) => focuses.includes('all');
export const isDefaultFocus = (focuses) => focuses.length === 0 || (focuses.length === 1 && focuses[0] === 'default');
export const thematicFocuses = (focuses) => focuses.filter((f) => f !== 'default' && f !== 'all');
/** Active view for highlight strip; null on Alle. */
export const activeCatalogueFocusView = (focuses) => {
    if (isAllFocus(focuses))
        return null;
    if (isDefaultFocus(focuses))
        return 'default';
    return thematicFocuses(focuses)[0] ?? null;
};
export const matchesFocusFilter = (sign, focuses) => {
    if (isAllFocus(focuses))
        return true;
    if (isAlleOnlySign(sign))
        return false;
    if (isDefaultFocus(focuses))
        return isInCatalogueView(sign, 'default');
    return thematicFocuses(focuses).some((t) => isInCatalogueView(sign, t));
};
export const filterSignsByFocus = (signs, focuses) => signs.filter((sign) => matchesFocusFilter(sign, focuses));
//# sourceMappingURL=catalogueFocus.js.map