import { select as d3_select } from 'd3-selection';

import { patchHash } from '../../behavior/hash';
import { t, localizer } from '../../core/localizer';
import { services } from '../../services';
import { modeSelectError } from '../../modes/select_error';
import { appendMapRoulettePinIcon } from '../../svg/maproulette_logo';
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
  function goToNearbyMapRouletteTask(): void {
    const mr = services.maproulette;
    if (!mr || typeof mr.getNearestItem !== 'function') return;

    const excludeId = context.selectedErrorID && context.selectedErrorID();
    const next = mr.getNearestItem(context.map().center(), excludeId);
    if (!next || !next.loc) return;

    context.map().centerZoomEase(next.loc, Math.max(context.map().zoom(), 17));
    context.enter(modeSelectError(context, next.id, 'maproulette'));
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
        .title(() => t.append('map_data.layers.maproulette.nearbyTask.go_to'))
        .placement((localizer.textDirection() === 'rtl') ? 'right' : 'left')
      )
      .on('click', function(this: Element, d3_event: Event) {
        d3_event.preventDefault();
        d3_event.stopPropagation();
        if (d3_select(this).classed('disabled')) return;
        goToNearbyMapRouletteTask();
      })
      .call(function(selection: any) {
        appendMapRoulettePinIcon(selection, {
          width: 20,
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
  }

  function updateControls(li: any, liEnter: any): void {
    const mrEnabled = !!(layers.layer('maproulette') && layers.layer('maproulette').enabled());
    const hasNearby = !!(services.maproulette &&
      typeof services.maproulette.getNearestItem === 'function' &&
      services.maproulette.getNearestItem(context.map().center()));
    li
      .merge(liEnter)
      .selectAll('button.zoom-to-maproulette')
      .classed('disabled', !mrEnabled || !hasNearby);

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
