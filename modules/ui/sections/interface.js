import { prefs } from '../../core/preferences';
import { t } from '../../core/localizer';
import { uiTooltip } from '../tooltip';
import { uiSection } from '../section';

export const INTERFACE_LABELS_PREF = 'preferences.interface.labels';
var LEGACY_LABELS_PREF = 'preferences.toolbar.labels';


function labelsPref() {
    var current = prefs(INTERFACE_LABELS_PREF);
    if (current !== null) return current;

    var legacy = prefs(LEGACY_LABELS_PREF);
    if (legacy !== null) {
        prefs(INTERFACE_LABELS_PREF, legacy);
        prefs(LEGACY_LABELS_PREF, null);
        return legacy;
    }

    return 'true';
}


export function applyInterfacePrefs(context, options) {
    var showLabels = labelsPref() === 'true';
    context.container().classed('hide-toolbar-labels', !showLabels);
    if (options && options.resize && context.ui()) {
        context.ui().onResize();
    }
}


export function uiSectionInterface(context) {
    var section = uiSection('preferences-interface', context)
        .label(() => t.append('preferences.interface.title'))
        .disclosureContent(renderDisclosureContent);

    function renderDisclosureContent(selection) {
        selection.selectAll('.interface-options-list')
            .data([0])
            .enter()
            .append('ul')
            .attr('class', 'layer-list interface-options-list');

        var labelsEnter = selection.select('.interface-options-list')
            .selectAll('.interface-labels-item')
            .data([labelsPref()])
            .enter()
            .append('li')
            .attr('class', 'interface-labels-item')
            .append('label')
            .call(uiTooltip()
                .title(() => t.append('preferences.interface.labels.tooltip'))
                .placement('bottom')
            );

        labelsEnter
            .append('input')
            .attr('type', 'checkbox')
            .on('change', (d3_event, d) => {
                d3_event.preventDefault();
                prefs(INTERFACE_LABELS_PREF, d === 'true' ? 'false' : 'true');
            });

        labelsEnter
            .append('span')
            .call(t.append('preferences.interface.labels.description'));

        selection.selectAll('.interface-labels-item')
            .classed('active', d => d === 'true')
            .select('input')
            .property('checked', d => d === 'true');
    }

    prefs.onChange(INTERFACE_LABELS_PREF, () => {
        applyInterfacePrefs(context, { resize: true });
        section.reRender();
    });

    return section;
}
