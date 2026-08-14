import { select as d3_select } from 'd3-selection';

import { patchHash } from '../../behavior/hash';
import { t, localizer } from '../../core/localizer';
import { services } from '../../services';
import { appendMapRoulettePinIcon } from '../../svg/maproulette_logo';
import { goToMapRouletteTask } from '../../util/maproulette_nearby';
import {
  getLastWorkedChallengeId,
  mapDataNextAction,
  pickNearest,
  pickRandomNearby,
  resolveCandidatePool,
} from '../../util/maproulette_next_task';
import { uiTooltip } from '../tooltip';


export function parseMapRouletteChallengeIds(value: string): string[] {
  return String(value || '')
    .split(',')
    .map(function(s) { return s.trim(); })
    .filter(function(s) { return s && s.toLowerCase() !== 'true'; });
}


export function updateMapRouletteChallengeLinks(container: any, value: string): void {
  const ids = parseMapRouletteChallengeIds(value);
  let ul = container.selectAll('ul.maproulette-challenge-links')
    .data(ids.length ? [0] : []);

  ul.exit().remove();
  ul = ul.enter()
    .append('ul')
    .attr('class', 'maproulette-challenge-links')
    .merge(ul);

  let items = ul.selectAll('li')
    .data(ids, function(d: string) { return d; });

  items.exit().remove();

  const itemsEnter = items.enter()
    .append('li');

  itemsEnter.append('a')
    .attr('rel', 'noopener')
    .attr('target', '_blank');

  itemsEnter.merge(items as any)
    .select('a')
    .attr('href', function(d: string) {
      return 'https://maproulette.org/browse/challenges/' + encodeURIComponent(d);
    })
    .text(function(d: string) {
      return t('map_data.layers.maproulette.id_open_on_maproulette', { id: d });
    });
}


/**
 * Map Data pane helpers for the MapRoulette layer row (nearby + challenge filter).
 */
export function createMapRouletteDataLayerControls(
  context: any,
  layers: any,
  setLayer: (which: string, enabled: boolean) => void,
) {
  let _pendingGoToNearbyAfterZoom = false;
  let _pendingGoToNearbyFlushTimeout: ReturnType<typeof setTimeout> | null = null;
  let _pendingGoToNearbyAbandonTimeout: ReturnType<typeof setTimeout> | null = null;

  const PENDING_GO_TO_NEARBY_ABANDON_MS = 20000;

  function mapRouletteLoadMinZoom(): number {
    const mr = services.maproulette;
    return (mr && typeof mr.loadMinZoom === 'function') ? mr.loadMinZoom() : 12;
  }

  function resolveMapDataPool() {
    const mr = services.maproulette;
    if (!mr) {
      return { mode: 'empty' as const, tasks: [], preferredChallengeIds: [] };
    }
    return resolveCandidatePool(mr, {
      lastChallengeId: getLastWorkedChallengeId(),
    });
  }

  function liveViewportOpenTasks() {
    const mr = services.maproulette;
    if (!mr || typeof mr.getItems !== 'function') return [];
    return (mr.getItems(context.projection) || []).filter(function(d: any) {
      return mr.isOpenTask ? mr.isOpenTask(d) : true;
    });
  }

  function goToNextMapDataTask(): boolean {
    const pool = resolveMapDataPool();
    const action = mapDataNextAction(pool);
    if (!action) return false;
    const center = context.map().center();
    const next = action === 'nearest'
      ? pickNearest(pool.tasks, center)
      : pickRandomNearby(pool.tasks, liveViewportOpenTasks());
    if (!next) return false;
    return goToMapRouletteTask(context, next);
  }

  function tryPendingGoToNearbyAfterZoom(
    mrEnabled: boolean,
    zoom: number,
    minZ: number,
    loading: boolean,
    hasNext: boolean,
  ): void {
    if (!_pendingGoToNearbyAfterZoom) return;
    if (!mrEnabled) {
      _pendingGoToNearbyAfterZoom = false;
      return;
    }
    if (zoom < minZ || loading) return;
    _pendingGoToNearbyAfterZoom = false;
    if (hasNext) {
      goToNextMapDataTask();
    }
  }

  function getMapRouletteControlState() {
    const mrEnabled = !!(layers.layer('maproulette') && layers.layer('maproulette').enabled());
    const mr = services.maproulette;
    const zoom = context.map().zoom();
    const minZ = mapRouletteLoadMinZoom();
    const loading = !!(mrEnabled && mr &&
      typeof mr.isLoadingIssues === 'function' &&
      mr.isLoadingIssues(context.projection, zoom));
    const nextAction = (mrEnabled && !loading && mr)
      ? mapDataNextAction(resolveMapDataPool())
      : null;
    const hasNext = nextAction !== null && nextAction !== undefined;
    return { mrEnabled, zoom, minZ, loading, nextAction, hasNext };
  }

  function clearPendingGoToNearbyListeners(): void {
    const mr = services.maproulette as any;
    if (mr && typeof mr.on === 'function') {
      mr.on('loading.mrPendingGoTo', null);
      mr.on('loaded.mrPendingGoTo', null);
    }
    context.map().on('move.mrPendingGoTo', null);
    if (_pendingGoToNearbyFlushTimeout !== null) {
      clearTimeout(_pendingGoToNearbyFlushTimeout);
      _pendingGoToNearbyFlushTimeout = null;
    }
    if (_pendingGoToNearbyAbandonTimeout !== null) {
      clearTimeout(_pendingGoToNearbyAbandonTimeout);
      _pendingGoToNearbyAbandonTimeout = null;
    }
  }

  function abandonPendingGoToNearbyAfterZoom(): void {
    if (!_pendingGoToNearbyAfterZoom) return;
    _pendingGoToNearbyAfterZoom = false;
    clearPendingGoToNearbyListeners();
  }

  function flushPendingGoToNearbyAfterZoom(): void {
    if (!_pendingGoToNearbyAfterZoom) return;
    const wasPending = true;
    const { mrEnabled, zoom, minZ, loading, hasNext } = getMapRouletteControlState();
    tryPendingGoToNearbyAfterZoom(mrEnabled, zoom, minZ, loading, hasNext);
    if (wasPending && !_pendingGoToNearbyAfterZoom) {
      clearPendingGoToNearbyListeners();
    }
  }

  function attachPendingGoToNearbyListeners(): void {
    const mr = services.maproulette as any;
    if (mr && typeof mr.on === 'function') {
      mr.on('loading.mrPendingGoTo', flushPendingGoToNearbyAfterZoom);
      mr.on('loaded.mrPendingGoTo', flushPendingGoToNearbyAfterZoom);
    }
    context.map().on('move.mrPendingGoTo', flushPendingGoToNearbyAfterZoom);
    _pendingGoToNearbyFlushTimeout = setTimeout(flushPendingGoToNearbyAfterZoom, 300);
  }

  function zoomInToLoadMapRouletteTasks(d3_event: Event): void {
    d3_event.preventDefault();
    d3_event.stopPropagation();
    clearPendingGoToNearbyListeners();
    _pendingGoToNearbyAfterZoom = true;
    context.map().zoomEase(mapRouletteLoadMinZoom());
    attachPendingGoToNearbyListeners();
    _pendingGoToNearbyAbandonTimeout = setTimeout(
      abandonPendingGoToNearbyAfterZoom,
      PENDING_GO_TO_NEARBY_ABANDON_MS,
    );
  }

  function updateMapRouletteHash(): void {
    const mrLayer = layers.layer('maproulette');
    const enabled = mrLayer && mrLayer.enabled();
    const ids = String(
      (services.maproulette && typeof services.maproulette.challengeIDs === 'function')
        ? services.maproulette.challengeIDs() : ''
    );
    // patchHash removes keys whose value is null, so disabling clears the param.
    patchHash({ maproulette: enabled ? (ids || 'true') : null });
  }

  function mapRouletteIDsChanged(d3_event: any): void {
    const value = d3_event.target.value;
    if (services.maproulette) {
      services.maproulette.challengeIDs(value);
    }
    // Ensure the layer is enabled when the user provides challenge IDs
    const mrLayer = layers.layer('maproulette');
    if (mrLayer && !mrLayer.enabled()) {
      setLayer('maproulette', true);
    }
    updateMapRouletteHash();
    updateMapRouletteChallengeLinks(
      d3_select(d3_event.target.closest('.maproulette-challenge-ids')),
      value,
    );
  }

  function appendEnterControls(liEnter: any): void {
    // Zoom-to-nearby control on the MapRoulette row (same pattern as custom data).
    liEnter
      .filter(function(d: any) { return d.id === 'maproulette'; })
      .append('button')
      .attr('class', 'zoom-to-maproulette')
      .call((uiTooltip() as any)
        .title(function() {
          const { nextAction } = getMapRouletteControlState();
          if (nextAction === 'nearest') {
            return t.append('map_data.layers.maproulette.next_nearest');
          }
          if (nextAction === 'random') {
            return t.append('map_data.layers.maproulette.next_random');
          }
          return t.append('map_data.layers.maproulette.none_next');
        })
        .placement((localizer.textDirection() === 'rtl') ? 'right' : 'left')
      )
      .on('click', function(this: Element, d3_event: Event) {
        d3_event.preventDefault();
        d3_event.stopPropagation();
        const button = d3_select(this);
        if (button.classed('disabled') || button.classed('loading')) return;
        goToNextMapDataTask();
      })
      .call(function(selection: any) {
        appendMapRoulettePinIcon(selection, {
          width: 15,
          height: 20,
          className: 'icon maproulette-pin-icon'
        });
      });

    // Challenge-ID filter — own row below the toggle (not inside the layer <label>).
    const mrFilterEnter = liEnter
      .filter(function(d: any) { return d.id === 'maproulette'; })
      .append('div')
      .attr('class', 'maproulette-challenge-ids');

    mrFilterEnter
      .append('label')
      .attr('for', 'maproulette-challenge-ids-input')
      .call(t.append('map_data.layers.maproulette.id_label'));

    mrFilterEnter
      .append('input')
      .attr('id', 'maproulette-challenge-ids-input')
      .attr('type', 'text')
      .attr('class', 'challenge-ids')
      .attr('placeholder', t('map_data.layers.maproulette.id_placeholder'))
      .on('input change', mapRouletteIDsChanged);

    const statusEnter = mrFilterEnter
      .append('div')
      .attr('class', 'maproulette-status')
      .style('display', 'none');

    statusEnter
      .append('span')
      .attr('class', 'maproulette-status-text');

    statusEnter
      .append('a')
      .attr('href', '#')
      .attr('class', 'maproulette-status-zoom')
      .style('display', 'none')
      .on('click', zoomInToLoadMapRouletteTasks);
  }

  function updateControls(li: any, liEnter: any): void {
    const { mrEnabled, zoom, minZ, loading, hasNext } = getMapRouletteControlState();
    const needsZoom = mrEnabled && zoom < minZ;
    const wasPending = _pendingGoToNearbyAfterZoom;

    if (!mrEnabled) {
      _pendingGoToNearbyAfterZoom = false;
    }

    tryPendingGoToNearbyAfterZoom(mrEnabled, zoom, minZ, loading, hasNext);

    if (wasPending && !_pendingGoToNearbyAfterZoom) {
      clearPendingGoToNearbyListeners();
    }

    let statusMessage: string | null = null;
    let showZoomLink = false;
    if (mrEnabled) {
      if (needsZoom) {
        statusMessage = t('map_data.layers.maproulette.status.zoom_in');
        showZoomLink = true;
      } else if (loading) {
        statusMessage = t('map_data.layers.maproulette.status.loading');
      } else if (!hasNext) {
        statusMessage = t('map_data.layers.maproulette.none_next');
      }
    }

    li
      .merge(liEnter)
      .selectAll('button.zoom-to-maproulette')
      .classed('loading', loading)
      .classed('disabled', !mrEnabled || (!loading && !hasNext))
      .attr('aria-busy', loading ? 'true' : null);

    li
      .merge(liEnter)
      .filter(function(d: any) { return d.id === 'maproulette'; })
      .select('.maproulette-status')
      .style('display', statusMessage ? 'block' : 'none')
      .select('.maproulette-status-text')
      .text(statusMessage || '');

    li
      .merge(liEnter)
      .filter(function(d: any) { return d.id === 'maproulette'; })
      .select('.maproulette-status-zoom')
      .style('display', showZoomLink ? 'inline' : 'none')
      .text(t('map_data.layers.maproulette.status.zoom_in_link'));

    // Keep the challenge-IDs field in sync with the service (not while typing).
    li
      .merge(liEnter)
      .filter(function(d: any) { return d.id === 'maproulette'; })
      .select('.maproulette-challenge-ids')
      .each(function(this: Element) {
        const container = d3_select(this);
        const input = container.select('input.challenge-ids');
        if (input.node() !== document.activeElement) {
          const value = String(
            (services.maproulette && typeof services.maproulette.challengeIDs === 'function')
              ? services.maproulette.challengeIDs() : ''
          );
          input.property('value', value);
          updateMapRouletteChallengeLinks(container, value);
        }
      });
  }

  return {
    appendEnterControls,
    updateControls,
    updateHash: updateMapRouletteHash,
  };
}
