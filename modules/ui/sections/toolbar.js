import { prefs } from '../../core/preferences';
import { t } from '../../core/localizer';
import { uiTooltip } from '../tooltip';
import { uiSection } from '../section';

export const TOOLBAR_LABELS_PREF = 'preferences.toolbar.labels';


export function applyToolbarLabelsPref(context, options) {
    var show = (prefs(TOOLBAR_LABELS_PREF) || 'true') === 'true';
    context.container().classed('hide-toolbar-labels', !show);
    if (options && options.resize && context.ui()) {
        context.ui().onResize();
    }
}


export function uiSectionToolbar(context) {
    var section = uiSection('preferences-toolbar', context)
        .label(() => t.append('preferences.toolbar.title'))
        .disclosureContent(renderDisclosureContent);

    function renderDisclosureContent(selection) {
        selection.selectAll('.toolbar-options-list')
            .data([0])
            .enter()
            .append('ul')
            .attr('class', 'layer-list toolbar-options-list');

        var labelsEnter = selection.select('.toolbar-options-list')
            .selectAll('.toolbar-labels-item')
            .data([prefs(TOOLBAR_LABELS_PREF) || 'true'])
            .enter()
            .append('li')
            .attr('class', 'toolbar-labels-item')
            .append('label')
            .call(uiTooltip()
                .title(() => t.append('preferences.toolbar.labels.tooltip'))
                .placement('bottom')
            );

        labelsEnter
            .append('input')
            .attr('type', 'checkbox')
            .on('change', (d3_event, d) => {
                d3_event.preventDefault();
                prefs(TOOLBAR_LABELS_PREF, d === 'true' ? 'false' : 'true');
            });

        labelsEnter
            .append('span')
            .call(t.append('preferences.toolbar.labels.description'));

        selection.selectAll('.toolbar-labels-item')
            .classed('active', d => d === 'true')
            .select('input')
            .property('checked', d => d === 'true');
    }

    prefs.onChange(TOOLBAR_LABELS_PREF, () => {
        applyToolbarLabelsPref(context, { resize: true });
        section.reRender();
    });

    return section;
}
