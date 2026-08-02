import { select as d3_select } from 'd3-selection';

import { services } from '../../services';
import { t } from '../../core/localizer';
import { uiSection } from '../section';
import { uiMapRouletteDetails } from '../maproulette_details';
import { uiMapRouletteEarmarkToggle } from '../maproulette_earmark_toggle';


export function uiSectionMapRouletteTask(context: any) {
  let _entityIDs: string[] = [];
  let _tasks: any[] = [];
  let _highlightBound = false;
  let _enriching = false;

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
        root.classed('mr-resolved', isResolved);

        const details = (uiMapRouletteDetails(context) as any)
          .embedded(true)
          .task(d);
        details(root);

        let banner: any = root.selectAll('.mr-resolved-banner')
          .data(isResolved ? [d] : []);
        banner.exit().remove();
        const bannerEnter = banner.enter()
          .append('div')
          .attr('class', 'mr-resolved-banner notice');
        bannerEnter.append('strong');
        bannerEnter.append('p');
        banner = bannerEnter.merge(banner);
        banner.select('strong')
          .text(t('map_data.layers.maproulette.resolved_title'));
        banner.select('p')
          .text(t('map_data.layers.maproulette.resolved_message'));

        let earmarkHost: any = root.selectAll('.mr-earmark-host')
          .data(isResolved ? [] : [d]);
        earmarkHost.exit().remove();
        earmarkHost = earmarkHost.enter()
          .append('div')
          .attr('class', 'mr-earmark-host')
          .merge(earmarkHost);
        if (!isResolved) {
          earmarkHost.call(
            uiMapRouletteEarmarkToggle(context).task(d)
          );
        }
      });
  }

  section.entityIDs = function(val?: string[]) {
    if (!arguments.length) return _entityIDs;
    _entityIDs = val || [];
    clearPinHighlights();
    _tasks = findTasks();

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
    section.reRender();
  }

  if (services.maproulette && typeof (services.maproulette as any).on === 'function') {
    (services.maproulette as any).on('loaded.maproulette_task', function() {
      if (!mapRouletteLayerEnabled() || !_entityIDs.length) return;
      refreshTasksFromIndex();
    });
  }

  return section;
}
