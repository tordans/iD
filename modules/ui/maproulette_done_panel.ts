import { t } from '../core/localizer';
import { modeBrowse } from '../modes/browse';
import { services } from '../services';
import { MR_STATUS } from '../services/maproulette';
import { goToMapRouletteTask } from '../util/maproulette_nearby';
import {
  bannerBeforeSelector,
  nextActionsBeforeSelector,
  preferredShowOsmId,
  type CompletionMode,
} from '../util/maproulette_completion';
import { longFormOsmId } from '../util/maproulette_osm_ids';
import {
  nextTaskActionsForPool,
  pickNearest,
  pickPriority,
  pickRandomNearby,
  resolveCandidatePool,
} from '../util/maproulette_next_task';
import { doneTaskStatusOf, statusLabelKey } from '../util/maproulette_status';

export interface DonePanelState {
  qaItem: any;
  mode: CompletionMode;
  isShown: boolean;
  isResolved: boolean;
  isQueued: boolean;
}

export interface DonePanelDeps {
  context: any;
  getState: () => DonePanelState;
  onQueuedUndo: () => void;
  selectAssociatedOsmEntity: (elems: string[], done: (selected: boolean) => void) => void;
  snapshotAssociatedElems: (d: any) => string[];
}

function doneContentHost(sel: any): any {
  const host = sel.select('.error-details');
  return host.empty() ? sel : host;
}

export function renderDonePanel(sel: any, deps: DonePanelDeps): void {
  renderStatusBanner(sel, deps);
  renderNextActions(sel, deps);
}

function renderStatusBanner(sel: any, deps: DonePanelDeps): void {
  const state = deps.getState();
  const showResolved = state.isResolved && !state.isQueued;
  const showQueued = state.isQueued;
  const mr = services.maproulette;
  const status = state.qaItem ? doneTaskStatusOf(mr, state.qaItem) : MR_STATUS.FIXED;
  const statusTitle = t(statusLabelKey(status));
  const host = doneContentHost(sel);
  const before = bannerBeforeSelector(state.mode);

  let resolved = host.selectAll('.mr-resolved-banner').data(showResolved ? [0] : []);
  resolved.exit().remove();
  const resolvedEnter = resolved
    .enter()
    .insert('div', before)
    .attr('class', 'mr-resolved-banner mr-status-notice');
  resolvedEnter.append('h3');
  resolvedEnter.append('p').attr('class', 'mr-status-notice-message');
  resolved = resolvedEnter.merge(resolved);
  resolved.select('h3').text(statusTitle);
  resolved.select('.mr-status-notice-message')
    .text(t('map_data.layers.maproulette.resolved_message'));

  let queued = host.selectAll('.mr-queued-banner').data(showQueued ? [0] : []);
  queued.exit().remove();
  const queuedEnter = queued
    .enter()
    .insert('div', before)
    .attr('class', 'mr-queued-banner mr-status-notice');
  queuedEnter.append('h3');
  const queuedMessage = queuedEnter
    .append('p')
    .attr('class', 'mr-status-notice-message');
  queuedMessage.append('span').attr('class', 'mr-status-notice-text');
  queuedMessage.append('a')
    .attr('href', '#')
    .attr('class', 'mr-queued-undo')
    .text(t('map_data.layers.maproulette.queued_undo'));
  queued = queuedEnter.merge(queued);
  queued.select('h3').text(statusTitle);
  queued.select('.mr-status-notice-text')
    .text(`${t('map_data.layers.maproulette.queued_message')} `);
  queued.select('.mr-queued-undo')
    .on('click.mr-queued-undo', function(this: HTMLElement, d3_event: Event) {
      d3_event.preventDefault();
      deps.onQueuedUndo();
    });
}

function renderNextActions(sel: any, deps: DonePanelDeps): void {
  const state = deps.getState();
  const show = state.isShown && (state.isResolved || state.isQueued);
  const host = doneContentHost(sel);
  let wrap = host.selectAll('.mr-next-actions').data(show ? [0] : []);
  wrap.exit().remove();
  const enter = wrap
    .enter()
    .insert('div', nextActionsBeforeSelector(state.mode))
    .attr('class', 'mr-next-actions');
  enter.append('div').attr('class', 'buttons mr-next-actions-buttons');
  enter.append('p').attr('class', 'mr-next-actions-none');
  wrap = enter.merge(wrap);
  if (!show || !state.qaItem) return;

  const mr = services.maproulette;
  const qaItem = state.qaItem;
  const excludeId = qaItem.id;
  const currentChallengeId = qaItem.parentId || (qaItem.task && qaItem.task.parentId);
  const poolForVisibility = resolveCandidatePool(mr, {
    excludeId,
    currentChallengeId,
  });
  const actions = nextTaskActionsForPool(poolForVisibility);
  const osmId = state.mode === 'panel'
    ? preferredShowOsmId(deps.snapshotAssociatedElems(qaItem))
    : null;

  function livePool() {
    return resolveCandidatePool(services.maproulette, {
      excludeId,
      currentChallengeId,
    });
  }

  function liveViewportOpenTasks() {
    const svc = services.maproulette;
    if (!svc || typeof svc.getItems !== 'function') return [];
    return (svc.getItems(deps.context.projection) || []).filter(function(d: any) {
      return svc.isOpenTask ? svc.isOpenTask(d) : true;
    });
  }

  const buttonDefs: Array<{
    key: string;
    label: string;
    enabled: boolean;
    onClick: () => void;
  }> = [];

  if (actions.showNearest) {
    buttonDefs.push({
      key: 'nearest',
      label: t('map_data.layers.maproulette.next_nearest'),
      enabled: true,
      onClick: function() {
        const next = pickNearest(livePool().tasks, deps.context.map().center());
        if (next) goToMapRouletteTask(deps.context, next);
      },
    });
  }
  if (actions.showPriority) {
    buttonDefs.push({
      key: 'priority',
      label: t('map_data.layers.maproulette.next_priority'),
      enabled: true,
      onClick: function() {
        const next = pickPriority(livePool().tasks, deps.context.map().center());
        if (next) goToMapRouletteTask(deps.context, next);
      },
    });
  }
  if (actions.showRandom) {
    buttonDefs.push({
      key: 'random',
      label: t('map_data.layers.maproulette.next_random'),
      enabled: true,
      onClick: function() {
        const next = pickRandomNearby(livePool().tasks, liveViewportOpenTasks());
        if (next) goToMapRouletteTask(deps.context, next);
      },
    });
  }
  if (osmId) {
    const displayId = longFormOsmId(osmId);
    buttonDefs.push({
      key: 'show-osm',
      label: t('map_data.layers.maproulette.show_osm', { id: displayId }),
      enabled: true,
      onClick: function() {
        deps.selectAssociatedOsmEntity([osmId], function(didSelect: boolean) {
          if (!didSelect) {
            deps.context.enter(modeBrowse(deps.context));
          }
        });
      },
    });
  }

  let buttons = wrap.select('.mr-next-actions-buttons')
    .selectAll('button.mr-next-action')
    .data(buttonDefs, function(d: any) { return d.key; });
  buttons.exit().remove();
  const btnEnter = buttons.enter()
    .append('button')
    .attr('type', 'button')
    .attr('class', 'button action mr-next-action fixedIt-button');
  buttons = btnEnter.merge(buttons);
  buttons
    .attr('data-action', function(d: any) { return d.key; })
    .text(function(d: any) { return d.label; })
    .attr('disabled', function(d: any) { return d.enabled ? null : true; })
    .on('click.mr-next', function(this: HTMLElement, d3_event: Event, d: any) {
      d3_event.preventDefault();
      this.blur();
      if (!d || !d.enabled) return;
      d.onClick();
    });

  wrap.select('.mr-next-actions-none')
    .text(t('map_data.layers.maproulette.none_next'))
    .classed('hide', buttonDefs.length > 0);
}
