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
import { requiredAttributes, roadAttributes, type RequiredAttribute } from '../../tilda/required_attributes';
import { uiSection } from '../section';
import { drawTagPlan, tagPlanChanges, type TagPlanRow } from '../tag_plan';

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

const MAX_BUTTONS = 6;

const STATE_ICON: Record<RequiredAttribute['state'], string> = {
    ok: '✓',
    inherited: '✓',
    guess: '?',
    ignored: '✗',
    missing: '!'
};


/** What TILDA makes of the tagged value, if that is worth saying */
function stateNote(attribute: RequiredAttribute) {
    const { state, value, tilda } = attribute;
    if (state === 'inherited') return t('inspector.tilda.state.inherited', { value: tilda });
    if (state === 'guess') return t('inspector.tilda.state.guess', { value: tilda });
    if (state === 'ignored') return t('inspector.tilda.state.ignored');
    if (state === 'ok' && tilda !== undefined && tilda !== value) return t('inspector.tilda.state.normalized', { value: tilda });
    if (state === 'missing' && attribute.optional) return t('inspector.tilda.state.optional');
    return '';
}


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
                attributes: requiredAttributes(result, _tags, target !== result.category ? target : undefined)
            };
        });
    }


    function renderDisclosureContent(selection: d3.Selection) {
        const data = cards();

        selection.selectAll('.tilda-intro')
            .data([0])
            .enter()
            .append('div')
            .attr('class', 'tilda-callout tilda-intro')
            .call(t.append('inspector.tilda.intro'));

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

        // header bar like a field label, body like a field input
        cardEnter.append('div')
            .attr('class', 'tilda-card-header')
            .append('span')
            .attr('class', 'tilda-side');
        const bodyEnter = cardEnter.append('div').attr('class', 'tilda-card-body');
        bodyEnter.append('div').attr('class', 'tilda-category');
        bodyEnter.append('div').attr('class', 'tilda-gaps');
        bodyEnter.append('div').attr('class', 'tilda-target');
        bodyEnter.append('div').attr('class', 'tilda-attributes');

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
            .text(d => categoryLabel(d.result.category))
            // the TILDA category id is the value in the TILDA dataset
            .attr('title', d => t('inspector.tilda.category_id', { id: d.result.category }));

        cardSelection.select<HTMLDivElement>('.tilda-gaps').each(function(d) { drawGaps(d3_select(this), d); });
        cardSelection.select<HTMLDivElement>('.tilda-target').each(function(d) { drawTarget(d3_select(this), d); });
        cardSelection.select<HTMLDivElement>('.tilda-attributes').each(function(d) {
            const header = d.target && d.target !== d.result.category
                ? t('inspector.tilda.required_for', { category: categoryLabel(d.target) })
                : t('inspector.tilda.required');
            drawAttributes(d3_select(this), d.attributes, header);
        });

        drawRoadCard(selection, data);
    }


    /** The road itself (TILDA `roads` export, infraVelo "mixed traffic"), unless it is bike infrastructure itself */
    function drawRoadCard(selection: d3.Selection, data: SideCard[]) {
        const selfIsInfrastructure = data.some(d => d.side === 'self' && d.result._infrastructureExists);
        const attributes = selfIsInfrastructure ? [] : roadAttributes(_tags);

        let card = selection.selectAll<HTMLDivElement, RequiredAttribute[]>('.tilda-road-card')
            .data(attributes.length ? [attributes] : []);
        card.exit().remove();
        const cardEnter = card.enter()
            .insert('div', '.tilda-card')   // above the cards for the sides
            .attr('class', 'tilda-card tilda-road-card');
        cardEnter.append('div')
            .attr('class', 'tilda-card-header')
            .call(t.append('inspector.tilda.side.road'));
        cardEnter.append('div')
            .attr('class', 'tilda-card-body')
            .append('div')
            .attr('class', 'tilda-attributes');

        card = card.merge(cardEnter);
        card.select<HTMLDivElement>('.tilda-attributes')
            .each(function(d) { drawAttributes(d3_select(this), d, t('inspector.tilda.required_road')); });
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
            .each(function(d) {
                const reason = d3_select(this).text('');
                reason.append('code').text(writeKeyForSide(d.key, card.side, card.result._prefix));
                // the library adds a note about its internal key names; not useful here
                reason.append('span').text(` ${d.reason.replace(/\s*\(transformed from [^)]*\)/, '')}`);
            });

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
        const labelEnter = label.enter().append('label').attr('class', 'tilda-target-label');
        labelEnter.append('div').attr('class', 'tilda-subheading').call(t.append('inspector.tilda.target'));
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
        const rows: TagPlanRow[] = plan ? [
            ...plan.remove.map(key => ({ kind: 'remove' as const, key, value: _tags[key] ?? '', reason: t('inspector.tilda.remove_reason') })),
            // add only what is still missing (the plan may repeat existing tags)
            ...plan.add.filter(entry => _tags[entry.key] === undefined)
                .map(entry => ({ kind: 'add' as const, key: entry.key, value: entry.value, reason: entry.reason })),
            ...plan.change.map(entry => ({ kind: 'change' as const, key: entry.key, value: entry.to, from: entry.from, reason: entry.reason })),
            ...plan.conflicts.map(entry => ({ kind: 'conflict' as const, key: entry.key, value: entry.value, reason: entry.reason }))
        ] : [];

        drawTagPlan(selection, plan && {
            rows,
            canApply: plan.aligned && rows.some(row => row.kind !== 'conflict'),
            applyLabel: t('inspector.tilda.apply_all'),
            onApply: () => changeTags(tagPlanChanges(rows))
        });
    }


    /**
     * Checklist of tags the Radnetz dataset needs: key, state, how TILDA reads the value,
     * and the values TILDA accepts as buttons (plus a free input).
     */
    function drawAttributes(selection: d3.Selection<HTMLDivElement>, attributes: RequiredAttribute[], headerText: string) {
        const header = selection.selectAll<HTMLDivElement, string>('.tilda-attributes-header')
            .data(attributes.length ? [headerText] : []);
        header.exit().remove();
        header.enter()
            .append('div')
            .attr('class', 'tilda-attributes-header')
            .merge(header)
            .text(d => d);

        let rows = selection.selectAll<HTMLDivElement, RequiredAttribute>('.tilda-attribute')
            .data(attributes, d => d.key);
        rows.exit().remove();

        const rowsEnter = rows.enter()
            .append('div')
            .attr('class', 'tilda-attribute');
        rowsEnter.append('span').attr('class', 'tilda-attribute-state');
        const labelEnter = rowsEnter.append('span').attr('class', 'tilda-attribute-label');
        labelEnter.append('span').attr('class', 'tilda-attribute-name');
        labelEnter.append('code').attr('class', 'tilda-attribute-key');
        const valueEnter = rowsEnter.append('span').attr('class', 'tilda-attribute-value');
        valueEnter.append('span').attr('class', 'tilda-attribute-tagged');
        valueEnter.append('span').attr('class', 'tilda-attribute-note');
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
        inputs.append('datalist');

        rows = rows.merge(rowsEnter)
            .attr('class', d => `tilda-attribute state-${d.state}${d.optional ? ' optional' : ''}`)
            .attr('title', d => t('inspector.tilda.feeds', { attributes: d.feeds.join(', ') }));

        rows.select('.tilda-attribute-state').text(d => STATE_ICON[d.state]);
        rows.select('.tilda-attribute-name').text(d => t(`inspector.tilda.attribute.${d.id}`, { default: d.id }));
        rows.select('.tilda-attribute-key').text(d => d.key);
        rows.select('.tilda-attribute-tagged').text(d => d.value ?? '');
        rows.select('.tilda-attribute-note').text(d => stateNote(d));
        rows.select<HTMLSpanElement>('.tilda-attribute-inputs')
            .style('display', d => d.state === 'ok' ? 'none' : null);

        // many options: the first few as buttons, all of them as suggestions in the input
        const datalistID = (d: RequiredAttribute) => `tilda-options-${d.key.replace(/[^\w-]/g, '_')}`;
        rows.select('input').attr('list', d => d.options.length ? datalistID(d) : null);
        const datalist = rows.select('datalist').attr('id', datalistID);
        const listOptions = datalist.selectAll<HTMLOptionElement, string>('option')
            .data(d => d.options, d => d);
        listOptions.exit().remove();
        listOptions.enter().append('option').merge(listOptions).attr('value', d => d);

        const buttons = rows.select('.tilda-buttons')
            .selectAll<HTMLButtonElement, string>('button')
            .data(d => d.options.slice(0, MAX_BUTTONS), d => d);
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
