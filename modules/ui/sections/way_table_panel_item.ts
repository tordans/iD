import { t } from '../../core/localizer';
import { uiTooltip } from '../tooltip';

/**
 * Checkbox in the Map Data pane's panel list that toggles the way table panel.
 */
export function drawWayTablePanelItem(list: d3.Selection<HTMLUListElement>, context: iD.Context) {
    // `wayTable` is set on the ui object in `ui/init.js`
    const wayTable = (context.ui() as { wayTable?: { enabled(): boolean, toggle(enabled?: boolean): unknown } }).wayTable;

    const label = list
        .append('li')
        .attr('class', 'way-table-panel-toggle-item')
        .append('label')
        .call((uiTooltip() as any)
            .title(() => t.append('map_data.way_table_panel.tooltip'))
            .keys([t('way_table.key')])
            .placement('top')
        );

    label
        .append('input')
        .attr('type', 'checkbox')
        .property('checked', wayTable?.enabled() ?? false)
        .on('change', function(this: HTMLInputElement) {
            wayTable?.toggle(this.checked);
        });

    label
        .append('span')
        .call(t.append('map_data.way_table_panel.title'));
}
