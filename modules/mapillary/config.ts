/**
 * Project configuration of the Mapillary layer (WORKDOC feature 18), set before `context.init()`:
 *
 *     iD.mapillaryConfig({ highlightUsers: ['radinfra'], highlightOrgs: ['fixmycity'] });
 *
 * URL parameters (`photo_dates`, `photo_highlight_users`, `photo_highlight_orgs`) win over this.
 */

export type MapillaryConfig = {
    /** Default "from" date of the age filter (`YYYY-MM-DD`), used when the URL has no `photo_dates`; `null` for no default */
    defaultFromDate: string | null;
    /** Usernames whose images are highlighted */
    highlightUsers: string[];
    /** Organization slugs whose images are highlighted */
    highlightOrgs: string[];
};

let _config: MapillaryConfig = {
    defaultFromDate: '2024-01-01',
    highlightUsers: [],
    highlightOrgs: []
};


/** Get the config, or merge in changes */
export function mapillaryConfig(changes?: Partial<MapillaryConfig>): MapillaryConfig {
    if (changes) _config = { ..._config, ...changes };
    return _config;
}


/** Comma or semicolon separated list, trimmed, without empty parts and duplicates */
export function parseList(value: string | null | undefined): string[] {
    if (!value) return [];
    const parts = value.replace(/;/g, ',').split(',').map(part => part.trim()).filter(Boolean);
    return [...new Set(parts)];
}


/** A URL value wins over the configured list; an absent URL value falls back to the config */
export function effectiveList(urlValue: string | null | undefined, configured: string[]): string[] {
    const fromUrl = parseList(urlValue);
    return fromUrl.length ? fromUrl : configured;
}
