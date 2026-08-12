import { select as d3_select } from 'd3-selection';

import { services } from '../../services';
import { t } from '../../core/localizer';
import { goToMapRouletteTask, goToNearbyMapRouletteTask } from '../../util/maproulette_nearby';
import {
  nextTaskActionsForPool,
  pickNearest,
  pickPriority,
  pickRandomNearby,
  resolveCandidatePool,
  setLastWorkedChallengeId,
} from '../../util/maproulette_next_task';
import { doneTaskStatusOf, statusLabelKey } from '../../util/maproulette_status';
import { uiSection } from '../section';
import { uiMapRouletteDetails } from '../maproulette_details';
import { uiMapRouletteEarmarkToggle } from '../maproulette_earmark_toggle';
import { uiMapRouletteTagFix, type MapRouletteTagFixPaintInfo } from '../maproulette_tag_fix';


export function uiSectionMapRouletteTask(context: any) {
  let _entityIDs: string[] = [];
  let _tasks: any[] = [];
  let _highlightBound = false;
  let _enriching = false;
  let _lastPresence = false;
  const _presenceListeners: Array<(present: boolean) => void> = [];

  const section = (uiSection('maproulette-task', context) as any)
    .shouldDisplay(function() {
      return mapRouletteLayerEnabled() && _tasks.length > 0;
    })
    .label(function() {
      return t.append('inspector.maproulette_task');
    })
    .expandedByDefault(false)
    .disclosureContent(renderDisclosureContent);

  function mapRouletteLayerEnabled(): boolean {
    const layer = context.layers().layer('maproulette');
    return !!(layer && layer.enabled());
  }

  function isPresent(): boolean {
    return mapRouletteLayerEnabled() && _tasks.length > 0;
  }

  function notifyPresenceChange(): void {
    const present = isPresent();
    if (present === _lastPresence) return;
    _lastPresence = present;
    _presenceListeners.forEach(function(cb) {
      cb(present);
    });
  }

  function findTasks(): any[] {
    const mr = services.maproulette;
    if (!mr || typeof mr.getTasksForEntity !== 'function') return [];
    const seen: Record<string, boolean> = {};
    const out: any[] = [];
    _entityIDs.forEach(function(entityId) {
      (mr.getTasksForEntity(entityId) || []).forEach(function(task: any) {
        if (!task || !task.id || seen[task.id]) return;
        seen[task.id] = true;
        out.push(task);
      });
    });
    return out;
  }

  /**
   * Task titles (w123@0) often arrive only with /task/{id}. Enrich visible
   * tasks missing elems so the reverse index can link the selected entity.
   */
  function enrichVisibleTaskElems(): Promise<boolean> {
    const mr = services.maproulette;
    if (!mr || typeof mr.loadTaskDetailAsync !== 'function') {
      return Promise.resolve(false);
    }
    if (typeof mr.getItems !== 'function') return Promise.resolve(false);
    const items = mr.getItems(context.projection) || [];
    const need = items.filter(function(d: any) {
      return d && !d.elemsResolved;
    });
    if (!need.length) return Promise.resolve(false);
    _enriching = true;
    return Promise.all(need.slice(0, 25).map(function(d: any) {
      return mr.loadTaskDetailAsync(d).catch(function() { return null; });
    })).then(function() {
      _enriching = false;
      return true;
    }).catch(function() {
      _enriching = false;
      return false;
    });
  }

  function clearPinHighlights(): void {
    context.container()
      .selectAll('.qaItem.maproulette.highlighted')
      .classed('highlighted', false);
  }

  function setPinHighlights(on: boolean): void {
    clearPinHighlights();
    if (!on) return;
    _tasks.forEach(function(task) {
      context.container()
        .selectAll('.qaItem.maproulette.itemId-' + task.id)
        .classed('highlighted', true);
    });
  }

  function bindDisclosureHighlight(): void {
    const disclosure = section.disclosure();
    if (!disclosure || _highlightBound) return;
    _highlightBound = true;
    disclosure.on('toggled.maproulette_task', function(expanded: boolean) {
      setPinHighlights(!!expanded);
    });
  }

  function renderDisclosureContent(selection: any): void {
    bindDisclosureHighlight();
    // Content only renders while expanded — keep the pin highlighted.
    setPinHighlights(true);

    const containers = selection.selectAll('.maproulette-task-embed')
      .data(_tasks, function(d: any) { return d.id; });

    containers.exit()
      .remove();

    const containersEnter = containers.enter()
      .append('div')
      .attr('class', 'maproulette-task-embed');

    containersEnter.merge(containers)
      .each(function(this: Element, d: any) {
        const root = d3_select(this);
        const mr = services.maproulette;
        const isResolved = !!(mr && mr.isRecentlyResolved && mr.isRecentlyResolved(d));
        const isQueued = !!(mr && mr.isEarmarked && mr.isEarmarked(d.id));
        root.classed('mr-resolved', isResolved || isQueued);
        const statusTitle = t(statusLabelKey(doneTaskStatusOf(mr, d)));

        const details = (uiMapRouletteDetails(context) as any)
          .embedded(true)
          .done(isResolved || isQueued)
          .task(d);
        details(root);

        const host = root.select('.error-details');
        const panelHost = host.empty() ? root : host;
        const beforeBanner = '.mr-next-actions, .qa-details-loading, .mr-section-disclosure';

        let banner: any = panelHost.selectAll('.mr-resolved-banner')
          .data(isResolved && !isQueued ? [d] : []);
        banner.exit().remove();
        const bannerEnter = banner.enter()
          .insert('div', beforeBanner)
          .attr('class', 'mr-resolved-banner mr-status-notice');
        bannerEnter.append('h3');
        bannerEnter.append('p').attr('class', 'mr-status-notice-message');
        banner = bannerEnter.merge(banner);
        banner.select('h3')
          .text(statusTitle);
        banner.select('.mr-status-notice-message')
          .text(t('map_data.layers.maproulette.resolved_message'));

        let queuedBanner: any = panelHost.selectAll('.mr-queued-banner')
          .data(isQueued ? [d] : []);
        queuedBanner.exit().remove();
        const queuedEnter = queuedBanner.enter()
          .insert('div', beforeBanner)
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
        queuedBanner = queuedEnter.merge(queuedBanner);
        queuedBanner.select('h3')
          .text(statusTitle);
        queuedBanner.select('.mr-status-notice-text')
          .text(`${t('map_data.layers.maproulette.queued_message')} `);
        queuedBanner.select('.mr-queued-undo')
          .on('click.mr-queued-undo', function(this: HTMLElement, d3_event: Event) {
            d3_event.preventDefault();
            if (!mr || typeof mr.unearmarkTask !== 'function') return;
            mr.unearmarkTask(d.id);
            section.reRender();
          });

        // Next-task actions under the done banner (no Show OSM — already on entity).
        const showNext = isResolved || isQueued;
        let nextWrap: any = panelHost.selectAll('.mr-next-actions')
          .data(showNext ? [d] : []);
        nextWrap.exit().remove();
        const nextEnter = nextWrap.enter()
          .insert('div', '.qa-details-loading, .mr-section-disclosure')
          .attr('class', 'mr-next-actions');
        nextEnter.append('div').attr('class', 'buttons mr-next-actions-buttons');
        nextEnter.append('p').attr('class', 'mr-next-actions-none');
        nextWrap = nextEnter.merge(nextWrap);
        if (showNext) {
          const excludeId = d.id;
          const currentChallengeId = d.parentId || (d.task && d.task.parentId);
          const poolForVisibility = resolveCandidatePool(mr, {
            excludeId,
            currentChallengeId,
          });
          const actions = nextTaskActionsForPool(poolForVisibility);

          function livePool() {
            return resolveCandidatePool(services.maproulette, {
              excludeId,
              currentChallengeId,
            });
          }

          function liveViewportOpenTasks() {
            const svc = services.maproulette;
            if (!svc || typeof svc.getItems !== 'function') return [];
            return (svc.getItems(context.projection) || []).filter(function(item: any) {
              return svc.isOpenTask ? svc.isOpenTask(item) : true;
            });
          }

          const buttonDefs: Array<{ key: string; label: string; onClick: () => void }> = [];
          if (actions.showNearest) {
            buttonDefs.push({
              key: 'nearest',
              label: t('map_data.layers.maproulette.next_nearest'),
              onClick: function() {
                const next = pickNearest(livePool().tasks, context.map().center());
                if (next) goToMapRouletteTask(context, next);
              },
            });
          }
          if (actions.showPriority) {
            buttonDefs.push({
              key: 'priority',
              label: t('map_data.layers.maproulette.next_priority'),
              onClick: function() {
                const next = pickPriority(livePool().tasks, context.map().center());
                if (next) goToMapRouletteTask(context, next);
              },
            });
          }
          if (actions.showRandom) {
            buttonDefs.push({
              key: 'random',
              label: t('map_data.layers.maproulette.next_random'),
              onClick: function() {
                const next = pickRandomNearby(livePool().tasks, liveViewportOpenTasks());
                if (next) goToMapRouletteTask(context, next);
              },
            });
          }
          let buttons = nextWrap.select('.mr-next-actions-buttons')
            .selectAll('button.mr-next-action')
            .data(buttonDefs, function(btn: any) { return btn.key; });
          buttons.exit().remove();
          buttons = buttons.enter()
            .append('button')
            .attr('type', 'button')
            .attr('class', 'button action mr-next-action fixedIt-button')
            .merge(buttons);
          buttons
            .text(function(btn: any) { return btn.label; })
            .on('click.mr-next', function(this: HTMLElement, d3_event: Event, btn: any) {
              d3_event.preventDefault();
              this.blur();
              if (btn && btn.onClick) btn.onClick();
            });
          nextWrap.select('.mr-next-actions-none')
            .text(t('map_data.layers.maproulette.none_next'))
            .classed('hide', buttonDefs.length > 0);
        }

        let tagFixHost: any = root.selectAll('.mr-tag-fix-host')
          .data(isResolved || isQueued ? [] : [d]);
        tagFixHost.exit().remove();
        tagFixHost = tagFixHost.enter()
          .append('div')
          .attr('class', 'mr-tag-fix-host')
          .merge(tagFixHost);
        if (!isResolved && !isQueued) {
          tagFixHost.call(
            uiMapRouletteTagFix(context)
              .mode('embedded')
              .focusEntityIds(_entityIDs.slice())
              .task(d)
              .onAccepted(function() {
                const ch = d.parentId || (d.task && d.task.parentId);
                if (ch !== undefined && ch !== null && ch !== '') setLastWorkedChallengeId(String(ch));
                section.reRender();
              })
              .onPainted(function(info: MapRouletteTagFixPaintInfo) {
                if (String(d.id) !== info.taskId) return;
                let goToHost: any = root.selectAll('.mr-go-to-nearby-host')
                  .data(info.showGoToNearby ? [d] : []);
                goToHost.exit().remove();
                goToHost = goToHost.enter()
                  .append('div')
                  .attr('class', 'mr-go-to-nearby-host')
                  .merge(goToHost);
                if (!info.showGoToNearby) return;
                let btn = goToHost.selectAll('button.mr-go-to-nearby')
                  .data([d]);
                btn = btn.enter()
                  .append('button')
                  .attr('type', 'button')
                  .attr('class', 'button mr-go-to-nearby')
                  .text(t('map_data.layers.maproulette.nearbyTask.go_to'))
                  .on('click', function(this: HTMLElement, d3_event: Event) {
                    d3_event.preventDefault();
                    this.blur();
                    if (d3_select(this).classed('disabled')) return;
                    goToNearbyMapRouletteTask(context, d.id);
                  })
                  .merge(btn);
                btn
                  .classed('disabled', !info.hasNearby)
                  .attr('disabled', info.hasNearby ? null : true);
              }),
          );
        }

        let earmarkHost: any = root.selectAll('.mr-earmark-host')
          .data(isResolved || isQueued ? [] : [d]);
        earmarkHost.exit().remove();
        earmarkHost = earmarkHost.enter()
          .append('div')
          .attr('class', 'mr-earmark-host')
          .merge(earmarkHost);
        if (!isResolved && !isQueued) {
          earmarkHost.call(
            uiMapRouletteEarmarkToggle(context)
              .task(d)
              .onChange(function() {
                section.reRender();
              }),
          );
        }
      });
  }

  section.entityIDs = function(val?: string[]) {
    if (!arguments.length) return _entityIDs;
    _entityIDs = val || [];
    clearPinHighlights();
    _tasks = findTasks();
    notifyPresenceChange();

    if (mapRouletteLayerEnabled() && !_enriching) {
      enrichVisibleTaskElems().then(function(updated) {
        if (!updated) return;
        refreshTasksFromIndex();
      });
    }

    return section;
  };

  function refreshTasksFromIndex(): void {
    const next = findTasks();
    const changed = next.length !== _tasks.length ||
      next.some(function(task, i) {
        return !_tasks[i] || _tasks[i].id !== task.id;
      });
    if (!changed) return;
    _tasks = next;
    notifyPresenceChange();
    section.reRender();
  }

  section.onPresenceChange = function(cb: (present: boolean) => void) {
    _presenceListeners.push(cb);
    cb(isPresent());
    return section;
  };

  if (services.maproulette && typeof (services.maproulette as any).on === 'function') {
    (services.maproulette as any).on('loaded.maproulette_task', function() {
      if (!mapRouletteLayerEnabled() || !_entityIDs.length) return;
      refreshTasksFromIndex();
    });
  }

  context.layers().on('change.uiSectionMapRouletteTask', notifyPresenceChange);

  return section;
}
