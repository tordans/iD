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
- **Review (2026-09-30):**
  - The field only edits the sign value (plus a link to the external tool). It did not suggest the tags a sign implies.
  - Fixed: side keys (`cycleway:right:traffic_sign`) showed the raw key as label.
  - Fixed: presets that list `traffic_sign` (our road/path presets, feature 15) showed the field twice.
- **Tag suggestions (2026-09-30).** Below each traffic sign field, the same tag-plan UI as the TILDA section (`modules/ui/tag_plan.ts`, `css/95_tag_plan.css`) lists what the changed sign implies, with one "Apply these tags" button (one undo step). The TILDA section then shows the category for the new tags, so the flow is: change the sign → apply the suggested tags → TILDA recomputes.
  - Source of the rules: the traffic sign converter's `signsToTags` (each sign's `tagRecommendationsByGeometry`, geometry `way`). It comes from a lazy bundle `dist/traffic-sign-converter/recommender.js` (~160 KB), built from the vendored converter files by `npm run dist:traffic-sign-recommender` (`scripts/traffic_sign_recommender_entry.js`). `opening_hours` is replaced by a shim, since it is only used to prettify conditional time ranges and is ~750 KB. The slim `id-field-browser.js` has no `signsToTags`; the source repo's build setup has uncommitted WIP, so the bundle is built here.
  - Logic in `modules/traffic_sign/sign_tag_plan.ts` (tests in `test/spec/traffic_sign/`):
    - Add or change the implied tags.
    - `highway` changes only on separate paths (e.g. 237 → 240 turns `highway=cycleway` into `path`).
    - Roads ignore signs whose `highway` list does not include them (e.g. 245 on a primary).
    - Normalize the value (`DE:241` → `DE:241-30`).
    - Remove tags the previous sign implied, or restore their downloaded value.
    - The previous sign is the value before the change while the way stays selected, else the downloaded one. Unchanged signs show nothing, so existing data is not nagged.
  - Road sides (`cycleway:<side>:traffic_sign`, `sidewalk:<side>:traffic_sign`) get only `bicycle`, `foot` and `segregated`, as side keys.
  - Open: directional keys (`traffic_sign:forward/backward`) get no suggestions yet. Conditional values are not prettified (shim). The same plan could later feed a validation for existing inconsistent data (feature 9).

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
- **Filter (2026-09-30, ✅):** each layer can have an optional `key` + `value` filter in its settings.
  - Only features whose properties match are drawn: no key = all features; key without value = the property is set; key and value = the property equals the value (as a string, so numbers match too).
  - The row shows `Name (key=value)` (`key=*` without a value), the filter part smaller and muted; the tooltip adds "Only features with key=value".
  - The same URL can be added several times with different filters, e.g. `radverkehrsnetz.pmtiles` once with `ist_radvorrangnetz=Radvorrangnetz` and once with `ist_radvorrangnetz=Ergänzungsnetz` in different colors.
  - Code: `matchesCustomDataFilter` / `customDataFilterLabel` in `modules/renderer/custom_data_layers.ts`, applied in `layerFeatures()` of `modules/svg/custom_data.ts`. Stored as `filterKey` / `filterValue` (left out when empty).
  - Tooltip fix: read-only and hidden rows dimmed their whole label, including the tooltip inside it, so the tooltip was see-through. Now only the label's content is dimmed.

### 5. Map style "lenses" — ✅ (Radnetz QA lens bundled)

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
- Done (2026-09-30): **bundled lenses** and the first one, **"Radnetz QA"** (`modules/lenses/radnetz_qa.ts`, listed in `modules/lenses/index.ts`). The lens list is now: Default (iD's normal style, `⌥D`) and Radnetz QA (`⌥Q`), then imported lenses. A bundled lens has a fixed shortcut (reserved for imported lenses), localized name/tooltip, its CSS as a string, and optional computed classes: while it is active, `appendLensTagClasses` adds `classes(tags)` to every map element.
  - Radnetz QA colors ways by the TILDA checklist (feature 8, `modules/tilda/qa_state.ts`, cached per tags object): green = all required tags there, orange = a required tag missing / not accepted by TILDA / only guessed, red = TILDA cannot decide the category (`needsClarification`, `*_adjoiningOrIsolated`, `*_advisoryOrExclusive`). Wide = bike infrastructure (way or its sides), thin = roads without it (road checklist); everything else fades to 30 %. Classes `tilda-qa`, `tilda-qa-complete|incomplete|unclear`, `tilda-qa-bike|road`.
  - Around Rosenthaler Platz (z17): 192 ways, 21 complete, 167 incomplete (mostly roads without `width`), 4 unclear.
- Open: a legend on the map; separate colors per side (lanes are drawn on the road's line); "why incomplete" on hover.
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
- 2026-09-29: the panel is now docked at the bottom (full width minus the map controls). Its height follows the table up to a maximum set by dragging the top edge (`way-table-panel-max-height`, fraction of the map height; the old free move/resize and `way-table-panel-layout` are gone). Clicking a way column or previous/next selects the way and eases the map so the way is centered in the map area above the panel, zooming out if it does not fit (`flyTo()`, measured against the map surface because the map runs under the top bar).
- Open: raw tag editing (v2), a "load more" per side, keyboard navigation between ways, better column widths for long values. Maybe a real bottom panel that shrinks the map instead of covering it.

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

### 8. TILDA bike infrastructure helper — 🟨 (v1 built)

**Done (2026-09-27):** inspector section "TILDA Bike Infrastructure" below the preset fields, for single ways with `highway=*`. Uses `@tilda-geo/bicycle-infrastructure` ^0.1.2 from npm.
- One card per TILDA result (this way / left side / right side): category label (with the German term) and id, colored by state (exact / incomplete / needs clarification / none). Hovering a left/right card shows the side on the map (side indicator, feature 7).
- Gap questions from `analyzeCategoryGaps` as buttons (e.g. `cycleway:right:lane` advisory / exclusive).
- Target category select. The tag plan lists removals, additions and changes with reasons; "Apply these tags" only appears when the plan reaches the target (checked with `processBikelanes`). All edits go through the entity editor, so each apply is one undo step.
- Checklist "Needed for the Radnetz dataset" per side (width, surface, traffic sign, oneway for separate ways; separation / traffic mode / buffer / marking for protected lanes; buffer / marking for on-road lanes and bicycle roads) with quick-value buttons and a value input.
- Code: `modules/tilda/category_plan.ts` (planner, ported from street-space-editor + fixes), `modules/tilda/required_attributes.ts`, `modules/ui/sections/tilda_bike_infra.ts`, `css/89_tilda_bike_infra.css`, labels under `inspector.tilda` in `data/core.yaml`; tests in `test/spec/tilda/`.
- Library issues found (worked around in `category_plan.ts`, to fix in tilda-schemas): for left/right plans `planTagsForCategory` writes the presence key as `cycleway:<side>:cycleway` instead of `cycleway:<side>`, and without an existing `cycleway:<side>` it plans bare keys (`lane=…`). It also does not split `cycleway:both`. Our wrapper splits `:both`, adds `cycleway:<side>=lane|track|…` for the target, fixes the keys and checks the result with `processBikelanes`.
- **v2 (2026-09-29): checklist per category from the data index (feature 16).** `modules/tilda/required_attributes.ts` is a rule table: per rule the own-way key (made side-specific with `writeKeyForSide`), the infraVelo attributes it feeds, TILDA's accepted values and how TILDA reads it. Each row shows label, key, tagged value (also found via `:both` / plain key, like TILDA), a state and a note: ✓ ok, ✓ grey = inherited (surface from the road, `traffic_mode` from `parking:*`, sidepath from the category), `?` guess (TILDA's `assumed_no`/`implicit_yes` oneway), ✗ ignored (TILDA drops the value), `!` missing; optional rows ("only if it applies") are grey. "TILDA reads it as …" shows sanitizing (`cobblestone` → `large_sett`, `orange` → `red`, `oneway:bicycle=no` → `car_not_bike`). Values TILDA accepts are buttons (first 6) and suggestions in the input. With a target category chosen, the checklist is for the target. Roads that are not bike infrastructure themselves get a "This road" card (mixed traffic: oneway, `oneway:bicycle`, `dual_carriageway`, width, surface, `cycleway:*` presence). Tests: `test/spec/tilda/required_attributes.ts`.
- 2026-09-30: every highway way gets a "This way" card with the target select, also when TILDA has no result for it (e.g. a sidewalk without bike access; the chip says "TILDA does not process this way …"). Choosing a target shows the tag plan and the checklist of that category. Road sides without any `cycleway:*`/`sidewalk:*` tags still get no card (would add two cards to every road).
- 2026-09-30 (UI rework): the section comes right after Feature Type, above the fields. The intro text is behind an info button in the section header (shown only when open). "This road" (mixed traffic checklist) is merged into the "This way" card; that card collapses when the bike infrastructure is on the sides and the way itself is none. Each card header shows the category chip and an edit button; the "Change to" select only appears after clicking edit (clicking it again cancels). The select is grouped with `<optgroup>` (cycle tracks, on the carriageway, with pedestrians, with buses, bicycle roads, special cases: links and crossings). In a German UI the category names are TILDA's own: `data/tilda_labels.de.json`, generated by `npm run update:tilda-labels` (`scripts/update_tilda_labels.js`) from tilda-geo's processed topic docs `app/src/data/generated/topicDocs/inspectorTranslations.gen.ts` (all `atlas_bikelanes--*` keys). Rerun it after the topic docs change; the JSON is committed because Netlify has no tilda-geo checkout. Optional checklist rows say "only if it applies" next to the name.
- Next: QA validations (feature 9), German texts, "why not category X" explanations.

**Original plan:**

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

- Source: `~/Development/OSM/osm-live-touched` (package `@osm-editor-kit/live-touched`, from npm `^0.1.0`). Start from its `packages/live-touched/README.md` ("iD integration guide") and `docs/concept.md`. Its `WORKPLAN.md` tracks the steps (T10 = the iD test).
- Integrated 2026-09-27:
  - `modules/services/osm.js`: `getAccessToken()` (the backend uses the token only to read user id and name).
  - `modules/live_touched/live_touched.ts`: session wiring. Reports locally modified objects on history `change` (also fires on undo, redo, reset, restore), marks them saved on uploader `resultSuccess` (the changeset has its id there), reports the view on map `move`, sets `.live-touched-*` classes on map `drawn`. Turns back on after reload if enabled and consent is current.
  - `modules/ui/sections/live_touched.ts`: "Live edits nearby" in the Map Data pane: switch with consent dialog on first use, login hint, zoom-in / empty messages, list (select + zoom on click, user link, status, age, hint), privacy link, "Delete my data on the server". Pulsing dot on the Map Data button while others edit in view.
  - `css/88_live_touched.css`: orange `touched`, faded dashed `stale`, violet `saved`, red casing for `parallel`/`outdated`.
  - Strings under `live_touched` in `data/core.yaml` (English only; German texts are in `docs/concept.md`).
- Checked so far: unit/integration test with an in-memory backend and two users (`test/spec/live_touched/live_touched.ts`): alice's iD edit is shared, bob sees it, a parallel edit gets the `parallel` hint and the "others nearby" flag, undo deletes the entry, "delete my data" works. In the browser (logged out): section renders, login hint shows, switch is disabled.
- **T10 (Tobias):** open iD at `http://127.0.0.1:8080` (not `localhost`; only `127.0.0.1:*` is allowed by the backend) in two browser profiles with two OSM accounts, same area at zoom ≥ 15. Turn on "Show and share live edits" in both (consent dialog). Edit in one; the other should list it within ~10 s and show the orange halo. Also check: parallel hint when both edit the same way, "saved" (violet) after an upload, the map halos on lines, areas and points, and "Delete my data on the server".
- Open question for osm-live-touched (from Cursor Bugbot on PR #10): the full OSM token goes to the backend, which only needs the user id and name. The consent text now says so; a narrower mechanism would be better.
- Not verified yet: the halo CSS on real map elements (needs real entries), the upload → `saved` path in a real upload.

### 12. Read-only feature categories — ✅ (v1)

**Done (2026-09-27):**
- Lock button per row in Map Data ▸ Map Features. Locked categories stay visible (grayscale, 50 % opacity) and get no pointer events, so no hover, click or snapping while drawing; the lasso skips them too. State in the URL (`readonly_features=buildings,water`) and the pref `readonly-features`.
- Vertices are read-only only if all their parent ways are, so a road node shared with a building stays editable.
- Code: `modules/renderer/readonly_features.ts` (store, matching via `features().getMatches`, classes on every map redraw), `modules/ui/layer_mode_toggle.ts` (shared toggle, see Icon conventions), hooks in `map_features.js`, `behavior/lasso.js`, `ui/init.js`; `css/92_readonly_features.css`; test `test/spec/renderer/readonly_features.ts`.
- Not covered in v1: selecting a read-only object via search, the feature list or `id=` in the URL still works.

**Original plan:**

**Goal:** mark whole feature categories (e.g. buildings and water) as **read-only**. They stay on the map for orientation, in a muted style, but cannot be edited. This works like the Map Features filters, which *hide* categories: same category list, same kind of URL state and list UI, but "read-only" instead of "hidden". For our project this keeps the map calm and prevents accidental edits to things we do not map (buildings, water, landuse …) while we focus on streets and bike infrastructure.

**How iD's filters work today** (`modules/renderer/features.js`)
- Rules per category via `defineRule(key, filter)`: `points`, `traffic_roads`, `service_roads`, `paths`, `buildings`, `building_parts`, `indoor`, `landuse`, `boundaries`, `water`, `rail`, `pistes`, `aerialways`, `power`, `past_future`, `others`.
- State: URL hash `disable_features=buildings,water` and pref `disabled-features`; `features.enable/disable/enabled/disabled`.
- List: Map Data pane ▸ "Map Features" (`modules/ui/sections/map_features.js`), one checkbox per category.
- Hidden entities are skipped by the renderer and by selection/lasso via `features.isHidden*`.

**Wanted behavior**
- A second state per category: `readonly`. URL hash `readonly_features=buildings,water`, pref `readonly-features`, same keys as the filters. If a category is hidden, hidden wins.
- List: in the "Map Features" section, a "read-only" toggle per category next to the visibility checkbox (or a separate section with the same list; decide when building).
- Rendering: muted, e.g. lower luminance / grayscale (all colors pulled toward gray), maybe lower opacity. Done with a class (`readonly-feature`) on the SVG elements plus CSS. To check: CSS `filter: grayscale() brightness()` on SVG shapes vs. overriding `stroke`/`fill` colors; performance with many elements.
- Not editable:
  - not selectable by click or lasso, no hover highlight,
  - drawing does not snap to or connect with them (new ways must not join buildings or water),
  - no move/rotate/delete via other selections (e.g. a shared node with an editable way: decide what happens),
  - no interaction at all in v1: clicking does nothing (decided 2026-09-27).
- Follow-up phase: a quick override for one object, e.g. Shift+click opens it in the inspector in normal edit mode.

**Plan and difficulty**
- Easy: rules and category list reuse the existing `defineRule` definitions; URL/pref state like `disable_features`; list UI; CSS for the muted style.
- Medium: adding the class to all drawn elements (areas, lines, points, vertices, labels) and keeping it cached per entity like the hidden cache.
- Hard: making them non-interactive everywhere: hover, select, lasso, snapping in draw modes (`behaviorDraw`, `behaviorHover`, `modes/drag_node`), shared nodes, validations that suggest fixes on read-only objects. Likely one central check `features.isReadOnly(entity, graph, geometry)`, called where `isHidden` is called today.
- Code: new TS module (e.g. `modules/renderer/readonly_features.ts`) that reuses the rules from `features.js`, plus small hooks in the upstream files.

### 13. Hide toolbar button labels — ✅

- Source: `iD--v3-reloaded` worktree (commits `1f76e0820`, `439e18668`, `7d74005f8`), ported to the current toolbar.
- Preferences ▸ Interface ▸ "Show button labels". Unchecked, the captions under the top toolbar buttons ("Add Feature", "Undo / Redo", …) are hidden and the toolbar is 60 px instead of 71 px high. Stored in the pref `preferences.interface.labels` (same key as in v3).
- Code: `modules/ui/sections/interface.ts`, `css/91_interface_prefs.css`, applied at startup in `ui/init.js`.

### 14. Show Mapillary image from the field — ➡️ (now part of feature 19)

### 15. Preset customization and missing fields — ✅ (v1; side variants open)

**Done (2026-09-29):**
- `customize()` also takes `setFields` (replace a preset's `fields`/`moreFields`, for order), `removeFields` and new `presets`. The Radnetz config moved to `modules/presets/radnetz_customization.ts`. `presets/field.ts` falls back to the field's own `strings` for option and side labels (`options.bollard`, `types.separation:left`), so custom fields show readable values without translations.
- New fields: `is_sidepath` (check), `surface/colour`, `sett/length` (only for `surface=sett`; mosaic / small / large), `width/effective`, `source/width` (only with `width`), and directional (left/right/both) `separation`, `marking`, `buffer`, `traffic_mode`, `cycleway/lane` (advisory/exclusive per side). Option lists are TILDA's accepted values.
- New presets (TILDA categories without a schema preset):
  - `highway/cycleway/link` "Cycleway Link (Routing Connection)" — TILDA `cyclewayLink` (Berlin 2026-09: 495 ways).
  - `highway/residential/bicycle_road` (`addTags` `bicycle=designated`, `traffic_sign=DE:244.1`) and `…/vehicle_destination` (`vehicle=destination`, `traffic_sign=DE:244.1,1020-30`) — TILDA `bicycleRoad` / `bicycleRoad_vehicleDestination`. iD's "incomplete tags" validation then asks for a missing sign or `bicycle=designated` (TILDA todos `missing_traffic_sign_244`, `missing_access_tag_bicycle_road`).
  - `highway/cycleway/bicycle_road`.
  - Berlin bicycle roads by highway (Overpass 2026-09-29): residential 851, service 25, construction 25, cycleway 22, unclassified 20, track 9, pedestrian 7. Signs: `DE:244.1,1020-30` 666, none 135, `DE:244.1` 56. Access: `vehicle=destination` 622 (+37 with `motor_vehicle`), `motor_vehicle=destination` 190 — the latter match the base preset; the TILDA card still shows the right category.
- Field lists (the fields that feed the dataset first; removed `incline`, tolls, weights/heights, destination signs, hazards, trolley wire, `covered`, MTB/hiking scales, `dog`, `stroller`, …):
  - roads (trunk … living_street, service): name, oneway, oneway (bicycles), dual carriageway, maxspeed, lanes, bike lanes, sidewalks, parking, surface, smoothness, width, traffic sign, structure, access; more: lane type, lane markings, parking orientation, surface colour, sett size, usable width, width source, directional signs.
  - bicycle roads: + traffic mode / marking / buffer left/right (the `trennstreifen` inputs).
  - cycleways and foot+cycle paths: name, sidepath, (segregated), oneway, surface, smoothness, width, traffic sign, separation, structure, access.
  - footway, sidewalk, path: name, access, traffic sign, sidepath, surface, smoothness, width, structure.
  - crossings (cycleway/footway/path): + width, oneway, access; more: surface colour, smoothness, traffic sign.
- **Side prerequisites (2026-09-30):** iD's field option `prerequisiteTag` can now name the side in its key, e.g. `cycleway/lane` has `{ key: 'cycleway:{side}', value: 'lane' }`.
  - The field is allowed (shown, or offered in "Add field") only when the prerequisite holds on at least one side, or when the field already has a value. This is the same rule as upstream's `prerequisiteTag`.
  - In the directional combo, a side where it does not hold is disabled, and its placeholder (and tooltip) names the field to change first, e.g. "“Keiner”: change “Fahrradinfrastruktur” first". A side value that is already there stays editable.
  - The side value is read from `cycleway:right`, then `cycleway:both`, then `cycleway`. `value`, `values`, `valueNot` and `valuesNot` work as upstream.
  - Code: `modules/ui/fields/side_prerequisite.ts` (pure helpers + `uiSidePrerequisites`, tests in `test/spec/ui/fields/side_prerequisite.ts`); small hooks in `modules/ui/field.js` (`isAllowed`, class `has-side-prerequisite`) and `modules/ui/fields/directional_combo.js` (row state, placeholder).
  - Grouping: `cycleway/lane` moved from `moreFields` to the road `fields`, right after `cycleway`. It only appears when a side has `lane`. In the compact sidebar (feature 23), a field with a side prerequisite has no line above it, so it reads as part of the field above.
  - **Planned upstream PR (later, separate from this branch):** "directional combo knows its parent tag". It needs `{side}` in `prerequisiteTag.key` documented in id-tagging-schema, the helpers in iD, and fields that use it (lane type, `parking:{side}:orientation` with `valuesNot: [no, separate]`, `sidewalk:{side}:surface`, …). Open for that PR: should changing the parent to `no`/`separate` also remove the detail tags of that side?
- Open: side variants (`cycleway:<side>:separation:left`, `cycleway:<side>:surface`, …) have no fields; the TILDA section's checklist (feature 8) covers them with key + options. Fields could follow as "sub-fields" of the `cycleway` directional field.
- Open: a preset category "TILDA Radinfrastruktur"; presets for `footwayBicycleYes` (sidewalk + `bicycle=yes` + `DE:239,1022-10`) and bicycle roads on `service`/`unclassified`.


- `presetManager.customize()` (`modules/presets/customization.ts`): adds fields and appends them to existing presets' `fields` / `moreFields` while the schema loads. Set in `index.html` before `context.init()`: `iD.presetManager.customize(iD.RADNETZ_PRESET_CUSTOMIZATION)`. A field's `label` is used untranslated (small fallback in `presets/field.ts`). Test: `test/spec/presets/customization.ts`.
- Done: `dual_carriageway` (type `check`, yes / no / unset) as a regular field on `highway/trunk`, `primary`, `secondary`, `tertiary`, `residential`, `unclassified`, `living_street`. id-tagging-schema has no field for it at all. Not on `service` and `road`.
- Note: the TILDA library (`@tilda-geo/bicycle-infrastructure`) does not read `dual_carriageway`; it matters for our own road processing and QA.

**TILDA tags without an iD field** (keys read by `@tilda-geo/bicycle-infrastructure` 0.1.x or `modules/tilda/required_attributes.ts`, checked against id-tagging-schema v6):

| Tags | Where | Proposal |
|---|---|---|
| `separation:left/right`, `marking:left/right`, `buffer:left/right` | separate cycleways (`highway=cycleway/path`) | combo fields with the TILDA value lists (`bollard`, `flex_post`, `kerb`, `solid_line`, `dashed_line`, `parking`, …); one "Separation" group, left/right with the side indicator |
| `cycleway:<side>:separation[:left/right]`, `:marking…`, `:buffer…` | road with a cycle lane | same fields as side variants, shown under the cycleway field when the side has a lane |
| `traffic_mode:left/right`, `cycleway:<side>:traffic_mode…` | both | combo (`motor_vehicle`, `parking`, `foot`, `bicycle`, …) |
| `cycleway:<side>:surface`, `:smoothness`, `:segregated`, `:oneway`, `:traffic_sign`, `:lane`, `:surface:colour` | road with a cycle lane | side variants of the existing fields; `:width` is already covered by feature 10 |
| `is_sidepath` | separate paths next to a road | check field (`yes` / `no`), on `highway/cycleway`, `footway`, `path` |
| `surface:colour` | lanes and cycleways | combo (`red`, `green`, …) |
| `footway`, `path` (sub-types like `sidewalk`, `crossing`) | footways and paths | iD shows them through preset choice only; a combo would help in TILDA review |
| `width:lanes`, `bicycle:lanes`, `cycleway:lanes` | roads | lane-based tags; rather the way table or raw tags, no field |
| `access:reason` | any | text field in `moreFields`, low priority |
| `traffic_sign:forward/backward` | — | already added by feature 2 |

### 16. Data index: infraVelo result ⇐ TILDA ⇐ OSM tags — 📚 (reference for validations)

**Reference:** the Radnetz dataset for infraVelo is built by `~/Development/FMC/infravelo-radnetz` (read at commit `56f605e`, 2026-01-29). Use that repo for this index, not the older analyses in `~/Development/FMC/scripts`. Its first step, `scripts/translate_attributes_tilda_to_rvn.py` (run by `process_tilda_data.sh`), turns three TILDA exports into the infraVelo attributes; later steps (matching, snapping onto the Detailnetz, Schutzstreifen conversion, overrides, aggregation per `elem_nr` + direction) only move and merge those values. Spec: `processing/REQUIREMENTS.md` (says it may be outdated; the Python code is the truth). So what we validate in iD is the OSM input of that one translation step.

| TILDA export | infraVelo file | Rows |
|---|---|---|
| `bikelanes` (one row per way and side, category from the bikelane rules) | `TILDA Bikelanes Translated` | bike infrastructure |
| `roads` (motor vehicle roads) | `TILDA Streets Translated` | `fuehr` = "Mischverkehr mit motorisiertem Verkehr" |
| `roadsPathClasses` (footway, path, track, …) | `TILDA Paths Translated` | `fuehr` = "Sonstige Wege (…)" |

Sources for the OSM side: `@tilda-geo/bicycle-infrastructure` (`categories/category-specs.ts`, `predicates.ts`, `refine-predicates.ts`, `sanitize/*`, `derive/*`) and TILDA's LUA for roads (`tilda-geo/processing/topics/roads_bikelanes/roads/road_classification.lua`, `helper/sanitize_tags.lua`).
Note on `~/Development/FMC/tilda-geo--osm-tag-mapping` (branch `osm-tag-mapping`, last commit 2026-07-13, 29 commits ahead of develop, report uncommitted): it builds `processing/filter/osmiumTagFilter/contract.yaml`, the list of keys/values the osmium pre-filter keeps. For `roads_bikelanes` that is only the `highway` values (plus `leisure=track` as exclusion); it does not list the tags each category reads. Not useful for this index yet.

**Two geometry versions.** TILDA splits every road into *self* (the way itself) plus one object per side from `cycleway:<side>:*` (prefix `cycleway`) and `sidewalk:<side>:*` (prefix `sidewalk`, only for `sidewalk:<side>:bicycle=yes` style tagging). Specificity: `cycleway:*` < `cycleway:both:*` < `cycleway:<side>:*`. Paths (`cycleway`, `footway`, `path`, `bridleway`, `steps`, …) are never split. So each attribute has two keys:
- **Own way** (separate geometry, or the road itself for bicycle roads / bus lanes / lanes in the middle): `width`, `surface`, `oneway`, `traffic_sign`, `separation:left`, …
- **Road side** (centerline tagging): `cycleway:<side>:width`, `cycleway:<side>:surface`, `cycleway:<side>:oneway`, `cycleway:<side>:traffic_sign[:forward]`, `cycleway:<side>:separation:left`, … (`writeKeyForSide()` in the library builds these). Surface/smoothness fall back to the road's own `surface` for on-road categories (`copySurfaceSmoothnessFromParent`).

#### A. Attribute index (bikelanes)

| infraVelo attribute | TILDA field | OSM tags (own way) | OSM tags (road side) | TILDA sanitizing / notes |
|---|---|---|---|---|
| `verkehrsri` (one / two directions) | `oneway` | `oneway`, `oneway:bicycle` | `cycleway:<side>:oneway` (+ road's `oneway`, `oneway:bicycle`) | derived: `oneway:bicycle=yes`→yes; `oneway:bicycle=no`→`car_not_bike`/no; `oneway=yes/no`; else `assumed_no` or `implicit_yes` (category default). infraVelo maps `assumed_no`/`implicit_yes` to a direction but they are guesses → **require explicit `oneway`** |
| `fuehr` (type) | `category` (+ `traffic_sign`) | see table B | see table B | 240 / 239+1022-10 / 242+1022-10 in `traffic_sign` pick the sub-type |
| `pflicht` (mandatory use) | `traffic_sign` (+ `_forward`, `_backward`) | `traffic_sign`, `traffic_sign:forward/backward` | `cycleway:<side>:traffic_sign[:forward/backward]` | yes if 237, 240 or 241 is in any of them. `traffic_sign=none` states "no sign". TILDA sanitizes the sign string (`DE:` prefix, German text variants) |
| `breite` (width, 0.1 m) | `width_effective` else `width` | `width:effective`, `width` (+ `source:width`) | `cycleway:<side>:width` (+ `source:cycleway:<side>:width`) | parsed as meters; `m`/`meter` stripped, first of `a;b`. Lanes in the middle: from the road's `width:lanes` |
| `ofm` (surface) | `surface` | `surface` (+ `sett:length` for `sett`) | `cycleway:<side>:surface`, else road `surface` | sanitized: `cobblestone`/`unhewn_cobblestone`→`large_sett`, `sett` + `sett:length` ≤0.08→mosaic, ≤0.13→small, else large; `earth/dirt/mud/clay`→`ground`; `paving_stones:20/30`→`paving_stones`; unknown values → dropped (logged). infraVelo groups into Asphalt / Beton / Gepflastert / Kopfstein / Ungebunden / Sonstige; missing → `NICHT-GEFUNDEN` |
| `farbe` (coloured) | `surface_color` | `surface:colour` | `cycleway:<side>:surface:colour` | allowed `red`, `green`, `red;green`, `no`; `grey/gray/none/silver`→`no`, `orange`→`red`. infraVelo: yes if red or green |
| `protek` (protection, only `cyclewayOnHighwayProtected`) | `separation_left/right`, `marking_left/right`, `traffic_mode_left/right`, `buffer_*` | `separation:left/right`, `marking:left/right`, `traffic_mode:left/right`, `buffer:left/right` | `cycleway:<side>:separation:left/right`, `…:marking:…`, `…:traffic_mode:…`, `…:buffer:…` | `<key>:<side>` → `<key>:both` → (left only) `<key>`. separation allowed: `no bollard flex_post vertical_panel studs bump planter kerb fence jersey_barrier guard_rail structure ditch greenery hedge tree_row cone yes …`; marking: `solid_line dashed_line double_solid_line barred_area pictogram surface`; traffic_mode: `no motor_vehicle parking psv bicycle foot` (`motorized`→`motor_vehicle`); buffer: meters, `no`→0 |
| `trennstreifen` (buffer to parking on the right; bicycle roads: both sides) | `traffic_mode_right` (+ left for bicycle roads), `buffer_right`, `marking_right` | `traffic_mode:right`, `buffer:right`, `marking:right` | `cycleway:<side>:traffic_mode:right`, `…:buffer:right`, `…:marking:right` | yes if parking on the right and `buffer:right` ≥ 0.6 (bicycle roads: parking and buffer > 0 or a `solid_line`/`dashed_line` marking, either side). **Fallback:** without `traffic_mode`, TILDA infers `parking` from the road's `parking:<side>` / `parking:both` (≠ `no`) — on-road lanes use their own side, bicycle roads both sides. No parking → "entfällt" |
| `nutz_beschr` (use restriction) | `traffic_sign` | `traffic_sign` containing `Radwegschäden`, `Gehwegschäden`, … (+ `source:traffic_sign:mapillary`) | side variant | not for mixed traffic |
| `Kommentar` | `lifecycle` | `highway=construction` + `construction=*`, `temporary=yes` | — | construction / temporary text plus the list of missing attributes |

#### B. Category index (`fuehr` ⇐ TILDA `category` ⇐ OSM)

Berlin km from the TILDA export in that repo (`infravelo-radnetz/data/TILDA Radwege Berlin.fgb`, Sept 2025, clipped to Berlin). "Own way" includes bicycle roads and lanes in the middle, which are the road itself.

| infraVelo `fuehr` | TILDA category | km own way / road side | OSM tags, own way | OSM tags, road side |
|---|---|---|---|---|
| Radfahrstreifen | `cyclewayOnHighway_exclusive`, `cyclewayOnHighwayBetweenLanes` | 0.5 / 181; 3 / 0 | (rare) `highway=cycleway` + `cycleway=lane` + `lane=exclusive`; between lanes: `cycleway:lanes` has `\|lane\|` or `bicycle:lanes` has `\|designated\|` on the road | `cycleway:<side>=lane` + `cycleway:<side>:lane=exclusive` |
| Schutzstreifen | `cyclewayOnHighway_advisory` | 0.4 / 272 | as above with `lane=advisory` | `cycleway:<side>=lane` + `cycleway:<side>:lane=advisory` |
| *(TODO, gap)* | `cyclewayOnHighway_advisoryOrExclusive` | 2 / 20 | `lane` missing | `cycleway:<side>:lane` missing |
| Geschützter Radfahrstreifen | `cyclewayOnHighwayProtected` | 6 / 28 | a sidepath (`is_sidepath=yes` or similar) with `separation:left` ∈ {bollard, flex_post, vertical_panel, studs, bump, planter, fence, jersey_barrier, guard_rail} (and no `traffic_mode:right=motor_vehicle`, no `segregated`), or `traffic_mode:left=parking`, or `traffic_mode:right=motor_vehicle` + such a `separation:right` | `cycleway:<side>=track\|lane` + `cycleway:<side>:separation:left=…` (+ `traffic_mode`) |
| Radfahrstreifen mit Linienverkehr frei (237 + 1026-32) | `sharedBusLaneBikeWithBus` | 0 / 2 | `highway=cycleway` + `lane=share_busway`, or sign `DE:237` with `1024-14`/`1026-32` | `cycleway:<side>=lane` + `cycleway:<side>:lane=share_busway`, or that sign on the road |
| Bussonderfahrstreifen mit Radverkehr frei (245 + 1022-10) | `sharedBusLaneBusWithBike` | 0 / 59 | `cycleway=share_busway`, or sign `DE:245` with `1022-10`/`1022-14` | `cycleway:<side>=share_busway` |
| Fahrradstraße /-zone (244) | `bicycleRoad`, `bicycleRoad_vehicleDestination` | 4 + 42 / 0 | `bicycle_road=yes` or sign `DE:244*`; vehicle destination: sign with `1020-30` (or "Kfz frei" text) or `vehicle`/`motor_vehicle` = `destination`/`yes` | — (always the road itself) |
| Radweg | `cycleway_adjoining`, `cycleway_isolated`, `cycleway_adjoiningOrIsolated`, `footAndCyclewaySegregated_*`, `footAndCyclewayShared_*` (without 240) | see below | `highway=cycleway` (+ `is_sidepath`), or `cycleway=track` on a cycleway, or sign `DE:237` on a path-like way; segregated: `segregated=yes` + `bicycle`/`foot` designated or sign `DE:241`; shared: `segregated=no` + designated, or sign `DE:240` | `cycleway:<side>=track` (+ `cycleway:<side>:segregated`, `:traffic_sign`); sidewalk variants via `sidewalk:<side>:bicycle=designated` + `:segregated` |
| Gemeinsamer Geh- und Radweg mit Z240 | `footAndCyclewayShared_*` + `traffic_sign` has 240 | 65+21+183 / 11 | as shared, plus `traffic_sign=DE:240` | `cycleway:<side>=track` + `cycleway:<side>:traffic_sign=DE:240` |
| Gehweg mit „Radverkehr frei“ (239 + 1022-10) | `footwayBicycleYes_*` + sign 239 and 1022-10 | 157+9+430 / 24 | `highway=footway\|path` + `bicycle=yes` (or sign with `1022-10`), not a crossing; plus `traffic_sign=DE:239,1022-10` | `sidewalk:<side>:bicycle=yes` (+ `sidewalk:<side>:traffic_sign`) |
| Fußgängerzone „Radverkehr frei“ | `pedestrianAreaBicycleYes` + sign 242 and 1022-10 | 15 / 0 | `highway=pedestrian` + `bicycle=yes\|designated` + `traffic_sign=DE:242.1,1022-10` | — |
| Mischverkehr mit motorisiertem Verkehr | `sharedMotorVehicleLane`; all of `roads` | 0 / 2 | `highway=cycleway` + `cycleway=shared_lane` (rare) | `cycleway:<side>=shared_lane` |
| Sonstige Wege | `footwayBicycleYes_*` without the sign, `pedestrianAreaBicycleYes` without the sign; all of `roadsPathClasses` | | | |
| Kreuzungsweg | `crossing` | 83 / 2 | `highway=cycleway` + `cycleway=crossing\|traffic_island`, or `cycleway=lane` + `lane=crossing`, or `highway=footway\|path` + `footway\|path=crossing\|traffic_island` + `bicycle=yes\|designated`; not longer than 100 m | rare (crossing tagged on a road side) |
| *(TODO, "Klärung notwendig")* | `needsClarification` | 297 / 5 | `highway=cycleway` that matches nothing above (mostly missing `is_sidepath`/`segregated`/signs), `path`/`footway` + `bicycle=designated` | same on a side |
| not in the dataset | `cyclewayLink` | 4 / 0 | `highway=cycleway` + `cycleway=link` (routing connector; Berlin: 495 ways) | — |
| no infrastructure | `data_no`, `separate_geometry`, `not_expected` | | | `cycleway:<side>=no\|none`, `=separate`; left side of a one-way road tagged with plain `cycleway=*` |

Sidepath refinement (`_adjoining` / `_isolated` / `_adjoiningOrIsolated`): adjoining if `is_sidepath=yes`, `footway=sidewalk`, `path=sidewalk|sidepath`, `cycleway=sidepath` or it is a road side; isolated if `is_sidepath=no`, `highway=service|track`; otherwise unknown → **`is_sidepath` is required on every separate cycleway/footway/path** with bike access. Berlin: 700 km of `*_adjoiningOrIsolated` (mostly `footwayBicycleYes` on footways).

#### C. Roads and paths (`roads`, `roadsPathClasses`)

| infraVelo attribute | TILDA field | OSM tags | Notes |
|---|---|---|---|
| `verkehrsri` | `oneway`, `oneway_bicycle` | `oneway`, `oneway:bicycle`, `dual_carriageway` | roads: `oneway=yes` + `dual_carriageway=yes` → `yes_dual_carriageway`; `oneway=no` is dropped (= two-way). `oneway:bicycle=no` → two-way for bikes |
| `breite` | `width_effective` / `width` | `width:effective`, `width` (+ `source:width`) | |
| `ofm` | `surface` | `surface` (+ `sett:length`) | same sanitizing as above |
| `farbe` | — | — | roads have no `surface_color` column → always "Nein" |
| `pflicht` | `traffic_sign` | — | streets: always "Nein"; paths: from `traffic_sign` (237/240/241) |
| `protek` / `trennstreifen` | — | — | "Ohne" / "entfällt" (no `traffic_mode` on roads) |
| no bike infrastructure on the sides | `cycleway:<side>` presence | `cycleway:both/left/right=no\|separate`, `sidewalk:<side>:bicycle` | infravelo QA layer "cycleway no": roads in the network should say explicitly that there is no lane |

#### D. Required tags per TILDA category (drives the sidebar, feature 8)

Key names are for the own way; on a road side they get the `cycleway:<side>:` / `sidewalk:<side>:` prefix.

| Category group | Required | Conditional |
|---|---|---|
| all bike infrastructure | `traffic_sign` (or `none`), `width`, `surface`, `oneway` | `sett:length` if `surface=sett`; `surface:colour` if coloured; `source:width` |
| separate ways (`cycleway_*`, `footAndCycleway*`, `footwayBicycleYes_*`, `needsClarification`) | + `is_sidepath` (yes/no) | `segregated` on shared/segregated foot+cycle ways; `bicycle`+`foot=designated` with DE:240/241 |
| `cyclewayOnHighway_*`, `cyclewayOnHighwayBetweenLanes`, `sharedBus*` | + `lane` (advisory/exclusive) on the side | `traffic_mode:right`, `buffer:right`, `marking:right` when parking is next to the lane (`trennstreifen`) |
| `cyclewayOnHighwayProtected` | + `separation:left/right`, `marking:left/right`, `buffer:left/right`, `traffic_mode:left/right` | |
| `bicycleRoad*` | `traffic_sign` (DE:244.1 …), `width`, `surface`, `oneway`, `oneway:bicycle` if one-way | `traffic_mode:left/right` (or `parking:*`), `marking:left/right`, `buffer:left/right`; `vehicle`/`motor_vehicle` |
| `crossing` | `width`, `surface`, `oneway` | `traffic_sign`, `surface:colour`, `crossing` (signals/markings) |
| roads (mixed traffic) | `oneway` (+ `oneway:bicycle`, `dual_carriageway` if one-way), `width`, `surface`, `cycleway:both/left/right` | `surface:colour` |

### 17. Extract a side into a separate way — ✅ (v1)

**Done (2026-09-30):** built as specified below.
- Code: `modules/sidepath/extract_tags.ts` (tag logic), `modules/sidepath/offset_line.ts`, `modules/actions/extract_sidepath.ts`, `modules/operations/extract_sidepath.ts` (added to the edit menu by a small hook in `modules/modes/select.js`, after iD's "Extract"), `css/96_extract_sidepath.css`, strings `operations.extract_sidepath.*`. Tests: `test/spec/sidepath/`, `test/spec/actions/extract_sidepath.ts`.
- Hovering a menu entry previews the new way (magenta dashed). The tooltip gives the offset, how many side tags move, and what the road gets.
- The operation needs the traffic sign rules (the lazy recommender bundle, loaded when a road is selected); until they are there the entry is disabled with "Loading the traffic sign rules …". If loading fails, it extracts without sign rules.
- Question 3 (`foot=use_sidepath` for sidewalks): built with "never".
- `use_sidepath` only when the side's **sign** designates it (237, 240, 241); a combined path without a sign is `bicycle`/`foot=designated` but the road gets no `use_sidepath`.
- Simplified against the spec: the kerb/buffer distance is a fixed 1 m (the side's `buffer` is not used yet). Unsided meta keys (`check_date:cycleway`, `source:cycleway:width`) stay on the road.
- Also: field "Bicycles, by Direction" (`bicycle/direction`) on the road presets; iD's edit menu no longer shows an empty "Shortcut" row for operations without a key.
- Tested in the browser (local test edits, all undone): right cycle track with DE:237 on Torstraße, and track + sidewalk with DE:241 as one path. TILDA reads the new ways as "Cycle track, along a road" / "Segregated foot and cycle path, along a road".
- Next: "extract along the chain" (way table, feature 6); snap the new way's ends to crossing paths; use `buffer` and the sidewalk/parking order from street-space-editor for the offset.

**Goal.** Many Berlin roads carry their cycle track and sidewalk as tags on the road (`cycleway:right=track`, `sidewalk:both=yes`, …). For the Radnetz dataset, and for width, separation and surface details, a separate way is often better: it gets its own geometry, junctions and full tagging. Today that conversion is manual and error-prone. You have to draw a parallel way, copy and rename ~10 tags, change the road to `…=separate` and remember `bicycle=use_sidepath`. This feature does it with one right-click. The result is one undo step, and the new way is selected so the mapper can align it with the imagery and connect it.

**Principle.** The side's tags are read exactly as TILDA reads them: `getTransformedObjects` from `@tilda-geo/bicycle-infrastructure`, the same unnesting as street-space-editor's `expandSidepaths`, with specificity `prefix` < `prefix:both` < `prefix:<side>`, plus `source:`/`note:` meta keys. So after the extraction TILDA sees the same attributes on the new way as it saw on the side before. Only the category changes from "road side" to "own way".

#### When the operations appear

Only for a single selected way with `highway` = a road class (not path-like classes, not areas), fully loaded and not locked.

| Side has… (after unnesting, per side) | Offered |
|---|---|
| `cycleway:<side>` = `track` (also via `cycleway`, `cycleway:both`, `opposite_track`) | "Extract <side> cycle track" |
| `cycleway:<side>` = `lane` / `share_busway` **with** a physical `separation:*` (protected lane) | "Extract <side> protected bike lane" — offered, but **not recommended**: the default for Radnetz is to keep protected lanes on the centerline. The entry sits at the end of the group, and its tooltip says "Usually kept on the road; only extract with a good reason (e.g. a long kerb-separated section)." No hint or validation ever suggests it. |
| `cycleway:<side>` = `lane` / `shared_lane` / `share_busway` without separation, `no`, `separate`, `opposite` | nothing (painted lanes stay on the road) |
| `sidewalk:<side>` = `yes` (also via `sidewalk=both|left|right|yes`, `sidewalk:both`) | "Extract <side> sidewalk" |
| both a cycle track and a sidewalk on the same side | both entries above, plus "Extract <side> cycle track and sidewalk as one path" |

So one road can offer up to 6 entries (left/right × cycleway / sidewalk / combined path). In the edit menu they sit together after "Reverse", all with iD's `iD-operation-extract` icon, ordered right side first (the side cycle tracks are on in Germany). Tooltips say what will happen, e.g. "Create a separate cycleway about 10 m to the right and set `cycleway:right=separate` on this road."

Disabled (entry shown greyed, with iD's usual reason tooltip): way not fully downloaded, too large (off-screen), or the new geometry would not fit (way shorter than 2 m).

#### Tagging per variant

Notation: `S` = the side's unnested tags (e.g. `S.surface` comes from `cycleway:right:surface` ?? `cycleway:both:surface` ?? `cycleway:surface`). `R` = the road's tags.

**A. Cycle track → `highway=cycleway`**

New way:
- `highway=cycleway`, `is_sidepath=yes`. No `is_sidepath:of*` (decided, question 6).
- Copied from `S`: `surface`, `smoothness`, `width` (+ `source:width`), `surface:colour`, `sett:length`, `segregated`, `traffic_sign` (+ `:forward`/`:backward`), `separation:*`, `buffer:*`, `marking:*`, `traffic_mode:*`, `lit` (else copy `R.lit`), `oneway`, `note`, `check_date`, and any other `S` key except the ones below.
- Dropped: the presence value itself (`cycleway=track`), `lane`, and keys that only make sense on the road (`lanes`, `width:lanes`, …).
- Highway and access from the sign, taken from the traffic sign tool (decided, question 4). The vendored converter's `trafficSignTagToSigns()` + `signsToTags(signs, 'DE', 'way')` give each sign's `tagRecommendationsByGeometry` (`osm-traffic-sign-tools-id-field/packages/traffic-sign-converter/src/data-definitions/DE/data/infrastructure.ts`), so the rules live in one place:
  - `DE:237` → `highway=cycleway`, `bicycle=designated`.
  - `DE:240` → `highway=path`, `bicycle=designated`, `foot=designated`, `segregated=no`, `is_sidepath=yes`, `traffic_sign=DE:240`.
  - `DE:241-30` / `DE:241-31` → `highway=path`, `bicycle=designated`, `foot=designated`, `segregated=yes`, `is_sidepath=yes`, `traffic_sign=DE:241-30|31`. A bare `DE:241` is written as `DE:241-30`, following the tool's redirect (`signsToTrafficSignTagValue`); the side (`-30` bike left, `-31` bike right) can't be derived from the road tags.
  - No sign → `highway=cycleway` (implies bicycle designated); `traffic_sign=none` is kept if tagged.
  - `S.segregated` from the road is only used when the sign does not decide it.
- Direction: `S.oneway` if tagged. Otherwise the way is drawn in the road's direction on the right side and against it on the left, with `oneway=yes` (German default: tracks run with the traffic on their side). If the road has `oneway=yes` + `oneway:bicycle=no` and the left side has no oneway tag, we do **not** guess: `oneway` stays unset and the TILDA checklist shows it as missing.

Road (centerline):
- `cycleway:<side>=separate`. All `cycleway:<side>:*` keys and their `source:`/`note:`/`check_date:` variants are removed.
- If the value came from `cycleway` or `cycleway:both`, it is first split into `cycleway:left` / `cycleway:right` (and `cycleway:both:*` sub-keys into both sides), so the other side keeps its tags. If both sides end up equal (`separate`), they are merged back into `cycleway:both=separate`.
- Use-sidepath, only if the new way is designated (sign 237, 240 or 241), direction-specific and merged like the directional combo (question 2):
  - Right side extracted → `bicycle:forward=use_sidepath`.
  - Left side extracted → `bicycle:backward=use_sidepath`.
  - Both sides designated (after the second extraction) → merged into `bicycle=use_sidepath` (and the directional keys removed).
  - On a one-way road the forward side alone → `bicycle=use_sidepath`, unless `oneway:bicycle=no`.
  - An existing `bicycle=*` value other than `yes`/`designated`/unset is not overwritten (reported in the flash message).

**B. Sidewalk → `highway=footway` + `footway=sidewalk`**

New way:
- `highway=footway`, `footway=sidewalk` (TILDA treats that as a sidepath, so no `is_sidepath` needed).
- Copied from `S` (prefix `sidewalk`): `surface`, `smoothness`, `width`, `sett:length`, `lit`, `kerb`, `tactile_paving`, `traffic_sign`, `note`, `check_date`, …
- Bicycle access from `S.bicycle`:
  - `yes` → `bicycle=yes` (TILDA `footwayBicycleYes`; the sign `DE:239,1022-10` is kept if tagged).
  - `designated` → the shared path of variant A: `highway=path`, `bicycle=designated`, `foot=designated`, `segregated` from the sign (240 / 241) or `S`; `footway=sidewalk` is dropped (TILDA foot+cycle categories need the designations and `segregated`).
  - `no` → `bicycle=no`.
- No `oneway`.

Road:
- `sidewalk:<side>=separate`.
- The old one-key schema is converted to sided keys: `sidewalk=right` means right yes, left no. The same split and merge rules as for cycleways apply.
- `foot=use_sidepath` only on request (open question below); by default nothing, because in Germany pedestrians have no general "must use" rule like bikes do.

**C. Cycle track + sidewalk on the same side → one `highway=path`**

For "Geh- und Radweg" mapped as two side tags:
- `highway=path`, `bicycle=designated`, `foot=designated`, `is_sidepath=yes`.
- `segregated`:
  - `yes` if a cycle track and a sidewalk are both tagged (two strips) or the sign is 241.
  - `no` if the sign is 240.
  - Otherwise `S_cycleway.segregated` or `S_sidewalk.segregated`.
- Split keys (Key:segregated wiki; the same as street-space-editor's width/surface modes and what TILDA reads):
  - `cycleway:surface`, `cycleway:smoothness`, `cycleway:width` (+ `source:cycleway:width`), `cycleway:surface:colour` ← from the cycle track.
  - `footway:surface`, `footway:smoothness`, `footway:width` ← from the sidewalk.
- Combined keys:
  - `surface` / `smoothness`: only when both parts have the same value (then the split keys are left out).
  - `width`: the sum of both widths, only if both are known.
  - `lit`: from either part, else from the road.
- `traffic_sign` from the cycle track side (240/241 live there), else the sidewalk side.
- Direction: `oneway=no` for the path; the cycle direction as `oneway:bicycle` (the rules from A, where `oneway=yes` becomes `oneway:bicycle=yes`).
- TILDA check: TILDA reads `cycleway:*` on a path as the bike values (`surface` ← `cycleway:surface`), so the Radnetz attributes stay the same.
- Road: both A and B changes (`cycleway:<side>=separate`, `sidewalk:<side>=separate`, `bicycle:<dir>=use_sidepath` when designated).

#### Geometry

- A copy of the road's line offset to the chosen side: right = right of the way's direction.
- **Offset from the road width (decided, question 5),** stacked like the street cross-section (road → parking → cycle track → sidewalk), the same order as street-space-editor's `surface-sidepath-offset.ts`:
  - `road/2`: from `roadWidthFromTags()` in `modules/width/width_tags.ts`, i.e. `width` → `est_width` → a default by highway and oneway.
  - `+ parking`: only when `parking:<side>` (or `:both`) = `lane`/`street_side`. By `parking:<side>:orientation`: parallel 2 m (default), diagonal 4.5 m, perpendicular 5 m. `half_on_kerb` counts 1 m, `on_kerb` 2 m; `no`/`separate` counts 0.
  - `+ 1 m`: kerb / buffer. If the side has a tagged `buffer`, that value is used instead.
  - **Cycle track:** `+ track/2`, where `track` = `S.width` or 2 m.
  - **Sidewalk:** `+ track` (the full cycle track width, if that side has one, extracted or not) `+ sidewalk/2`, where `sidewalk` = `S.width` or 2.5 m.
  - **Combined path:** `+ (track + sidewalk)/2`.
  - Example: residential without tags, no parking, track + sidewalk: track at 4 + 1 + 1 = 6 m, sidewalk at 4 + 1 + 2 + 1.25 ≈ 8.3 m. Secondary two-way with parallel parking: track at 7 + 2 + 1 + 1 = 11 m.
- The width defaults are TILDA's: iD's `width_tags.ts` table (ported from street-space-editor) has the same numbers as `tilda-geo/processing/topics/parking/roads/helper/road_width_tags.lua` and the shared `highway_width_fallbacks.lua` on the CQI branch (`feature/cycling-quality-index`): primary 18 / 12 one-way, secondary 14 / 9, tertiary 10 / 7, residential/unclassified 8, living_street 5, service 4, unknown 10. The est-width branch adds `est_width` as the second source, which iD already does. So nothing to copy now.
  - Later: move the table plus `roadWidth(tags)` into `@tilda-geo/bicycle-infrastructure` (TS port of TILDA's LUA, used by iD and street-space-editor) once the CQI branch has merged the LUA table. Then the three places share one source.
  - Each vertex is moved along the average of its two segment normals, in meters converted with `geoMetersToLat/Lon`.
  - Very sharp angles are clamped so the line doesn't loop.
- New nodes only. Nothing is connected to the road network. iD's "disconnected way" / "almost junction" validations then show the ends to connect, which is intended because junctions need a human.
- Node order: see "Direction" in A.
- After the operation: one undo step ("Extracted the right cycle track into a separate way"). The new way is selected, and the map doesn't move. Flash text: what was changed on the road.

#### Edge cases

- **Road split into several ways:** only the selected way is converted. The way table (feature 6) shows the neighbours. v2: "extract along the chain".
- **Way with `cycleway:right=separate` already:** that side isn't offered.
- **Directional traffic signs on the road** (`traffic_sign:forward=DE:237` without side keys): not moved in v1 (the flash message says so).
- **Parking lanes between road and track** (`parking:right=lane`): only affect the offset. v1 uses the fixed distances.
- **Roundabouts / closed ways:** not offered in v1.

#### Implementation plan (after review)

- `modules/sidepath/extract_tags.ts`: pure functions. `sideTags(tags, prefix, side)` via `getTransformedObjects`, `newWayTags(variant, …)`, `roadTagChanges(variant, …)`, `signTags(trafficSign)` (via the vendored traffic sign converter). Unit tests for every row of the tables above.
- `modules/sidepath/offset_line.ts`: offset coordinates; `sidepathOffsetMeters(tags, prefix, side)` for the stacking (uses `roadWidthFromTags`).
- `modules/actions/extract_sidepath.ts`: one action that adds nodes + way and changes the road tags.
- `modules/operations/extract_sidepath.ts`: one operation factory per variant/side (`operationExtractSidepath(context, ids, { prefix, side })`), registered in `modules/operations/index` and in the edit menu. Not named `extract` (iD already has "Extract" for points from areas).
- Strings under `operations.extract_sidepath.*` in `data/core.yaml`.
- Field `bicycle/direction` in `radnetz_customization.ts` (road presets, `moreFields`); the merge helper `setDirectionalValue(tags, key, direction, value)` shared with the action.

#### Open questions for review

1. ~~Offer protected bike lanes?~~ **Decided (2026-09-30):** offer them, but as a user decision only. The default is to keep them on the centerline; the UI does not recommend extracting them (see the table). Kerb-separated tracks are the conventional case for separate ways.
2. ~~Directional or plain `use_sidepath`?~~ **Decided (2026-09-30):** direction-specific, merged once both directions are equal.
   - The action writes `bicycle:forward` / `bicycle:backward` and merges into `bicycle=…` when both sides have the same value, using the same rule as iD's directional combo (`modules/ui/fields/directional_combo.js` `change()`): equal → common key, directional keys removed; different → both directional keys, common key removed. A plain `bicycle=yes` that is already there becomes the value of the other direction (`bicycle:backward=yes`), like the field does.
   - New field `bicycle/direction` (directionalCombo, `key: bicycle`, `keys: [bicycle:forward, bicycle:backward]`, options `use_sidepath`, `optional_sidepath`, `yes`, `designated`, `no`; labels "Forward" / "Backward") in `moreFields` of the road presets (not bicycle roads). Mappers see and fix the result with the same merge behavior. Checked: the directional combo is generic on `keys`, so `:forward/:backward` works.
   - Caveats:
     - The field also appears on roads that only have a plain `bicycle=*` (iD shows `moreFields` whose key is tagged), next to the Access field that edits the same `bicycle` key.
     - The up-arrow in the row label is fine for forward/backward; the side indicator (feature 7) only knows left/right, so it shows nothing for this field.
3. `foot=use_sidepath` for sidewalks: never, always, or as a separate option?
4. ~~240/241: `highway=cycleway` or `highway=path`?~~ **Decided (2026-09-30):** `highway=path` + `foot=designated` + `bicycle=designated` + `segregated=no` (240) / `yes` (241-30/31), with `is_sidepath=yes` and the sign. The tags come from the traffic sign tool's recommendations.
5. ~~Fixed offsets or from the road width?~~ **Decided (2026-09-30):** from the road width with TILDA's fallbacks, stacked by parking / track / sidewalk (see Geometry).
6. ~~`is_sidepath:of` / `is_sidepath:of:name`?~~ **Decided (2026-09-30):** no, the new way only gets `is_sidepath=yes` (cycleway, path) or `footway=sidewalk`.

### 18. Mapillary layer: recent imagery, own users, the selected way's images — ✅ (v1)

For Radnetz we map from recent imagery, and often from our own captures (user `radinfra`, organization `fixmycity`). The layer should make both visible at a glance.

**Data (checked 2026-09-30):** Mapillary's vector tiles (`mly1_public/2`, layer `image`) carry `id`, `captured_at`, `compass_angle`, `creator_id`, `is_pano`, `quality_score`, `sequence_id`, and on some images `organization_id` (320 of 181,216 images in one Mitte z14 tile). No usernames.
- Username → `creator_id`: Graph API `images?creator_username=<name>&limit=1&fields=creator` (`radinfra` → `750463990876291`).
- Organization slug → id: no search endpoint. Collect the `organization_id`s seen in tiles and resolve each once with `/{id}?fields=slug` (`fixmycity` → `231009332916068`); cache per session.

1. **Default age filter from 2024-01-01** — `context.photos()` starts with `fromDate = 2024-01-01` unless the URL has `photo_dates`. The age slider's histogram gets a marker line at that date ("2024-01-01: older imagery"), so mappers see how much older imagery they hide. The default comes from the project config (below).
2. **Age colors** — markers and sequence lines are colored by capture date instead of iD's single green:
   - Images older than the cutoff date are red. The cutoff is the "from" filter date, else 2024-01-01; they are only visible when the filter is widened.
   - The time from the cutoff to today is split into three equal parts: newest third green, middle yellow, oldest orange. With cutoff 2024-01-01 and today 2026-09: green from 2025-10, yellow from 2024-12, orange before.
   - The bands adapt when the filter changes. A small legend sits under the age slider.
   - Open for review: the request said "all after 1.1.2024 is red". Read here as "all *older than* 1.1.2024 is red", since newer is the preferred imagery.
3. **Highlight users and organizations** — images from listed users/orgs get an extra white-ringed dot (their own color, e.g. blue) in the middle of the marker, and their sequences a slightly thicker line.
   - Lists are comma-separated usernames and org slugs, in the URL (`photo_highlight_users=radinfra`, `photo_highlight_orgs=fixmycity`) and in the project config (`index.html`: `iD.mapillaryHighlight({ users: ['radinfra'], orgs: ['fixmycity'] })` or similar), editable in the Photo Overlays pane ("Highlight users" / "Highlight organizations" inputs next to the existing username filter).
   - URL wins over the config; the pane writes the URL.
4. **The selected way's images** — when a way is selected, every Mapillary image id in its tags (all keys of feature 19) that is in the loaded tiles gets a distinct marker (e.g. a magenta dot + a larger ring). It is shown even when the age/type/username filters would hide it. Deselecting removes it.

Code: `modules/svg/mapillary_images.ts` (classes and filter exceptions), `modules/renderer/photos.js` (defaults, URL params), `modules/ui/sections/photo_overlays.js` (marker line, legend, inputs); new TS helpers in `modules/mapillary/` (config, highlight id resolution, age bands), CSS in its own file.

**Status (v1, built by a Sonnet agent, reviewed):**
- Config: `iD.mapillaryConfig({ defaultFromDate, highlightUsers, highlightOrgs })` in `index.html` (`modules/mapillary/config.ts`; `defaultFromDate: null` turns the default filter off).
- Highlight inputs start with the configured lists; what the user enters replaces them, an empty input means no highlighting (`photo_highlight_users=` stays in the URL), entering the configured list again drops the parameter.
- Classes `mly-age-new|mid|old|outdated`, `mly-highlighted` (sequence), `mly-highlight-dot`, `mly-selected-feature-image` (magenta ring); CSS `css/97_mapillary_highlight.css`.
- Tested: at Hauptstraße/Traunsteiner Str. the radinfra images get the dot and their sequence the thicker line; bands new/mid/old show; a way's `mapillary` image older than the cutoff appears when the way is selected.
- Limits: the cutoff line on the slider stays at the configured date when the filter is widened. The selected way's images are only drawn if their tile is loaded (zoom ≥ 12).

### 19. Mapillary image fields: all our keys, several images, show in the viewer — ✅ (v1, replaces feature 14)

**Keys in our data** (Berlin PBF 2026-08, `osmium cat -f opl`; TILDA reads the same, `extract_bikelanes.lua`: `mapillary`, `source:mapillary`, `mapillary:forward/backward` (+ `source:`), `traffic_sign:mapillary`, `source:traffic_sign(:forward|:backward):mapillary`, each also on road sides after unnesting):

| Key | Berlin | | Key | Berlin |
|---|---|---|---|---|
| `mapillary` | 5835 | | `cycleway:left:traffic_sign:mapillary` | 67 |
| `cycleway:right:mapillary` | 1187 | | `cycleway:both:mapillary` | 47 |
| `source:traffic_sign:mapillary` | 1046 | | `source:mapillary` | 31 |
| `source:cycleway:right:traffic_sign:mapillary` | 675 | | `mapillary:backward` | 23 |
| `cycleway:left:mapillary` | 352 | | `traffic_sign:mapillary` | 16 |
| `source:cycleway:left:traffic_sign:mapillary` | 144 | | `source:sidewalk:right:traffic_sign:mapillary` | 15 |
| `cycleway:right:traffic_sign:mapillary` | 138 | | `cycleway:mapillary`, `source:traffic_sign:backward/forward:mapillary`, `mapillary:forward`, `sidewalk:*:mapillary`, `cycleway:both:mapillary:backward`, … | < 15 each |

- Several images in one value (`;`) are rare: 17 of 5835 `mapillary`, 1 of 31 `source:mapillary`.
- No numbered keys (`mapillary:1`, `:2`) in Berlin. Germany (`germany-latest.osm.pbf`, 70,547 `mapillary`) has the same key set plus: `mapillary:image` 220 (nonstandard), `mapillary:2019` 12 / `mapillary:2020` 8 (years; **not supported**, numbered keys have at most 3 digits), `mapillary:addr` 7, `source:ref|maxspeed:mapillary` 7 each, `mapillary_url` 4. Only `mapillary:image` is frequent enough to consider; not handled for now. The field supports numbered keys anyway.
- Not image ids, excluded: `mapillary:map_feature`, `was:mapillary`.
- Key grammar we handle: `[source:][cycleway|sidewalk[:left|:right|:both]:][traffic_sign[:forward|:backward]:]mapillary[:forward|:backward|:<n>]`, plus `source:mapillary[:forward|:backward]`. Labels from the parts, e.g. "Right bike lane · traffic sign (source)".

1. **One "Mapillary images" field** replaces the `mapillary` identifier field (custom field type, like the traffic sign field):
   - It lists every image key of the feature, one row per key.
   - Each row lists its images: `;`-separated values become a small list.
   - Per image: the id (editable), the external link (as today), and an eye button "Show in viewer". The eye button turns on the Mapillary layer, opens the viewer and selects the image (`services.mapillary.selectImage`, `showViewer`). This was feature 14.
   - Under each image: its age in relative time ("3 months ago", with the date on hover), the username, and "360°" if it is a panorama. This comes from the Graph API `/{id}?fields=captured_at,creator,is_pano`, cached per id, loaded when the row is visible.
   - "+" on a row adds another image to that key. "+ Add image" at the bottom adds a row with a key chooser: the keys above that make sense for this feature — road sides only on roads that have that side, the sign keys only with a sign.
   - The field shows when any of its keys is tagged, and is in `moreFields` of the Radnetz presets.
2. **Auto-show on select** — a checkbox in the Mapillary part of the Photo Overlays pane, on by default: "Show the way's Mapillary image when selecting it".
   - When on and a way with image keys is selected, the layer turns on and the viewer shows the first image.
   - Order: `mapillary:forward`, then `mapillary`, then the other keys in field order; the first id of a list.
   - Stored in `prefs`.

Code: `modules/mapillary/tag_keys.ts` (parse keys and values, labels, preferred image; shared with features 18 and 20, with tests), `modules/ui/fields/mapillary_images.ts`, `modules/presets/…` (field type override), strings in `data/core.yaml`.

**Status (v1, built by a Sonnet agent, reviewed):**
- Field type `mapillaryImages` (`modules/ui/fields/mapillary_images.ts`, CSS `css/98_mapillary_field.css`), helpers `modules/mapillary/{field_rows,image_info,viewer,auto_show}.ts` with tests.
- The customization replaces the `mapillary` field with `universal: true` instead of adding it to each preset's `moreFields`: every preset offers it, and it shows once any image key is tagged. `presets/field.ts`: `allKeys` includes all image keys of the tags (present/modified/revert), and the field's own label wins over the schema's translated "Mapillary Image ID".
- Pasting a Mapillary URL (`pKey=`) stores the id. Removing the last image of a key removes the tag.
- Auto-show: `context.on('enter')` hook (`initMapillaryAutoShow` in `ui/init.js`), pref `mapillary-auto-show-selected`, checkbox shown while the Mapillary layer is on.
- Layout (after review): one table row per image like the directional combo — label cell = key label + small age and image type (360° / flat, no username), value cell = id (cut off) + link + eye + trash. The "+" sits in the field label before the trash and adds a row with a key chooser.
- Not supported: multi-selection.

### 20. "Set photo from viewer" for all image keys — ✅ (v1)

iD's eye-dropper button in the photo viewer always writes `mapillary=<id>`. With the keys of feature 19 that is too limited.
- Target:
  - The main button writes to the **active target**: the image key row that was last focused or clicked in the Mapillary images field (the row gets an "active target" outline); otherwise `mapillary`.
  - A caret next to the button opens a short list of targets: the feature's existing image keys, plus the likely new ones (`mapillary:forward`, `mapillary:backward`, `cycleway:right:mapillary`, …, `source:traffic_sign:mapillary`). Each entry has a tooltip "Add to `<key>`".
- Append, don't overwrite: if the key already has images, the id is added to its `;` list (no duplicates). The button tooltip says where it goes.
- Keeps iD's disabled states ("already set" per target key, "too far").

Code: `modules/ui/photoviewer.js` (small hook), new `modules/ui/mapillary_set_photo.ts`.

**Status (v1, built by a Sonnet agent, reviewed):**
- `modules/mapillary/active_target.ts` (target per selection, `change` dispatch, shared by field and viewer), `modules/mapillary/set_photo.ts` (pure: target, append, disabled reason; tests), `modules/ui/mapillary_set_photo.ts` (button + caret menu). Hook at the top of `renderAddPhotoIdButton` in `photoviewer.js`: Mapillary only, other providers unchanged. CSS in `css/98_mapillary_field.css`.
- Only an explicitly chosen target row is outlined; with the default `mapillary` nothing is. With several features selected, the menu lists the first one's keys; "already set" needs the id on all of them.
- The button also re-renders when the viewer's image changes (iD's did not, so its disabled state could be stale).
- Open: eyeball check of the caret menu styling in a visible window.


### 21. Measuring tape ("Maßband") for width fields — ✅ (v1)

**Goal.** Measure a width on the aerial image directly from the width field, instead of guessing or using a separate tool. The measured value goes into the field with 5 cm precision.

**Where.** Every width input: `width`, `est_width`, `width:effective`, `cycleway:width`, `footway:width`, the side width fields (`cycleway|sidewalk:<side>:width`, feature 10), `buffer:*` in meters. Not the raw tag editor: it only ever shows the plain tags. Each gets a "measure" button (ruler icon, tooltip "Measure on the map") next to iD's +/- buttons.

**Start.**
- Clicking the button starts the tape for this key and the selected way.
- The width band (feature 10) is hidden while measuring and comes back afterwards.
- Initial position: the middle of the part of the way that is visible on screen, at a right angle (90°) to the way there, centered on the way, reaching to both sides.
- Initial length: the current value of the field, else the road width (`roadWidthFromTags`) for `width`, else 2 m.

**UI on the map.**
- A blue line with an end handle at both ends and the length as a label ("3.45 m").
- The handles must not hide the point being measured: a thin ring with a transparent center and a small crosshair, with a larger invisible hit area around it.
- Drag an end handle → that end moves anywhere on the map. The way only sets the start position. Drag the line itself → the whole tape moves.
- **Magnifier** while dragging an end: a round loupe (about 160 px, 3× zoom) next to the pointer shows the selected background imagery around the handle, with a crosshair. It uses a clone of the background tiles taken at drag start; the map does not move while dragging.

**Value.**
- Length = spherical distance of the two ends, rounded to 0.05 m, written without trailing zeros (`2.35`, `2.4`).
- While dragging, the field input shows the value live.
- On drag end the tag is written: one undo step per drag, "Measured width".
- Leaving the field or the way keeps the last written value; nothing is reverted.

**End.** Clicking the button again, pressing Esc, or selecting something else (or nothing) ends the tape. Moving the map keeps it (the ends are geo coordinates).

**Code (plan).**
- `modules/measure/measure_tape.ts`: state singleton — active key, entity, the two ends; dispatch `change`.
- `modules/measure/initial_tape.ts`: pure; visible middle of a way, the perpendicular line, rounding.
- `modules/svg/measure_tape.ts`: SVG layer with the line, handles, label, d3 drag.
- `modules/ui/measure_loupe.ts`: the magnifier.
- Button: added by event delegation / a small hook where iD renders fields, like the width indicator (feature 10).
- The width indicator checks the tape and hides itself while it is active.
- CSS `css/98_measure_tape.css`. Tests for the pure parts.

**Status (v1, built by a Sonnet agent, reviewed):**
- Code as planned, plus `modules/measure/measure_tape_listeners.ts` (a MutationObserver on the sidebar adds the button to width fields; raw tag rows only get the live value while dragging). CSS is `css/99_measure_tape.css`; icon `fas-pen-ruler` (already in the sprite).
- Measurable keys: `width`, `est_width`, `width:effective`, `*:width`, `buffer:*`; not `maxwidth`, not `*:source`. Needs exactly one selected way.
- Hooks in upstream files: `svg/layers.ts` (layer `measure-tape`), `svg/width_indicator.ts` (hidden while measuring), `ui/init.js` (listeners).
- Dragging the whole tape writes nothing (length unchanged); Esc is caught before it deselects the way.
- Magnifier: crosshair with a gap and a dot on the measured point, the tape drawn in the lens; placed away from the tape, beside it or diagonal (farther out near map edges), always inside the map (`modules/measure/loupe_position.ts`, tested). Handles use a crosshair cursor.
- Open: touch input untested.

### 22. Access field: all tagged access keys, add a mode of transport — ✅ (merged)

- Source: branch `show-tagged-access-tags` on origin (tordans/iD), the branch of PR openstreetmap/iD#12011. Merged as a merge commit, so later updates of the branch can be merged again.
- The "Allowed Access" field shows the default rows (All, Foot, Horses, Bicycles, Motor Vehicles) plus every tagged access key, in OSM wiki order (`modules/ui/fields/access_keys.ts`, land-based keys only; waterways use `access_simple`).
- A "+" in the field label adds a row with a key combobox ("Add a new mode of transport"); choosing a key opens the value combobox (`uiCombobox.open`).
- Remove/revert use the shown keys: the field sets `field.effectiveKeys`, and `uiField.allKeys` prefers them.
- Temporary English labels for the extra keys (`data/access_field_types.en.json`) are merged into the tagging locale until id-tagging-schema ships them (`modules/presets/access_field_type_strings.js`, hooked into the localizer).
- Merge fixes (only in this branch, not on the PR branch): the localizer hook moved to `localizer.ts` (upstream migrated it), `uiField.allKeys(tags)` keeps our argument, and the new access specs use `d3_select` instead of the removed `d3` global. **The PR branch itself needs the same spec fix when it is rebased on current develop.**
- Same "+ in the field label" pattern as the Mapillary images field (feature 19).
- Tested: a road with `bicycle=designated`, `motorcar=destination`, `hgv=no` shows Cars and Heavy goods vehicle as extra rows.

### 23. Compact sidebar — 🟨 (round 1 done)

Goal: more room for the data in the entity editor, keeping iD's look and feel.

- **Round 1 (2026-09-30):**
  - Feature type is the header of the sidebar: no disclosure, edge to edge, with a small "Feature type" line above the preset name (`modules/ui/sections/feature_type.js` uses `.content()` instead of `.disclosureContent()`).
  - All sections run edge to edge, separated by a line. The section headers are full-width rows. Their bodies keep a small gutter (`--sidebar-gutter`, 10px).
  - Fields: no grey box around them, tighter labels, inputs and spacing.
  - Tags: the raw tag editor has no side padding; the rows are the only frame.
  - Relations only follow the general section changes.
  - All in `css/99_sidebar_compact.css`, which overrides `80_app.css`. Everything is scoped to `.entity-editor`, so the preset list and the other panes are unchanged.
- **Grouping (2026-09-30):** a field with a side prerequisite sits right below its parent field, without the separator line (see feature 15, side prerequisites). General field grouping is still to be discussed.
- **Round 2 (2026-09-30), experiment: fields without boxes:**
  - A line above each field label is the only separator. The label is plain text; its buttons have no borders.
  - Inputs and buttons keep their darker background. The borders inside the input area take the sidebar color: the outer edges disappear, and the inner ones become small gaps between input, caret and buttons. The input area has rounded corners, but not while a combobox is open, so its dropdown can hang below.
  - The label buttons and the input buttons are both 26px wide, so they line up.
  - No scrollbar track when nothing scrolls, and a thin one otherwise (`.inspector-body`: `auto` instead of `scroll`).
  - Traffic sign field: the "No signs yet" text is hidden, since other fields have no empty text either.
  - Buttons we added use Font Awesome icons (measuring tape `fas-pen-ruler`, Mapillary `fas-eye`), which fill the whole icon box, while iD's icons have a margin. They are drawn at 14px so they look the same size.
  - Mapillary images field: the input fills the whole row height (the compact input height had left a gap below it), and the row buttons line up with the label buttons.
  - Not changed yet: the TILDA cards still have their boxes.
- **Open ideas (to discuss):**
  - Group the fields (e.g. "Geometry & width", "Surface", "Bike infrastructure", "Access & traffic signs", "Other"), with small subheadings inside the Fields section instead of more disclosures. Possible in a preset field order, or as a mapping from field ids to groups in our code.
  - Merge the TILDA section into the fields. For example, the TILDA checklist rows could become field groups, or the fields could show TILDA's state per field.
  - Sticky section headers, so the current section stays visible while scrolling.

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
12. Read-only feature categories
13. Hide toolbar button labels
14. Access field (PR #12011 branch, merged as is)

## Coding conventions (this branch)

- New code is TypeScript with `const`/`let`. Old upstream files stay JS; change them as little as possible and put new logic in new TS modules (e.g. `modules/ui/favorite_button.ts` is called from upstream's `feature_type.js`).
- Follow the modern TS files upstream uses: `modules/ui/sections/map_style_options.ts`, `modules/ui/fields/check.ts`, `modules/svg/mapillary_signs.ts`.
  - Global types `iD.Context`, `d3.Selection<T>`, `Tags`, `TagsMulti` from `modules/globals.d.ts`.
  - Sections: `(uiSection(id, context) as any).label(…).disclosureContent(…)`; tooltips: `(uiTooltip() as any).title(…)`.
  - d3 events: `.on('click', (d3_event, d) => …)`; namespaced listeners `store.on('change.someName', …)`; typed joins `selectAll<HTMLLIElement, Datum>(…)`.
  - Small stores are singletons with a d3 `dispatch('change')` and `utilRebind(obj, dispatch, 'on')`, persisted with `prefs()` (see `modules/core/preset_favorites.ts`, `modules/renderer/custom_data_layers.ts`).
- New CSS goes into its own file (e.g. `css/85_custom_data_layers.css`).
- Checks: `npx tsc`, `npx eslint modules test/spec`, `npx vitest run`, `npm run build:data`.

## Icon conventions (Map Data pane)

- One toggle for every list entry that can take part in the map (`modules/ui/layer_mode_toggle.ts`, `css/94_layer_mode_toggle.css`):
  - pointer (`fas-arrow-pointer`) = interactive: shown, can be selected (and edited, for OSM data). The default.
  - lock (`fas-lock`) = read-only: shown for orientation, cannot be hovered or selected. Same lock as iD's locked fields.
  - crossed eye (`fas-eye-slash`) = hidden.
  - Used by Map Features (hidden = iD's filter, read-only = feature 12) and Custom Data Layers (hidden = disabled, read-only = `selectable: false`).
- Pencil (`iD-icon-edit`) = "edit the settings of this entry" (custom backgrounds, custom data layers, lenses), like upstream's background list.
- Trash (`iD-operation-delete`) = delete the entry, always with a confirm modal.
- Tooltips in panes: one per element. Row tooltip on the `label` (never the `li`), buttons their own; both via `uiPaneTooltip()` (`modules/ui/pane_tooltip.ts`: on top, kept inside the pane). No native `title` attributes.

## Dev notes

- Dev server: `npm start` (port 8080, or `PORT=… npm start`). The CSS watcher only knows files that existed at startup; run `npm run build:css` after adding a CSS file.
- A fresh worktree needs the SVG sprites: `npx run-p "dist:svg:*"`, and the traffic sign assets: `npx run-p dist:traffic-sign-field dist:traffic-sign-converter`.
- The traffic sign packages are vendored in `vendor/` (built files from `~/Development/OSM/osm-traffic-sign-tools-id-field`, which is WIP and not fully on npm). Refresh with `npm run vendor:traffic-signs`, see `vendor/README.md`.
- `npm run build:data` merges `data/traffic_sign_field_locales.yaml` into the committed `dist/locales/de*.min.json`.
- New UI strings exist only in English (`data/core.yaml`). The localizer now always loads the English UI strings as a fallback (`modules/core/localizer.ts`), so a German browser shows German upstream strings and English for ours instead of "Missing translation". German strings for our UI are still open.

- Since the lens merge, all iD CSS is in `@layer ideditor`. CSS loaded later without a layer (e.g. `vendor/traffic-sign-field/id-field.css`) always wins over it; overriding such CSS from `css/` needs `!important` (see `css/93_traffic_sign_field.css`).

## Progress log

- 2026-09-30: Side prerequisites (feature 15): the lane type field only appears when a side has a lane; the other side is disabled with a hint to change the bike infrastructure first. Written to be reused for a later upstream PR.
- 2026-09-30: Compact sidebar round 2 (feature 23): fields without boxes, no reserved scrollbar track, same-size field buttons, Mapillary field gaps fixed, no "No signs yet" text.
- 2026-09-30: Compact sidebar, round 1 (feature 23): Feature type as the header, sections edge to edge, fields and tags tighter.
- 2026-09-30: TILDA section UI rework (feature 8): right after Feature type, category chip and edit button in each card header, grouped target select, info button for the intro, German category names generated from tilda-geo's topic docs.
- 2026-09-30: Custom data layers get an optional key=value filter (feature 4). Pane tooltips of read-only/hidden rows no longer see-through. English fallback for our UI strings in other locales. Mapillary field: input and buttons fill the row height.

- 2026-09-30: Mapillary features 18–20 and the measuring tape (21) built with Sonnet agents and reviewed; Mapillary field redesigned as a directional-combo table; magnifier fixed (crosshair, placement). Netlify now gets the project setup (`dist/index.html`). Merged the access field branch (feature 22).
- 2026-09-30: Extract a road side into a separate way (feature 17). TILDA target select also for ways TILDA does not process (feature 8).
- 2026-09-30: Traffic sign review; tag suggestions below the traffic sign field, in the same UI as the TILDA tag plan (feature 2).
- 2026-09-30: Bundled lens "Radnetz QA" (feature 5): ways colored by how complete their TILDA checklist is.
- 2026-09-29: Way table docked at the bottom, flies to the selected way.
- 2026-09-29: Data index infraVelo ⇐ TILDA ⇐ OSM (feature 16). TILDA checklist per category with keys, values and TILDA's reading (feature 8 v2). Preset customization v1: Radnetz fields, bicycle road and cycleway link presets, shorter field lists (feature 15).
- 2026-09-27: `develop` updated from upstream. Created worktree and branch `radnetz-berlin` on tordans/iD. Took stock of the feature sources. Decided on the traffic-sign source branch.
- 2026-09-27: Custom data layers can be made non-selectable. Lens section and TILDA section redesigned in iD's style; TILDA section moved to the top of the inspector. Ported the toolbar label preference from v3 (feature 13).
- 2026-09-27: Switched live touched to npm 0.1.0. Built the TILDA bike infrastructure section (feature 8 v1).
- 2026-09-27: Width indicator and side width fields. Integrated live touched (feature 11), tested with a fake backend.
- 2026-09-27: Full UI test run of all features (no OSM uploads, test edits discarded). Fixed the way table checkbox state. Merged the side indicator branch. Planned features 8–10.
- 2026-09-27: Merged the lens PR and the v6 lens shortcut commits. Added the way table panel. All six features are in `radnetz-berlin`, checked in the browser.
- 2026-09-27: Merged multiple custom backgrounds. Merged favorites and reworked the shortcuts (fixed numbers, left-hand first, swap on conflict, number input in preferences). Merged the traffic sign field (converted to TS). Added PMTiles support and multiple custom data layers. All checked in the browser with the test URLs.

## Next steps

- Known upstream behavior: leaving (blur) a directional combo row without typing rewrites `cycleway:both=no` to `cycleway=no` (upstream `directional_combo.js` calls `change` on blur and uses the common key when both sides match). Equivalent for TILDA, but an unexpected edit. Consider not writing on blur when nothing changed.
- Known issue: deleting the active custom background switches to "None" instead of the previous background (from the backgrounds branch).
- Features 8–10 (plans above).
- T10: two-account test of live touched (feature 11).
- Feature 12 (read-only categories): ready to build (v1 without interaction).
- German strings for the new UI (favorites, custom data layers, lenses, way table).
- Way table v2: raw tag editing.
- Features 18–20: Mapillary layer, image fields, set-photo targets.
- Feature 15: side-variant fields (`cycleway:<side>:separation…`), preset category, `footwayBicycleYes` preset.
- Feature 9 validations, using the data index (feature 16) as the rule list.
- Feature 17 v2: extract along the chain; snap the ends.
- Decide whether iD's single "Custom Map Data" row should stay next to the new "Custom Data Layers" section.

## Open questions

- How to bring features in: merge the source branches (easy to re-sync) or cherry-pick (cleaner history)? Default: merge.
- Where will the build be deployed for project users?
