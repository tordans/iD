import { dispatch as d3_dispatch } from 'd3-dispatch';
import { select as d3_select } from 'd3-selection';
import {
    analyzeCategoryGaps,
    isIncompleteCategoryId,
    listTargetCategories,
    processBikelanes,
    writeKeyForSide,
    type BikelaneResult,
    type CategoryGap
} from '@tilda-geo/bicycle-infrastructure';

import { t } from '../../core/localizer';
import { utilRebind } from '../../util/rebind';
import { categoryForSide, planCategory, type Side, type TildaTagPlan } from '../../tilda/category_plan';
import { requiredAttributes, type RequiredAttribute } from '../../tilda/required_attributes';
import { uiSection } from '../section';

/** One card per TILDA result (self / left / right side of the way) */
type SideCard = {
    side: Side;
    result: BikelaneResult;
    gaps: CategoryGap[];
    target: string | undefined;
    plan: TildaTagPlan | undefined;
    attributes: RequiredAttribute[];
};

const SIDE_ORDER: Side[] = ['self', 'left', 'right'];


function categoryLabel(category: string | undefined) {
    if (!category) return t('inspector.tilda.no_category');
    return t(`inspector.tilda.category.${category}`, { default: category });
}


/**
 * Inspector section "TILDA bike infrastructure": how TILDA classifies each side of
 * the selected way, what is missing for an exact category, how to reach a chosen
 * category, and which attributes the Radnetz dataset needs.
 * Uses `@tilda-geo/bicycle-infrastructure`, the TypeScript port of TILDA's processing.
 *
 * Events:
 *   'change' - (entityIDs, changed tags), handled by the entity editor like other sections
 */
export function uiSectionTildaBikeInfra(context: iD.Context) {
    const dispatch = d3_dispatch('change');

    let _entityIDs: string[] = [];
    let _tags: Tags = {};
    /** target category per side, chosen by the user */
    let _targets = new Map<Side, string>();

    const section = (uiSection('tilda-bike-infra', context) as any)
        .label(() => t.append('inspector.tilda.title'))
        .shouldDisplay(() => _entityIDs.length === 1 && _entityIDs[0].startsWith('w') && !!_tags.highway)
        .disclosureContent(renderDisclosureContent);


    function changeTags(changed: TagsUpdate) {
        dispatch.call('change', section, _entityIDs, changed);
    }


    function showSide(side: Side | undefined) {
        const indicatorSide = side === 'left' || side === 'right' ? side : undefined;
        context.setDirectionalComboIndicator(indicatorSide ? { side: indicatorSide, entityIDs: _entityIDs } : null);
    }


    function cards(): SideCard[] {
        const results = processBikelanes(_tags)
            .sort((a, b) => SIDE_ORDER.indexOf(a._side) - SIDE_ORDER.indexOf(b._side));
        const gaps = analyzeCategoryGaps(_tags, results);

        return results.map(result => {
            const side = result._side;
            const target = _targets.get(side);
            const plan = target && target !== result.category ? planCategory(_tags, target, side) : undefined;
            return {
                side,
                result,
                gaps: gaps.find(gap => gap._side === side)?.missing ?? [],
                target,
                plan,
                attributes: requiredAttributes(result, _tags)
            };
        });
    }


    function renderDisclosureContent(selection: d3.Selection) {
        const data = cards();

        const empty = selection.selectAll<HTMLParagraphElement, number>('.tilda-empty')
            .data(data.length ? [] : [0]);
        empty.exit().remove();
        empty.enter()
            .append('p')
            .attr('class', 'tilda-empty deemphasize')
            .call(t.append('inspector.tilda.not_processed'));

        let cardSelection = selection.selectAll<HTMLDivElement, SideCard>('.tilda-card')
            .data(data, d => d.side);
        cardSelection.exit().remove();

        const cardEnter = cardSelection.enter()
            .append('div')
            .attr('class', d => `tilda-card tilda-card-${d.side}`)
            .on('mouseenter', (_d3_event: MouseEvent, d: SideCard) => showSide(d.side))
            .on('mouseleave', () => showSide(undefined));

        const headerEnter = cardEnter.append('div').attr('class', 'tilda-card-header');
        headerEnter.append('span').attr('class', 'tilda-side');
        headerEnter.append('span').attr('class', 'tilda-category');
        headerEnter.append('code').attr('class', 'tilda-category-id');
        cardEnter.append('div').attr('class', 'tilda-gaps');
        cardEnter.append('div').attr('class', 'tilda-target');
        cardEnter.append('div').attr('class', 'tilda-attributes');

        cardSelection = cardSelection.merge(cardEnter);

        cardSelection.select('.tilda-side')
            .text(d => t(`inspector.tilda.side.${d.side}`));
        cardSelection.select('.tilda-category')
            .attr('class', d => [
                'tilda-category',
                d.result.category === 'needsClarification' ? 'needs-clarification' : '',
                isIncompleteCategoryId(d.result.category) ? 'incomplete' : '',
                d.result._infrastructureExists ? 'exists' : 'absent'
            ].filter(Boolean).join(' '))
            .text(d => categoryLabel(d.result.category));
        cardSelection.select('.tilda-category-id')
            .text(d => d.result.category);

        cardSelection.select<HTMLDivElement>('.tilda-gaps').each(function(d) { drawGaps(d3_select(this), d); });
        cardSelection.select<HTMLDivElement>('.tilda-target').each(function(d) { drawTarget(d3_select(this), d); });
        cardSelection.select<HTMLDivElement>('.tilda-attributes').each(function(d) { drawAttributes(d3_select(this), d); });
    }


    /** Questions that make an incomplete category exact, one button per answer */
    function drawGaps(selection: d3.Selection<HTMLDivElement>, card: SideCard) {
        let rows = selection.selectAll<HTMLDivElement, CategoryGap>('.tilda-gap')
            .data(card.gaps, d => d.key);
        rows.exit().remove();

        const rowsEnter = rows.enter()
            .append('div')
            .attr('class', 'tilda-gap');
        rowsEnter.append('div').attr('class', 'tilda-gap-reason');
        rowsEnter.append('div').attr('class', 'tilda-buttons');

        rows = rows.merge(rowsEnter);
        rows.select('.tilda-gap-reason')
            .text(d => `${writeKeyForSide(d.key, card.side, card.result._prefix)}: ${d.reason}`);

        const buttons = rows.select('.tilda-buttons')
            .selectAll<HTMLButtonElement, string>('button')
            .data(d => d.values, d => d);
        buttons.exit().remove();
        buttons.enter()
            .append('button')
            .attr('class', 'button tilda-value')
            .merge(buttons)
            .text(d => d)
            .on('click', function(_d3_event: MouseEvent, value: string) {
                const gap = d3_select(this.parentElement!.parentElement!).datum() as CategoryGap;
                changeTags({ [writeKeyForSide(gap.key, card.side, card.result._prefix)]: value });
            });
    }


    /** Target category select, and the tags to add or change to reach it */
    function drawTarget(selection: d3.Selection<HTMLDivElement>, card: SideCard) {
        const current = card.result.category;
        const targets = listTargetCategories({ fromCategory: current, fromIncomplete: isIncompleteCategoryId(current) });
        const options = [current, ...targets.filter(target => target !== current)];

        let label = selection.selectAll<HTMLLabelElement, number>('label')
            .data([0]);
        const labelEnter = label.enter().append('label');
        labelEnter.append('span').call(t.append('inspector.tilda.target'));
        labelEnter.append('select')
            .on('change', function(this: HTMLSelectElement) {
                const value = this.value;
                if (value === current) {
                    _targets.delete(card.side);
                } else {
                    _targets.set(card.side, value);
                }
                section.reRender();
            });
        label = label.merge(labelEnter);

        const select = label.select('select');
        const optionSelection = select.selectAll<HTMLOptionElement, string>('option')
            .data(options, d => d);
        optionSelection.exit().remove();
        optionSelection.enter()
            .append('option')
            .merge(optionSelection)
            .attr('value', d => d)
            .text(d => d === current ? `${categoryLabel(d)} (${t('inspector.tilda.current')})` : categoryLabel(d));
        select.property('value', card.target ?? current);

        const plan = card.plan;
        const planBox = selection.selectAll<HTMLDivElement, TildaTagPlan>('.tilda-plan')
            .data(plan ? [plan] : []);
        planBox.exit().remove();
        const planEnter = planBox.enter().append('div').attr('class', 'tilda-plan');
        planEnter.append('ul');
        planEnter.append('button')
            .attr('class', 'button action tilda-apply-all')
            .call(t.append('inspector.tilda.apply_all'));

        const merged = planBox.merge(planEnter);
        if (!plan) return;

        type PlanRow = { kind: 'add' | 'change' | 'remove' | 'conflict'; key: string; value: string; from?: string; reason: string };
        const rows: PlanRow[] = [
            ...plan.remove.map(key => ({ kind: 'remove' as const, key, value: _tags[key] ?? '', reason: t('inspector.tilda.remove_reason') })),
            ...plan.add.map(entry => ({ kind: 'add' as const, key: entry.key, value: entry.value, reason: entry.reason })),
            ...plan.change.map(entry => ({ kind: 'change' as const, key: entry.key, value: entry.to, from: entry.from, reason: entry.reason })),
            ...plan.conflicts.map(entry => ({ kind: 'conflict' as const, key: entry.key, value: entry.value, reason: entry.reason }))
        ];

        const items = merged.select('ul')
            .selectAll<HTMLLIElement, PlanRow>('li')
            .data(rows, d => `${d.kind}-${d.key}`);
        items.exit().remove();
        items.enter()
            .append('li')
            .merge(items)
            .attr('class', d => `tilda-plan-${d.kind}`)
            .each(function(d) {
                const li = d3_select(this).text('');
                const tag = d.kind === 'change' ? `${d.key}: ${d.from} → ${d.value}` : `${d.key}=${d.value}`;  // remove shows the old tag
                li.append('code').text(d.kind === 'conflict' ? d.reason : tag);
                if (d.kind !== 'conflict') {
                    li.append('span').attr('class', 'tilda-reason').text(d.reason);
                }
            });

        const editable = plan.aligned && plan.add.length + plan.change.length + plan.remove.length > 0;
        merged.select('.tilda-apply-all')
            .classed('hide', !editable)
            .on('click', () => {
                const changed: TagsUpdate = {};
                for (const key of plan.remove) changed[key] = undefined;
                for (const entry of plan.change) changed[entry.key] = entry.to;
                for (const entry of plan.add) if (_tags[entry.key] === undefined) changed[entry.key] = entry.value;
                changeTags(changed);
            });
    }


    /** Checklist of attributes the Radnetz dataset needs, with quick values for missing ones */
    function drawAttributes(selection: d3.Selection<HTMLDivElement>, card: SideCard) {
        const header = selection.selectAll<HTMLDivElement, number>('.tilda-attributes-header')
            .data(card.attributes.length ? [0] : []);
        header.exit().remove();
        header.enter()
            .append('div')
            .attr('class', 'tilda-attributes-header')
            .call(t.append('inspector.tilda.required'));

        let rows = selection.selectAll<HTMLDivElement, RequiredAttribute>('.tilda-attribute')
            .data(card.attributes, d => d.key);
        rows.exit().remove();

        const rowsEnter = rows.enter()
            .append('div')
            .attr('class', 'tilda-attribute');
        rowsEnter.append('span').attr('class', 'tilda-attribute-state');
        rowsEnter.append('span').attr('class', 'tilda-attribute-label');
        rowsEnter.append('span').attr('class', 'tilda-attribute-value');
        const inputs = rowsEnter.append('span').attr('class', 'tilda-attribute-inputs');
        inputs.append('span').attr('class', 'tilda-buttons');
        inputs.append('input')
            .attr('type', 'text')
            .attr('class', 'tilda-attribute-input')
            .attr('placeholder', t('inspector.tilda.enter_value'))
            .on('keydown', function(this: HTMLInputElement, d3_event: KeyboardEvent, d: RequiredAttribute) {
                if (d3_event.key !== 'Enter' || !this.value.trim()) return;
                d3_event.preventDefault();
                changeTags({ [d.key]: this.value.trim() });
            });

        rows = rows.merge(rowsEnter)
            .classed('present', d => d.value !== undefined)
            .classed('missing', d => d.value === undefined)
            .attr('title', d => d.key);

        rows.select('.tilda-attribute-state').text(d => d.value !== undefined ? '✓' : '!');
        rows.select('.tilda-attribute-label').text(d => t(`inspector.tilda.attribute.${d.id}`));
        rows.select('.tilda-attribute-value').text(d => d.value ?? '');
        rows.select<HTMLSpanElement>('.tilda-attribute-inputs')
            .style('display', d => d.value === undefined ? null : 'none');

        const buttons = rows.select('.tilda-buttons')
            .selectAll<HTMLButtonElement, string>('button')
            .data(d => d.quickValues, d => d);
        buttons.exit().remove();
        buttons.enter()
            .append('button')
            .attr('class', 'button tilda-value')
            .merge(buttons)
            .text(d => d)
            .on('click', function(_d3_event: MouseEvent, value: string) {
                const attribute = d3_select(this.closest('.tilda-attribute')!).datum() as RequiredAttribute;
                changeTags({ [attribute.key]: value });
            });
    }


    section.entityIDs = function(val?: string[]) {
        if (val === undefined) return _entityIDs;
        if (val.join() !== _entityIDs.join()) _targets = new Map();
        _entityIDs = val;
        return section;
    };

    section.tags = function(val?: Tags) {
        if (val === undefined) return _tags;
        _tags = val;
        // drop targets that are reached now
        for (const [side, target] of _targets) {
            if (categoryForSide(_tags, side) === target) _targets.delete(side);
        }
        return section;
    };

    return utilRebind(section, dispatch, 'on');
}
