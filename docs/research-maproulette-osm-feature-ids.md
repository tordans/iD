# MapRoulette V4: How OSM element identifiers are detected

**Summary:** The V4 UI message **“No OSM Feature Detected”** is driven entirely by a frontend parser (`parseOsmFeatureFromTask` / `parseOsmFeatureFromProperties` in `osmUtils.ts`). It inspects **only** each task GeoJSON feature’s **`properties`** (not task title/instructions, not GeoJSON `feature.id`). It accepts typed strings like `way/12345` on `@id` / `id` / `osm_id`, or numeric `osmid` / `osm_id` / `@osmId` plus an explicit or geometry-inferred type. Short forms (`w123`), bare numeric `id`, and free-text in instructions are **not** accepted for this history path. If at least one feature parses, the OSM History tab shows feature + element history; otherwise it shows the empty-state message. The same parser also feeds external editor selection URLs and the embedded iD selection list.

Researched against:

- Frontend: [maproulette/maproulette3](https://github.com/maproulette/maproulette3) branch **`v4`** @ `e6bcdea2696908c2acc21102a6bc6dd8fa9c0602`
- Docs: [Setting external task IDs](https://learn.maproulette.org/en-US/documentation/setting-external-task-identifiers/) (challenge external-id assignment — related but **not** the history empty-state logic)
- iD fork comparison: `modules/util/maproulette_osm_ids.ts` in this repo

Backend was **not** required for the empty-state message; detection is client-side on `task.geometries`.

---

## Story from the MapRoulette side (user-facing)

1. Mapper opens a task → Task Info → **OSM History** tab.
2. V4 runs `parseOsmFeatureFromTask(task)` over `task.geometries.features`.
3. **If a feature id is found:**
   - **OSM Feature** card (`type/id`, link to OSM)
   - **Element History** card (fetches `GET /api/0.6/{type}/{id}/history.json`)
4. **If none found:** empty state:
   - Title: “No OSM Feature Detected”
   - Body: *This task's geometry does not contain OSM element identifiers (like `@id: "way/12345"`). OSM feature history is only available when tasks reference specific OpenStreetMap elements.*
5. Independently, **Area History** / **Task Timeline** still render; **Linked Changeset** vs “No Changeset Linked” uses `task.changesetId` (separate concern — see `research-maproulette-changeset-linking.md`).

The empty-state copy’s example (`@id: "way/12345"`) matches the **preferred** typed-string convention in code.

---

## Where they look (locations in the payload)

### For “No OSM Feature Detected” / element history (V4)

| Location | Used? | Notes |
| --- | --- | --- |
| `task.geometries.features[].properties['@id']` | **Yes** | Preferred for typed `type/digits` |
| `…properties.id` | **Yes** | Typed string only (`way/123`); bare numeric `id: 123` is ignored |
| `…properties.osm_id` | **Yes** | Typed string **or** numeric (see formats) |
| `…properties.osmid` | **Yes** | Numeric path |
| `…properties['@osmId']` | **Yes** | Numeric path |
| `…properties['@type']` / `…properties.osm_type` | **Yes** | Type companion for numeric ids |
| `feature.geometry.type` | **Yes** | Infer type when numeric id has no explicit type |
| GeoJSON top-level `feature.id` | **No** | Only `feature.properties` is read |
| Task `title` / `name` / instruction / description | **No** | Not scanned for history |
| Nested blobs outside each feature’s `properties` | **No** | Loop is `for (const feature of task.geometries.features)` then `feature.properties` |

Core loop:

```ts
// src/components/TaskInfoPanel/taskUtils/osmUtils.ts
export const parseOsmFeaturesFromTask = (task: Task): OsmFeature[] => {
  const out: OsmFeature[] = []
  for (const feature of task.geometries.features) {
    if (!feature.properties) continue
    const parsed = parseOsmFeatureFromProperties(feature.properties, feature.geometry?.type)
    if (parsed) out.push(parsed)
  }
  return out
}
```

`parseOsmFeatureFromTask` returns the **first** parseable feature only (used by the History tab UI).

### Related but different: challenge “external id” docs

Official docs describe how MapRoulette **assigns unique external task identifiers** at challenge build time, scanning feature fields then properties for `id`, `@id`, `osmid`, `osm_id`, `name` (or a custom “OSM/External Id Property”). That path can mint a **UUID** when nothing matches, and MapRoulette “inspects external identifiers to determine if they match the format of OSM ids before treating them as such.”

That is **challenge-ingestion / editor-preselect identity**, not the V4 History empty-state predicate. The History tab does **not** treat `name` as an OSM element id, and does not use randomly assigned UUIDs as OSM features.

---

## Formats / patterns accepted

Implementation in `parseOsmFeatureFromProperties`:

### 1. Typed string: `^(node|way|relation)/(\d+)$`

Checked on, in order: `@id` → `id` → `osm_id` (first truthy wins via `||`).

Must be a **string** matching that regex exactly (full-string match).

| Input | Result |
| --- | --- |
| `@id: "way/12345"` | `{ type: 'way', id: 12345 }` |
| `id: "node/1"` | node/1 |
| `osm_id: "relation/789"` | relation/789 |
| `@id: "not-a-valid-id"` | ignored (falls through) |
| `id: 123` (number) | **not** accepted as typed; also **not** in numeric field list → **null** |
| `@id: "w123"` / `"way 123"` / `"way/123@0"` | **not** accepted |

### 2. Numeric id + type

Fields (first truthy): `osmid` → `osm_id` → `@osmId`.

- Coerced with `Number(...)`; must be finite and `> 0`.
- Numeric **strings** like `"444"` work.
- Type from `@type` or `osm_type` (case-insensitive `node`/`way`/`relation`).
- Else infer from geometry:
  - `Point` → `node`
  - `LineString` / `MultiLineString` / `Polygon` → `way`
  - `MultiPolygon` → `relation`
  - other / missing geometry → **null**

| Input | Result |
| --- | --- |
| `{ osmid: 111, '@type': 'Node' }` | node/111 |
| `{ osm_id: 222, osm_type: 'way' }` | way/222 |
| `{ osmid: 1 }` + Point | node/1 |
| `{ osmid: 0 }` or negative | **null** |
| `{ osmid: 6 }` + GeometryCollection | **null** |

### Explicitly **not** accepted (for this V4 history/editor parser)

- Short OSM forms: `w123`, `n456`, `r789`
- MapRoulette task titles like `w123@0`
- Bare numeric `properties.id` or `@id: "123"` without type (and no other numeric fields)
- Overpass QL / URLs
- Free text in instructions (“please fix way/123”)
- `properties.name` as an element id

Unit tests: [`osmUtils.test.ts` on `v4`](https://github.com/maproulette/maproulette3/blob/v4/src/components/TaskInfoPanel/taskUtils/osmUtils.test.ts).

---

## Conditions: empty state vs history

From [`OSMHistoryTab.tsx`](https://github.com/maproulette/maproulette3/blob/v4/src/components/TaskInfoPanel/OSMHistoryTab/OSMHistoryTab.tsx):

```tsx
const osmFeature = parseOsmFeatureFromTask(task)

return (
  <>
    {osmFeature ? (
      <>
        <OSMFeatureCard … />
        <ElementHistoryCard … />
      </>
    ) : (
      // “No OSM Feature Detected” + description mentioning @id: "way/12345"
    )}
    {/* Linked changeset / area history / timeline are separate */}
  </>
)
```

| Condition | UI |
| --- | --- |
| `parseOsmFeatureFromTask(task)` returns non-null | OSM Feature + Element History cards |
| returns `null` (no properties, no matching keys/patterns, invalid numbers, un-inferable geometry) | “No OSM Feature Detected” |
| Features without properties are skipped; later features can still match | First successful parse wins for the single-feature UI |

Element history fetch (`ElementHistoryCard`): `api.osm.fetchOSMElementHistory(\`${type}/${id}\`, true)` → OSM API `…/api/0.6/{type}/{id}/history.json`.

---

## Code paths that use the extracted ids

| Consumer | File (v4) | How ids are used |
| --- | --- | --- |
| OSM History tab empty vs feature/history | [`OSMHistoryTab.tsx`](https://github.com/maproulette/maproulette3/blob/v4/src/components/TaskInfoPanel/OSMHistoryTab/OSMHistoryTab.tsx) | `parseOsmFeatureFromTask` |
| OSM Feature card | [`OSMFeatureCard.tsx`](https://github.com/maproulette/maproulette3/blob/v4/src/components/TaskInfoPanel/OSMHistoryTab/OSMFeatureCard.tsx) | Display `type/id`, link to OSM |
| Element History card | [`ElementHistoryCard.tsx`](https://github.com/maproulette/maproulette3/blob/v4/src/components/TaskInfoPanel/OSMHistoryTab/ElementHistoryCard.tsx) | History API |
| Shared parser / formatter | [`osmUtils.ts`](https://github.com/maproulette/maproulette3/blob/v4/src/components/TaskInfoPanel/taskUtils/osmUtils.ts) | `parseOsmFeaturesFromTask`, `formatOsmEntities` |
| External editors | [`EditorButton.tsx`](https://github.com/maproulette/maproulette3/blob/v4/src/components/Pages/TaskEditPage/TaskActions/EditorButton.tsx) | iD: `node=`/`way=`/`relation=`; Rapid: `id=n…,w…`; JOSM: `select=` / `objects=`; Level0: `url=` |
| Embedded iD | [`IdEditorView.tsx`](https://github.com/maproulette/maproulette3/blob/v4/src/components/Pages/TaskEditPage/IdEditorView.tsx) | Builds `n`/`w`/`r` entity ids for hash `#id=` and selection |
| OSM HTTP helpers | [`src/api/osm.ts`](https://github.com/maproulette/maproulette3/blob/v4/src/api/osm.ts) | Expects `type/id` strings for element/history |

`formatOsmEntities`:

- `abbreviated: true` → `n123,w456,r789` (Rapid / some iD hashes)
- `abbreviated: false` → `node123,way456,relation789` (JOSM)

---

## Code references (full GitHub URLs on `v4`)

- Parser: https://github.com/maproulette/maproulette3/blob/v4/src/components/TaskInfoPanel/taskUtils/osmUtils.ts
- Tests: https://github.com/maproulette/maproulette3/blob/v4/src/components/TaskInfoPanel/taskUtils/osmUtils.test.ts
- Empty-state UI: https://github.com/maproulette/maproulette3/blob/v4/src/components/TaskInfoPanel/OSMHistoryTab/OSMHistoryTab.tsx
- Feature card: https://github.com/maproulette/maproulette3/blob/v4/src/components/TaskInfoPanel/OSMHistoryTab/OSMFeatureCard.tsx
- History fetch UI: https://github.com/maproulette/maproulette3/blob/v4/src/components/TaskInfoPanel/OSMHistoryTab/ElementHistoryCard.tsx
- OSM API client: https://github.com/maproulette/maproulette3/blob/v4/src/api/osm.ts
- Editor launch: https://github.com/maproulette/maproulette3/blob/v4/src/components/Pages/TaskEditPage/TaskActions/EditorButton.tsx
- Embedded iD: https://github.com/maproulette/maproulette3/blob/v4/src/components/Pages/TaskEditPage/IdEditorView.tsx

**Older main-branch note (not V4 History):** [`AsIdentifiableFeature.js` on `main`](https://github.com/maproulette/maproulette3/blob/main/src/interactions/TaskFeature/AsIdentifiableFeature.js) accepted a broader set (`@id`, `osmid`, `osmIdentifier`, `id` on feature **or** properties; short `n`/`w`/`r` prefixes; looser regex). V4’s `osmUtils.ts` is stricter and properties-only. Do not assume main-branch behavior for the V4 empty state.

---

## Implications for challenge authors / iD

### Challenge authors (so V4 History + editor preselect work)

Prefer Overpass/`osmtogeojson`-style properties:

```json
"properties": { "@id": "way/12345" }
```

Also reliable:

- `id: "node/…"` / `"way/…"` / `"relation/…"` (string)
- `osmid` / `osm_id` / `@osmId` as positive number **plus** `@type`/`osm_type`, **or** a geometry that can infer type

Avoid relying on:

- Task title alone (`w123@0`)
- Short ids (`w123`) in properties for V4 history
- Numeric-only `id` without type
- Putting the id only on GeoJSON `feature.id` (top-level)

Docs tip: id fields should be **strings** in GeoJSON for external identifiers; for V4 typed parsing, string form is required for the `@id`/`id`/`osm_id` typed branch.

### iD MapRoulette integration vs V4 (mismatch)

This repo’s `modules/util/maproulette_osm_ids.ts` (`collectOsmEntityIds`) is **broader** than V4 `osmUtils`:

| Behavior | MapRoulette V4 `osmUtils` | iD `collectOsmEntityIds` |
| --- | --- | --- |
| Scope | Each feature’s `properties` only | Deep walk of task/title/name/nested objects (skips geometry blobs) |
| `way/123` | Yes | Yes |
| `w123` / `n…` / `r…` | **No** | Yes |
| Title `w123@0` | **No** | Yes |
| Free text containing ids | **No** | Yes (long/short regex) |
| Numeric `osmid` + geometry infer | Yes | Treats numbers as strings; bare `12345` alone yields **no** typed entity |
| Preferred keys | `@id`, `id`, `osm_id`, `osmid`, `@osmId` | Prefers `title`, `name`, `osmId`, `osm_id`, `osmid`, `id`, `identifier` then walks all keys |

**Practical mismatch:** A challenge whose only reference is a title like `w123@0` (or short-form properties) can still surface entities in iD’s MapRoulette UI, while MapRoulette V4 shows **“No OSM Feature Detected”** and will not preselect those entities in V4’s own editor launchers. Conversely, V4’s numeric `osmid` + Point→node inference works in MR without an `n`/`node/` prefix; iD’s collector needs a typed long/short form in a string to emit `n123`.

For alignment with V4 History and editor URLs, challenge GeoJSON should include typed `@id` (or equivalent) on **feature properties**, which both sides understand.

---

## Sources

1. [maproulette3 `v4` `osmUtils.ts`](https://github.com/maproulette/maproulette3/blob/v4/src/components/TaskInfoPanel/taskUtils/osmUtils.ts) @ `e6bcdea2696908c2acc21102a6bc6dd8fa9c0602`
2. [maproulette3 `v4` `osmUtils.test.ts`](https://github.com/maproulette/maproulette3/blob/v4/src/components/TaskInfoPanel/taskUtils/osmUtils.test.ts)
3. [maproulette3 `v4` `OSMHistoryTab.tsx`](https://github.com/maproulette/maproulette3/blob/v4/src/components/TaskInfoPanel/OSMHistoryTab/OSMHistoryTab.tsx) (empty-state copy)
4. [maproulette3 `v4` `EditorButton.tsx`](https://github.com/maproulette/maproulette3/blob/v4/src/components/Pages/TaskEditPage/TaskActions/EditorButton.tsx), [`IdEditorView.tsx`](https://github.com/maproulette/maproulette3/blob/v4/src/components/Pages/TaskEditPage/IdEditorView.tsx)
5. [maproulette3 `v4` `src/api/osm.ts`](https://github.com/maproulette/maproulette3/blob/v4/src/api/osm.ts)
6. Docs: [Setting external task IDs (e.g. OSM IDs)](https://learn.maproulette.org/en-US/documentation/setting-external-task-identifiers/)
7. Docs (context): [Line-by-Line GeoJSON Format](https://learn.maproulette.org/en-US/documentation/line-by-line-geojson/)
8. Older MR3: [AsIdentifiableFeature.js (`main`)](https://github.com/maproulette/maproulette3/blob/main/src/interactions/TaskFeature/AsIdentifiableFeature.js)
9. This repo: `modules/util/maproulette_osm_ids.ts`, `test/spec/util/maproulette_osm_ids.js`
