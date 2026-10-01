import { debounce } from 'es-toolkit';
import { drag as d3_drag } from 'd3-drag';
import { select as d3_select } from 'd3-selection';

import { prefs } from '../core/preferences';
import { geoRawMercator, geoZoomToScale } from '../geo';
import { t } from '../core/localizer';
import { presetManager } from '../presets';
import { modeSelect } from '../modes/select';
import { svgIcon } from '../svg/icon';
import { utilHighlightEntities } from '../util/util';
import { utilDisplayLabel } from '../util/utilDisplayLabel';
import type { NodeId, WayId } from '../osm';
import { buildWayChain, type ChainSegment, type JunctionChoice, type WayChain } from '../way_table/chain';
import { buildTagRows, type TagCell, type TagRow } from '../way_table/tag_rows';
import { uiTooltip } from './tooltip';

const ENABLED_PREF = 'way-table-panel';
/** the panel's maximum height, as a fraction of the map height */
const HEIGHT_PREF = 'way-table-panel-max-height';
const DEFAULT_MAX_HEIGHT = 0.5;
const MIN_HEIGHT_PX = 80;
/** margin around a way that the map flies to */
const FLY_PADDING_PX = 40;


function readMaxHeight(): number {
    const stored = Number(prefs(HEIGHT_PREF));
    return stored > 0 && stored <= 1 ? stored : DEFAULT_MAX_HEIGHT;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);


/**
 * A panel docked at the bottom of the map that shows the selected way and its
 * previous and next ways as a table, one row per tag. Its height follows the table,
 * up to a maximum the user sets by dragging the top edge.
 * Toggle with the `K` key or in the Map Data pane.
 */
export function uiWayTablePanel(context: iD.Context) {
    let _container: d3.Selection<HTMLDivElement> = d3_select<HTMLDivElement, unknown>(null!);
    let _enabled = prefs(ENABLED_PREF) === 'true';
    let _maxHeight = readMaxHeight();
    /** chosen way per ambiguous junction node, reset when the selection leaves the chain */
    let _junctionChoices = new Map<NodeId, WayId>();
    let _chain: WayChain | undefined;


    function selectedWayID(): WayId | undefined {
        const ids = context.selectedIDs();
        return ids.length === 1 && ids[0].startsWith('w') ? ids[0] as WayId : undefined;
    }


    function presetKeys(wayID: WayId) {
        const graph = context.graph();
        const entity = graph.entity(wayID);
        const preset = presetManager.match(entity, graph);
        const keys = new Set(Object.keys(preset.tags ?? {}));
        for (const field of [...preset.fields(), ...preset.moreFields()]) {
            if (field.key) keys.add(field.key);
            for (const key of field.keys ?? []) keys.add(key);
        }
        return keys;
    }


    function segmentLabel(segment: ChainSegment) {
        const entity = context.hasEntity(segment.wayID);
        return (entity && utilDisplayLabel(entity, context.graph())) || segment.wayID;
    }


    function applyLayout() {
        _container.style('max-height', `${_maxHeight * 100}%`);
    }


    function mapHeight() {
        return _container.node()?.parentElement?.clientHeight || 1;
    }


    /** Drag the top edge to change the maximum height */
    function resizeBehavior() {
        let startHeight: number;
        return d3_drag<HTMLDivElement, unknown>()
            .subject((d3_event: { x: number, y: number }) => ({ x: d3_event.x, y: d3_event.y }))
            .on('start', () => {
                startHeight = _container.node()!.offsetHeight;
            })
            .on('drag', (d3_event: { y: number, subject: { y: number } }) => {
                const height = mapHeight();
                const newHeight = startHeight - (d3_event.y - d3_event.subject.y);
                _maxHeight = clamp(newHeight / height, MIN_HEIGHT_PX / height, 1);
                applyLayout();
            })
            .on('end', () => prefs(HEIGHT_PREF, String(_maxHeight)));
    }


    /**
     * Pan (and zoom out if needed) so the way is centered in the part of the map
     * that is not covered by the top bar, the footer or this panel.
     */
    function flyTo(wayID: WayId) {
        const entity = context.hasEntity(wayID);
        const panel = _container.node();
        const overMap = panel?.parentElement;
        if (!entity || !panel || !overMap) return;

        // the map surface is larger than the area above the panel; measure in its pixels
        const map = context.map();
        const [width, height] = map.dimensions() as [number, number];
        const surface = context.surfaceRect();
        const area = overMap.getBoundingClientRect();
        const bottom = _container.classed('hide') ? area.bottom : panel.getBoundingClientRect().top;
        const visible = {
            left: area.left - surface.left,
            right: area.right - surface.left,
            top: area.top - surface.top,
            bottom: Math.max(bottom, area.top + MIN_HEIGHT_PX) - surface.top
        };

        const extent = entity.extent(context.graph());
        const zoom = map.zoom() as number;
        const projection = geoRawMercator().scale(geoZoomToScale(zoom)).translate([0, 0]);
        const [x0, y1] = projection(extent[0]);
        const [x1, y0] = projection(extent[1]);
        const fit = Math.min(
            (visible.right - visible.left - 2 * FLY_PADDING_PX) / Math.max(x1 - x0, 1),
            (visible.bottom - visible.top - 2 * FLY_PADDING_PX) / Math.max(y1 - y0, 1)
        );
        const newZoom = fit < 1 ? Math.max(zoom + Math.log2(fit), context.minEditableZoom()) : zoom;

        // the map center is where the way's center must be, shifted by the offset of the visible center
        projection.scale(geoZoomToScale(newZoom));
        const [cx, cy] = projection(extent.center());
        const offsetX = width / 2 - (visible.left + visible.right) / 2;
        const offsetY = height / 2 - (visible.top + visible.bottom) / 2;
        map.centerZoomEase(projection.invert([cx + offsetX, cy + offsetY]), newZoom, 350);
    }


    function selectWay(wayID: WayId | undefined) {
        if (!wayID) return;
        utilHighlightEntities([wayID], false, context);
        context.enter(modeSelect(context, [wayID]));
        flyTo(wayID);
    }


    function highlight(wayID: WayId | undefined, highlighted: boolean) {
        if (wayID) utilHighlightEntities([wayID], highlighted, context);
    }


    function neighborID(offset: -1 | 1) {
        return _chain?.segments[_chain.centerIndex + offset]?.wayID;
    }


    function wayTablePanel(selection: d3.Selection) {
        _container = selection.selectAll<HTMLDivElement, number>('.way-table-panel')
            .data([0]);

        const enter = _container.enter()
            .append('div')
            .attr('class', 'way-table-panel fillD');

        enter
            .append('div')
            .attr('class', 'way-table-resize')
            .call(resizeBehavior());

        const header = enter
            .append('div')
            .attr('class', 'way-table-header');

        header
            .append('h3')
            .call(t.append('way_table.title'));

        const nav = header
            .append('div')
            .attr('class', 'way-table-nav');

        for (const [offset, icon, label] of [[-1, '#iD-icon-backward', 'way_table.previous'], [1, '#iD-icon-forward', 'way_table.next']] as const) {
            nav
                .append('button')
                .attr('class', `way-table-${offset < 0 ? 'previous' : 'next'}`)
                .call((uiTooltip() as any).title(() => t.append(label)).placement('bottom'))
                .on('click', () => selectWay(neighborID(offset)))
                .on('pointerenter', () => highlight(neighborID(offset), true))
                .on('pointerleave', () => highlight(neighborID(offset), false))
                .call(svgIcon(icon, ''));
        }

        header
            .append('button')
            .attr('class', 'way-table-close')
            .call((uiTooltip() as any).title(() => t.append('way_table.close')).keys([t('way_table.key')]).placement('bottom'))
            .on('click', () => wayTablePanel.toggle(false))
            .call(svgIcon('#iD-icon-close', ''));

        enter
            .append('div')
            .attr('class', 'way-table-body');

        _container = _container.merge(enter);
        applyLayout();
        redraw();
    }


    function redraw() {
        if (_container.empty()) return;

        const wayID = selectedWayID();
        _container.classed('hide', !_enabled || !wayID);
        if (!_enabled || !wayID) return;

        if (_chain && !_chain.segments.some(segment => segment.wayID === wayID)) {
            _junctionChoices = new Map();
        }
        _chain = buildWayChain(context.graph(), wayID, undefined, _junctionChoices);
        if (!_chain) return;

        const chain = _chain;
        const rows = buildTagRows(chain, presetKeys(wayID));

        _container.select('.way-table-previous')
            .property('disabled', !neighborID(-1));
        _container.select('.way-table-next')
            .property('disabled', !neighborID(1));

        const body = _container.select<HTMLDivElement>('.way-table-body');
        drawJunctions(body, chain.junctions);
        drawTable(body, chain, rows);
        scrollToCenter(body);
    }


    /** Scroll sideways so the selected way's column is in the middle */
    function scrollToCenter(body: d3.Selection<HTMLDivElement>) {
        const bodyNode = body.node();
        const centerNode = body.select<HTMLTableCellElement>('thead th.center').node();
        const keyNode = body.select<HTMLTableCellElement>('thead th.way-table-key-header').node();
        if (!bodyNode || !centerNode || !keyNode) return;

        // the sticky key column covers the left part of the visible area
        const visibleWidth = bodyNode.clientWidth - keyNode.offsetWidth;
        bodyNode.scrollLeft = centerNode.offsetLeft - keyNode.offsetWidth - (visibleWidth - centerNode.offsetWidth) / 2;
    }


    function drawJunctions(body: d3.Selection<HTMLDivElement>, junctions: JunctionChoice[]) {
        let junctionList = body.selectAll<HTMLDivElement, JunctionChoice>('.way-table-junction')
            .data(junctions, d => `${d.direction}-${d.nodeID}`);

        junctionList.exit()
            .remove();

        const junctionEnter = junctionList.enter()
            .insert('div', ':first-child')
            .attr('class', 'way-table-junction');

        junctionEnter
            .append('span')
            .attr('class', 'way-table-junction-label');

        junctionList = junctionList.merge(junctionEnter);

        junctionList.select('.way-table-junction-label')
            .text(d => t(d.direction === 'forward' ? 'way_table.junction.forward' : 'way_table.junction.backward'));

        const buttons = junctionList.selectAll<HTMLButtonElement, ChainSegment>('button')
            .data(d => d.candidates, d => d.wayID);

        buttons.exit()
            .remove();

        buttons.enter()
            .append('button')
            .attr('class', 'way-table-junction-choice')
            .on('click', function(_d3_event: MouseEvent, d: ChainSegment) {
                const junction = d3_select(this.parentElement).datum() as JunctionChoice;
                _junctionChoices.set(junction.nodeID, d.wayID);
                highlight(d.wayID, false);
                redraw();
            })
            .on('pointerenter', (_d3_event: PointerEvent, d: ChainSegment) => highlight(d.wayID, true))
            .on('pointerleave', (_d3_event: PointerEvent, d: ChainSegment) => highlight(d.wayID, false))
            .merge(buttons)
            .text(segmentLabel);
    }


    function drawTable(body: d3.Selection<HTMLDivElement>, chain: WayChain, rows: TagRow[]) {
        let table = body.selectAll<HTMLTableElement, number>('table')
            .data([0]);

        const tableEnter = table.enter()
            .append('table')
            .attr('class', 'way-table');

        tableEnter.append('thead').append('tr');
        tableEnter.append('tbody');

        table = table.merge(tableEnter);

        // header: one column per way
        const headerData: (ChainSegment | null)[] = [null, ...chain.segments];
        const headerCells = table.select('thead tr')
            .selectAll<HTMLTableCellElement, ChainSegment | null>('th')
            .data(headerData);

        headerCells.exit()
            .remove();

        headerCells.enter()
            .append('th')
            .merge(headerCells)
            .attr('class', (d, i) => {
                if (!d) return 'way-table-key-header';
                return [
                    'way-table-way',
                    i - 1 === chain.centerIndex ? 'center' : '',
                    d.reversed ? 'reversed' : ''
                ].filter(Boolean).join(' ');
            })
            .each(function(d, i) {
                const th = d3_select(this).text('');
                if (!d) {
                    th.call(t.append('way_table.key_column'));
                    return;
                }
                const isCenter = i - 1 === chain.centerIndex;
                th.append('button')
                    .attr('class', 'way-table-way-button')
                    .property('disabled', isCenter)
                    .attr('title', d.reversed ? t('way_table.reversed') : null)
                    .text(`${segmentLabel(d)}${d.reversed ? ' ⇄' : ''}`)
                    .on('click', () => selectWay(d.wayID))
                    .on('pointerenter', () => highlight(d.wayID, true))
                    .on('pointerleave', () => highlight(d.wayID, false));
            });

        // rows: one per tag key
        let tagRows = table.select('tbody')
            .selectAll<HTMLTableRowElement, TagRow>('tr')
            .data(rows, d => d.key);

        tagRows.exit()
            .remove();

        const tagRowsEnter = tagRows.enter()
            .append('tr');

        tagRowsEnter
            .append('th')
            .attr('class', 'way-table-key');

        tagRows = tagRows.merge(tagRowsEnter)
            .order()
            .classed('preset-key', d => d.isPresetKey)
            .classed('differs', d => d.differs);

        tagRows.select('.way-table-key')
            .text(d => d.key);

        const cells = tagRows.selectAll<HTMLTableCellElement, TagCell>('td')
            .data(d => d.cells);

        cells.exit()
            .remove();

        cells.enter()
            .append('td')
            .merge(cells)
            .attr('class', (d, i) => `way-table-value ${d.status}${i === chain.centerIndex ? ' center' : ''}`)
            .text(d => d.value ?? '');
    }


    const debouncedRedraw = debounce(redraw, 100);

    wayTablePanel.enabled = () => _enabled;

    wayTablePanel.toggle = function(enabled?: boolean) {
        _enabled = enabled ?? !_enabled;
        prefs(ENABLED_PREF, String(_enabled));
        context.container().select('.way-table-panel-toggle-item input')
            .property('checked', _enabled);
        if (!_enabled && _chain) {
            for (const segment of _chain.segments) highlight(segment.wayID, false);
        }
        redraw();
        return wayTablePanel;
    };

    context.on('enter.wayTablePanel', redraw);
    context.history()
        .on('change.wayTablePanel', debouncedRedraw)
        .on('merge.wayTablePanel', debouncedRedraw);   // neighbors may load after the selection

    context.keybinding()
        .on(t('way_table.key'), (d3_event: KeyboardEvent) => {
            d3_event.stopImmediatePropagation();
            d3_event.preventDefault();
            wayTablePanel.toggle();
        }, false);

    return wayTablePanel;
}
