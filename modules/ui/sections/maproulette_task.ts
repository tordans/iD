import { select as d3_select } from 'd3-selection';

import { services } from '../../services';
import { t } from '../../core/localizer';
import { modeSelectError } from '../../modes/select_error';
import { taskDoneStateOf } from '../../util/maproulette_status';
import { uiSection } from '../section';
import { uiMapRouletteDetails } from '../maproulette_details';
import { uiMapRouletteCompletion } from '../maproulette_completion';


export function uiSectionMapRouletteTask(context: any) {
  let _entityIDs: string[] = [];
  let _tasks: any[] = [];
  let _highlightBound = false;
  let _enriching = false;
  let _lastPresence = false;
  const _presenceListeners: Array<(present: boolean) => void> = [];
  /** Reuse details widgets so async paint state survives inspector re-renders. */
  const _detailsByTaskId: Record<string, any> = {};
  /** Reuse completion widgets so tag-fix / submit state survives re-renders. */
  const _completionByTaskId: Record<string, any> = {};

  const section = (uiSection('maproulette-task', context) as any)
    .shouldDisplay(function() {
      return mapRouletteLayerEnabled() && _tasks.length > 0;
    })
    .label(function() {
      return function(sel: any) {
        sel.call(t.append('inspector.maproulette_task'));
        const taskId = _tasks.length === 1 ? String(_tasks[0].id) : null;
        let link = sel.selectAll('a.mr-task-select-link')
          .data(taskId ? [taskId] : []);
        link.exit().remove();
        link = link.enter()
          .append('a')
          .attr('href', '#')
          .attr('class', 'mr-task-select-link')
          .text(function(id: string) { return '#' + id; })
          .merge(link);
        link.on('click', function(d3_event: Event, id: string) {
          d3_event.preventDefault();
          d3_event.stopPropagation();
          context.selectedErrorID(id);
          context.enter(modeSelectError(context, id, 'maproulette'));
        });
      };
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
    setPinHighlights(true);

    const containers = selection.selectAll('.maproulette-task-embed')
      .data(_tasks, function(d: any) { return d.id; });

    containers.exit()
      .each(function(d: any) {
        if (d && d.id !== undefined && d.id !== null) {
          const taskId = String(d.id);
          delete _detailsByTaskId[taskId];
          delete _completionByTaskId[taskId];
        }
      })
      .remove();

    const containersEnter = containers.enter()
      .append('div')
      .attr('class', 'maproulette-task-embed');

    containersEnter.merge(containers)
      .each(function(this: Element, d: any) {
        const root = d3_select(this);
        const mr = services.maproulette;
        const { isResolved, isQueued } = taskDoneStateOf(mr, d);
        root.classed('mr-resolved', isResolved || isQueued);

        const taskId = String(d.id);
        if (!_detailsByTaskId[taskId]) {
          _detailsByTaskId[taskId] = (uiMapRouletteDetails(context) as any).embedded(true);
        }
        if (!_completionByTaskId[taskId]) {
          _completionByTaskId[taskId] = uiMapRouletteCompletion(context);
        }

        _detailsByTaskId[taskId]
          .done(isResolved || isQueued)
          .task(d)(root);

        _completionByTaskId[taskId]
          .task(d)
          .mode('embedded')
          .focusEntityIds(_entityIDs.slice())
          .onChange(function() {
            section.reRender();
          });
        _completionByTaskId[taskId](root);
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
