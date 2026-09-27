/** @description Optimize name to be used as JS import/export names and filename. */
export const createSvgImportname = (countryPrefix, input) => {
    const string = typeof input === 'string' ? input : input.osmValuePart;
    const withDoubleUnderscores = string.replace(/\[/g, '__').replace(/\]/g, '__');
    const validIdentifier = withDoubleUnderscores.replace(/[^a-zA-Z0-9_]/g, '_');
    return `${countryPrefix}_${validIdentifier}`;
};
//# sourceMappingURL=createSvgImportname.js.map