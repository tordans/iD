# MapRoulette in iD

**Audience:** contributors updating MapRoulette UX in this iD fork.

**Keep this file updated whenever MapRoulette UX, finish flow, rendering, or APIs change.**

**Link, don’t duplicate:** next-step pool mermaid/trees live in [`maproulette-post-done-sidebar.md`](./maproulette-post-done-sidebar.md). Research: [`research-maproulette-osm-feature-ids.md`](./research-maproulette-osm-feature-ids.md), [`research-maproulette-changeset-linking.md`](./research-maproulette-changeset-linking.md).

**Official MapRoulette templating:** [challenge instructions / shortcodes](https://learn.maproulette.org/en-US/documentation/challenge-instructions-templating/), [mustache tag replacement](https://learn.maproulette.org/en-US/documentation/mustache-tag-replacement/).

---

## 1. UI parts

### Map Data (right sidebar / Layers)

Module: [`data_layers_maproulette.ts`](../modules/ui/sections/data_layers_maproulette.ts)

| Control | Behavior |
| --- | --- |
| **MapRoulette Tasks** toggle | Enables the map layer. |
| **Challenge IDs** input | Comma-separated filter. Entering IDs auto-enables the layer. Each ID links **Open {id} on maproulette.org** → `https://maproulette.org/browse/challenges/{id}`. |
| **Status line** | Zoom &lt; 12: must zoom in (with link). Loading: spinner on pin button + status text. Empty pool: **No other open tasks in view.** |
| **Pin button** (`.zoom-to-maproulette`) | One control, same challenge-scope pool as the done panel. **Next nearest task** (primary) or **Pick random task nearby** (fallback). Disabled when empty. Re-resolves pool and map center at paint/click. Does **not** show **Next priority task**. |

**Use cases:** discover open tasks in the current view; lock the map to one challenge; jump to work when the view has no pins for the filtered challenge.

### URL state

| Topic | Rule |
| --- | --- |
| **Where** | URL **hash only** (`#…maproulette=…`). Not query string. Challenge IDs are not stored in prefs. |
| `maproulette=true` | Layer on, no challenge filter. |
| `maproulette=123,456` | Layer on, filter to those challenge IDs. |
| Remove param / disable layer | Layer off; hash param cleared via `patchHash`. |
| **Startup** | [`svg/maproulette.ts`](../modules/svg/maproulette.ts) reads hash for layer enabled; [`services/maproulette.ts`](../modules/services/maproulette.ts) `init()` reads filter IDs. |
| **Hashchange** | Generic hash handling does not re-parse MapRoulette params (startup-only, same pattern as `notes=`). Map Data writes hash via `patchHash` when the toggle or filter changes. |
| **Prefs** | Only `maproulette-update-timing` (`with_save` default). **Last-worked challenge** is in-memory session state, not URL. |

### Map pins

Modules: [`svg/maproulette.ts`](../modules/svg/maproulette.ts), [`svg/maproulette_marker.ts`](../modules/svg/maproulette_marker.ts), [`util/maproulette_pin_loc.ts`](../modules/util/maproulette_pin_loc.ts)

| Topic | Detail |
| --- | --- |
| **Load** | Viewport fetch at zoom ≥ 12; tiles at z14. |
| **Click** | Error-select mode → MapRoulette left sidebar. |
| **Styles** | V4 status fill; muted fill for recently resolved; priority wedge only on Created/Skipped; selected = purple border; earmarked = green border; finished (recently resolved) = solid status fill, no wedge. |
| **Location** | Pin can snap onto a LineString from task geometry (`snapMapRoulettePinLoc`). |
| **Open** | Created (0) or Skipped (3). |
| **Recently resolved** | Fixed, False Positive, Already Fixed, Too Hard stay on the map **24h** from `mappedOn`. |
| **Unfiltered list** | Pins from disabled or deleted challenges are hidden (`challengeIsVisible`: `enabled && !deleted`). |

### MR left sidebar (pin selected)

Modules: [`maproulette_editor.ts`](../modules/ui/maproulette_editor.ts), [`maproulette_details.ts`](../modules/ui/maproulette_details.ts), [`maproulette_completion.ts`](../modules/ui/maproulette_completion.ts), [`maproulette_save_controls.ts`](../modules/ui/maproulette_save_controls.ts), [`maproulette_done_panel.ts`](../modules/ui/maproulette_done_panel.ts)

| Area | Content |
| --- | --- |
| **Header** | “MapRoulette Tasks”, close, footer **View on MapRoulette** (challenge/task URL). |
| **Meta** | Challenge/task ids; recognised OSM objects (pin sidebar only). |
| **Details / Instructions** | iD disclosures (blue hide-toggle). See default-open table below. Session memory per `taskId:section` when the mapper toggles them. |
| **While active** | Tag-fix UI, With save / Right away, optional comment (Right away only), status buttons. |
| **While done** | Status banner; **Undo** if queued; next-step buttons; finish controls hidden. |

**Details / Instructions default open (pin sidebar only)**

| State | Details | Instructions |
| --- | --- | --- |
| Active, no Map Data challenge filter | **open** | **open** |
| Active + Map Data challenge filter | **closed** | **open** |
| Done (queued or resolved) | **closed** | **closed** |

### OSM inspector MapRoulette section

Module: [`sections/maproulette_task.ts`](../modules/ui/sections/maproulette_task.ts)

| Topic | Detail |
| --- | --- |
| **When** | MapRoulette layer on and `getTasksForEntity` matches the selected OSM entity. |
| **Section** | Outer inspector section **collapsed by default** (`expandedByDefault(false)`). Label can link to pin sidebar (`#taskId` → error-select). |
| **Body** | Same completion widgets as pin sidebar; **no** per-section Details/Instructions disclosures (plain description + instruction body); **no** Show OSM; **no** pin meta row. |
| **Pins** | Matching map pins highlighted when the section is expanded. |
| **Tag-fix embed** | May show legacy “Go to next nearby…” when the focused entity already matches cooperative targets. |

---

## 2. Next steps

Full pool logic, mermaid flows, and picker details: [`maproulette-post-done-sidebar.md`](./maproulette-post-done-sidebar.md).

The same challenge-scope candidate pool appears in **three UIs**. Candidates are open tasks already in the client cache (from `/tasks/box`), excluding the finished task.

| UI | Next nearest | Next priority | Pick random nearby | Show OSM |
| --- | --- | --- | --- | --- |
| **Map Data** pin button | yes (primary mode) | no | yes (fallback mode) | no |
| **Pin sidebar** (done) | yes (primary) | yes (primary) | yes (fallback) | yes, if linked elems |
| **OSM inspector** (done) | yes (primary) | yes (primary) | yes (fallback) | no |

Click handlers re-resolve pool, map center, and viewport at click time. Which buttons are **visible** is decided when the done panel paints (or after Undo / Accept); pan/zoom alone does not swap Nearest/Priority vs Random until re-render.

---

## 3. How to confirm / finish

### With save vs Right away

| | **With save** (default) | **Right away** |
| --- | --- | --- |
| MapRoulette API | Queue outcome (earmark + `localDone`); update after OSM upload | `POST` comment (if any) → `PUT` status → `GET` release |
| Comment field | Hidden; leftover user comment is **not** sent (`shouldClearHiddenComment`) | Optional, max 1000 chars |
| Timing storage | Pref `maproulette-update-timing` | Same pref (not per-task) |
| After success | Queued banner + Undo + next-step buttons | Resolved banner + next-step buttons |

### Tag-fix tasks

| Rule | Detail |
| --- | --- |
| Timing | Always **With save** (`effectiveUpdateTiming` in-memory override; prefs unchanged). |
| Tooltip | `update_timing_tag_fix_tooltip`: can only resolve when the changeset is uploaded (merge-conflict avoidance). |
| **Fixed** button | Hidden while Accept is showing (`tagFixReady && tagFixHasAccept`). |
| Accept | Applies OSM tags locally, earmarks Fixed with `markLocalDone: true`; does not call MapRoulette API until upload. |

### Upload sidebar

Module: [`commit_maproulette.ts`](../modules/ui/commit_maproulette.ts)

| Topic | Detail |
| --- | --- |
| Checklist | MapRoulette tasks earmarked for this upload; mapper can uncheck. |
| Changeset **comment** / **source** | Prefilled from challenge `checkinComment` / `checkinSource` via plain-text mustache per cached task (`mustacheContextFromCachedTask`, `replaceMustacheTags` without HTML escape). |
| Hashtag | Adds `#maproulette`. |
| OSM tags | May set `closed:maproulette*` tags from session outcomes. |
| Heading | Uses `t.addOrUpdate('commit.maproulette_earmarks_title')` (no stacked titles). |

### After upload

Module: [`success_maproulette.ts`](../modules/ui/success_maproulette.ts)

| Step | Detail |
| --- | --- |
| Progress UI | Per-earmark resolve progress in success sidebar. |
| Auto comment | `Resolved by {username} in changeset {url}…` with quoted changeset comment (`buildMapRouletteResolveComment`). |
| Failures | Failed earmarks restored to `sessionStorage` via `restoreEarmarks`. |

---

## 4. Tag-fix suggestions

Modules: [`util/maproulette_cooperative.ts`](../modules/util/maproulette_cooperative.ts), [`maproulette_tag_fix.ts`](../modules/ui/maproulette_tag_fix.ts)

| Topic | Detail |
| --- | --- |
| Payload | Cooperative `cooperativeWork` on the task (from detail load or cache). |
| **Accept** | Applies matched OSM tag diffs **locally**; earmarks Fixed. **Does not** call `POST /task/:id/fix/apply`. |
| Queue | Outcome sent on OSM save, same as other With save finishes. |
| Annotation | `Accepted MapRoulette tag fix` on affected entities. |
| Copy | Unavailable / unmatched / already matches strings from [`data/core.yaml`](../data/core.yaml) (`tag_fix_*` keys). |

---

## 5. Description / instruction rendering

Module: [`maproulette_details.ts`](../modules/ui/maproulette_details.ts) — pipeline: mustache → markdown (`marked`) → OSM linkify → shortcodes → DOMPurify.

Utilities: [`maproulette_mustache.ts`](../modules/util/maproulette_mustache.ts), [`maproulette_markdown.ts`](../modules/util/maproulette_markdown.ts)

### Mustache

| Context | `{{property}}` | `{{osmIdentifier}}` | Missing property |
| --- | --- | --- | --- |
| Instructions (HTML) | From task GeoJSON properties; HTML-escaped | From title | Leave `{{tag}}` in output |
| Changeset templates | Plain text, not escaped | Same | Empty string |

### Shortcodes

Official docs: [challenge instructions templating](https://learn.maproulette.org/en-US/documentation/challenge-instructions-templating/).

| Shortcode | Behavior |
| --- | --- |
| `[select "Label" name="k" values="a,b"]` | Label wraps control; answer → `completionResponses[name]` (string) on status PUT |
| `[checkbox "Label" name="c"]` | Answer → `completionResponses[name]` (boolean) |
| `[copyable "text"]` | Clipboard only; not sent to API |
| `{{{…}}}` | Deprecated triple-brace form of select/checkbox |

### Recognised OSM objects

Module: [`maproulette_osm_ids.ts`](../modules/util/maproulette_osm_ids.ts) — sniffs title, geometries, instruction text. Broader than MapRoulette V4; see [`research-maproulette-osm-feature-ids.md`](./research-maproulette-osm-feature-ids.md). Clickable links highlight/select entities in iD.

---

## 6. APIs and data model

Service: [`services/maproulette.ts`](../modules/services/maproulette.ts) — base `https://maproulette.org/api/v2`.

Schemas: [`maproulette_api_schema.ts`](../modules/util/maproulette_api_schema.ts) (Zod parse at service boundary).

| When | API |
| --- | --- |
| Pan/zoom ≥ 12 | `GET /tasks/box/{bbox}?tStatus=0,1,2,3,5,6&includeGeometries=true` |
| New challenge ids in filter/cache | `GET /challenge/{id}` |
| Open pin / inspector enrich | `GET /task/{id}` (detail, geometries, cooperativeWork, instruction) |
| Right away finish | `POST /task/{id}/comment?actionId=2` (body: `{ comment }`) → `PUT /task/{id}/{status}` (JSON body = `completionResponses` if any) → `GET /task/{id}/release` (best-effort) |
| After OSM upload | Same PUT/comment sequence per earmarked task (`resolveEarmarksAfterChangeset`) |

### Auth / API key

| Topic | Detail |
| --- | --- |
| Storage | OSM user pref `maproulette_apikey_v2` via `loadMapRouletteKey` |
| Header | `apiKey` on mutating requests |
| 401 | Link to `https://maproulette.org/user/profile#apikey` in save controls |

### Client-only state

| Key | Purpose |
| --- | --- |
| `sessionStorage` `iD-maproulette-earmarks` | Earmarks queued for upload |
| `localDone` on earmark | Gray pin + done UI before API confirms; set by status buttons and Tag-fix Accept |
| Soft earmark | Earmark without `localDone` — queued for upload but pin stays visually open |
| OSM id sniffing | Client-side only; not an MR API |
| Challenge visibility | Unfiltered pins require `enabled && !deleted` on cached challenge metadata |

### 24h resolved pins

Terminal statuses (Fixed, False Positive, Already Fixed, Too Hard) render with muted styling for **24 hours** after `mappedOn`, then drop from the map. Tile soft-reload (~2 min) helps remote fixes propagate.

### Last-worked challenge (session)

[`maproulette_next_task.ts`](../modules/util/maproulette_next_task.ts) — `setLastWorkedChallengeId` on complete or Tag-fix Accept. Used for next-step pool when no Map Data filter is set. Not persisted to URL or prefs.

### Global spinner while tiles load

[`ui/spinner.js`](../modules/ui/spinner.js) shows the app spinner when the MapRoulette layer is enabled and `isLoadingIssues(projection, zoom)` is true (inflight tiles, pending viewport tiles, or blocking challenge metadata).

### Inspector Tags textarea

When the MapRoulette inspector section is present, [`raw_tag_editor.js`](../modules/ui/sections/raw_tag_editor.js) forces the Tags editor to **text view** (`mapRoulettePresent` from [`entity_editor.js`](../modules/ui/entity_editor.js) via `onPresenceChange`).

---

## Related tests

| Area | Spec |
| --- | --- |
| Service / cache / API | [`test/spec/services/maproulette.ts`](../test/spec/services/maproulette.ts) |
| Next-task pool | [`test/spec/util/maproulette_next_task.ts`](../test/spec/util/maproulette_next_task.ts) |
| Completion / finish | [`test/spec/util/maproulette_completion.ts`](../test/spec/util/maproulette_completion.ts) |
| Commit / upload | [`test/spec/ui/commit_maproulette.ts`](../test/spec/ui/commit_maproulette.ts) |
| Markdown / mustache | [`test/spec/util/maproulette_markdown.ts`](../test/spec/util/maproulette_markdown.ts), [`test/spec/util/maproulette_mustache.ts`](../test/spec/util/maproulette_mustache.ts) |
