import { throttle } from 'es-toolkit/compat';
import { select as d3_select } from 'd3-selection';

import { modeBrowse } from '../modes/browse';
import { svgPointTransform } from './helpers';
import { appendMapRouletteLogo, MAPROULETTE_MARKER_LOGO_Y, MAPROULETTE_PIN_POINTS } from './maproulette_logo';
import { services } from '../services';
import { utilStringQs } from '../util';

// Restore the layer from the URL hash at startup, following the pattern of
// svg/notes.js (`notes=`): layer params are startup-only and owned by their
// layer module - shared hash code (behavior/hash.js) knows nothing about them.
const _initialHash = utilStringQs(window.location.hash);

let _layerEnabled = !!_initialHash.maproulette;
let _qaService: any;

export function svgMapRoulette(projection: any, context: any, dispatch: any) {
  const throttledRedraw = throttle(function() {
    dispatch.call('change');
    updateMarkers();
  }, 300);
  const minZoom = 12;

  let touchLayer: any = d3_select(null);
  let drawLayer: any = d3_select(null);
  let layerVisible = false;

  function markerPath(selection: any, klass: string): void {
    selection
      .attr('class', klass)
      .attr('transform', 'translate(-10, -28)')
      .attr('points', MAPROULETTE_PIN_POINTS);
  }

  /** Rounded teardrop for hover/selected glow — same idea as native point pins. */
  function markerShadow(selection: any): void {
    selection
      .attr('class', 'shadow')
      .attr('transform', 'translate(-10, -28)')
      .attr(
        'd',
        // Tip at (10,27) matches the fill polygon tip; curves keep the glow
        // from reading as a second, oversized pin.
        'M 18,9 C 18,15 13,24 10,27 C 7,24 2,15 2,9 C 2,4.5 5.5,1.5 10,1.5 C 14.5,1.5 18,4.5 18,9 Z',
      );
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

    markersEnter
      .append('polygon')
      .call(markerPath, 'qaItem-fill');

    // Center in the pin head (y≈-16), not at the Osmose icon's top-left (-22).
    appendMapRouletteLogo(markersEnter, 0.35, 0, MAPROULETTE_MARKER_LOGO_Y);

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
      .attr('transform', getTransform);

    if (touchLayer.empty()) return;
    const fillClass = context.getDebug('target') ? 'pink ' : 'nocolor ';

    const targets = touchLayer
      .selectAll('.qaItem.maproulette')
      .data(data, function(d: any) { return d.id; });

    targets.exit().remove();

    targets
      .enter()
      .append('rect')
      .attr('width', '20px')
      .attr('height', '30px')
      .attr('x', '-10px')
      .attr('y', '-28px')
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
