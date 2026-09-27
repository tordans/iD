import { localizer, t } from '../../core/localizer';
import { readOnlyFeatures } from '../../renderer/readonly_features';
import { svgIcon } from '../../svg/icon';
import { uiTooltip } from '../tooltip';

/**
 * Adds a lock button to each row of the Map Features list (`map_features.js`).
 * Locked categories stay visible but muted and cannot be edited.
 */
export function drawReadOnlyToggles(items: d3.Selection<HTMLLIElement>) {
    const placement = localizer.textDirection() === 'rtl' ? 'right' : 'left';

    items.selectAll<HTMLButtonElement, string>('button.readonly-toggle')
        .data((d: string) => [d])
        .enter()
        .append('button')
        .attr('class', 'readonly-toggle')
        .call((uiTooltip() as any)
            .title((key: string) => t.append(readOnlyFeatures.isReadOnlyKey(key)
                ? 'map_data.readonly.on'
                : 'map_data.readonly.off'))
            .placement(placement)
        )
        .on('click', (d3_event: MouseEvent, key: string) => {
            d3_event.preventDefault();
            d3_event.stopPropagation();
            readOnlyFeatures.toggle(key);
        })
        .call(svgIcon('#fas-lock', ''));

    items
        .classed('readonly', (key: string) => readOnlyFeatures.isReadOnlyKey(key))
        .select('button.readonly-toggle')
        .classed('active', (key: string) => readOnlyFeatures.isReadOnlyKey(key))
        .attr('aria-pressed', (key: string) => String(readOnlyFeatures.isReadOnlyKey(key)));
}
