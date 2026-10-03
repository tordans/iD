/**
 * Project configuration of the editor's own UI (WORKDOC feature 30), set before `context.init()`:
 *
 *     iD.uiConfig({ hiddenMapControls: ['zoom-to-selection', 'geolocate', 'help'] });
 *
 * `hiddenMapControls`: buttons of the right sidebar that are not created.
 * - `zoom-to-selection` and `geolocate` are the two buttons below zoom in / out.
 *   The shortcut for "zoom to this" keeps working (it belongs to the select modes).
 * - Any other id is a pane (`background`, `map-data`, `map-display`, `photos`, `issues`,
 *   `preferences`, `help`): the pane, its button and its shortcut are left out.
 */

export type UiConfig = {
    hiddenMapControls: string[];
};

let _config: UiConfig = {
    hiddenMapControls: []
};


/** Get the config, or merge in changes */
export function uiConfig(changes?: Partial<UiConfig>): UiConfig {
    if (changes) _config = { ..._config, ...changes };
    return _config;
}


export function isMapControlHidden(id: string): boolean {
    return _config.hiddenMapControls.includes(id);
}
