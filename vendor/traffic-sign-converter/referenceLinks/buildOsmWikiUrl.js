const wikiBaseUrl = 'https://wiki.openstreetmap.org/wiki';
export const buildOsmWikiKeyUrl = (countryPrefix, osmKey) => `${wikiBaseUrl}/${countryPrefix}:Key:${osmKey}`;
export const buildOsmWikiTagUrl = (countryPrefix, osmKey, osmValue) => `${wikiBaseUrl}/${countryPrefix}:Tag:${osmKey}=${osmValue}`;
//# sourceMappingURL=buildOsmWikiUrl.js.map