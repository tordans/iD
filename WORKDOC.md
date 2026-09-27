# Radnetz Berlin editor — WORKDOC

A project-specific iD build that combines several features into one editor for the Radnetz Berlin project.
This file holds the plan and progress. Update it whenever something changes.

## Goals

1. **Primary:** build a great, complete editor for this project, here in this worktree.
2. **Secondary:** later, extract single features into separate branches/contributions.

We do not let goal 2 slow down goal 1. Features are merged or built directly on `radnetz-berlin`.
Keep features reasonably separated (own files, own commits, clear commit messages) where it's cheap, so they can be extracted later.

## Ground rules

- We only work on **`tordans/iD`** (`origin`). With `gh`, always pass `--repo tordans/iD`.
- `openstreetmap/iD` (`upstream`) is read-only for us: only fetch from it. Its push URL is set to `NO_PUSH_to_openstreetmap_iD`.
- All feature work happens on the `radnetz-berlin` branch unless noted.

## Setup

| What | Value |
|---|---|
| Worktree | `~/Development/OSM/iD--radnetz-berlin` |
| Branch | `radnetz-berlin` → `origin/radnetz-berlin` (tordans/iD) |
| Base | `upstream/develop` @ `d9879e101` (2026-09-27) |
| Main checkout | `~/Development/OSM/iD` (`develop`) |

Updating the base: `git -C ~/Development/OSM/iD pull --ff-only upstream develop`, then merge `develop` into `radnetz-berlin`.

## Features

Status: ⬜ not started · 🟨 in progress · ✅ integrated

### 1. Multiple custom backgrounds — ✅

- Source: branch `multiple-custom-backgrounds` (worktree `~/Development/OSM/iD--backgrounds`, 23 commits, on origin).
- Redo of openstreetmap/iD#11850 for #8874. Stable synthetic id plus a single `addOrGetCustomSource` path.
- Manual browser tests still TODO.

### 2. Traffic signs — ✅

- Source: branch **`traffic-sign-field-integration`** (worktree `~/Development/OSM/iD-traffic-sign-field`, 1 commit, 2026-06-06).
  - Adds a lazy-loaded `traffic_sign` field in the inspector (`modules/ui/fields/traffic_sign.js`, `modules/presets/traffic_sign_fields.js`, `modules/ui/sections/traffic_sign_inspector_fields.js`, build step in `scripts/build_data.js`).
  - Uses the `@osm-traffic-signs/id-field` package from `~/Development/OSM/osm-traffic-sign-tools-id-field` (also WIP, last commit "WIP").
  - The worktree has **uncommitted changes** (`data/core.yaml`, `data/traffic_sign_field_locales.yaml`, `package.json`, `scripts/server.js`, …). Review them before taking the branch over.
- Decision (2026-09-27): use this branch. The old `traffic-signs` branch (2025-02) was an early prototype (combo field with 3rd-party icons, openstreetmap/iD#10254) and is superseded.
- Expect a UI rework after integration.

### 3. Favorites and shortcuts — ✅

- Source: branch **`pr/11269-favorites-shortcuts`** on tordans/iD (2 commits).
  - `632e57d85`: kaligrafy's original commit, rebased onto 2026 develop.
  - `d310bac74`: Tobias's UI rework (favorites, numbered shortcuts, selectable in preset lists, settings UI; `preset_shortcuts.js` → `preset_favorites.ts`).
- The original PR openstreetmap/iD#11269 has not changed since Aug 2025; the tordans branch is the newer version.
- **Needed rework: shortcut assignment.**
  - Today: every favorite gets a number shortcut automatically from its position, and numbers shift when favorites are reordered.
  - Wanted:
    - A new favorite gets a free number automatically, **preferring left-hand keys** (e.g. 1–5 before 6–0).
    - Once assigned, the number is **fixed**. Reordering or removing other favorites does not change it.
    - Users change numbers in the **preferences panel**. Conflicts (two favorites with one number) are handled there.
  - Shortcuts stay **number-only** (no alphanumeric like `8a`).
- Related, low priority: kaligrafy/iD branches `feat/preset-shortcut-from-selection`, `feat/preset-shortcuts-batch`, `feat/clone-shortcuts` (based on kaligrafy's `v5`/`v6`, not on develop).

### 4. Custom data layers: multiple, from URLs, PMTiles — ✅

- Built directly on `radnetz-berlin`; extract into its own branch later if needed.
- Goal: iD has a single custom data layer (GeoJSON/GPX/KML via upload or URL). We want:
  - **multiple** custom data layers,
  - loaded from **external URLs** (no upload needed),
  - **PMTiles** (vector tiles) support, so we only load the part of the map being edited,
  - the same UI pattern as multiple custom backgrounds (feature 1), but in the Map data pane.
- Fallback: if PMTiles is too hard, start with GeoJSON from URL. GeoJSON can get large, and we only edit parts of the map.
- Test data (same data in two formats):
  - `https://tilda-geo.de/api/uploads/radverkehrsnetz-vorrangnetz-mask.pmtiles`
  - `https://tilda-geo.de/api/uploads/radverkehrsnetz-vorrangnetz-mask.geojson`
  - `https://tilda-geo.de/api/uploads/radverkehrsnetz.pmtiles`
  - `https://tilda-geo.de/api/uploads/radverkehrsnetz.geojson`
  - The real project file will be similar.
- Reference: Rapid (`~/Development/OSM/Rapid`) already supports PMTiles:
  - `modules/services/VectorTileService.js`: MVT/PMTiles fetching and parsing
  - `modules/pixi/PixiLayerCustomData.js`: custom data layer rendering
  - `modules/ui/settings/custom_data.js`: custom data URL dialog
  - `modules/ui/sections/data_layers.js`: data layers pane
  - `modules/util/fetch_response.js`
- Plan sketch:
  1. Read Rapid's VectorTileService for PMTiles handling (`pmtiles` lib, header/directory reads).
  2. Map it onto iD's `modules/svg/data.js` (d3/SVG, not Pixi) and `modules/ui/sections/data_layers.js`.
  3. Reuse the storage/id model from multiple custom backgrounds.

### 5. Map style "lenses" — 🟨

- Idea: a lens is a CSS file that restyles the OSM data on the map for one mapping theme or for QA (issue openstreetmap/iD#11189).
- Source A: kaligrafy's PR openstreetmap/iD#12473 "Add Lens support" (branch `kaligrafy/iD:feat/theme-css-upstream`, 5 commits, Jun 2026):
  - Lens section in the Map data pane. Built-in default lens or an imported `.css` file, kept in localStorage.
  - Lens CSS is injected unlayered and core CSS is wrapped in `@layer ideditor`, so a lens overrides core styles without `!important`.
  - `svgTagClasses` emits `tag-{key}[-{value}]` classes only for keys that the lens CSS uses.
  - Imported CSS is sanitized (`@import`/`url()` removed) and a warning is shown.
- Source B: **kaligrafy/iD `v6` branch** (last change 2026-09-22), further along than the PR:
  - lens keyboard shortcuts (Alt+letter) plus a UI to assign them (`modules/behavior/lens_shortcuts.js`),
  - bundled lenses built at build time (`config/bundled_lenses.js`, `scripts/build_bundled_lenses.js`, `lenses/*.css`: maxspeed, Québec, …),
  - more `tag_classes` support (maxspeed, flat counts, highway error classes).
  - `v6` has 195 commits of mostly Québec-specific work, so don't merge the branch. Cherry-pick the lens commits:
    `b50a25d67`, `484e80ecf`, `4d4c0047d` (shortcuts), `dfadc0451` (maxspeed tag classes), `46bb85bdc` (bundling), and parts of `1c5a20e12` / `1d1f563f9`.
- Plan: take Source A as the base, add the Source B commits, then write our own Radnetz Berlin lens CSS.
- Done (2026-09-27): merged Source A. Cherry-picked the v6 shortcut commits `b50a25d67`, `484e80ecf`, `4d4c0047d` (Alt+letter, shortcut UI). `lens_shortcuts` converted to TS, strings moved to `data/core.yaml` (v6 uses its own `data/locales/custom/*.json`).
- Not taken yet: maxspeed tag classes (`dfadc0451`) and build-time bundling (`46bb85bdc`, `1c5a20e12`, `1d1f563f9`). They are mixed with Québec lens files. Build our own bundling once we have a Radnetz Berlin lens.
- Note: the lens only overrides core styles when `dist/iD.css` is wrapped in `@layer ideditor` (done by `scripts/build_css.js`). Restart the dev server after pulling changes to `build_css.js`.
- TODO: write the Radnetz Berlin lens CSS.
- Fetch without adding a remote: `git fetch https://github.com/kaligrafy/iD.git feat/theme-css-upstream:kg-lens v6:kg-v6`.

### 6. Way-as-table comparison — ⬜

- Renders a chain of connected ways as a table so you can compare the tags of the current way with the previous and following ones.

**Wanted UI**

- **Panel**
  - A panel that by default spans the full width, is docked at the bottom and takes about 2/3 of the editor height.
  - Users can resize and move it. Size and position are stored in local preferences (`prefs`).
  - iD's existing info panels (`modules/ui/info.js`, Cmd+I) are small fixed boxes, so this needs a new panel component.
- **Content:** columns for the selected way, the previous way(s) and the next way(s). Rows are all tags that appear on any of these ways.
- **Navigation**
  - Previous/next buttons select the neighbour way and move the table along the chain.
  - Hovering a button (or a column) highlights that way on the map, so you can see what you are about to select. Use iD's hover behavior (`utilHighlightEntities` / hover classes).
- **Tag highlight:** tags that belong to the selected way's preset (its fields plus `moreFields`) get a subtle highlight, so important tags stand out from the rest.
- **Editing**
  - v1: read-only, if that is easier.
  - v2: raw tag editing like the "Tags" section (text or list), no field widgets.

**Open design points**

- **Junctions:** when more than two ways meet at an end node, which one is "next"?
  - Default: best match (same `highway`/`name`, continuing direction).
  - If the match is ambiguous, show a small chooser.
- **Direction:** order columns along the selected way's direction. Mark neighbours that point the opposite way.
- **Chain length:** how many neighbours per side (the core package defaults to 5, with "load more")?

**Existing code to reuse**

- `~/Development/OSM/osm-way-as-table-ui` (monorepo; issue link in `NOTE.md`):
  - `packages/core/src/traversal/`: `buildChain`, `neighborMatch` (incl. `JunctionChoice`), `direction`, with tests.
    - Framework-free, reusable in iD through an adapter.
  - `packages/core/src/ui/`: `TableView`, `TagRow`, `Cell`.
    - This is **React**. iD uses d3, so use it as the design reference and port it to d3.
  - `packages/id-plugin`: only a stub (`mount()`, `createIdAdapter(context)`). The adapter needs `getWay` / `getWaysForNode`, which map to `context.graph()` / `graph.parentWays(node)`.
- `~/Development/OSM/parking-lanes`: the app where this table is used today. Use it as the UX reference.

## Integration order (proposal)

1. Multiple custom backgrounds (most mature)
2. Favorites and shortcuts, then the shortcut-assignment rework
3. Traffic signs
4. Custom data layers (builds on 1's UI pattern)
5. Lenses
6. Way-as-table

## Coding conventions (this branch)

- New code is TypeScript with `const`/`let`. Old upstream files stay JS; change them as little as possible and put new logic in new TS modules (e.g. `modules/ui/favorite_button.ts` is called from upstream's `feature_type.js`).
- Follow the modern TS files upstream uses: `modules/ui/sections/map_style_options.ts`, `modules/ui/fields/check.ts`, `modules/svg/mapillary_signs.ts`.
  - Global types `iD.Context`, `d3.Selection<T>`, `Tags`, `TagsMulti` from `modules/globals.d.ts`.
  - Sections: `(uiSection(id, context) as any).label(…).disclosureContent(…)`; tooltips: `(uiTooltip() as any).title(…)`.
  - d3 events: `.on('click', (d3_event, d) => …)`; namespaced listeners `store.on('change.someName', …)`; typed joins `selectAll<HTMLLIElement, Datum>(…)`.
  - Small stores are singletons with a d3 `dispatch('change')` and `utilRebind(obj, dispatch, 'on')`, persisted with `prefs()` (see `modules/core/preset_favorites.ts`, `modules/renderer/custom_data_layers.ts`).
- New CSS goes into its own file (e.g. `css/85_custom_data_layers.css`).
- Checks: `npx tsc`, `npx eslint modules test/spec`, `npx vitest run`, `npm run build:data`.

## Dev notes

- Dev server: `npm start` (port 8080, or `PORT=… npm start`). The CSS watcher only knows files that existed at startup; run `npm run build:css` after adding a CSS file.
- A fresh worktree needs the SVG sprites: `npx run-p "dist:svg:*"`, and the traffic sign assets: `npx run-p dist:traffic-sign-field dist:traffic-sign-converter`.
- The traffic sign packages are local `file:` dependencies on `~/Development/OSM/osm-traffic-sign-tools-id-field` (WIP, unpublished). A deployed build needs them published or vendored.
- `npm run build:data` merges `data/traffic_sign_field_locales.yaml` into the committed `dist/locales/de*.min.json`.
- New UI strings exist only in English (`data/core.yaml`). With a German browser they show as "Missing translation". Use `&locale=en` or add German strings to a fork locale file like `data/traffic_sign_field_locales.yaml`.

## Progress log

- 2026-09-27: `develop` updated from upstream. Created worktree and branch `radnetz-berlin` on tordans/iD. Took stock of the feature sources. Decided on the traffic-sign source branch.
- 2026-09-27: Merged multiple custom backgrounds. Merged favorites and reworked the shortcuts (fixed numbers, left-hand first, swap on conflict, number input in preferences). Merged the traffic sign field (converted to TS). Added PMTiles support and multiple custom data layers. All checked in the browser with the test URLs.

## Open questions

- How to bring features in: merge the source branches (easy to re-sync) or cherry-pick (cleaner history)? Default: merge.
- Where will the build be deployed for project users?
