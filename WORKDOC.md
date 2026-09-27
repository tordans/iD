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

### 6. Way-as-table comparison — ✅ (v1, read-only)

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

**Done (2026-09-27)**

- `modules/way_table/chain.ts`: chain logic ported from `osm-way-as-table-ui` (`buildChain`, `neighborMatch`, `direction`), synchronous on the iD graph. Up to 3 ways per side; `choices` pins ways at ambiguous junctions.
- `modules/way_table/tag_rows.ts`: one row per key, cell status `same`/`changed`/`added`/`removed`/`empty`, preset keys first.
- `modules/ui/way_table_panel.ts`: the panel. Toggle with `K` (`T`/`Y` are the flip operations) or the checkbox in Map Data ▸ Data Layers. Layout stored in `way-table-panel-layout` as fractions of the map area.
- Open: raw tag editing (v2), a "load more" per side, keyboard navigation between ways, better column widths for long values.

**Existing code to reuse**

- `~/Development/OSM/osm-way-as-table-ui` (monorepo; issue link in `NOTE.md`):
  - `packages/core/src/traversal/`: `buildChain`, `neighborMatch` (incl. `JunctionChoice`), `direction`, with tests.
    - Framework-free, reusable in iD through an adapter.
  - `packages/core/src/ui/`: `TableView`, `TagRow`, `Cell`.
    - This is **React**. iD uses d3, so use it as the design reference and port it to d3.
  - `packages/id-plugin`: only a stub (`mount()`, `createIdAdapter(context)`). The adapter needs `getWay` / `getWaysForNode`, which map to `context.graph()` / `graph.parentWays(node)`.
- `~/Development/OSM/parking-lanes`: the app where this table is used today. Use it as the UX reference.

### 7. Side indicator for directional combo fields — ✅

- Source: branch `side-indicator` (4 commits, 2026-05, on origin), merged 2026-09-27.
- Hovering or focusing the left/right row of a directional combo field (e.g. `cycleway:left`/`:right`, `sidewalk:*`) draws blue arrows on that side of the selected way. The label gets a matching arrow. Hidden when the visible part of the way is too curved (`modules/geo/way_viewport_straightness.ts`).
- Merge work: state ported to the TS `context.ts` (`directionalComboIndicator()` / `setDirectionalComboIndicator()`), `directional_combo_arrow` converted to TS, tests updated to current test APIs (`new iD.osmNode`, no `d3` global, vitest matchers).
- The same hover/focus → map indicator pattern is the base for the width indicator (feature 10).

### 8. TILDA bike infrastructure helper — ⬜ (plan)

**Goal:** mappers pick the TILDA bike infrastructure category a way should have. The sidebar then shows which tags are missing or conflicting for that category, and which are required for the Radnetz dataset (width, surface, …).

**Sources**

- `@tilda-geo/bicycle-infrastructure` (npm 0.1.2, source `~/Development/FMC/tilda-geo-schema-spec-and-library-workspace/tilda-schemas/packages/bicycle-infrastructure`). Port of TILDA's LUA bikelane processing, 100% category match against the Berlin export.
  - `processBikelanes(tags)`: 1..N results (`self`, `left`, `right` side) with `category`, `surface`, `oneway`, `separation_*`, `buffer_*`, `marking_*`, `traffic_mode_*`, `width`, …
  - `analyzeCategoryGaps(tags, results)`: for incomplete categories (`*_adjoiningOrIsolated`, `*_advisoryOrExclusive`, `needsClarification`) the missing keys, allowed values and which category each unlocks.
  - `listTargetCategories()` and `planTagsForCategory(tags, target, side)`: `add` / `change` / `conflicts` to reach a target category.
  - Category vocabulary: `schemas/bicycle-infrastructure-category/schema/category.schema.json` (29 values incl. `needsClarification`, `data_no`, `separate_geometry`, `not_expected`).
  - Local WIP: uncommitted changes to `plan-tags-for-category.ts` in that repo. Check before relying on newer behavior.
- Street-space-editor (`~/Development/OSM/street-space-editor` → `parking-lanes`), bicycle mode, already uses this in a UI:
  - `app/src/modes/bicycle/domain/bicycle-edit-helpers.ts`: `findGapResult`, `defaultTargetCategory`, `planForSide`, `applyCategoryPlan`.
  - `app/src/modes/bicycle/domain/bicycle-category-plan.ts`: `MACRO_CATEGORY_SUGGESTIONS` (bicycle road, bus lanes, crossing), which the library planner skips.
  - `app/src/modes/bicycle/domain/bicycle-tag-keys.ts`: the key lists that matter per side.
- Design for a guided "tagging helper": `osm-cycleway-tagging-helper/plans/cycleway-tagging-helper/{plan,canvas}.mdx` in the same workspace. Questions are derived from missing predicates, plus "why not category X" explanations. Reuse its question design.
- TILDA LUA: `~/Development/FMC/tilda-geo/processing/topics/roads_bikelanes/` (bikelanes, roads, paths, todos; see the QA list below).

**Decision: a custom inspector section, not presets.**
Presets match on a fixed tag set and cannot express "category X on the left side of this road". The category comes from many tags, per side, in a fixed rule order. So:

- A new inspector section "TILDA Radinfrastruktur" (TS module, added next to the preset fields like the traffic sign fields) for ways with `highway=*`:
  1. **Current result** per side (`self`/`left`/`right`): category label, short explanation, color chip.
  2. **Target category** select per side (default from `defaultTargetCategory`), grouped: separate paths / on-road lanes / shared / other.
  3. **Tag plan** for the target: rows "add `key=value`", "change `key` a → b", "conflict". Each row has a one-click "apply" button that goes through `actionChangeTags`, plus "apply all". The reason text comes from the library.
  4. **Gaps**: for incomplete categories, the questions from `analyzeCategoryGaps` as buttons (e.g. `is_sidepath` yes/no, `cycleway:right:lane` advisory/exclusive).
  5. **Required attributes checklist** for the Radnetz dataset (from infravelo `inspector/QA.md`, see below): oneway, width (+ source), surface (+ `sett:length` for sett), `surface:colour`, traffic_sign (or `none`); for protected lanes separation / traffic_mode / buffer / marking left+right. Green check / missing, with the field to fill.
- Also a **preset category** "TILDA Radinfrastruktur" with a few presets for the separate-geometry cases (`highway=cycleway` + `is_sidepath`, segregated foot+bike path, shared path, bicycle road) whose fields are the checklist keys. That gives mappers a quick start. Build it as a local preset override (like the traffic sign fields in `modules/presets/traffic_sign_fields.ts`), not in id-tagging-schema.
- Map support: a lens (feature 5) colored by TILDA category, computed live with `processBikelanes` → CSS classes (`tilda-category-*`) via the tag-class hook from the lens work.

**Easy / hard**

- Easy: adding the npm package, the "current category" readout, the checklist, apply buttons (plain tag changes).
- Medium: side handling (`left`/`right` keys vs `self`), macro categories, keeping the section in sync with the raw tag editor.
- Hard: good explanations ("why not X") and question flow; live category coloring on the map for all ways (performance: cache per entity version).

### 9. QA rules — ⬜ (plan)

Rules from TILDA todos (`tilda-geo/processing/topics/roads_bikelanes/bikelanes/bikelane_todo_categories.lua`, `roads/road_todo_categories.lua`), the infravelo QA inspector (`~/Development/FMC/infravelo-radnetz/inspector/src/components/shared/*Style.ts`, `inspector/QA.md`, live: https://infravelo-qa.netlify.app/) and the infravelo validation scripts (`validation/*.py`).

How we implement them: **(V)** iD validation (issues pane, with fixes), **(H)** hint in the TILDA helper section (feature 8), **(L)** lens / map coloring, **(—)** not in the editor.

| Rule | Source | How here |
|---|---|---|
| `needsClarification`: tagging not enough to categorize | TILDA todo `needs_clarification`, infravelo category layer "Führung gar nicht erkannt" | V + H (gap questions) + L |
| `*_adjoiningOrIsolated`: missing `is_sidepath=yes/no` | TILDA `adjoining_or_isolated`, infravelo "Führung ungenau" | V + H |
| `*_advisoryOrExclusive`: missing `cycleway:*:lane=advisory/exclusive` | TILDA `advisory_or_exclusive` | V + H |
| `cycleway=track` too vague | TILDA `needs_clarification_track` | V + H |
| Mixed `cycleway`/`cycleway:both` with `cycleway:SIDE` | TILDA `mixed_cycleway_both` | V (fix: merge into sides) |
| Deprecated `cycleway=shared` | TILDA road todo `deprecated_cycleway_shared` | V (upstream iD may already cover it; check) |
| Missing `segregated=yes/no` on foot+bike ways | TILDA `missing_segregated` | V + H |
| Missing `bicycle=designated` + `foot=designated` for DE:240 | TILDA `missing_access_tag_240` | V (fix adds tags) |
| Missing `bicycle=designated` on bicycle roads | TILDA `missing_access_tag_bicycle_road` | V |
| Footway with bicycle access that should be `highway=path` | TILDA `unexpected_bicycle_access_on_footway` | V (warning, needs survey) |
| `highway=path` that should be `highway=cycleway` (DE:237) | TILDA `unexpected_highway_path` | V |
| Missing traffic sign (`DE:*` or `none`) | TILDA `missing_traffic_sign`, infravelo traffic sign layer | H + L; the traffic sign field (feature 2) helps fill it |
| Malformed traffic sign value | TILDA `malformed_traffic_sign` | V using the traffic sign converter package |
| Bicycle road without `DE:244.1` / vehicle destination sign | TILDA `missing_traffic_sign_244`, `..._vehicle_destination` | V + H |
| Missing `oneway` on bike infrastructure | TILDA `missing_oneway`, infravelo oneway layer | H + L |
| One-way road without `oneway:bicycle` | infravelo `QA.md`, oneway layer | H |
| Missing `width` / missing width source | TILDA `missing_width`, infravelo width layer ("Quellenangabe der Breite fehlt") | H + width tool (feature 10) |
| `surface=sett` without `sett:length` (mosaic / small / large) | infravelo sett layer, `QA.md` | H |
| Missing `surface` | TILDA `missing_surface` | H |
| Missing `surface:colour` where colored paint is expected | infravelo surface colour layer | H + L |
| Protected lanes: `separation`, `traffic_mode`, `buffer`, `marking` left+right | infravelo buffer/marking layer, `QA.md` | H + L |
| Bicycle roads: `marking_left/right`, `buffer_left/right` | infravelo buffer/marking layer | H |
| Road likely missing `cycleway:SIDE=no` | infravelo "cycleway no" layer | H + L |
| One-way pair without `dual_carriageway=yes` | infravelo dual carriageway layer, `validation/analyse_dual_carriageway.py` | V (needs a neighbor lookup: same name, opposite direction) |
| Crossing longer than 100 m | TILDA `crossing_too_long` | V |
| Not edited for ~10 years | TILDA `currentness_too_old`, infravelo age layer | L (color by last edit date) |
| Edited by the project account vs. others since project start | infravelo update source layer | L (needs changeset user; maybe later) |
| Mapillary coverage for way / sign | TILDA `*__mapillary` todos, infravelo Mapillary layer | L (via Mapillary layers already in iD; later) |
| Damage notes via `traffic_sign=*schäden*` + `source:traffic_sign:mapillary` | infravelo `QA.md` "ERGÄNZEN" | H (hint in traffic sign field) |
| `cycleway:note` for explanations | infravelo `QA.md` | H |
| Duplicate include/exclude ids, snapping/aggregation checks, Knotenpunkte ids | infravelo `validation/*.py` | — (processing-side, not editing) |

Notes:
- iD validations live in `modules/validations/*`. New ones go into their own TS files and are registered in `modules/validations/index`.
- Most rules only need the tags of one way plus `processBikelanes`, so they are cheap. Dual carriageway and crossing length need geometry and neighbors.

### 10. Width: map indicator and editing — 🟨 (indicator done, editing open)

**Done (2026-09-27):**
- Hovering or focusing a width input (preset field or raw tag editor row) draws the width as a band on the map with a label. `width`/`est_width`: band around the way. `cycleway:*:width`/`sidewalk:*:width`: band on that side, starting at the road edge (half of `width`, else a default by highway type). The band updates while typing.
- New fields "Bike Lane Width, Left/Right/Both" and "Sidewalk Width, …" appear when that side has a lane/track/sidewalk, or the key is already tagged (id-tagging-schema has no fields for these keys).
- Code: `modules/width/width_tags.ts` (parsing, fallbacks), `modules/width/width_indicator.ts` (state + event delegation, no change to the field code), `modules/svg/width_indicator.ts`, `modules/ui/sections/side_width_fields.ts`, `css/87_width_indicator.css`.
- Open: the right-click "Edit width" tool; the band for a `cycleway` side ignores a sidewalk or parking between road and lane.


**Wanted**

1. When the width field (`width`, `cycleway:*:width`, `est_width`, …) is hovered or focused, the map shows the width as a band around the selected way, like street-space-editor's width mode.
2. A right-click action "Edit width" on ways: drag handles on both sides of the way change the width on the map, and the width field updates.

**Reference:** street-space-editor width mode, `~/Development/OSM/parking-lanes/app/src/modes/width/`:
- `domain/handle-geometry.ts`: handle count by way length (1 / 2 / 3), handle positions, rectangles and hit areas (turf).
- `domain/road-width-from-tags.ts`, `domain/highway-width-fallbacks.ts`: parse `width`/`est_width`, fallback widths by highway type and oneway.
- `map/width-layer-paint.ts`, `map/WidthHandlesLayer.tsx`: band and handle styling (MapLibre; we draw SVG).
- `measure-guide/*`: what to measure per infrastructure type; useful as help text.

**Plan and difficulty**

- Easy: port the width parsing and fallbacks as TS (`modules/width/*`).
- Easy–medium: the indicator. Same pattern as the side indicator (feature 7): the field sets a state on focus/hover, an SVG layer draws a band. Band = the way's line with `stroke-width` = width in meters × pixels per meter at the current zoom (`projection.scale()` and latitude). Needs a hook in the width field (upstream `input`/`roadwidth` field is JS; add a small TS helper and call it from there).
- Medium: `cycleway:left:width` etc. need the band offset to that side (combine with the side indicator's side logic).
- Medium–hard: "Edit width" operation. A new operation in the edit menu (TS, like the operations in `modules/operations/*`) that enters a new mode with SVG drag handles. Dragging changes a preview width; on release, `context.perform(actionChangeTags(…))` with the rounded width (0.1 m) and `source:width` if we want it. The field updates by itself through the normal redraw. Hard parts: pointer handling inside iD's modes (similar to `modeMove`/`modeRotate`), handles on curved ways, undo annotation, touch.
- Open: which keys the tool edits (`width` of the way vs `cycleway:*:width` for lanes on the road), and whether to write `width:source` / `source:width` (infravelo wants a width source).

### 11. Live touched: see what others edit right now — 🟨 (integrated, T10 test open)

- Source: `~/Development/OSM/osm-live-touched` (package `@osm-editor-kit/live-touched` 0.1.0, not on npm yet, so a local `file:` dependency). Start from its `packages/live-touched/README.md` ("iD integration guide") and `docs/concept.md`. Its `WORKPLAN.md` tracks the steps (T10 = the iD test).
- Integrated 2026-09-27:
  - `modules/services/osm.js`: `getAccessToken()` (the backend uses the token only to read user id and name).
  - `modules/live_touched/live_touched.ts`: session wiring. Reports locally modified objects on history `change` (also fires on undo, redo, reset, restore), marks them saved on uploader `resultSuccess` (the changeset has its id there), reports the view on map `move`, sets `.live-touched-*` classes on map `drawn`. Turns back on after reload if enabled and consent is current.
  - `modules/ui/sections/live_touched.ts`: "Live edits nearby" in the Map Data pane: switch with consent dialog on first use, login hint, zoom-in / empty messages, list (select + zoom on click, user link, status, age, hint), privacy link, "Delete my data on the server". Pulsing dot on the Map Data button while others edit in view.
  - `css/88_live_touched.css`: orange `touched`, faded dashed `stale`, violet `saved`, red casing for `parallel`/`outdated`.
  - Strings under `live_touched` in `data/core.yaml` (English only; German texts are in `docs/concept.md`).
- Checked so far: unit/integration test with an in-memory backend and two users (`test/spec/live_touched/live_touched.ts`): alice's iD edit is shared, bob sees it, a parallel edit gets the `parallel` hint and the "others nearby" flag, undo deletes the entry, "delete my data" works. In the browser (logged out): section renders, login hint shows, switch is disabled.
- **T10 (Tobias):** open iD at `http://127.0.0.1:8080` (not `localhost`; only `127.0.0.1:*` is allowed by the backend) in two browser profiles with two OSM accounts, same area at zoom ≥ 15. Turn on "Show and share live edits" in both (consent dialog). Edit in one; the other should list it within ~10 s and show the orange halo. Also check: parallel hint when both edit the same way, "saved" (violet) after an upload, the map halos on lines, areas and points, and "Delete my data on the server".
- Not verified yet: the halo CSS on real map elements (needs real entries), the upload → `saved` path in a real upload.

## Integration order (proposal)

1. Multiple custom backgrounds (most mature)
2. Favorites and shortcuts, then the shortcut-assignment rework
3. Traffic signs
4. Custom data layers (builds on 1's UI pattern)
5. Lenses
6. Way-as-table
7. Side indicator
8. TILDA bike infrastructure helper (after merging all others)
9. QA rules (with 8)
10. Width indicator and editing
11. Live touched (T10 test with two accounts)

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
- 2026-09-27: Width indicator and side width fields. Integrated live touched (feature 11), tested with a fake backend.
- 2026-09-27: Full UI test run of all features (no OSM uploads, test edits discarded). Fixed the way table checkbox state. Merged the side indicator branch. Planned features 8–10.
- 2026-09-27: Merged the lens PR and the v6 lens shortcut commits. Added the way table panel. All six features are in `radnetz-berlin`, checked in the browser.
- 2026-09-27: Merged multiple custom backgrounds. Merged favorites and reworked the shortcuts (fixed numbers, left-hand first, swap on conflict, number input in preferences). Merged the traffic sign field (converted to TS). Added PMTiles support and multiple custom data layers. All checked in the browser with the test URLs.

## Next steps

- Known upstream behavior: leaving (blur) a directional combo row without typing rewrites `cycleway:both=no` to `cycleway=no` (upstream `directional_combo.js` calls `change` on blur and uses the common key when both sides match). Equivalent for TILDA, but an unexpected edit. Consider not writing on blur when nothing changed.
- Known issue: deleting the active custom background switches to "None" instead of the previous background (from the backgrounds branch).
- Features 8–10 (plans above).
- T10: two-account test of live touched (feature 11).
- Write the Radnetz Berlin lens CSS, then add build-time bundling for it (see feature 5).
- German strings for the new UI (favorites, custom data layers, lenses, way table).
- Way table v2: raw tag editing.
- Decide whether iD's single "Custom Map Data" row should stay next to the new "Custom Data Layers" section.
- Publish or vendor the traffic sign packages before deploying.

## Open questions

- How to bring features in: merge the source branches (easy to re-sync) or cherry-pick (cleaner history)? Default: merge.
- Where will the build be deployed for project users?
