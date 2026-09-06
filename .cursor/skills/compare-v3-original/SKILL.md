---
name: compare-v3-original
description: >-
  Fix v3 overlay bugs on PR #8 by comparing to the frozen 2020 prototype
  (PR #9). Use when the user asks to fix something against original iD, the
  freeze, V3-OVERLAY.md, “where it worked”, or says “fix XYZ and compare to
  original code where it worked”.
---

# Compare to original iD (v3 overlay)

| | What | Rule |
| --- | --- | --- |
| [PR #9](https://github.com/tordans/iD/pull/9) (`v3-prototype`, freeze `0328e101a`) | 2020 v3 as it was | **Read only.** Learn from this. Never commit here. |
| [PR #8](https://github.com/tordans/iD/pull/8) (this worktree, `iD--v3-reloaded`) | Overlay on current iD | **Only place to edit.** |
| `develop` / the `../iD` worktree | Untouched current iD | **Never change.** Read only if you need a 2.43 API spelling. |

“Original where it worked” means **PR #9**. Read it in place (`git show`), then patch **this** worktree.

Product inventory of the 2020 series (themes, key files, SHAs): [V3-OVERLAY.md](../../../V3-OVERLAY.md). Use it as a **lookup**, not as a dump.

## Fast path

1. Name the broken behavior and the current files on PR #8.
2. In [V3-OVERLAY.md](../../../V3-OVERLAY.md), find the **theme** and its **Key files**. Open that section’s SHA list only if a later freeze commit (not just the tip) is the one that “worked”.
3. Read the freeze **without switching branches**:

```bash
git show 0328e101a:modules/ui/assistant.js
```

If the path 404s, the file was renamed or deleted on the freeze:

```bash
git ls-tree -r --name-only 0328e101a | rg -i 'assistant|sidebar|top_toolbar'
```

Freeze often has `modules/core/context.js`; this tree has `modules/core/context.ts`. CSS is `css/80_app.css` on both; **grep a selector**, do not dump the whole file.

4. If a 2.43 call signature is unclear, read it — do not edit it:

```bash
git show upstream/develop:modules/operations/delete.js
```

5. Diff **one function or one CSS block**. Patch **this** worktree only. Restore freeze **behavior**; keep 2.43 APIs already in this tree (`context` first, `t.append`, d3 `(d3_event, d)`).
6. After CSS: `node scripts/build_css.js` (the watcher misses `80_app.css`). After JS: esbuild `--watch` from `npm start` is enough.
7. Verify in the browser (pan/select/draw if the map is involved).

## Porting rules

- Copying freeze call sites onto 2.43 factories throws. Example: freeze `operationDowngrade(selectedIDs, context)` vs this tree `operationDowngrade(context, selectedIDs)` → `context.graph is not a function`.
- Overlay CSS: `.over-map` is `pointer-events: none`; full-bleed wraps stay `none`; **children** opt back in. `.over-map > * { pointer-events: auto }` overrides equal-specificity wrap rules if it comes later — raise wrap specificity (`.over-map > .assistant-wrap`).
- Freeze deleted the docked sidebar (`0cee9848d`). This tree may keep `modules/ui/sidebar.js` as a **stub** for 2.x callers; inspect/search belong in the assistant.

## Theme → start here

| Theme (V3-OVERLAY.md) | Start files on freeze |
| --- | --- |
| 1 Assistant | `modules/ui/assistant.js`, `init.js`, `feature_list.js`, inspectors, `css/80_app.css` |
| 2 Ribbon | `modules/ui/top_toolbar.js`, `modules/ui/tools/*` |
| 3 Preset browser / groups | `preset_browser.js`, `modules/presets/index.js`, `data/presets/groups.json` |
| 4 Draw / structure / repeat | `modules/modes/add_*.js`, `draw_*.js`, `modules/ui/tools/{way_segments,structure,power_support,repeat_add,stop_draw}.js` |
| 5 Hash / panes / scale | `modules/behavior/hash.js`, `modules/ui/scale.js`, `init.js` |
| 7 CSS | `css/80_app.css` (selector-level vs freeze) |
| 9 Operations / select | `modules/operations/*.js`, `modules/modes/select.js`, `modules/ui/tools/operation.js` |

## Example

User: “fix map clicks and compare to original where it worked.”

- PR #9: assistant wrap `pointer-events: none`, children `auto`.
- Fix on PR #8: make `.over-map > .assistant-wrap` win so the map receives clicks. Do not touch `develop` or PR #9.
