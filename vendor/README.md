# Vendored builds

Built files of packages that are not on npm yet, so the app also builds on Netlify.

| Folder | Source | Refresh |
|---|---|---|
| `traffic-sign-field/` | `@osm-traffic-signs/id-field` from `~/Development/OSM/osm-traffic-sign-tools-id-field/packages/traffic-sign-id-field/dist` | `npm run vendor:traffic-signs` |
| `traffic-sign-converter/` | `@osm-traffic-signs/converter` from the same repo, `packages/traffic-sign-converter/dist` (needs `id-field-browser.js` and `data/`, which the npm release 0.6.0 does not have) | `npm run vendor:traffic-signs` |

`npm run dist` copies them to `dist/`. Switch back to npm dependencies once both packages are published with these files.
