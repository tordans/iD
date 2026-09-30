import { select as d3_select } from 'd3-selection';

import { t } from '../core/localizer';
import { svgIcon } from '../svg/icon';
import { uiTooltip } from '../ui/tooltip';
import { widthIndicator } from '../width/width_indicator';
import { initialTapeEnds, initialTapeMeters, isMeasurableKey, type LonLatExtent } from './initial_tape';
import { measureTape } from './measure_tape';

const BUTTON_CLASS = 'measure-tape-button';

type FieldDatum = { key?: string };


/** The key a `.form-field` or `li.tag-row` edits, if it is a width key we can measure */
function measurableKey(element: Element): string | undefined {
    const key = element.matches('li.tag-row')
        ? element.querySelector<HTMLInputElement>('input.key')?.value
        : (d3_select(element).datum() as FieldDatum | undefined)?.key;
    return key && isMeasurableKey(key) ? key : undefined;
}


/** The value inputs (preset field and raw tag editor row) that edit `key` */
function inputsForKey(context: iD.Context, key: string): HTMLInputElement[] {
    const inputs: HTMLInputElement[] = [];
    const sidebar = context.container().select('.sidebar').node() as HTMLElement | null;
    if (!sidebar) return inputs;

    for (const field of sidebar.querySelectorAll('.form-field')) {
        if (measurableKey(field) !== key) continue;
        const input = field.querySelector<HTMLInputElement>('.form-field-input-wrap > input');
        if (input) inputs.push(input);
    }
    for (const row of sidebar.querySelectorAll('li.tag-row')) {
        if (measurableKey(row) !== key) continue;
        const input = row.querySelector<HTMLInputElement>('input.value');
        if (input) inputs.push(input);
    }
    return inputs;
}


/**
 * Adds the "Measure on the map" button to width inputs, starts and ends the
 * measuring tape, and shows the measured value live in the input.
 * Uses event delegation and a MutationObserver on the sidebar, so the field
 * implementations stay unchanged.
 */
export function installMeasureTapeListeners(context: iD.Context) {
    const tooltip = (uiTooltip() as any)
        .placement('top')
        .title(() => t.append('inspector.measure_tape.button'));


    function start(key: string) {
        const ids = context.selectedIDs();
        const way = ids.length === 1 && ids[0].startsWith('w') ? context.graph().hasEntity(ids[0] as `w${number}`) : undefined;
        if (!way || way.type !== 'way') return;

        const line = context.graph().childNodes(way).map(node => node.loc);
        // geoExtent is array-like: [min, max]
        const extent = context.map().extent() as unknown as LonLatExtent | undefined;
        const visible: LonLatExtent | null = extent ? [extent[0], extent[1]] : null;

        const input = inputsForKey(context, key)[0];
        const meters = initialTapeMeters(key, input?.value ?? way.tags[key], way.tags);
        const ends = initialTapeEnds(line, visible, meters);
        if (!ends) return;

        widthIndicator.set(null);
        measureTape.start(way.id, key, ends);
    }


    function toggle(key: string) {
        if (measureTape.state()?.key === key) {
            measureTape.stop();
        } else {
            start(key);
        }
    }


    function refreshButtons() {
        const sidebar = context.container().select('.sidebar').node() as HTMLElement | null;
        if (!sidebar) return;

        const targets = [
            ...sidebar.querySelectorAll<HTMLElement>('.form-field'),
            ...sidebar.querySelectorAll<HTMLElement>('li.tag-row'),
        ];

        for (const element of targets) {
            const isRow = element.matches('li.tag-row');
            const key = measurableKey(element);
            const host = isRow
                ? element.querySelector<HTMLElement>('.inner-wrap')
                : element.querySelector<HTMLElement>('.form-field-input-wrap');
            // only fields with a plain text/number input, not combos etc.
            const hasInput = isRow || !!host?.querySelector(':scope > input');
            const existing = host?.querySelector<HTMLElement>(`:scope > .${BUTTON_CLASS}`) ?? null;

            if (!host || !key || !hasInput) {
                existing?.remove();
                continue;
            }

            const button = d3_select(existing ?? document.createElement('button'))
                .attr('type', 'button')
                .attr('tabindex', isRow ? -1 : null)
                .attr('class', `form-field-button ${BUTTON_CLASS}`)
                .classed('active', measureTape.state()?.key === key)
                .datum(key);

            if (!existing) {
                button.call(svgIcon('#fas-pen-ruler', '')).call(tooltip);
                button.on('click', (d3_event: Event, k: string) => {
                    d3_event.preventDefault();
                    d3_event.stopPropagation();
                    toggle(isRow
                        ? (element.querySelector<HTMLInputElement>('input.key')?.value ?? k)
                        : k);
                });
                // tag rows: before the remove button; fields: after the +/- buttons
                const remove = isRow ? host.querySelector(':scope > button.remove') : null;
                host.insertBefore(button.node()!, remove);
            }
        }
    }


    // debounce: many mutations arrive together when the inspector redraws
    let _scheduled = false;
    function scheduleRefresh() {
        if (_scheduled) return;
        _scheduled = true;
        setTimeout(() => {
            _scheduled = false;
            refreshButtons();
        }, 0);
    }

    const sidebar = context.container().select('.sidebar').node() as HTMLElement | null;
    if (sidebar) {
        new MutationObserver(scheduleRefresh).observe(sidebar, { childList: true, subtree: true });
        // typing a key into a raw tag editor row
        d3_select(sidebar)
            .on('change.measureTape', scheduleRefresh)
            .on('input.measureTape', (d3_event: Event) => {
                if ((d3_event.target as Element).matches('li.tag-row input.key')) scheduleRefresh();
            });
    }


    // show the measured value live in the input; the tag is written when the drag ends
    measureTape.on('change.measureTapeUI', () => {
        const state = measureTape.state();
        if (state?.dragging) {
            const value = measureTape.value() ?? '';
            for (const input of inputsForKey(context, state.key)) {
                if (input.value !== value) input.value = value;
            }
        }
        for (const button of context.container().selectAll<HTMLElement, string>(`.${BUTTON_CLASS}`).nodes()) {
            const key = state?.key;
            const rowKey = button.closest('li.tag-row')?.querySelector<HTMLInputElement>('input.key')?.value;
            button.classList.toggle('active', !!key && (rowKey ?? d3_select(button).datum()) === key);
        }
    });


    // Esc ends the tape (before iD's select mode deselects the way)
    window.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key !== 'Escape' || !measureTape.state()) return;
        measureTape.stop();
        event.preventDefault();
        event.stopImmediatePropagation();
    }, true);


    // selecting something else (or nothing) ends the tape
    context.on('enter.measureTape', () => {
        const state = measureTape.state();
        if (!state) return;
        const ids = context.selectedIDs();
        if (ids.length !== 1 || ids[0] !== state.entityID) measureTape.stop();
    });

    // the way disappeared, e.g. after undo
    context.history().on('change.measureTape', () => {
        const state = measureTape.state();
        if (state && !context.graph().hasEntity(state.entityID)) measureTape.stop();
    });
}
