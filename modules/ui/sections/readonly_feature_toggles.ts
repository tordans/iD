import { select as d3_select } from 'd3-selection';

import { localizer, t } from '../../core/localizer';
import { readOnlyFeatures } from '../../renderer/readonly_features';
import { svgIcon } from '../../svg/icon';
import { uiTooltip } from '../tooltip';

type FeatureMode = 'edit' | 'read' | 'hide';

const MODES: { mode: FeatureMode; icon: string }[] = [
    { mode: 'edit', icon: '#fas-pen' },
    { mode: 'read', icon: '#fas-eye' },
    { mode: 'hide', icon: '#fas-eye-slash' }
];


/**
 * Replaces the checkbox of each Map Features row (`map_features.js`) with a
 * 3-way toggle: Edit (shown, the default), Read (shown muted, not editable,
 * see renderer/readonly_features.ts) and Hide (iD's feature filter).
 */
export function drawFeatureModeToggles(items: d3.Selection<HTMLLIElement>, context: iD.Context) {
    const features = context.features();
    const placement = localizer.textDirection() === 'rtl' ? 'right' : 'left';

    function modeOf(key: string): FeatureMode {
        if (!features.enabled(key)) return 'hide';
        return readOnlyFeatures.isReadOnlyKey(key) ? 'read' : 'edit';
    }

    function setMode(key: string, mode: FeatureMode) {
        const wantReadOnly = mode === 'read';
        if (readOnlyFeatures.isReadOnlyKey(key) !== wantReadOnly) readOnlyFeatures.toggle(key);
        if (mode === 'hide') {
            features.disable(key);
        } else {
            features.enable(key);
        }
    }

    const groupEnter = items.selectAll<HTMLDivElement, string>('.feature-mode')
        .data((key: string) => [key])
        .enter()
        .append('div')
        .attr('class', 'feature-mode')
        .attr('role', 'radiogroup');

    groupEnter.selectAll<HTMLButtonElement, { key: string; mode: FeatureMode; icon: string }>('button')
        .data((key: string) => MODES.map(d => ({ key, ...d })))
        .enter()
        .append('button')
        .attr('class', d => `feature-mode-${d.mode}`)
        .attr('role', 'radio')
        .attr('aria-label', d => t('map_data.feature_mode.label', {
            feature: t(`feature.${d.key}.description`),
            mode: t(`map_data.feature_mode.${d.mode}`)
        }))
        .call((uiTooltip() as any)
            .title((d: { mode: FeatureMode }) => t.append(`map_data.feature_mode.${d.mode}`))
            .placement(placement)
        )
        .on('click', (d3_event: MouseEvent, d) => {
            d3_event.preventDefault();
            d3_event.stopPropagation();
            setMode(d.key, d.mode);
        })
        .each(function(d) {
            svgIcon(d.icon, '')(d3_select<HTMLElement, unknown>(this));
        });

    items
        .attr('data-mode', (key: string) => modeOf(key))
        .classed('readonly', (key: string) => modeOf(key) === 'read')
        .selectAll<HTMLButtonElement, { key: string; mode: FeatureMode }>('.feature-mode button')
        .classed('active', d => modeOf(d.key) === d.mode)
        .attr('aria-checked', d => String(modeOf(d.key) === d.mode));
}
