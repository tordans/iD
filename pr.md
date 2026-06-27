# Angle snapping while drawing lines and areas (hold Shift for 45°, Shift + Alt for 10°)

## Summary

While drawing **or editing** a **line** or **area**, holding a modifier key now
constrains the segment to a "pretty" angle — the same idea every presentation and
vector‑drawing tool offers when you hold <kbd>Shift</kbd>. Two snap steps are
available:

| Input while drawing/dragging   | Behavior                          |
| ------------------------------ | --------------------------------- |
| *(no modifier)*                | Any angle — unchanged default     |
| **Shift**                      | Snap to **45°** steps (coarse)    |
| **Shift + Alt/Option**         | Snap to **10°** steps (fine)      |

Release the keys to move freely again. The angle is measured **relative to the
previous segment**, so turning by a multiple of the step produces clean right
angles and diagonals regardless of how the feature is rotated. The very first
segment (which has no previous segment) snaps relative to the screen horizontal.

The same modifiers apply when **dragging an existing node**: each adjacent edge
snaps to a pretty angle, and when the cursor is within a small search radius of
where both edges would meet at a clean angle, the node **locks onto that perfect
corner** — e.g. drag the fourth node of an almost‑square area and it snaps to a
true 90° rectangle corner.

This revives the idea from the closed 2017 PR
[openstreetmap/iD#3641 "pretty angles"](https://github.com/openstreetmap/iD/pull/3641)
(issue [#3637](https://github.com/openstreetmap/iD/issues/3637)), rebuilt for the
current codebase, kept deliberately small, and extended with a **second, finer
snap step** controlled by a modifier combination.

> **Note:** This branch does not open a PR by itself — it only prepares this
> description. No pull request has been created.

## Why two modifier steps?

Most drawing tools use a single modifier (usually <kbd>Shift</kbd>) to constrain
angles, almost always to **45°**. A few use <kbd>Ctrl</kbd> with a configurable
default of 15°. We wanted both a quick coarse step for everyday building/road
drawing **and** a finer step for the cases where 45° is too coarse (diagonal
roads, tilted buildings, roundabout approaches, etc.).

- **Shift → 45°.** This matches the dominant convention (Illustrator, Photoshop,
  Figma, Sketch, PowerPoint, LibreOffice, and the original iD #3641 all use
  Shift for a 45° constraint while drawing — see the table below).
- **Shift + Alt → 10°.** Adding a second key for a *finer* step has direct
  precedent: PowerPoint's drawing ruler rotates in 15° steps, or **1° when Alt
  is held** — i.e. "Alt = finer." `10°` and `45°` are both standard preset
  increments (QGIS "snap to common angles" and AutoCAD polar tracking both list
  10° and 45°).

Why not <kbd>Ctrl</kbd> for the fine step (as Inkscape/CorelDRAW use for their
primary constraint)? On macOS <kbd>Ctrl</kbd>+click is a right‑click (opens the
context menu), which would interfere with placing nodes. <kbd>Alt</kbd> is
already a drawing modifier in iD (it temporarily disables snapping to existing
nodes/ways), so layering the fine step onto Shift + Alt is conflict‑free and
keeps <kbd>Cmd</kbd> free for undo/redo/save.

The two values and the two modifiers live in one small constant block
(`DRAW_ANGLE_SNAP_COARSE_DEG = 45`, `DRAW_ANGLE_SNAP_FINE_DEG = 10`, and the
`drawAngleSnapStep()` mapping) so they're trivial to tweak during review.

## Behavior details

- **Relative to the previous segment.** Snapping constrains the *turn* relative
  to the previous segment, so a 45° step gives you straight‑ahead, ±45°, ±90°
  (right angle), ±135°, and reverse — perfect for square building corners at any
  orientation. The first segment of a feature snaps to absolute screen angles.
- **Distance is preserved.** Only the direction is constrained; the node keeps
  the cursor's distance from the previous node.
- **Only in open space.** With **Shift** alone, if you hover an existing node or
  way the normal snap‑to‑geometry still wins (so you can still connect features).
  Angle snapping only kicks in where there's nothing to snap to. Because
  **Alt** already suppresses geometry snapping, **Shift + Alt** gives a pure,
  always‑on fine angle snap that ignores nearby features — i.e. "precision mode."
- **Preview matches placement.** The floating draw node previews the snapped
  position, and the committed node is snapped the same way, so what you see is
  what you get (mouse click and the <kbd>Space</kbd> placement key both work).
- **One model for draw and drag → perfect corners.** Snapping operates on *a node
  in a way by its neighbours*, so the same logic serves the temporary draw node
  and an existing dragged node. A node with **one** neighbour (a line endpoint,
  or the first segment of any way) snaps relative to the previous edge. A node
  with **two** neighbours snaps each adjacent edge and, when the cursor is within
  a **search radius** (`NODE_ANGLE_SNAP_RADIUS_PX`, 30 px) of where both rays
  meet, locks onto that exact corner; outside the radius it snaps to the nearest
  single‑edge pretty angle.
- **Areas snap while still drawing.** An area's draw node already sits between the
  last placed node and the closing first node, so it has two neighbours *during
  drawing* — placing the fourth corner of a rectangle snaps to a true 90° corner
  before you even click, not only when dragging afterwards. Dragging an existing
  corner node behaves identically.

## How other apps handle angle‑snapping modifiers

Researched from official docs where possible; a few values are only documented by
third parties and are marked accordingly. Sources are linked below the table.

| Application | Modifier (while drawing) | Snap increment | Notes |
| --- | --- | --- | --- |
| **Adobe Illustrator** | Shift | **45°** | Plus a global *Constrain Angle* preference that rotates the whole X/Y axis; Shift snaps relative to it. Rotating with Shift = 45°. |
| **Adobe Photoshop** | Shift | **45°** (line/shape); rotate = **15°** | Rotate‑15° is official; line‑45° is standard documented behavior (H/V/45° diagonals). |
| **Figma** | Shift | H/V/**45°**; rotate = **15°** | Rotate‑15° is official. |
| **Sketch** | Shift | H/V/**45°**; rotate = **15°** | Rotate‑15° is official. |
| **Microsoft PowerPoint** | Shift | **45°** (line); rotate = **15°** | Ruler can be set to an angle and rotates in 15° steps, or **1° with Alt** (precedent for "Alt = finer"). Degree values are community‑documented; MS docs only state Shift "constrains the dimensions." |
| **Google Slides / Drawings** | Shift | straight H/V/diagonal (line); rotate = **15°** | Rotate‑15° is official; the line‑drawing increment is not published by Google (unverified). |
| **LibreOffice Impress / Draw** | Shift | **45°** (line); rotate = **15°** | Official: "To constrain the line to 45 degrees, hold down Shift while you drag." Alt = draw symmetrically from center. |
| **Inkscape** | **Ctrl** | **15°** default | Configurable via *Preferences → Behavior → Steps → "Rotation snaps every"* (3.75°–90°). |
| **CorelDRAW** | **Ctrl** | **15°** default | Configurable "Constrain angle" in *Options → Edit*. |
| **AutoCAD — Ortho** | F8 toggle | **90°** | Horizontal/vertical only. |
| **AutoCAD — Polar Tracking** | F10 toggle | default **90°**; presets incl. **45°, 30, 22.5, 18, 15, 10, 5°** | Custom angles too. |
| **QGIS — Advanced Digitizing** | type into the angle (`a`) box | any value; "snap to common angles" presets incl. **10°, 45°, 90°** (and 0.1–30°) | Lock can be absolute or relative to the last segment. |
| **JOSM** (draw mode) | `A` toggles snap modes | **0 / 30 / 45 / 90°** (and relative ±30/45/60/90/120/135/150° vs. a base segment) | Toggles none → angle‑snap → fixed‑direction. |
| **iD #3641** (closed 2017, prior art) | Shift | **45°** segments, **90°** area‑closing | This PR's direct ancestor. |

**Takeaways that shaped this PR:** Shift→45° is the de‑facto standard, so we use
it for the coarse step. "Alt = finer increment" has precedent in PowerPoint's
ruler. 10° and 45° are both standard preset increments (QGIS, AutoCAD). And the
relative‑to‑previous‑segment model matches QGIS's "relative to last segment"
lock and JOSM's base‑segment snapping.

### Sources

- Illustrator — Pen tool / Shift 45°: https://helpx.adobe.com/illustrator/using/tool-techniques/pen-tool.html · Constrain Angle / rotate: https://helpx.adobe.com/illustrator/using/rotating-reflecting-objects.html
- Photoshop — Free Transform (Shift rotate 15°): https://helpx.adobe.com/photoshop/using/free-transformations-images-shapes-paths.html
- Figma — alignment/rotation (Shift 15°): https://help.figma.com/hc/en-us/articles/360039956914-Adjust-alignment-rotation-position-and-dimensions
- Sketch — resizing/rotating (Shift 15°): https://www.sketch.com/docs/designing/layer-basics/resizing-and-rotating-layers/
- PowerPoint — draw straight lines / ruler (15° steps, 1° with Alt): https://support.microsoft.com/en-us/office/draw-straight-lines-or-align-things-with-the-ruler-in-powerpoint-6222c9b4-2fdf-48f7-a3fd-1687fbe2bf84 · Rotate or flip: https://support.microsoft.com/en-us/office/rotate-or-flip-an-object-in-powerpoint-41bc6777-3b46-4984-bc5b-615ea7786ab1 · community 45°/15°: https://www.indezine.com/products/powerpoint/learn/shapes/rotation-fun-in-powerpoint.html
- Google Drawings/Slides — rotate 15° (official): https://support.google.com/docs/answer/179740
- LibreOffice — Lines & Arrows (Shift 45°): https://help.libreoffice.org/latest/en-US/text/simpress/02/10120000.html · Rotating objects: https://help.libreoffice.org/latest/en-US/text/sdraw/guide/rotate_object.html
- Inkscape — keyboard reference (Ctrl 15°): https://inkscape.org/doc/keys.html · Preferences ("Rotation snaps every"): https://wiki.inkscape.org/wiki/PreferencesDialog
- CorelDRAW — Constraining objects (Ctrl, default 15°, configurable): https://product.corel.com/help/CorelDRAW/540223850/Main/EN/Documentation/CorelDRAW-Constraining-objects.html
- AutoCAD — Polar Tracking & PolarSnap: https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-7EC3C63D-EA4E-4E65-A676-C3A3627E3F19 · Set polar angles: https://help.autodesk.com/view/ACD/2023/ENU/?guid=GUID-3E0AAC2C-0756-4626-B79C-ED8DAB930EA3
- QGIS — Advanced Digitizing: https://docs.qgis.org/3.34/en/docs/user_manual/working_with_vector/editing_geometry_attributes.html
- JOSM — Draw/AngleSnap: https://josm.openstreetmap.de/wiki/Help/Action/Draw/AngleSnap
- iD — PR #3641: https://github.com/openstreetmap/iD/pull/3641 · issue #3637: https://github.com/openstreetmap/iD/issues/3637

## UI / documentation changes

- **Toolbar tooltips.** The hover tooltips for the **Line** and **Area** buttons
  in the top toolbar now show a second line with the snapping shortcut. This uses
  **new** locale keys (`modes.add_line.snap_tip` / `modes.add_area.snap_tip`)
  rendered as an extra `.tooltip-tip` line — *not* appended to the existing
  `description`, because that key is already translated and the translation would
  hide the addition in non‑English UIs. New keys fall back to English until
  translated, so the hint shows in every locale.
- **Keyboard shortcuts panel (`?` → Keyboard shortcuts → Editing → Drawing).**
  Two rows were added: <kbd>⇧</kbd> "snap drawing to 45° angles" and
  <kbd>⇧</kbd> <kbd>⌥</kbd> "snap drawing to 10° angles".
- **Help pane (`?` help).** A new "Snapping to Angles" subsection was added to both
  the **Lines** and **Areas** help topics, using the existing `{shift}`/`{alt}`
  key placeholders so the keys render correctly per platform.

## Implementation — kept minimal & in TypeScript

New logic lives entirely in a new, self‑contained **TypeScript** module; the
JavaScript changes are thin wiring in `draw_way.js` and `drag_node.js` (no
behavior change when no modifier is held).

**New files**

- `modules/behavior/draw_angle_snap.ts` — the whole feature:
  - `drawAngleSnapStep(event)` → maps modifier keys to a step in degrees (or
    `null`).
  - `snapNodeAngleLoc(context, nodeID, loc, stepDeg, searchRadiusPx?)` → one pure
    function that snaps any node of a way by its neighbours, returning a snapped
    `[lon, lat]`. Used for both the draw node and a dragged node; with two
    neighbours it does the "perfect corner" lock.
  - Returns `loc` unchanged if the geometry needed is missing, so callers can use
    it unconditionally.
  - `DRAW_ANGLE_SNAP_COARSE_DEG = 45`, `DRAW_ANGLE_SNAP_FINE_DEG = 10`,
    `NODE_ANGLE_SNAP_RADIUS_PX = 30`.
- `test/spec/behavior/draw_angle_snap.ts` — unit tests for the modifier mapping
  and the snap geometry: absolute first segment, relative subsequent segments,
  distance preservation, fine‑vs‑coarse, the area draw‑node corner lock (and no
  lock outside the radius), and a dragged corner node. 10 tests, all passing.

**Edited files**

- `modules/behavior/draw_way.js` (+14) — import the helper; track the active step
  on `move`; snap the draw node in `move()` (only in the existing "no snap target"
  branch) and again in `drawWay.add` so the placed node matches the preview.
- `modules/modes/drag_node.js` (+6) — import the helper; in `doMove()`, snap the
  dragged node in the existing "no snap target" branch.
- `modules/ui/tools/modes.js` (+~12) — pass the new `snapTip` string and render
  it as a second tooltip line for the Line/Area buttons.
- `modules/ui/panes/help.js` (+6) — register the two new help keys + headings.
- `data/core.yaml` (+8 strings) — tooltip tip, shortcut labels, help subsections.
- `data/shortcuts.json` (+8) — the two Drawing‑section shortcut rows.
- `css/80_app.css` (+5) — `.tooltip-tip` styling.

The relevant `draw_way.js` hook (all other lines unchanged):

```js
_angleSnapStep = drawAngleSnapStep(d3_event);
// ...
} else if (_angleSnapStep) {   // snap the segment angle - only in open space
    loc = snapNodeAngleLoc(context, _drawNode.id, loc, _angleSnapStep);
}
```

All maths is done in projected screen pixels (consistent with the rest of iD's
drawing code) and the result is projected back to a location.

## How to test

1. `npm install && npm run all` (or `npm start`), open iD.
2. Press **2** (Line) or **3** (Area) and start drawing.
3. Hold **Shift** and move the cursor — segments snap to 45° relative to the
   previous segment (straight, 45°, right angles…).
4. Hold **Shift + Alt/Option** — segments snap in finer 10° steps.
5. Release the modifiers to draw at any angle.
6. With **Shift** alone, hover an existing node/way — it still snaps to the
   geometry (angle snapping only applies in open space).
7. **Drag test:** draw a triangle, double‑click an edge to add a 4th node, then
   drag that node toward the missing rectangle corner while holding **Shift** —
   it should lock onto a clean 90° corner once the cursor is within ~30 px.
8. Hover the **Line**/**Area** toolbar buttons to see the updated tooltip; open
   the **?** help → **Lines**/**Areas** → "Snapping to Angles"; and check the
   Keyboard‑shortcuts dialog → **Editing → Drawing** for the two new rows.

Validated locally: `tsc` (typecheck), `eslint`, `vitest` (new spec, 10 passing),
`build:data`, `build:css`, and the esbuild bundle all pass.

## Open questions for reviewers

- **Modifier choice.** Shift (45°) + Shift + Alt (10°) — happy to change the
  fine‑step modifier or the two angle values; they're isolated constants.
- **Relative vs. absolute snapping.** This snaps relative to the previous segment
  (best for buildings). Should the first segment also support an absolute mode?
- **Should the fine step keep ignoring feature snapping** (current behavior,
  because Alt suppresses geometry snapping), or should it respect nearby nodes
  like the coarse step does?
- **Out of scope (intentionally):** the original #3641 also snapped the final
  area edge to *close* the polygon at a clean angle. Left out to keep this change
  small; easy to add later as a follow‑up.

## Notes

- `dist/locales/*.json` are generated by `npm run build:data` from
  `data/core.yaml` and are not committed; rebuild after pulling.
- A `CHANGELOG.md` entry should be added before opening the PR.
