import { throttle } from 'es-toolkit/compat';
import { select as d3_select } from 'd3-selection';

import { modeBrowse } from '../modes/browse';
import { svgPointTransform } from './helpers';
import {
  appendMapRouletteV4Pin,
  MAPROULETTE_DEFAULT_BORDER,
  MAPROULETTE_EARMARK_BORDER,
  MAPROULETTE_PIN_TIP,
  MAPROULETTE_SELECTED_BORDER,
  MAPROULETTE_SHADOW_PATH,
  updateMapRouletteV4Pin,
} from './maproulette_marker';
import { services } from '../services';
import { utilStringQs } from '../util';
import { pinDisplayStatusOf } from '../util/maproulette_status';

// Restore the layer from the URL hash at startup, following the pattern of
// svg/notes.js (`notes=`): layer params are startup-only and owned by their
// layer module - shared hash code (behavior/hash.js) knows nothing about them.
const _initialHash = utilStringQs(window.location.hash);

let _layerEnabled = !!_initialHash.maproulette;
let _qaService: any;

function isDonePin(d: any, service: any): boolean {
  return !!(service && service.isRecentlyResolved && service.isRecentlyResolved(d));
}

function pinBorderColor(d: any, selectedID: string | null, service: any): string {
  if (d.id === selectedID) return MAPROULETTE_SELECTED_BORDER;
  if (isDonePin(d, service)) return MAPROULETTE_DEFAULT_BORDER;
  if (d.earmarked || (service && service.isEarmarked && service.isEarmarked(d.id))) {
    return MAPROULETTE_EARMARK_BORDER;
  }
  return MAPROULETTE_DEFAULT_BORDER;
}

function taskPriorityOf(d: any): number | null {
  const raw = (d && d.taskPriority !== undefined && d.taskPriority !== null)
    ? d.taskPriority
    : (d && d.task && d.task.priority);
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

/** Priority wedge only for open Created/Skipped pins — finished pins are solid status fill. */
function pinPriorityForDisplay(d: any, status: number, service?: any): number | null {
  if (service && isDonePin(d, service)) return null;
  if (status !== 0 && status !== 3) return null;
  return taskPriorityOf(d);
}

export function svgMapRoulette(projection: any, context: any, dispatch: any) {
  const throttledRedraw = throttle(function() {
    dispatch.call('change');
    updateMarkers();
  }, 300);
  const minZoom = 12;

  let touchLayer: any = d3_select(null);
  let drawLayer: any = d3_select(null);
  let layerVisible = false;

  /** Rounded teardrop for hover/selected glow — V4 pin body. */
  function markerShadow(selection: any): void {
    selection
      .attr('class', 'shadow')
      .attr(
        'transform',
        `translate(${-MAPROULETTE_PIN_TIP.x}, ${-MAPROULETTE_PIN_TIP.y})`,
      )
      .attr('d', MAPROULETTE_SHADOW_PATH);
  }

  function getService() {
    if (services.maproulette && !_qaService) {
      _qaService = services.maproulette;
      _qaService.on('loaded', throttledRedraw);
    } else if (!services.maproulette && _qaService) {
      _qaService = null;
    }
    return _qaService;
  }

  function editOn(): void {
    if (!layerVisible) {
      layerVisible = true;
      drawLayer.style('display', 'block');
    }
  }

  function editOff(): void {
    if (layerVisible) {
      layerVisible = false;
      drawLayer.style('display', 'none');
      drawLayer.selectAll('.qaItem.maproulette').remove();
      touchLayer.selectAll('.qaItem.maproulette').remove();
    }
  }

  function layerOn(): void {
    editOn();
    drawLayer
      .style('opacity', 0)
      .transition()
      .duration(250)
      .style('opacity', 1)
      .on('end interrupt', function() { dispatch.call('change'); });
  }

  function layerOff(): void {
    throttledRedraw.cancel();
    drawLayer.interrupt();
    touchLayer.selectAll('.qaItem.maproulette').remove();
    drawLayer
      .transition()
      .duration(250)
      .style('opacity', 0)
      .on('end interrupt', function() {
        editOff();
        dispatch.call('change');
      });
  }

  function updateMarkers(): void {
    if (!layerVisible || !_layerEnabled) return;
    const service = getService();
    const selectedID = context.selectedErrorID();
    const data = service ? service.getItems(projection) : [];
    const getTransform = svgPointTransform(projection);

    const markers = drawLayer
      .selectAll('.qaItem.maproulette')
      .data(data, function(d: any) { return d.id; });

    markers.exit().remove();

    const markersEnter = markers
      .enter()
      .append('g')
      .attr('class', function(d: any) {
        return `qaItem ${d.service} itemId-${d.id} itemType-${d.itemType}`;
      });

    markersEnter
      .append('path')
      .call(markerShadow);

    markersEnter
      .append('ellipse')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('rx', 4.5)
      .attr('ry', 2)
      .attr('class', 'stroke');

    markersEnter.each(function(this: SVGGElement, d: any) {
      const status = pinDisplayStatusOf(service, d);
      appendMapRouletteV4Pin(d3_select(this), {
        status,
        priority: pinPriorityForDisplay(d, status, service),
        borderColor: pinBorderColor(d, selectedID, service),
        anchorTip: true,
      });
    });

    markers
      .merge(markersEnter)
      .sort(sortY)
      .classed('selected', function(d: any) { return d.id === selectedID; })
      .classed('earmarked', function(d: any) {
        return !!(d.earmarked || (service && service.isEarmarked && service.isEarmarked(d.id)));
      })
      .classed('resolved', function(d: any) {
        return !!(service && service.isRecentlyResolved && service.isRecentlyResolved(d));
      })
      .attr('transform', getTransform)
      .each(function(this: SVGGElement, d: any) {
        const pin = d3_select(this).select('.maproulette-pin');
        if (pin.empty()) return;
        const status = pinDisplayStatusOf(service, d);
        updateMapRouletteV4Pin(pin, {
          status,
          priority: pinPriorityForDisplay(d, status, service),
          borderColor: pinBorderColor(d, selectedID, service),
        });
      });

    if (touchLayer.empty()) return;
    const fillClass = context.getDebug('target') ? 'pink ' : 'nocolor ';

    const targets = touchLayer
      .selectAll('.qaItem.maproulette')
      .data(data, function(d: any) { return d.id; });

    targets.exit().remove();

    targets
      .enter()
      .append('rect')
      .attr('width', '27px')
      .attr('height', '36px')
      .attr('x', `${-MAPROULETTE_PIN_TIP.x}px`)
      .attr('y', `${-MAPROULETTE_PIN_TIP.y}px`)
      .merge(targets)
      .sort(sortY)
      .attr(
        'class',
        function(d: any) { return `qaItem ${d.service} target ${fillClass} itemId-${d.id}`; },
      )
      .attr('transform', getTransform);

    function sortY(a: any, b: any): number {
      return a.id === selectedID
        ? 1
        : b.id === selectedID
          ? -1
          : b.loc[1] - a.loc[1];
    }
  }

  function drawMapRoulette(selection: any): void {
    const service = getService();
    const surface = context.surface();
    if (surface && !surface.empty()) {
      touchLayer = surface.selectAll(
        '.data-layer.touch .layer-touch.markers',
      );
    }

    drawLayer = selection
      .selectAll('.layer-maproulette')
      .data(service ? [0] : []);

    drawLayer.exit().remove();

    drawLayer = drawLayer
      .enter()
      .append('g')
      .attr('class', 'layer-maproulette')
      .style('display', _layerEnabled ? 'block' : 'none')
      .merge(drawLayer);

    if (_layerEnabled) {
      if (service && ~~context.map().zoom() >= minZoom) {
        editOn();
        service.loadIssues(projection);
        updateMarkers();
      } else {
        editOff();
      }
    }
  }

  drawMapRoulette.enabled = function(val?: boolean) {
    if (!arguments.length) return _layerEnabled;
    _layerEnabled = val!;
    if (_layerEnabled) {
      layerOn();
    } else {
      layerOff();
      if (context.selectedErrorID()) {
        context.enter(modeBrowse(context));
      }
    }
    dispatch.call('change');
    return this;
  };

  drawMapRoulette.supported = function() { return !!getService(); };

  return drawMapRoulette;
}
