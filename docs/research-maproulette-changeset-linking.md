# MapRoulette V4: How OSM changesets are linked to tasks

**Summary:** MapRoulette stores a linked OSM changeset on each task as `changesetId` / DB `tasks.changeset_id`. The V4 UI shows **“No Changeset Linked”** when that value is missing or ≤ 0. Linking is **server-side only**: the backend matches closed OSM changesets for the user who marked the task **FIXED**, within a time window, preferring changesets whose `comment` tag contains `"maproulette"` (case-insensitive), otherwise requiring bbox intersection with the task geometry. The V4 frontend does **not** call the match API; it only displays `task.changesetId` and pre-fills editor changeset comments (including `#maproulette-beta` and an optional short task URL).

Researched against:

- Frontend: [maproulette/maproulette3](https://github.com/maproulette/maproulette3) branch **`v4`** @ `e6bcdea2696908c2acc21102a6bc6dd8fa9c0602`
- Backend: [maproulette/maproulette-backend](https://github.com/maproulette/maproulette-backend) `main` @ `8b445ce068fbdbda61f419b1cc152edf731240ab`
- Docs: [Creating a Challenge](https://learn.maproulette.org/en-US/documentation/creating-a-challenge/)

---

## Story from the MapRoulette side (user-facing flow)

1. Mapper opens a task and launches an editor (embedded iD, external iD/Rapid, JOSM, etc.).
2. MapRoulette V4 builds a changeset **comment** from the challenge’s `checkinComment`, optionally appends a short task URL (`VITE_SHORT_URL/c/{challengeId}/t/{taskId}`), and appends `#maproulette-beta` during the MR4 beta.
3. Mapper saves edits to OSM (changeset must eventually be **closed**).
4. Mapper marks the MapRoulette task as completed (**FIXED**, status `1`).
5. Backend attempts to link an OSM changeset to the task (immediately and/or via scheduled job / manual API — see below), writing `tasks.changeset_id`.
6. Task Info → OSM History tab:
   - If `changesetId > 0`: **“Linked Changeset”** with links to OSM / OSMCha / Overpass Turbo.
   - Else: **“No Changeset Linked”** plus the explanatory copy that a changeset will be linked automatically when the task is completed and edits are saved to OSM.

**Important nuance:** The UI message implies automatic linking after completion + OSM save. The actual mechanism is a **heuristic OSM API lookup on the server**, not the editor posting a changeset ID back to MapRoulette. Linking can lag, fail, or be skipped depending on server config and match conditions.

---

## Conditions / matching rules

### Stored field

| Layer | Field | Meaning |
| --- | --- | --- |
| API / JSON | `changesetId` (`Option[Long]` / number) | Linked OSM changeset id |
| DB | `tasks.changeset_id` | Default **`-1`** (not linked yet) |
| UI “linked” | `changesetId && changesetId > 0` | Show Linked Changeset card |
| Gave up | `-2` | Matcher already tried and found nothing viable after the time window |

Schema default (`-1`) was added in evolution `13.sql`.

### What the matcher looks for on OSM changesets

Matching is **not** based on `closed:maproulette`, a dedicated OSM tag key, or parsing a task id out of the comment.

**Comment substring (strong signal):** When parsing OSM changeset XML, MapRoulette sets `hasMapRouletteComment = true` if **any tag** has:

- key exactly `comment`, and
- value containing `"maproulette"` (**case-insensitive** substring).

So `#maproulette`, `#maproulette-beta`, `Fixed via MapRoulette`, or a URL containing `maproulette` in the **changeset comment** all set this flag. Other tags (`source`, `created_by`, etc.) are **not** checked for this flag.

**Selection pipeline** (`TaskDAL.matchToOSMChangeSet` + `getSortedChangeList`):

1. Task status must be **FIXED** (`STATUS_FIXED = 1`).
2. Matching must be allowed: `allowMatchOSM = changeSetEnabled \|\| osmMatcherEnabled \|\| osmMatcherManualOnly`.
3. Load the status-action row for who marked the task FIXED (uses that row’s `osmUserId` and `created` timestamp).
4. Query OSM:  
   `GET {osmServer}/api/0.6/changesets?user={osmUserId}&time={fixed−limit},{fixed+limit}`  
   Default time limit: **`1 hour`** (`maproulette.tasks.changesets.timeLimit`).
5. Keep only **closed** changesets (`filter(!_.open)`).
6. Sort by closeness of changeset `created_at` to the FIXED action time.
7. Take the **first** changeset where:
   - **`hasMapRouletteComment`** → accept **without** geometry check, **or else**
   - changeset bbox **intersects** the task GeoJSON geometry envelope.
8. On success: `UPDATE tasks SET changeset_id = {change.id}`.
9. On no match: if wall-clock time since FIXED exceeds the time limit, set `changeset_id = -2` (stop retrying). Otherwise leave `-1` for a later attempt.

**Not used by the matcher (clarifications):**

- No `closed:maproulette` (or similar) OSM tag.
- No requirement that the comment contain the task id or short URL (those help humans / analytics; matcher only needs the `"maproulette"` substring for the comment fast-path).
- Challenge `checkinSource` / OSM `source=` is prefilled for editors but **not** consulted during linking.
- The `immediate` parameter on `matchToOSMChangeSet` appears **unused** in the method body (call sites pass `true`/`false`, but logic does not branch on it).

### Official docs (comment / hashtag expectations)

[Creating a Challenge](https://learn.maproulette.org/en-US/documentation/creating-a-challenge/) states that the challenge **Changeset Description** prefills the editor comment, that a URL to the challenge/task is added when the challenge is discoverable, and that a **`#maproulette` hashtag will be added** unless the creator changes that default. Docs do **not** document the server-side bbox/time matching algorithm or the `changesetId` field.

The “MapRoulette Tags” docs page is about **in-app task filter tags**, not OSM changeset tags.

### When linking is triggered (server-side)

| Trigger | Condition | Code |
| --- | --- | --- |
| On task status update | If `maproulette.tasks.changesets.enabled` (`changeSetEnabled`) | After unlock in `setTaskStatus`, fire-and-forget `matchToOSMChangeSet` |
| Scheduled job `OSMChangesetMatcher` | If `osmMatcher.enabled`; selects `status = 1 AND changeset_id = -1` (batch size default 5000); interval default **24 hours** | `SchedulerActor.matchChangeSets` |
| Manual task API | `PUT /api/v2/task/:id/changeset` | `TaskController.matchToOSMChangeSet` |
| Manual challenge API | `GET /api/v2/challenge/:id/matchChangesets?skipSet=` (owner/superuser) | `ChallengeController.matchChangeSets` |

**Default config in repo** (`conf/application.conf`): both `tasks.changesets.enabled = false` and `scheduler.osmMatcher.enabled = false`. Production may override these; the public repo defaults alone do **not** prove what maproulette.org runs.

### Success / failure conditions (practical)

**Likely success** when all of:

- Task marked **FIXED**
- Same OSM user closed a changeset in the time window around FIXED
- Changeset is **closed** when queried
- Either comment contains `"maproulette"` **or** changeset bbox intersects task geometry
- Matching feature enabled via one of the config flags above
- `changeset_id` not already stuck at `-2` (scheduler only picks `-1`)

**Failure / no link** when:

- Task not FIXED (other completion statuses are not matched)
- Matching disabled (`allowMatchOSM` false)
- No FIXED status-action row for the user
- OSM request fails / non-200
- Only **open** changesets in window (still editing / not closed yet) — filtered out
- No comment match **and** no bbox intersection
- Time window elapsed without a match → `-2` (permanent give-up for the scheduler path)
- Wrong OSM user marked FIXED vs who uploaded the changeset
- Ambiguity: with multiple MR-comment changesets, **first by time proximity** wins; comment fast-path **skips** bbox, so the “wrong” nearby MR changeset can be attached

**Client (V4):** does not invoke match endpoints; refresh of task JSON is required to see a newly written `changesetId`.

---

## Code references

### Frontend (v4) — UI strings & display

**“No Changeset Linked”** — `OSMHistoryTab` when `!(changesetId && changesetId > 0)`:

- https://github.com/maproulette/maproulette3/blob/v4/src/components/TaskInfoPanel/OSMHistoryTab/OSMHistoryTab.tsx#L15-L60

```ts
const hasChangeset = changesetId && changesetId > 0
// ...
{t('taskInfoPanel.osmHistory.tab.noChangesetTitle', undefined, 'No Changeset Linked')}
// ...
{t(
  'taskInfoPanel.osmHistory.tab.noChangesetDescription',
  undefined,
  'This task does not have an OSM changeset linked yet. A changeset will be automatically linked when the task is completed and the edits are saved to OpenStreetMap.'
)}
```

**i18n keys** (`en-US.json`):

- `taskInfoPanel.osmHistory.tab.noChangesetTitle` → `No Changeset Linked`
- `taskInfoPanel.osmHistory.tab.noChangesetDescription` → (message above)
- Linked card: `taskInfoPanel.osmHistory.linkedChangeset.*`

https://github.com/maproulette/maproulette3/blob/v4/src/i18n/messages/en-US.json (keys around the `taskInfoPanel.osmHistory` block)

**Linked Changeset card:**

- https://github.com/maproulette/maproulette3/blob/v4/src/components/TaskInfoPanel/OSMHistoryTab/LinkedChangesetCard.tsx

**Tab badge count** (1 if linked):

- https://github.com/maproulette/maproulette3/blob/v4/src/components/TaskInfoPanel/TaskTabs.tsx#L39

**API type field:**

- https://github.com/maproulette/maproulette3/blob/v4/src/types/openApiTypes.ts — Task schema includes `changesetId?: number | null`; also documents `PUT /task/{id}/changeset` and `GET /challenge/{id}/matchChangesets`.

### Frontend (v4) — comment prefill (helps matching, does not write `changesetId`)

- https://github.com/maproulette/maproulette3/blob/v4/src/lib/changesetComment.ts

```ts
const BETA_HASHTAG = '#maproulette-beta'
// comment = checkinComment + optional short link; always ensure beta hashtag
```

Used from:

- https://github.com/maproulette/maproulette3/blob/v4/src/components/Pages/TaskEditPage/IdEditorView.tsx
- https://github.com/maproulette/maproulette3/blob/v4/src/components/Pages/TaskEditPage/TaskActions/EditorButton.tsx (`comment` / `changeset_comment` / `source` / `changeset_source` query params)

Default short URL host in `.env.example`: `VITE_SHORT_URL="https://mpr.lt"`.

### Backend — model & comment detection

- https://github.com/maproulette/maproulette-backend/blob/main/app/org/maproulette/models/Changeset.scala#L16-L102  
  (`hasMapRouletteComment`; `comment` contains `"maproulette"` ignore-case)

- https://github.com/maproulette/maproulette-backend/blob/main/app/org/maproulette/framework/model/Task.scala — `changesetId: Option[Long]`

- https://github.com/maproulette/maproulette-backend/blob/main/conf/evolutions/default/13.sql — `changeset_id` default `-1`

### Backend — match algorithm & triggers

- Core matcher: https://github.com/maproulette/maproulette-backend/blob/main/app/org/maproulette/models/dal/TaskDAL.scala#L925-L1030
- On status set: https://github.com/maproulette/maproulette-backend/blob/main/app/org/maproulette/models/dal/TaskDAL.scala#L783-L788
- Scheduler job: https://github.com/maproulette/maproulette-backend/blob/main/app/org/maproulette/jobs/SchedulerActor.scala#L331-L356  
  Job registration: https://github.com/maproulette/maproulette-backend/blob/main/app/org/maproulette/jobs/Scheduler.scala (name `OSMChangesetMatcher`)
- Config defaults: https://github.com/maproulette/maproulette-backend/blob/main/conf/application.conf (`tasks.changesets`, `scheduler.osmMatcher`)  
  Keys/defaults: https://github.com/maproulette/maproulette-backend/blob/main/app/org/maproulette/Config.scala (`DEFAULT_CHANGESET_HOUR_LIMIT = "1 hour"`, `DEFAULT_CHANGESET_ENABLED = false`, …)
- Routes:  
  - https://github.com/maproulette/maproulette-backend/blob/main/conf/v2_route/task.api#L808-L829 — `PUT /task/:id/changeset`  
  - https://github.com/maproulette/maproulette-backend/blob/main/conf/v2_route/challenge.api#L1435-L1459 — `GET /challenge/:id/matchChangesets`

API description (geometry + time): “match the OSM changeset to the Task based on the geometry and the time that the changeset was executed” — the comment substring path is an additional implementation detail not spelled out in that summary.

---

## Implications for iD / editors

To maximize successful auto-linking when users edit from MapRoulette (or an iD integration):

1. **Put `"maproulette"` in the OSM changeset `comment` tag** (case-insensitive). That is the only tag key the matcher inspects for the fast path. Using `#maproulette` (docs default) or `#maproulette-beta` (MR4) both work because they contain the substring.
2. **Close the changeset** before / around the time the task is marked FIXED; open changesets are ignored.
3. Mark the MapRoulette task **FIXED** as the **same OSM user** who uploaded the changeset, ideally within the configured time window (default ±1 hour of the FIXED action).
4. If the comment does **not** contain `"maproulette"`, linking falls back to **bbox intersection** between the changeset extent and the task geometry — still time- and user-scoped.
5. Prefilling `source=…` (e.g. `maproulette;overpass`) is good practice for OSM but **does not** drive MapRoulette’s linker.
6. Including a task short URL (`…/c/{challengeId}/t/{taskId}`) is useful for humans and MR4 analytics; the matcher does **not** parse task ids from it.
7. Editors should **not** expect to push a changeset id into MapRoulette unless they call `PUT /api/v2/task/{id}/changeset` (or wait for server matching). V4’s built-in editor paths do not send the changeset id on save.

**Unclear / not verified here:** whether production maproulette.org enables `tasks.changesets.enabled` and/or `scheduler.osmMatcher.enabled` (repo defaults are `false`). Without at least one of those (or manual API), UI copy about automatic linking would not hold.

---

## Sources

1. https://github.com/maproulette/maproulette3/tree/v4 — frontend @ `e6bcdea2696908c2acc21102a6bc6dd8fa9c0602`
2. https://github.com/maproulette/maproulette3/blob/v4/src/components/TaskInfoPanel/OSMHistoryTab/OSMHistoryTab.tsx
3. https://github.com/maproulette/maproulette3/blob/v4/src/components/TaskInfoPanel/OSMHistoryTab/LinkedChangesetCard.tsx
4. https://github.com/maproulette/maproulette3/blob/v4/src/lib/changesetComment.ts
5. https://github.com/maproulette/maproulette3/blob/v4/src/i18n/messages/en-US.json
6. https://github.com/maproulette/maproulette-backend — `main` @ `8b445ce068fbdbda61f419b1cc152edf731240ab`
7. https://github.com/maproulette/maproulette-backend/blob/main/app/org/maproulette/models/Changeset.scala
8. https://github.com/maproulette/maproulette-backend/blob/main/app/org/maproulette/models/dal/TaskDAL.scala
9. https://github.com/maproulette/maproulette-backend/blob/main/app/org/maproulette/jobs/SchedulerActor.scala
10. https://github.com/maproulette/maproulette-backend/blob/main/conf/v2_route/task.api
11. https://github.com/maproulette/maproulette-backend/blob/main/conf/application.conf
12. https://learn.maproulette.org/en-US/documentation/creating-a-challenge/ — `#maproulette` hashtag / changeset description prefills
