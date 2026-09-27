import { prefs } from '../../core/preferences';
import { t } from '../../core/localizer';
import { uiSection } from '../section';
import { uiTooltip } from '../tooltip';

/**
 * Preferences ▸ Interface: options for the editor's own UI.
 * "Show button labels" hides the captions under the top toolbar buttons
 * ("Add Feature", "Undo / Redo", …) for a shorter toolbar.
 * Ported from the iD--v3-reloaded worktree (commits 1f76e0820, 439e18668, 7d74005f8).
 */

export const INTERFACE_LABELS_PREF = 'preferences.interface.labels';


function showLabels() {
    return prefs(INTERFACE_LABELS_PREF) !== 'false';
}


/** Applies the interface preferences to the container; call at startup and after changes */
export function applyInterfacePrefs(context: iD.Context, options?: { resize?: boolean }) {
    context.container().classed('hide-toolbar-labels', !showLabels());
    if (options?.resize) {
        // the toolbar height changed, so the map area did too
        (context.ui() as { onResize?: () => void }).onResize?.();
    }
}


export function uiSectionInterface(context: iD.Context) {
    const section = (uiSection('preferences-interface', context) as any)
        .label(() => t.append('preferences.interface.title'))
        .disclosureContent(renderDisclosureContent);

    function renderDisclosureContent(selection: d3.Selection) {
        let list = selection.selectAll<HTMLUListElement, number>('ul.interface-options-list')
            .data([0]);
        list = list.enter()
            .append('ul')
            .attr('class', 'layer-list interface-options-list')
            .merge(list);

        const itemEnter = list.selectAll('li.interface-labels-item')
            .data([0])
            .enter()
            .append('li')
            .attr('class', 'interface-labels-item')
            .append('label')
            .call((uiTooltip() as any)
                .title(() => t.append('preferences.interface.labels.tooltip'))
                .placement('bottom')
            );

        itemEnter
            .append('input')
            .attr('type', 'checkbox')
            .on('change', function(this: HTMLInputElement) {
                prefs(INTERFACE_LABELS_PREF, this.checked ? 'true' : 'false');
            });

        itemEnter
            .append('span')
            .call(t.append('preferences.interface.labels.description'));

        list.select('li.interface-labels-item')
            .classed('active', showLabels())
            .select('input')
            .property('checked', showLabels());
    }

    prefs.onChange(INTERFACE_LABELS_PREF, () => {
        applyInterfacePrefs(context, { resize: true });
        section.reRender();
    });

    return section;
}
