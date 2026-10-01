import { dispatch as d3_dispatch } from 'd3-dispatch';
import { select as d3_select } from 'd3-selection';

import { t } from '../../core/localizer';
import { presetField } from '../../presets/field';
import { TRAFFIC_SIGN_FIELD_TYPE } from '../../presets/traffic_sign_fields';
import { signRows, type SignGroup, type SignRow } from '../../traffic_sign/sign_field_rows';
import { utilRebind } from '../../util';
import { uiFieldTrafficSign } from './traffic_sign';
import type { Field } from '@openstreetmap/id-tagging-schema';

/**
 * A traffic sign field with one row per key (WORKDOC feature 27): the way's sign with its
 * directions, or the signs of the bike lanes / sidewalks per side. Each row is the traffic sign
 * field of its key, with its tag suggestions.
 */
export function uiFieldTrafficSignGroup(field: { key: string; signGroup?: SignGroup }, context: iD.Context) {
    const dispatch = d3_dispatch('change');
    const group: SignGroup = field.signGroup ?? 'way';
    const rowFields = new Map<string, ReturnType<typeof uiFieldTrafficSign>>();
    /** directions added with "+ forward" while this feature is selected */
    const added = new Set<string>();
    let _tags: TagsMulti = {};
    let _entityIDs: string[] = [];
    let _selection: d3.Selection | null = null;


    function fieldForRow(key: string) {
        if (!rowFields.has(key)) {
            const data = { key, type: TRAFFIC_SIGN_FIELD_TYPE, label: key, snake_case: false, caseSensitive: true } as unknown as Field;
            const instance = uiFieldTrafficSign(presetField(`traffic_sign/${key.replace(/:/g, '_')}`, data), context);
            instance.on('change', (tags: TagsUpdate, onInput?: boolean) => dispatch.call('change', trafficSignGroup, tags, onInput));
            instance.entityIDs(_entityIDs);
            rowFields.set(key, instance);
        }
        return rowFields.get(key)!;
    }


    function rowLabel(row: SignRow): string {
        const parts: string[] = [];
        if (row.side) parts.push(t(`inspector.traffic_sign_group.side.${row.side}`));
        if (row.direction) parts.push(t(`inspector.traffic_sign_group.direction.${row.direction}`));
        // the way's plain sign next to its directions
        else if (!row.side && group === 'way') parts.push(t('inspector.traffic_sign_group.direction.both'));
        return parts.join(' ');
    }


    /** Only ways have directions; the way's own sign can get one added */
    function addableDirections(rows: SignRow[]): string[] {
        if (group !== 'way' || _entityIDs.length !== 1) return [];
        if (!_entityIDs[0].startsWith('w')) return [];
        const shown = new Set(rows.map(row => row.key));
        return ['traffic_sign:forward', 'traffic_sign:backward'].filter(key => !shown.has(key));
    }


    function render() {
        if (!_selection) return;
        const rows = signRows(_tags, group, added);
        const labelled = rows.length > 1 || group !== 'way';

        let list = _selection.selectAll<HTMLDivElement, number>('.traffic-sign-rows').data([0]);
        list = list.enter().append('div').attr('class', 'traffic-sign-rows').merge(list);

        const items = list.selectAll<HTMLDivElement, SignRow>('.traffic-sign-row')
            .data(rows, d => d.key);
        items.exit().remove();
        const enter = items.enter()
            .append('div')
            .attr('class', 'traffic-sign-row');
        enter.append('div').attr('class', 'traffic-sign-row-label');
        enter.append('div').attr('class', 'traffic-sign-row-input');

        const all = enter.merge(items).order();
        all.select('.traffic-sign-row-label')
            .classed('hide', d => !labelled || !rowLabel(d))
            .text(d => labelled ? rowLabel(d) : '');
        all.select<HTMLDivElement>('.traffic-sign-row-input')
            .each(function(d) {
                const instance = fieldForRow(d.key);
                instance.tags(_tags);
                d3_select<HTMLElement, unknown>(this).call(instance as unknown as (selection: d3.Selection) => void);
            });

        const addButtons = _selection.selectAll<HTMLButtonElement, string>('.traffic-sign-add-direction')
            .data(addableDirections(rows), d => d);
        addButtons.exit().remove();
        addButtons.enter()
            .append('button')
            .attr('type', 'button')
            .attr('class', 'traffic-sign-add-direction')
            .text(d => `+ ${t(`inspector.traffic_sign_group.direction.${d.endsWith('forward') ? 'forward' : 'backward'}`)}`)
            .attr('title', t('inspector.traffic_sign_group.add_direction_tooltip'))
            .on('click', (_event, key) => {
                added.add(key);
                render();
                rowFields.get(key)?.focus();
            });
    }


    function trafficSignGroup(selection: d3.Selection) {
        _selection = selection;
        render();
    }


    trafficSignGroup.tags = function(tags: TagsMulti) {
        _tags = tags;
        render();
        return trafficSignGroup;
    };


    trafficSignGroup.entityIDs = function(val?: string[]) {
        if (val === undefined) return _entityIDs;
        if (val.join() !== _entityIDs.join()) added.clear();
        _entityIDs = val;
        for (const instance of rowFields.values()) instance.entityIDs(val);
        return trafficSignGroup;
    };


    trafficSignGroup.focus = function() {
        rowFields.values().next().value?.focus();
        return trafficSignGroup;
    };


    return utilRebind(trafficSignGroup, dispatch, 'on');
}

