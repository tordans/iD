# V3 overlay inventory (2020 prototype)

This file is a **product-theme inventory of the original 2020 iD v3-prototype work**. It is not a hop changelog and it does not describe rewritten SHAs from later overlay hops.

Pointers:

- Freeze PR: [tordans/iD#9](https://github.com/tordans/iD/pull/9) (`v3-prototype` → frozen 2020 snapshot)
- Freeze tip of the 2020 tree: `0328e101aaccc3d84b866b22d6493c09c7fadc3d` (`v2.17.2 changelog`, 2020-02-14)
- Join with 2.x that **is** on `develop`: `ba40154a06842a82a7ac557e1f0f15ba1f897add` (`v2.17.1`)
- Unique original series: first-parent, no-merge `ba40154a0..0328e101a` (**256** commits)
- Local linearized freeze backup: `backup/iD--v3-reloaded-linear-2020` = `0146e63710c175ebcf7b8a95364be7883bff928b`
- Netlify/Node 24 shims on PR #9 only (not product): `5a94d76b1`, `92e1302de`
- Current hop-8 HEAD (this worktree, unchanged by this inventory): `1407539c783f17999a114fe311a67db9f6d0e1d0` (`Build hop 8 on Node 24 against upstream/develop.`)

**Original** means those 256 commits (or matching subjects on `0328e101a` ancestry). Hop 1–8 rewritten SHAs are not original.

Each product commit is listed in **one** theme (oldest first). CSS and `data/core.yaml` strings also land inside feature commits; those files are called out in the theme that owns the behavior. There is **no Osmose** work in this freeze; QA inspectors that moved into the assistant are KeepRight and ImproveOSM.

---
## 1. Assistant (welcome, restore, save, QA, sidebar wrap)

The 2020 UI replaced the splash screen and the classic right sidebar with a floating **assistant** over the map: a mode-aware panel that greets the mapper, offers restore of unsaved edits, hosts feature search and the entity/note/QA/commit UIs, and can collapse to a header strip. Inspectors (entity editor, notes, KeepRight, ImproveOSM, custom data, save/commit) were moved into assistant screens rather than a dedicated sidebar column. Welcome/anniversary/block notices, drawing instructions, and save-success lived here. The old `#sidebar` became a map overlay, then was removed in favor of a resizable assistant.

**Key files (2020 paths):** `modules/ui/assistant.js`, `modules/ui/init.js`, `modules/ui/sidebar.js` (then deleted), `modules/ui/commit.js`, `modules/ui/commit_changes.js`, `modules/ui/entity_editor.js`, `modules/ui/note_editor.js`, `modules/ui/feature_list.js`, `modules/ui/improveOSM_editor.js`, `modules/ui/keepRight_editor.js`, `modules/ui/data_editor.js`, `modules/modes/save.js`, `css/80_app.css`, `data/core.yaml` (`assistant.*`)

| SHA | Subject |
| --- | --- |
| `64d308390` | Don't automatically uncollapse the sidebar when adding a new, tagged feature |
| `18aef6c7b` | Convert sidebar into a panel over the map (close #6461) |
| `3f798b85c` | Use background blur filter for translucent dark elements on supported browsers |
| `1c3b6bf7f` | Add an assistant panel that displays the current mode (re: #6119) |
| `c5267842b` | Only show the region name in the assistant at mid zoom levels |
| `ed465f8ad` | Add basic drawing instructions to the assistant (close #6119) |
| `e78c9e8de` | Remove unneeded file Adjust assistant line spacing Ensure the sidebar does not overflow vertically |
| `7fc6fd6b2` | Restore sidebar resizing (close #6488) Prevent overflow of feature search results |
| `14c6b8ff3` | Replace splash screen with a welcome UI in the assistant (close #6486) |
| `b4ef08629` | Update restore text to include change count, location, and duration (close #6467) Move restore functionality to the assistant panel |
| `f2d7cfa51` | Integrate feature search directly into the assistant panel (close #6493) |
| `75df7911a` | Fix issue where commit sidebar would not fully display, so saving was impossible (close #6499) |
| `16443e228` | Don't show another welcome screen after the user discards stored changes |
| `b6d4a486c` | Add button to manually start mapping immediately from the welcome screen (close #6500) |
| `2b5066b86` | Disable feature previews when hovering for now |
| `480140442` | Search all downloaded features when searching, not just visible (close #6516) |
| `3cebb0d02` | Add hover and active styling for primary buttons |
| `3d595c66b` | Show save mode state in the assistant |
| `6b2467efa` | Incorporate the save success screen into the assistant panel |
| `ca9bf636b` | Move multi-select list to the assistant panel |
| `fc38a7333` | Make assistant more opaque |
| `d9992ec3a` | Check if local entities exist during feature search |
| `1a113c09d` | Show the preset icon in the assistant when a single feature is selected (close #6027) |
| `910edd045` | Add disclosure button for hiding the assistant body (close #6586) Refactor assistant screens into distinct panel objects Use light background for some assistant panel screens Remove creepy smile icon for low count changeset success |
| `b92d4daee` | Move entity editor into the assistant |
| `b5662e99e` | Move note editor into the assistant Move selected note ID storage from context into modeSelectNote |
| `05c2f393b` | Remove "All" from the entity editor section labels Add a min width to the assistant when it's uncollapsed |
| `ecb550a23` | Use white background for header part of assistant for some panels |
| `d1191bd2e` | Replace use of `footer` and `body` classes in the inspector |
| `2226663cc` | Move KeepRight and ImproveOSM issue inspectors into the assistant |
| `2d4369bf9` | Move custom data editor to the assistant |
| `05b47f5b3` | Draw point markers in small preset icons with no icon specified |
| `7e56b5f93` | Move commit UI into the assistant Add assistant status message when the user is authenticating |
| `0cee9848d` | Remove old sidebar and toggle button entirely Make the assistant horizontally resizable Fix issue where restrictions editor would not display Fix tooltip placement for first and last toolbar items |
| `186262ff9` | Show marker icon in assistant header for points presets when no other icon is specified Don't use a grey fill for vertex preset icon circles Use the same stroke width for point and vertex preset icon frames |
| `e533619e4` | Redraw the map immediately after discarding stored changes Remove some unused CSS |
| `0354ddb93` | Move the save/cancel buttons into the footer of the commit UI Move the changeset prose and review request button to the top of the commit UI Move the change summary list a disclosure Move the upload blocker text from a tooltip to a persistent message, for mobile-friendliness Give more info about changeset comments in the blocker message Rename "Suggested Hashtags" field to just "Hashtags" |
| `425fc3217` | Improve "Add field" padding on the commit screen Make the changes section title format consistent with other section titles |
| `4e4279791` | Fix issue where assistant could not scroll in Firefox (close #6624) |
| `1f3d266cb` | Add instructions on how to finish drawing to assistant |
| `78ba70b0f` | Fix bug where stale entity editor could appear in the assistant |
| `7c488d981` | Improve padding and background color of light assistant |
| `e6c6cf9ac` | Keep assistant width constant when collapsing until mousing out (re: #6765) |
| `83385cb31` | Make the assistant toggleable via the entire header, not just the disclosure button (close #6765) |
| `9b49005b8` | Make assistant collapse states for different screens independent Persist assistant collapse states between sessions |
| `5edd10807` | Change Keep Mapping button label to Continue Mapping (close #6770) Use X button instead of Start Mapping button for returning welcome screen (re: #6769) |
| `ab31d7db4` | Fix issue where assistant title would only show the current location |
| `d6506463a` | Improve assistant collapse state persistence Ensure the upload UI is initially visible once pressing Save (close #6767) |
| `06b7869a1` | Prevent issue where assistant would toggle by closing the welcome panel |
| `fc2a1a9fe` | Use the desaturated "inactive" styling for the map when map is uneditable due to pending restore (re: #6769) |
| `284831f75` | Change "Editing" and "Viewing" mode labels to "Inspecting" |
| `570c0fb98` | Use X button instead of "Continue Mapping" button to close save success screen (re:  #6768) Increase assistant padding somewhat |
| `3e89f3fe6` | Remove unused div |
| `d08b2fb2a` | Move minimap to opposite side of screen to avoid overlapping assistant (close #6487) |
| `98de284f1` | Make form fields and entity issues background darker and translucent |
| `9713fbed5` | Show notice about active account blocks to the assistant on launch (re: #5400) Add account-specific assistant welcome screen |
| `6657d597f` | Only show anniversary screen if account is at least a year old |
| `62ec80436` | Properly parse and format changeset and block counts for assistant messages |
| `a645ef8fe` | Fix extra feature list border |
| `d126b73eb` | Fix feature search list overflow in Firefox |
| `ab0ee7581` | Don't toggle the header when pressing various prominent assistant buttons |
| `3ff52fd54` | Don't collapse the inspector when dragging nodes (close #6766) |

---

## 2. Ribbon / top toolbar tools

The Point/Line/Area mode buttons were replaced by a **top ribbon** (`#bar` → later `.top-toolbar`): Add Feature, favorites, recents, generic Point/Line/Area (“Geometries”), toolbox (toggle which tools show), operations (including Downgrade, Extract, Continue, Reverse, Square/… when `available('toolbar')`), undo/redo, deselect, save, notes, zoom-to-center, and draw-time Finish/Cancel. Quick presets could be dragged between favorites and recents. Tooltips were generalized into a shared popover used by the preset browser and tools menu. Add Feature became a button (not a search field) with `` ` `` / `@` shortcuts.

**Key files:** `modules/ui/top_toolbar.js`, `modules/ui/tools/index.js`, `modules/ui/tools/add_feature.js`, `modules/ui/tools/quick_presets.js`, `modules/ui/tools/quick_presets_favorites.js`, `modules/ui/tools/quick_presets_recent.js`, `modules/ui/tools/quick_presets_generic.js`, `modules/ui/tools/quick_presets_addable.js`, `modules/ui/tools/toolbox.js`, `modules/ui/tools/notes.js`, `modules/ui/tools/save.js`, `modules/ui/tools/undo_redo.js`, `modules/ui/tools/operation.js`, `modules/ui/tools/simple_button.js`, `modules/ui/tools/segmented.js`, `modules/ui/tools/center_zoom.js`, `modules/ui/tools/stop_draw.js`, `modules/ui/tools/repeat_add.js`, `modules/ui/tools/adding_geometry.js`, `css/80_app.css`

| SHA | Subject |
| --- | --- |
| `639348ec5` | Reinstate preset search, favorites, and recents tools (ribbon UI) |
| `b150dc72d` | Reduce toolbar update debounce time |
| `f6832c3ad` | Add deselect toolbar item |
| `f868d1c8f` | Add Downgrade operation to the top toolbar |
| `ba31d6117` | Use a button instead of a search field item in the top toolbar for adding features, to save space |
| `f124a3b38` | Simplify "add feature" tool structure Properly disable "add feature" tool when data is disabled |
| `9b1adf55c` | Rename the search_add tool to add_feature Adjust toolbar spacing |
| `9eee5e9dd` | Hide unneeded toolbar items and show Cancel or Finish items when drawing (close #5960) |
| `da81fb33f` | Fix issue where map cursors could be incorrect (close #6450, close #6452) |
| `fc6f92460` | Include the Extract and Continue operations in the top toolbar |
| `0fd6ebb97` | Add "Repeat" toolbar item for adding multiple features of the same type sequentially (close #5874) |
| `2eab0cbe9` | Show the Finish button instead of the Cancel toolbar button after adding repeat features |
| `ec29e50f5` | Fix issue where the "add feature" popover would hide the footer on tall windows |
| `58b13ac10` | Move Deselect toolbar button to be next to Undo/Redo |
| `930221abe` | Allow undo/redo while adding features (close #6482) |
| `6c82cd69c` | Allow up to 10 recent quick presets in the ribbon, up from 5 |
| `63dac2ed8` | Generalize segmented toolbar items into a single reusable class |
| `be81c4892` | Refactor toolbar items to call render on each update, not just when first adding an item, in order to avoid stale state |
| `c8f949365` | Fix undo/redo |
| `744d4497d` | Hide tooltip upon clicking operation toolbar button |
| `723bc4523` | Fix issue where multiple preset browsers could be rendered and not dismissed |
| `59b51f3a2` | Fix preset browser keyboard shortcuts |
| `61407a59b` | Use the tilde key (`) for opening the Add Feature preset browser instead of Tab (close #6560) Use the apostrophe key (') for toggling the sidebar |
| `a579e35fc` | Use keyboard styling for shortcuts in tooltips (close #6574) Make tooltips less transparent |
| `f8acda831` | Replace quick links zoom-to-center toolbar item (close #6601) |
| `9eac13a2c` | Fix issue where a stale save button could sometimes appear |
| `97f33473b` | Fix lint error |
| `89008769f` | Show the reverse operation as a toolbar item |
| `b68efaa16` | Add disclosure indicator to the Add Feature toolbar button Adjust the prominent assistant icon color |
| `6df192866` | Enable zoom-to-center of multiple selected entities (close #6696) |
| `dafb574e8` | Don't use generic presets as favorites for brand new users (close #6708) |
| `a8dcaa28b` | Improve mechanism for creating uiToolSimpleButton |
| `3be80cc89` | Move most tool availability logic to the tools themselves Combine cancelDrawing and finishDrawing into one tool |
| `d5c9312f0` | Enable undoing zoom to center (close #6611) |
| `4bae2a8aa` | Reduce the maximum number of recent presets shown in the toolbar from 10 to 5 (re: #6044) |
| `47ab51630` | Refactor uiToolAddRecent and uiToolAddFavorite to reduce duplicate code |
| `ead729bef` | Add UI for toggling toolbar items on and off |
| `aaf09c21f` | Update the toolbar immediately after toggling tools Don't show Delete operation if Downgrade is available Improve order and grouping of operation tools Make fewer tools toggleable Don't show Extract tool by default |
| `976d98d44` | Add icon to Add Note toolbox item |
| `57bd675c9` | Write tool toggle state to local storage |
| `7497bdce2` | Add tooltip to Tools toolbar item Add reusable class to hide tooltips for active disclosing toolbar items Fix lint errors |
| `c4a469e9a` | Remove geometry type selection from the preset browser (#6760) Add toolbar item to toggle the geometry type when adding a feature Detach geometry types from favorite and recent presets Update some presets to indicate the preferred geometry types Don't show standalone point frames for preset icons in the preset browser or quick preset buttons Update the "Add Feature" button icon to show specific instead of generic features |
| `28a072561` | Remove spacer between operation tools |
| `a06ec5951` | Rename "visible" property of presets to "addable" Show addable presets as toolbar item when limiting with the URL API (close #6665) Hide preset browser, quick favorite, and quick recent tools when limiting addable presets |
| `0211fb8ad` | Enable dragging quick presets between recents and favorites (close #6044) Fix favorite preset reordering (close #6781) |
| `48984d0fe` | Rename y to deltaY in quick preset dragging for consistency |
| `92d17d832` | Add keyboard shortcut to toggle adding geometry type (re: #6760) |
| `f700ec503` | Add spacer between structure/support and segments tools in toolbar Use the orthogonal segment icon for the segment tool in the toolbox menu |
| `2b240072b` | Use dark text color for kbd shortcuts on dark tooltips |
| `1eb39f3d3` | Only show the Reverse toolbar item for lines that are oneway or sided |
| `3701b9422` | Don't show circularize toolbar item for unclosed lines |
| `aa7f9a97c` | Don't show Square, Split, or Disconnect toolbar items for lone endpoint nodes |
| `7545f6706` | Make toolbar horizontally scrollable when it overflows (close #6755) Generalize tooltip into popover control Use the same popover control for tooltip as the preset browser and tools list popovers Smartly position the preset browser popover and menu bar tooltips to stay fully onscreen Position most tooltips closer to their controls Fix small gap that could appear between a tooltip and its arrow Allow wider toolbar tooltips |
| `0c2f609b9` | Move popover positioning code into its own function |
| `a7a375580` | Fix the edit menu tooltips |
| `86c396f03` | Make the top toolbar scrollable using vertical scrolling |
| `966eecde5` | Add toolbar item for generic Point/Line/Area presets for simpler legacy workflow compatibility (close #6458) |
| `974f7734b` | Rename "Base Types" toolbar item to "Geometries" (re: #6458) |
| `c06a9b6b3` | Avoid disabling generic preset shortcuts when favorites are present |
| `b215a4fb1` | Use "Building" label instead of "Area" for the geometry select tool for POIs that can be mapped as buildings |
| `123a9d1b1` | Support `@` key for focusing the Add Feature button (re: #6864) |
| `77917f44c` | Display quick preset buttons when dragging them out of the toolbar |
| `0f082318e` | Use building icon instead of generic area icon when adding feature as a building |
| `99e5880b9` | Switch geometry shortcut from G to T (close #6950) |
| `d305fce5b` | Fix issue where presets with special characters in their names could not be dragged around in the toolbar |

---

## 3. Preset browser, favorite button, groups / schema

Add Feature and “change preset” used a **popover preset browser** instead of `uiPresetList` in the sidebar. Geometry filters later moved to a dedicated ribbon tool; the browser respected `visible`/`addable` and `countryCodes`, showed category folder frames, and mixed nearby / recommended / recent presets. A **group** schema (`data/presets/groups.json`, `group_manager`, `schema_manager`) drove zone recommendations (mall, farm, power, transit, …) and which ways a vertex feature may snap to. Favorite-star UI stayed on `preset_favorite_button.js`. Preferred geometry order on presets started to matter for add.

**Key files:** `modules/ui/preset_browser.js`, `modules/ui/preset_favorite_button.js`, `modules/ui/preset_icon.js`, `modules/ui/preset_list.js` (removed), `modules/entities/group_manager.js`, `modules/entities/schema_manager.js`, `data/presets/groups.json`, `data/presets/schema/group.json`, `data/presets/groups/**`, `modules/presets/index.js`

| SHA | Subject |
| --- | --- |
| `643c7a647` | Separate preset browser popover from the Add Feature toolbar item (re: #6468) |
| `b859058f0` | Adjust preset browser CSS |
| `5cb8e4035` | Improve handling of preset browser event listening |
| `f6b192d54` | Use the popover preset browser instead of the sidebar list when changing presets (close #6468) |
| `3b90f8851` | Don't display point marker in preset icons if an image is specified |
| `68651c559` | Fix state issues with the preset browser geometry filter buttons |
| `9d94450a6` | Fix stale preset browser geometry filter buttons in the entity editor |
| `8f90f2f6e` | Add folder frame around preset category icons (close #6085) |
| `52e4d223f` | Update preset browser to respect preset `visible` property (close #6637) |
| `4f7bb7942` | Make the v3 preset browser respect preset `countryCodes` (re: #6124) |
| `b6f306353` | Remove old uiPresetList |
| `f15624543` | Add farm zone group |
| `c05a201b7` | Don't recommend fallback presets |
| `3757177b2` | Add mall zone for preset recommendations |
| `f0170f5e1` | Don't recommend unsearchable presets |
| `68d19b0ee` | Add power zone group |
| `ec7cec644` | Add fast food zone group |
| `4d78c7676` | Add water park zone group |
| `cad8c78ec` | Recommend hotel preset near airports |
| `eb0647a4b` | Recommend changing rooms near water parks |
| `eb2a60006` | Add mechanism to nest simple groups inside other groups Rename "subfeatures" to "nearby" and nest within zones |
| `afb65376c` | Add mechanism for restricting what ways a node feature can be added as a vertex of |
| `728218667` | Add building and stadium zone groups |
| `36cf83a03` | Move public transport zone groups into a subfolder Add train zone group Recommend park and ride lots near subway stations |
| `c72100247` | Add zoo zone group Recommend maps around theme parks |
| `0c80d5704` | Add cemetery zone group |
| `630f3168b` |  Include recent presets alongside nearby and recommended presets in the default preset browser list |
| `860a0536f` | Fix error where preset browser would not dismiss when switching presets |
| `ccfe7b672` | Add place of worship zone group |
| `87d0fc0a1` | Add ferry zone group |
| `afe063747` | Don't allow placing railway=crossing on roads and railway=level_crossing on paths Add `note` property to group schema for developer documentation Rename `groups` group property to `allGroups` Add `anyGroups` group property Break rail lines and vehicular roads into their own groups |
| `60ed13dcb` | Add light rail and monorail zone groups |
| `f35f4152e` | Allow adding crossings only to highways |
| `f43dd185e` | Avoid squishing preset browser search field |
| `09bcb1c44` | Don't reload the preset browser results for every toolbar render |
| `b45dc7e8b` | Update various presets to specify the preferred geometry type Add documentation about the geometry array order |
| `baa1f6dca` | Disable hidden presets in the preset browser and quick preset buttons |
| `9c7a259dd` | Prefer areas for some presets |
| `26c91c668` | Fix issue with category icons in the preset browser |
| `cbc04339d` | Fix bug where preset browser would try to load tag documentation for categories |
| `4887b926e` | Show the preset browser immediately when after drawing a generic feature type for the legacy add workflow |
| `314f95575` | Fix error upon drawing generic preset Place preset browser in the entity editor below the button even when the view is scrolled |
| `7516697fb` | Fix extra spacing in preset browser tag reference |
| `300457819` | Reorganize popover CSS Fix issue where the the preset list could exceed the preset browser |
| `c0e7232a3` | Fix issue where preset list could exceed the preset browser in Firefox |
| `e3120cdb2` | Fix flex layout of preset categories |
| `bd52e0f80` | Use country-coder in v3-exclusive code (re: #6941) |
| `de22c77b8` | Fallback to SVG preset icons when image fails to load or has not loaded yet (close  #7028) |
| `c96570018` | Fix small vertex preset icons |
| `a3584f5b2` | Fix issue with setting preset in inspector |

---

## 4. Draw / structure / defaultTags / repeat-add

Draw modes carried **defaultTags** from the chosen preset and gained in-ribbon drawing helpers: **way segments** (straight vs orthogonal), **structure** (bridge/tunnel/`layer` while drawing highways/rail/water), **power support** (none/pole/tower on power lines), **repeat-add**, and Finish/Cancel while drawing. Undo/redo worked during add. Vertex-only features got “must be added to a way” instructions. Structure/power tools wrote tags onto `mode.defaultTags` as the way was drawn.

**Key files:** `modules/behavior/draw_way.js`, `modules/behavior/draw.js`, `modules/modes/add_point.js`, `modules/modes/add_line.js`, `modules/modes/add_area.js`, `modules/modes/draw_line.js`, `modules/modes/draw_area.js`, `modules/ui/tools/way_segments.js`, `modules/ui/tools/structure.js`, `modules/ui/tools/power_support.js`, `modules/ui/tools/repeat_add.js`, `modules/ui/tools/stop_draw.js`, `modules/osm/tags.js`

| SHA | Subject |
| --- | --- |
| `4210435ba` | Enable way segments toolbar item and basic orthogonal drawing support (close #6453) |
| `9a29587f0` | Add tooltips and keyboard shortcut for drawing segment toggle (re: #6453) |
| `7556c13b7` | Fix orthogonal segments when continuing a line from its start |
| `283719131` | Use "key" instead of "shortcut" for segments hotkey id, for consistency |
| `79806d70e` | Fix issue with orthogonal area drawing |
| `db3060b57` | Use "place points" language rather than "trace" for way drawing instructions |
| `df88eb199` | Add Structure tool for quickly toggling bridges and tunnels while drawing highways, railways, and waterways (close #6501) |
| `7014c2cda` | Select all added entities after drawing in some cases (re: #6563) |
| `521f1b596` | Select all added features when ending repeat drawing via a keyboard shortcut or the toolbar item (close #6563) Show Finish button instead of Cancel after adding at least one feature while repeat-drawing |
| `45a89df7c` | Select all features when finishing repeat-drawing during line and area draw modes (re: #6563) |
| `bf85ff723` | Don't discard drawn feature when toggling a quick preset while drawing (close #6609) |
| `33c51ed43` | Ensure that all added features are selected after using the structure tool |
| `4e07aa573` | Add layer tags with the Structure tool (close #6673) |
| `ee8e191da` | Add toolbar item for setting the node preset (none/pole/tower) when drawing power lines (close #5701) |
| `60a4ba544` | Move power support tool to be before the way segments tool (re: #5701) |
| `ec15ed972` | Fix error upon adding any line feature except power lines (close #6788) |
| `78a410e6d` | Add instructions for adding vertex-only features that indicate they must be added to ways (close #6026) |
| `e7a19adc1` | Improve structure tool icons (close #6809) |
| `62915d692` | Improve vertex adding instructions |
| `3e87ea7ba` | Fix missing structure tool icons (close #7124) |

---

## 5. Hash / notes / restorable changes / scale / map panes

URL `id=` could center and select **multiple** entities. Notes stayed a ribbon tool; the note editor itself moved with the assistant (listed there). Map **panes** (background/history/measurement) were re-anchored for small screens after the sidebar overlay change. The **scale bar** moved to the right by default (left still optional) so it would not fight the assistant. Restorable-edit UX (inactive map until restore/discard, redraw after discard) is mostly in assistant SHAs (`b4ef08629`, `fc2a1a9fe`, `e533619e4`); this group keeps hash, panes, and scale.

**Key files:** `modules/behavior/hash.js`, `modules/ui/scale.js`, `modules/ui/init.js`, `modules/ui/panels/**`, `modules/ui/background_offset.js`, `modules/ui/tools/notes.js`, `modules/renderer/map.js`

| SHA | Subject |
| --- | --- |
| `ced2ae407` | Fix issue where map panes wouldn't display |
| `dc7c3238f` | Allow viewing and editing the tags/relations of selected features at any zoom level (close #5001) |
| `09ea401d5` | Allow clicking to focus the background offset text field (close #6698) |
| `a67b0bc4b` | Move scale bar to the right side of screen, but leave option for left scalebar (re: #6657) |
| `cbfa19945` | Make panes usable on small screens |
| `abe8f1d9d` | Keep pane width constant and anchored but still adjust to small screens (close #6891) |
| `3d5d8b4bc` | Prevent long background layer names from pushing the "best" icon out of its container |
| `efb361ad2` | Allow centering and selecting multiple entities on launch with the `id` URL parameter (close #2818) |

---

## 6. Strings (`data/core.yaml` `assistant.*` / `toolbar.*`)

Almost every assistant and ribbon SHA also updates `data/core.yaml` and `dist/locales/en.json`. The freeze namespaces (under `en:`) are:

- `toolbar.*` — `center_zoom`, `deselect`, `undo_redo`, `recent`, `favorites`, `add_feature`, `finish`, `generic`, `geometry`, `repeat`, `segments`, `structure`, `support`, `toolbox`, plus shared tool labels
- `assistant.*` — `mode`, `instructions`, `global_location`, `greetings`, `notice`, `launch`, `restore`, `commit`, `feature_count`, and per-mode copy (`add_feature`, `add_area`, `add_line`, `add_point`, `add_note`, `browse`, `draw_*`, …)

Copy-only (or copy-primary) commit in this range; other string edits are listed with their feature theme:

| SHA | Subject |
| --- | --- |
| `03b16a8c2` | Adjust the strings for the invalid formatting validation (re: #6494) |

Related copy that is filed under other themes: `db3060b57` (“place points” vs “trace”), `284831f75` (Inspecting), `5edd10807` (Continue Mapping), `0354ddb93` (Hashtags / commit blockers).

---

## 7. CSS (`css/80_app.css` assistant, ribbon, `#bar` → `.top-toolbar`)

Feature work owns most `css/80_app.css` diffs (assistant translucency/blur, light/dark panels, ribbon overflow/scroll, popovers, inspector fields). Commits whose **primary** change is CSS (or icon metrics used by chrome):

| SHA | Subject |
| --- | --- |
| `5d6fec0ec` | CSS tweaks |
| `4d718c4e4` | Make inline icons scale correctly to different font sizes |
| `6103526e0` | Remove duplicate CSS |

Also see `3f798b85c` (background blur), `3cebb0d02` (primary buttons), `98de284f1` (translucent form fields), `7c488d981` / `fc38a7333` (assistant opacity/padding), `86c396f03` / `7545f6706` (toolbar scroll + popover). Map-layer CSS that landed on the prototype branch but is not chrome is under §9 (`70a1fe930`, `6b512f0ef`).

---

## 8. Build (Font Awesome icons in `build_data`)

`build_data.js` was extended so the v3 sprite/data pipeline emits **preset groups** and extra FA icons used by assistant/toolbox (smile/grin/laugh-beam, sun/moon, edit, map-marked-alt, toolbox, clock, birthday-cake).

**Key files:** `build_data.js`, `svg/fontawesome/*.svg`, `data/presets/groups.json` (generated)

| SHA | Subject |
| --- | --- |
| `73e8b2ce5` | Reinstate v3 parts of build_data.js |

Assistant/toolbox SHAs also add individual SVGs (`fas-sun`, `fas-moon`, `fas-toolbox`, …). `c357a136c` / `df8be98d6` are icon noise (skipped).

---

## 9. Other real v3-era behavior

Work that is not chrome-themed but landed in the unique series: **radial menu removal** (operations live on the ribbon via `op.available('toolbar')` in `modules/ui/tools/operation.js`), multi-select **raw tag editor**, relation member download, validation fix crashes / multi-square, selection highlighting, save-button lint, issues panel crash, map cursor/mode test glue, and a few map-style tweaks that rode along on the prototype branch.

**Key files:** `modules/ui/tools/operation.js`, `modules/operations/*.js`, `modules/ui/raw_tag_editor.js`, `modules/ui/entity_editor.js`, `modules/ui/radial_menu.js` (removed), `modules/validations/*.js`, `modules/core/context.js`, `modules/services/osm.js`, `modules/modes/select.js`

| SHA | Subject |
| --- | --- |
| `70a1fe930` | Use lighter styling for sidewalks than generic footways (close #6522) |
| `b15bbee2d` | Remove deprecated radial menu (re: #3753) |
| `cf2935576` | Highlight relation members in yellow when a relation is selected, including in a multi-selection (close #5766) |
| `6b512f0ef` | Let some iD icons be colored by CSS |
| `4314bce76` | Allow squaring multiple features at once (close #6565) |
| `a365da8a8` | Update unsquare fix annotation |
| `4ab97128c` | Don't render multipolygon members in yellow when the multipolygon is selected (close #6558) |
| `795981a7c` | Add directional arrows to waterway=weir rendered as lines (close #6615) |
| `423b8d484` | Fix crash on some validation fixes |
| `4bb21191a` | Check for mode to appease tests |
| `b4268a82d` | Let osm.js handle connection failure scenarios instead of context.js |
| `7ece70ef9` | Download some members upon selecting a relation (re: #4903, #6656) |
| `a4fee5030` | Refactor uiEntityEditor to accept multiple entities in preparation for #1761 |
| `b25af7cb7` | Lower the selected relation member download limit to 150 (re: #6668) |
| `3a8ed8be0` | Make the raw tag editor work for multiple selected features (close #1761) |
| `b61b3e716` | Fix tests for multi-entity raw tag editor |
| `6ba4603cd` | Fix issue where nonshared keys could appear shared in raw tag editor |
| `cb2a67d4c` | Fix issue where a shared key with an empty value would be treated as non-shared in the raw tag editor |
| `8e4bb6fb1` | Fix raw tag editor test |
| `4874a4d6f` | Show the combined values in the raw tag editor's field tooltip for multiselection (close #6730) |
| `8c48fcbc1` | Fix circularize error when selection non-ways |
| `46a0140a4` | Fix undefined var error |
| `09eb3bae7` | Remove duplicate function |

---

## Skipped / not product

Empty or noise relative to v3 UI. No greenkeeper commits appear in this 256. Imagery/translations dumps are represented by FAQ + `dist/locales` / generated JSON only.

| SHA | Subject | Skip reason |
| --- | --- | --- |
| `a0a0de34f` | Add derived data for prior merge | derived data |
| `02a8fa626` | Revert "Deprecate leisure/tanning_salon" | preset deprecate revert (`leisure/tanning_salon`) |
| `53888239e` | Revert "Add derived data for prior merge" | derived data revert |
| `0b54319cf` | Transifex should continue to track the 2.15 branch for a while | transifex branch tracking |
| `81f1e3366` | Bump min versions of node and npm.. test on node 8,10,12 | travis / node+npm version bump |
| `2794420f9` | Use simple access field for public bookcase (re: #6503) | preset field tweak (public bookcase; not v3-specific) |
| `1017687b3` | Add derived data from #6531 | derived data / locales dump |
| `ff8e5bd5d` | Changelog 2.15.2 | changelog-only |
| `ac106d74e` | Update osm community index to 0.8.0 | dependency bump (osm-community-index) |
| `154701352` | Release from `2.15` branch now, not `master` | RELEASING.md branch name |
| `df8be98d6` | Re-add some icon files | icon file re-add (chess knight/pawn) |
| `bfd2c1302` | Update README to recommend using 2.15 for downstream development | README downstream 2.15 pointer |
| `80e4b81a6` | Remove references to nonexistent test files | test harness cleanup (nonexistent spec refs) |
| `b0ed68909` | Add derived data from prior merge | derived data from merge |
| `d747f5043` | Add derived documentation change | derived documentation (`docs/statistics.html`) |
| `ce93439f1` | Derived data from prior commit | derived data |
| `c357a136c` | Update icon for latest fontawesome | Font Awesome icon refresh (`fas-guitar.svg`) |
| `8a9ca2c8f` | Tweak presets from #6863 and add derived data | preset dump + derived data (indoor elevator/stairs; not v3 chrome) |
| `d908b2a7f` | Updated Mapbox Satellite feedback instructions | imagery/FAQ (Mapbox Satellite feedback) |
| `72c7163a3` | Update name and terms for car sharing and car pooling presets | preset name/terms dump (car sharing/pooling; not v3-specific) |
| `790242492` | Update derived data | derived data / locales dump |
| `e81cb8d62` | drop support for Node 8, end-of-life | travis / Node 8 EOL |
| `0328e101a` | v2.17.2 changelog | changelog-only (plus package/context version bump for 2.17.2) |

### Skip categories (examples)

- **Changelog-only:** `0328e101a`, `ff8e5bd5d`
- **Derived data / locales dumps:** `790242492`, `ce93439f1`, `b0ed68909`, `1017687b3`, `a0a0de34f`, `53888239e`, `d747f5043`
- **Non-v3 preset dumps:** `8a9ca2c8f`, `72c7163a3`, `2794420f9`, `02a8fa626`
- **Imagery/FAQ:** `d908b2a7f`
- **Transifex:** `0b54319cf`
- **Travis / Node toolchain:** `e81cb8d62`, `81f1e3366`
- **Docs/release/README:** `bfd2c1302`, `154701352`
- **Dep bumps (not v3-specific):** `ac106d74e`
- **Icon file noise:** `c357a136c`, `df8be98d6`
- **Test index only:** `80e4b81a6`

---

## Counts

| | |
| --- | --- |
| Original unique commits (`ba40154a0..0328e101a`, first-parent, no-merge) | 256 |
| Product-themed (sections 1–9) | 233 |
| Skipped / not product | 23 |
| Theme groups | 9 |
| Unclassified | 0 |

Every SHA in the 256 appears in exactly one of: a product theme, or the skip table.

---

## Hop-8 status on this worktree (2.43.0-dev)

Target chrome is current `upstream/develop`: docked 2.x sidebar, `.top-toolbar`, `t.append`, `context.ts`, `en.min.json` only.

| Group | In tree? | Paints / behaves like 2020? |
| --- | --- | --- |
| 1 Assistant | `assistant.js` mounted in `.sidebar-wrap` | Partial: wrap often empty; 2.x sidebar kept on purpose; splash deleted |
| 2 Ribbon | `top_toolbar.js` + `modules/ui/tools/*` | **No** until `presetManager.getAddable` / favorites APIs restored; `t.html` on notes/save/undo must be `t.append` |
| 3 Groups / browser | `groups.json`, managers, `preset_browser.js` | Files present; addable ribbon depends on group 2 APIs |
| 4 Draw / structure / repeat | mode/behavior ports from hops 4–7 | Needs re-check after ribbon boots |
| 5 Hash / scale / panes | hop-7 ports | Duplicate `.over-map` CSS (v3 `top:71px` vs 2.43 relative) |
| 6 Strings | `data/core.yaml` `assistant.*` / `toolbar.*` | In `en.min.json`; other locales (e.g. `de.min.json`) lack v3 keys |
| 7 CSS | assistant/ribbon rules in `css/80_app.css` | Duplicate `.over-map` blocks fight layout |
| 8 FA / build_data | v3 glyphs on `faIcons` Set | Extra fetched SVGs untracked; warn+skip missing glyphs |
| 9 Other | toolbar `available('toolbar')`, multi-id hash | Mixed; keep 2.43 `checkActionAllowed` + toolbar situation |
