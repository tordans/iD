import { select as d3_select } from 'd3-selection';

/** One row of a tag plan: a tag to add, change or remove, or a conflict to explain */
export type TagPlanRow = {
    kind: 'add' | 'change' | 'remove' | 'conflict';
    key: string;
    /** new value; the old value for `remove` */
    value: string;
    /** old value, for `change` */
    from?: string;
    reason: string;
};

export type TagPlanView = {
    rows: TagPlanRow[];
    /** show the apply button */
    canApply: boolean;
    applyLabel: string;
    onApply: () => void;
};


/** The tag update that applies all add / change / remove rows */
export function tagPlanChanges(rows: TagPlanRow[]): TagsUpdate {
    const changed: TagsUpdate = {};
    for (const row of rows) {
        if (row.kind === 'remove') changed[row.key] = undefined;
        if (row.kind === 'add' || row.kind === 'change') changed[row.key] = row.value;
    }
    return changed;
}


/**
 * A list of proposed tag changes with a reason each, and one button to apply them all.
 * Used by the TILDA section (reach a category) and the traffic sign field (tags the sign implies).
 * Renders into `selection` as a single `.tag-plan` box, or removes it when `plan` is undefined.
 */
export function drawTagPlan<E extends HTMLElement>(selection: d3.Selection<E>, plan: TagPlanView | undefined) {
    const box = selection.selectAll<HTMLDivElement, TagPlanView>('.tag-plan')
        .data(plan ? [plan] : []);
    box.exit().remove();

    const boxEnter = box.enter()
        .append('div')
        .attr('class', 'tag-plan');
    boxEnter.append('ul');
    boxEnter.append('button')
        .attr('class', 'button action tag-plan-apply');

    const merged = box.merge(boxEnter);
    if (!plan) return;

    const items = merged.select('ul')
        .selectAll<HTMLLIElement, TagPlanRow>('li')
        .data(plan.rows, d => `${d.kind}-${d.key}`);
    items.exit().remove();
    items.enter()
        .append('li')
        .merge(items)
        .attr('class', d => `tag-plan-${d.kind}`)
        .each(function(d) {
            const li = d3_select(this).text('');
            if (d.kind === 'conflict') {
                // a readable callout, not code
                li.append('div').attr('class', 'tag-plan-conflict-text').text(d.reason);
                return;
            }
            const tag = d.kind === 'change' ? `${d.key}: ${d.from} → ${d.value}` : `${d.key}=${d.value}`;  // remove shows the old tag
            li.append('code').text(tag);
            li.append('span').attr('class', 'tag-plan-reason').text(d.reason);
        });

    merged.select('.tag-plan-apply')
        .classed('hide', !plan.canApply)
        .text(plan.applyLabel)
        .on('click', () => plan.onApply());
}
