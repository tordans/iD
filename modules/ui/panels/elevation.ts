import { t, localizer } from '../../core/localizer';
import { displayLength } from '../../util/units';
import { closestPointOnLine } from '../../elevation/geometry';
import { profilePointAtDistance } from '../../elevation/profile';
import type { ProfilePoint } from '../../elevation/profile';
import { svgElevationAuxiliary } from '../../svg/elevation_auxiliary';

const CHART_WIDTH = 226;
const CHART_HEIGHT = 90;
const CHART_MARGIN = { top: 8, right: 8, bottom: 20, left: 36 };

interface ChartScales {
  minDist: number;
  maxDist: number;
  xScale: (d: number) => number;
  yScale: (e: number) => number;
  innerH: number;
}

function chartScales(profile: ProfilePoint[]): ChartScales | null {
  const valid = profile.filter(p => p.elevation !== null);
  if (valid.length < 2) return null;

  const distances = valid.map(p => p.distance);
  const elevations = valid.map(p => p.elevation as number);
  const minDist = distances[0];
  const maxDist = distances[distances.length - 1];
  const minEle = Math.min(...elevations);
  const maxEle = Math.max(...elevations);
  const elePad = Math.max(5, (maxEle - minEle) * 0.05);
  const yMin = minEle - elePad;
  const yMax = maxEle + elePad;

  const innerW = CHART_WIDTH - CHART_MARGIN.left - CHART_MARGIN.right;
  const innerH = CHART_HEIGHT - CHART_MARGIN.top - CHART_MARGIN.bottom;

  return {
    minDist,
    maxDist,
    innerH,
    xScale: (d: number) => CHART_MARGIN.left + (d - minDist) / (maxDist - minDist || 1) * innerW,
    yScale: (e: number) => CHART_MARGIN.top + innerH - (e - yMin) / (yMax - yMin || 1) * innerH
  };
}

export function uiPanelElevation(context: iD.Context) {
  let _isImperial = !localizer.usesMetric();
  let _wayNodeSignature: string | null = null;
  const elevation = context.elevation();
  const drawAuxiliary = svgElevationAuxiliary(context);

  function selectedWayId(): EntityID | null {
    const ids = context.selectedIDs().filter((id: EntityID) => context.hasEntity(id));
    if (ids.length !== 1) return null;
    const entity = context.entity(ids[0]);
    return entity.geometry(context.graph()) === 'line' ? ids[0] : null;
  }

  function wayNodeSignature(wayId: EntityID): string {
    const entity = context.entity(wayId);
    return entity.nodes.map((id: EntityID) => {
      const node = context.entity(id);
      return `${id}:${node.loc[0].toFixed(7)},${node.loc[1].toFixed(7)}`;
    }).join('|');
  }

  function drawChart(
    selection: d3.Selection<any>,
    profile: ProfilePoint[],
    hoverDistance: number | null
  ) {
    selection.selectAll('.elevation-chart').remove();

    const scales = chartScales(profile);
    if (!scales) {
      selection
        .append('div')
        .attr('class', 'elevation-chart-empty')
        .call(t.append('info_panels.elevation.no_data'));
      return;
    }

    const { minDist, maxDist, xScale, yScale, innerH } = scales;
    const valid = profile.filter(p => p.elevation !== null);
    const innerW = CHART_WIDTH - CHART_MARGIN.left - CHART_MARGIN.right;
    const points = valid.map(p => `${xScale(p.distance)},${yScale(p.elevation as number)}`).join(' ');

    const chart = selection
      .append('svg')
      .attr('class', 'elevation-chart')
      .attr('width', CHART_WIDTH)
      .attr('height', CHART_HEIGHT);

    chart
      .append('polyline')
      .attr('class', 'elevation-chart-line')
      .attr('fill', 'none')
      .attr('points', points);

    chart
      .append('rect')
      .attr('class', 'elevation-chart-hit')
      .attr('x', CHART_MARGIN.left)
      .attr('y', CHART_MARGIN.top)
      .attr('width', innerW)
      .attr('height', innerH)
      .attr('fill', 'transparent')
      .on('pointermove.elevation-chart', function(d3_event) {
        const rect = (this as SVGRectElement).getBoundingClientRect();
        const x = d3_event.clientX - rect.left;
        const ratio = Math.max(0, Math.min(1, x / innerW));
        const distance = minDist + ratio * (maxDist - minDist);
        const point = profilePointAtDistance(profile, distance);
        if (point) {
          elevation.setHover({
            loc: point.loc,
            distance: point.distance,
            elevation: point.elevation
          });
        }
      })
      .on('pointerleave.elevation-chart', () => {
        elevation.clearHover();
      });

    updateChartCursor(chart, profile, hoverDistance);

    chart
      .append('text')
      .attr('class', 'elevation-chart-label')
      .attr('x', CHART_MARGIN.left)
      .attr('y', CHART_HEIGHT - 4)
      .text('0');

    chart
      .append('text')
      .attr('class', 'elevation-chart-label')
      .attr('x', CHART_WIDTH - CHART_MARGIN.right)
      .attr('y', CHART_HEIGHT - 4)
      .attr('text-anchor', 'end')
      .text(displayLength(maxDist, _isImperial));
  }

  function updateChartCursor(
    chart: d3.Selection<any>,
    profile: ProfilePoint[],
    hoverDistance: number | null
  ) {
    chart.selectAll('.elevation-chart-cursor, .elevation-chart-crosshair').remove();

    if (hoverDistance === null) return;

    const scales = chartScales(profile);
    if (!scales) return;

    const hoverPoint = profilePointAtDistance(profile, hoverDistance);
    if (!hoverPoint || hoverPoint.elevation === null) return;

    const { xScale, yScale, innerH } = scales;

    chart
      .append('circle')
      .attr('class', 'elevation-chart-cursor')
      .attr('cx', xScale(hoverPoint.distance))
      .attr('cy', yScale(hoverPoint.elevation))
      .attr('r', 4);

    chart
      .append('line')
      .attr('class', 'elevation-chart-crosshair')
      .attr('x1', xScale(hoverPoint.distance))
      .attr('x2', xScale(hoverPoint.distance))
      .attr('y1', CHART_MARGIN.top)
      .attr('y2', CHART_MARGIN.top + innerH);
  }

  function updateHover(selection: d3.Selection<any>) {
    const profile = elevation.profile();
    const hover = elevation.hover();

    const current = selection.select('.elevation-current');
    if (hover && hover.elevation !== null) {
      const text = t('info_panels.elevation.at_point', {
        elevation: Math.round(hover.elevation).toLocaleString(localizer.localeCode())
      });
      if (current.empty()) {
        const chartWrap = selection.select('.elevation-chart-wrap');
        if (chartWrap.empty()) {
          selection.append('div').attr('class', 'elevation-current').text(text);
        } else {
          selection.insert('div', '.elevation-chart-wrap')
            .attr('class', 'elevation-current')
            .text(text);
        }
      } else {
        current.text(text);
      }
    } else {
      current.remove();
    }

    updateChartCursor(selection.select('.elevation-chart'), profile, hover?.distance ?? null);

    if (hover) {
      drawAuxiliary.show(hover.loc);
    } else {
      drawAuxiliary.clear();
    }
  }

  function redraw(selection: d3.Selection<any>) {
    const wayId = selectedWayId();
    const profile = elevation.profile();
    const hover = elevation.hover();
    const loading = elevation.profileLoading();
    const overlayOn = elevation.showsOverlay();

    selection.html('');

    selection
      .append('button')
      .attr('class', 'button elevation-layer-toggle')
      .attr('type', 'button')
      .text(t(overlayOn ? 'info_panels.elevation.hide_layer' : 'info_panels.elevation.show_layer'))
      .on('click.elevation-panel', function(d3_event) {
        d3_event.preventDefault();
        elevation.toggleOverlay();
        selection.call(redraw);
      });

    if (!wayId) {
      selection
        .append('div')
        .attr('class', 'elevation-hint')
        .call(t.append('info_panels.elevation.select_way'));
      drawAuxiliary.clear();
      return;
    }

    if (loading) {
      selection
        .append('div')
        .attr('class', 'elevation-loading')
        .call(t.append('info_panels.elevation.loading'));
      drawAuxiliary.clear();
      return;
    }

    if (hover && hover.elevation !== null) {
      selection
        .append('div')
        .attr('class', 'elevation-current')
        .text(t('info_panels.elevation.at_point', {
          elevation: Math.round(hover.elevation).toLocaleString(localizer.localeCode())
        }));
    }

    const chartContainer = selection
      .append('div')
      .attr('class', 'elevation-chart-wrap');

    drawChart(chartContainer, profile, hover?.distance ?? null);

    if (hover) {
      drawAuxiliary.show(hover.loc);
    } else {
      drawAuxiliary.clear();
    }
  }

  function refreshProfile() {
    const wayId = selectedWayId();
    if (wayId) {
      _wayNodeSignature = wayNodeSignature(wayId);
      elevation.loadProfileForWay(wayId);
    } else {
      _wayNodeSignature = null;
      elevation.clearProfile();
    }
  }

  function onMapPointerMove() {
    if (!elevation.mapHoverEnabled()) return;

    const wayId = selectedWayId();
    if (!wayId) return;

    const entity = context.entity(wayId);
    const coords = entity.nodes.map((nodeId: EntityID) => context.entity(nodeId).loc as [number, number]);
    const loc = context.map().mouseCoordinates() as [number, number];
    if (!loc || loc.some(isNaN)) return;

    const result = closestPointOnLine(coords, loc);
    if (!result || result.distanceToLine > 20) {
      elevation.clearHover();
      return;
    }

    const profile = elevation.profile();
    const point = profilePointAtDistance(profile, result.distanceAlong);
    if (point) {
      elevation.setHover({
        loc: result.loc,
        distance: point.distance,
        elevation: point.elevation
      });
    }
  }

  function onMapDrawn() {
    const hover = elevation.hover();
    if (hover) {
      drawAuxiliary.show(hover.loc);
    }
  }

  function detachListeners() {
    context.map().on('drawn.info-elevation', null);
    context.on('enter.info-elevation', null);
    context.history().on('change.info-elevation', null);
    context.surface().on('pointermove.info-elevation', null);
    elevation.on('profile.info-elevation', null);
    elevation.on('hover.info-elevation', null);
    context.background().on('change.info-elevation', null);
  }

  const panel = function(selection: d3.Selection<any>) {
    // uiInfo re-invokes active panels on every toggle; detach before re-attach.
    detachListeners();

    elevation.setMapHoverEnabled(true);
    refreshProfile();
    selection.call(redraw);

    context.map()
      .on('drawn.info-elevation', onMapDrawn);

    context
      .on('enter.info-elevation', () => {
        refreshProfile();
        selection.call(redraw);
      });

    context.history()
      .on('change.info-elevation', () => {
        const wayId = selectedWayId();
        if (!wayId) return;
        const sig = wayNodeSignature(wayId);
        if (sig !== _wayNodeSignature) {
          _wayNodeSignature = sig;
          elevation.loadProfileForWay(wayId, { force: true });
        }
      });

    context.surface()
      .on('pointermove.info-elevation', onMapPointerMove);

    elevation.on('profile.info-elevation', () => selection.call(redraw));
    elevation.on('hover.info-elevation', () => selection.call(updateHover));

    context.background()
      .on('change.info-elevation', () => selection.call(redraw));
  };

  panel.off = function() {
    elevation.setMapHoverEnabled(false);
    elevation.clearHover();
    drawAuxiliary.clear();
    detachListeners();
  };

  panel.id = 'elevation';
  panel.label = t.append('info_panels.elevation.title');
  panel.key = t('info_panels.elevation.key');

  return panel;
}
