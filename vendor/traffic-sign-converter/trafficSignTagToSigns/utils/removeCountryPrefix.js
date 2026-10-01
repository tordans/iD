/**
 * @param `input` – For example "DE:123", "DE:123[4.4]", "123-45", "DE:123,123-45;DE:567"
 * @param `countryPrefix` – For example "DE", see `countryPrefixes`
 */
export const removeCountryPrefix = (input, countryPrefix) => {
    return (input
        .replaceAll(`${countryPrefix}:`, '')
        // Just in case we also replace the lower case version
        .replaceAll(`${countryPrefix.toLocaleLowerCase()}:`, ''));
};
/**
 * @param `input` – For example `["DE:111","1212-12","DE:222"]`
 * @param `countryPrefix` – For example "DE", see `countryPrefixes`
 */
export const removeCountryPrefixes = (input, countryPrefix) => {
    return input.map((i) => removeCountryPrefix(i, countryPrefix));
};
//# sourceMappingURL=removeCountryPrefix.js.map