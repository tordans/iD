import { dispatch as d3_dispatch } from 'd3-dispatch';
import { select as d3_select } from 'd3-selection';

import { t } from '../../core/localizer';
import { presetField } from '../../presets/field';
import { TRAFFIC_SIGN_FIELD_TYPE, WAY_SIGN_KEYS } from '../../presets/traffic_sign_fields';
import {
    mergeWaySigns, signRows, waySignChanges, waySigns, type SignGroup, type SignRow, type WaySigns
} from '../../traffic_sign/sign_field_rows';
import { utilRebind } from '../../util';
import { uiFieldTrafficSign } from './traffic_sign';
import type { Field } from '@openstreetmap/id-tagging-schema';

type Toggle = 'whole' | 'directions';

/**
 * A traffic sign field with one row per key (WORKDOC feature 27): the way's sign with its
 * directions, or the signs of the bike lanes / sidewalks per side. Each row is the traffic sign
 * field of its key, with its tag suggestions.
 *
 * The way's field has two switches in its label, "Whole way" (`traffic_sign`) and "Per direction"
 * (`:forward`, `:backward`). Direction signs that say the same as the whole way are shown merged
 * into it (`mergeWaySigns`); the tags follow with the next change of the whole way's sign.
 */
export function uiFieldTrafficSignGroup(field: { key: string; signGroup?: SignGroup }, context: iD.Context) {
    const dispatch = d3_dispatch('change');
    const group: SignGroup = field.signGroup ?? 'way';
    const rowFields = new Map<string, ReturnType<typeof uiFieldTrafficSign>>();
    /** the switches the user set while this feature is selected; `undefined`: follow the tags */
    let _showWhole: boolean | undefined;
    let _showDirections: boolean | undefined;
    let _tags: TagsMulti = {};
    let _entityIDs: string[] = [];
    let _selection: d3.Selection | null = null;


    function fieldForRow(key: string) {
        if (!rowFields.has(key)) {
            const data = { key, type: TRAFFIC_SIGN_FIELD_TYPE, label: key, snake_case: false, caseSensitive: true } as unknown as Field;
            const instance = uiFieldTrafficSign(presetField(`traffic_sign/${key.replace(/:/g, '_')}`, data), context);
            instance.on('change', (tags: TagsUpdate, onInput?: boolean) => dispatch.call('change', trafficSignGroup, rowChange(key, tags), onInput));
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


    function isTagged(key: string) {
        const value = _tags[key];
        return Array.isArray(value) || (typeof value === 'string' && value !== '');
    }


    /**
     * What the way's field shows. The tags as they are once the user switched the directions on
     * (so signs can be built up per direction) and for a multiselection with different values;
     * else merged.
     */
    function wayState() {
        const multiple = WAY_SIGN_KEYS.some(key => Array.isArray(_tags[key]));
        const merged = !multiple && _showDirections !== true;
        const signs: WaySigns = merged ? mergeWaySigns(waySigns(_tags)) : waySigns(_tags);
        const directionsTagged = merged
            ? !!(signs.forward || signs.backward)
            : isTagged('traffic_sign:forward') || isTagged('traffic_sign:backward');
        const wholeTagged = merged ? !!signs.whole : isTagged('traffic_sign');
        const directions = directionsTagged || _showDirections === true;
        const whole = wholeTagged || !directions || _showWhole !== false;
        return { merged, signs, whole, directions, locked: { whole: wholeTagged || !directions, directions: directionsTagged } };
    }


    /** The tags a row field reads: the merged signs for the way's rows */
    function rowTags(): TagsMulti {
        if (group !== 'way') return _tags;
        const state = wayState();
        if (!state.merged) return _tags;
        const tags = { ..._tags };
        delete tags['traffic_sign:forward'];
        delete tags['traffic_sign:backward'];
        delete tags.traffic_sign;
        if (state.signs.whole) tags.traffic_sign = state.signs.whole;
        if (state.signs.forward) tags['traffic_sign:forward'] = state.signs.forward;
        if (state.signs.backward) tags['traffic_sign:backward'] = state.signs.backward;
        return tags;
    }


    /** A change of a row, plus the tags that bring a merged display into the tags */
    function rowChange(key: string, change: TagsUpdate): TagsUpdate {
        if (group !== 'way') return change;
        if (key !== 'traffic_sign') {
            // from now on the directions are edited as tagged: equal signs are not merged away
            // while the user builds them up
            _showDirections = true;
            return change;
        }
        const state = wayState();
        if (!state.merged || !('traffic_sign' in change)) return change;
        const whole = typeof change.traffic_sign === 'string' && change.traffic_sign !== '' ? change.traffic_sign : undefined;
        return { ...change, ...waySignChanges(_tags, { ...state.signs, whole }) };
    }


    function wayRows(): SignRow[] {
        const state = wayState();
        const rows: SignRow[] = [];
        if (state.whole) rows.push({ key: 'traffic_sign' });
        if (state.directions) {
            rows.push({ key: 'traffic_sign:forward', direction: 'forward' });
            rows.push({ key: 'traffic_sign:backward', direction: 'backward' });
        }
        return rows;
    }


    /** Only ways have directions; other features get the switches when a direction is tagged */
    function hasToggles() {
        if (group !== 'way') return false;
        return wayState().locked.directions || (_entityIDs.length > 0 && _entityIDs.every(id => id.startsWith('w')));
    }


    /** The switches "Whole way | Per direction" in the field's label */
    function renderToggles() {
        const label = _selection!.select<HTMLElement>('.field-label');
        if (label.empty()) return;

        const state = group === 'way' ? wayState() : undefined;
        let toggles = label.selectAll<HTMLDivElement, number>('.traffic-sign-toggles')
            .data(state && hasToggles() ? [0] : []);
        toggles.exit().remove();
        toggles = toggles.enter()
            .insert('div', 'button')
            .attr('class', 'traffic-sign-toggles')
            .merge(toggles);
        if (!state) return;

        const buttons = toggles.selectAll<HTMLButtonElement, Toggle>('button')
            .data(['whole', 'directions'] as Toggle[]);
        buttons.enter()
            .append('button')
            .attr('type', 'button')
            .attr('class', d => `traffic-sign-toggle traffic-sign-toggle-${d}`)
            .text(d => t(`inspector.traffic_sign_group.toggle.${d}`))
            .on('click', (d3_event: MouseEvent, d) => {
                d3_event.preventDefault();
                d3_event.stopPropagation();
                const now = wayState();
                if (now.locked[d]) return;
                if (d === 'whole') _showWhole = !now.whole;
                else _showDirections = !now.directions;
                render();
            })
            .merge(buttons)
            .classed('active', d => state[d])
            .classed('locked', d => state.locked[d])
            .attr('aria-pressed', d => String(state[d]))
            .attr('title', d => t(`inspector.traffic_sign_group.toggle.${d}_tooltip`));
    }


    function render() {
        if (!_selection) return;
        const rows = group === 'way' ? wayRows() : signRows(_tags, group);
        const labelled = rows.length > 1 || group !== 'way' || rows[0]?.key !== 'traffic_sign';
        const tags = rowTags();

        renderToggles();

        let list = _selection.selectAll<HTMLDivElement, number>('.traffic-sign-group-rows').data([0]);
        list = list.enter().append('div').attr('class', 'traffic-sign-group-rows').merge(list);

        const items = list.selectAll<HTMLDivElement, SignRow>('.traffic-sign-group-row')
            .data(rows, d => d.key);
        items.exit().remove();
        const enter = items.enter()
            .append('div')
            .attr('class', 'traffic-sign-group-row');
        enter.append('div').attr('class', 'traffic-sign-group-label');
        enter.append('div').attr('class', 'traffic-sign-group-input');

        const all = enter.merge(items).order();
        all.select('.traffic-sign-group-label')
            .classed('hide', d => !labelled || !rowLabel(d))
            .text(d => labelled ? rowLabel(d) : '');
        all.select<HTMLDivElement>('.traffic-sign-group-input')
            .each(function(d) {
                const instance = fieldForRow(d.key);
                instance.tags(tags);
                d3_select<HTMLElement, unknown>(this).call(instance as unknown as (selection: d3.Selection) => void);
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
        if (val.join() !== _entityIDs.join()) {
            _showWhole = undefined;
            _showDirections = undefined;
        }
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

