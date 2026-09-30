# Vendored builds

Built files of packages that are not on npm yet, so the app also builds on Netlify.

| Folder | Source | Refresh |
|---|---|---|
| `traffic-sign-field/` | `@osm-traffic-signs/id-field` from `~/Development/OSM/osm-traffic-sign-tools-id-field/packages/traffic-sign-id-field/dist` | `npm run vendor:traffic-signs` |
| `traffic-sign-converter/` | `@osm-traffic-signs/converter` from the same repo, `packages/traffic-sign-converter/dist` (needs `id-field-browser.js` and `data/`, which the npm release 0.6.0 does not have) | `npm run vendor:traffic-signs` |
| `surface-smoothness-field/` | `@osm-editor-kit/surface-smoothness-id-field` (`index.js` with d3 and the catalogue bundled in, `surface-smoothness-field.css`) and the photos of `@osm-editor-kit/surface-smoothness-data` (`images/`, from StreetComplete with their own licenses, see the catalogue's `attribution`), from `~/Development/OSM/osm-surface-smoothness-workspace/osm-surface-smoothness-tagging` (branch `image-first-ui`: the photo-first UI; npm 0.0.0 has the older UI) | `npm run vendor:surface-smoothness` (build the packages there first) |

`npm run dist` copies them to `dist/`. Switch back to npm dependencies once both packages are published with these files.
