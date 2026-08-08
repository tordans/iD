import { select as d3_select } from 'd3-selection';
import { deepEqual } from 'fast-equals';

import { t } from '../core/localizer';
import { actionChangeTags } from '../actions/change_tags';
import { modeSelect } from '../modes/select';
import { services } from '../services';
import { utilTagDiff } from '../util';
import {
  extractCooperativeWork,
  isMapRouletteTagFix,
  matchMapRouletteTagFixes,
  tagFixesToApply,
  type MapRouletteMatchedTagFix,
} from '../util/maproulette_cooperative';

export type MapRouletteTagFixPaintInfo = {
  taskId: string;
  hasAccept: boolean;
  showGoToNearby: boolean;
  hasNearby: boolean;
};

/** Display iD id `w123` as `way/123`. */
function longFormId(id: string): string {
  return id.replace(/^[wnr]/, function(prefix) {
    switch (prefix) {
      case 'w': return 'way/';
      case 'n': return 'node/';
      case 'r': return 'relation/';
      default: return prefix;
    }
  });
}

function taskPayload(qaItem: any, detail?: any): any {
  if (detail && extractCooperativeWork(detail)) return detail;
  if (qaItem && qaItem.task && extractCooperativeWork(qaItem.task)) return qaItem.task;
  if (qaItem && extractCooperativeWork(qaItem)) return qaItem;
  return detail || (qaItem && qaItem.task) || qaItem;
}

function matchedForFocus(
  matched: MapRouletteMatchedTagFix[],
  mode: 'panel' | 'embedded',
  focusIds: Set<string>,
): MapRouletteMatchedTagFix[] {
  if (mode === 'embedded' && focusIds.size) {
    return matched.filter(function(m) { return focusIds.has(m.entityId); });
  }
  return matched;
}

function hasPendingTagDiffs(matched: MapRouletteMatchedTagFix[]): boolean {
  return matched.some(function(m) {
    return utilTagDiff(m.currentTags, m.proposedTags).length > 0;
  });
}

function entityHasPendingDiffs(m: MapRouletteMatchedTagFix): boolean {
  return utilTagDiff(m.currentTags, m.proposedTags).length > 0;
}

function isTaskEarmarked(taskId: string): boolean {
  const mr = services.maproulette;
  return !!(mr && typeof mr.isEarmarked === 'function' && mr.isEarmarked(taskId));
}

/**
 * Shared Tag Fix UI for the MR task panel and entity-inspector embed.
 * Accept applies matched targets locally and earmarks Fixed (no MR /fix/apply).
 */
export function uiMapRouletteTagFix(context: any): any {
  let _qaItem: any = null;
  let _mode: 'panel' | 'embedded' = 'panel';
  let _focusEntityIds: string[] = [];
  let _onAccepted: (() => void) | null = null;
  let _onPainted: ((info: MapRouletteTagFixPaintInfo) => void) | null = null;
  let _loadSeq = 0;

  function renderTagDiffTable(parent: any, matched: MapRouletteMatchedTagFix): void {
    const tagDiff = utilTagDiff(matched.currentTags, matched.proposedTags);
    if (!tagDiff.length) return;

    parent
      .append('table')
      .attr('class', 'tagDiff-table')
      .selectAll('.tagDiff-row')
      .data(tagDiff)
      .enter()
      .append('tr')
      .attr('class', 'tagDiff-row')
      .append('td')
      .attr('class', function(d: any) {
        const klass = 'tagDiff-cell';
        switch (d.type) {
          case '+': return `${klass} tagDiff-cell-add`;
          case '-': return `${klass} tagDiff-cell-remove`;
          default: return `${klass} tagDiff-cell-unchanged`;
        }
      })
      .each(function(this: HTMLElement, d: any) {
        d3_select(this).call(d.render);
      });
  }

  function attachEntityJump(selection: any): void {
    selection.selectAll('a.mr-tag-fix-entity-link')
      .on('click.mr-tag-fix', function(this: Element, d3_event: Event) {
        d3_event.preventDefault();
        const id = d3_select(this).attr('data-entity-id');
        if (!id) return;
        if (context.hasEntity(id)) {
          context.enter(modeSelect(context, [id]));
        } else if (typeof context.zoomToEntity === 'function') {
          context.zoomToEntity(id);
        }
      });
  }

  function renderMatchSections(
    root: any,
    matched: MapRouletteMatchedTagFix[],
    unmatched: string[],
    focusIds: Set<string>,
  ): void {
    const focusMatched = _mode === 'embedded' && focusIds.size
      ? matched.filter(function(m) { return focusIds.has(m.entityId); })
      : matched;
    const otherPending = _mode === 'embedded' && focusIds.size
      ? matched.filter(function(m) {
        return !focusIds.has(m.entityId) && entityHasPendingDiffs(m);
      })
      : [];
    const showMatched = focusMatched.concat(otherPending);

    if (_mode === 'embedded' && focusIds.size && !focusMatched.length && matched.length) {
      root.append('p')
        .attr('class', 'mr-tag-fix-note')
        .text(t('map_data.layers.maproulette.tag_fix_other_targets'));
    }

    showMatched.forEach(function(m) {
      const block = root.append('div').attr('class', 'mr-tag-fix-entity');
      const heading = block.append('h5').attr('class', 'mr-tag-fix-entity-heading');
      heading.append('a')
        .attr('href', '#')
        .attr('class', 'mr-tag-fix-entity-link')
        .attr('data-entity-id', m.entityId)
        .text(longFormId(m.entityId));
      if (entityHasPendingDiffs(m)) {
        renderTagDiffTable(block, m);
      }
    });

    if (matched.length > showMatched.length) {
      const others = matched.filter(function(m) {
        return !focusIds.has(m.entityId) && !entityHasPendingDiffs(m);
      });
      if (others.length) {
        const note = root.append('p').attr('class', 'mr-tag-fix-note mr-tag-fix-other-matched');
        note.append('span').text(t('map_data.layers.maproulette.tag_fix_also_matched') + ' ');
        others.forEach(function(m, i) {
          if (i > 0) note.append('span').text(', ');
          note.append('a')
            .attr('href', '#')
            .attr('class', 'mr-tag-fix-entity-link')
            .attr('data-entity-id', m.entityId)
            .text(longFormId(m.entityId));
        });
      }
    }

    if (unmatched.length) {
      const miss = root.append('p').attr('class', 'mr-tag-fix-note mr-tag-fix-unmatched');
      miss.append('span').text(t('map_data.layers.maproulette.tag_fix_unmatched') + ' ');
      unmatched.forEach(function(id, i) {
        if (i > 0) miss.append('span').text(', ');
        miss.append('a')
          .attr('href', '#')
          .attr('class', 'mr-tag-fix-entity-link')
          .attr('data-entity-id', id)
          .text(longFormId(id));
      });
    }

    attachEntityJump(root);
  }

  function acceptFixes(task: any): void {
    if (!_qaItem) return;
    const toApply = tagFixesToApply(context, task);
    if (!toApply.length) return;

    const actions = toApply
      .filter(function(item) {
        const entity = context.hasEntity(item.entityId);
        return entity && !deepEqual(entity.tags || {}, item.tags);
      })
      .map(function(item) {
        return actionChangeTags(item.entityId as any, item.tags);
      });

    if (actions.length) {
      context.perform(function(graph: any) {
        actions.forEach(function(action) {
          graph = action(graph);
        });
        return graph;
      }, t('map_data.layers.maproulette.tag_fix_annotation'));
      context.validator().validate();
    }

    const mr = services.maproulette;
    if (mr && typeof mr.earmarkTask === 'function') {
      mr.earmarkTask(_qaItem);
    }

    const ids = toApply.map(function(item) { return item.entityId; })
      .filter(function(id) { return context.hasEntity(id); });
    if (ids.length) {
      context.enter(modeSelect(context, ids));
    }

    if (_onAccepted) _onAccepted();
  }

  function setEmbeddedHostVisible(root: any, visible: boolean): void {
    if (_mode !== 'embedded') return;
    const host = root.node() && root.node().parentElement;
    if (host) d3_select(host).classed('hide', !visible);
  }

  function tagFixPaintInfo(
    task: any,
    matched: MapRouletteMatchedTagFix[],
    focusIds: Set<string>,
    hasNearby: boolean,
  ): MapRouletteTagFixPaintInfo {
    const pending = hasPendingTagDiffs(matched);
    const focusMatched = matchedForFocus(matched, _mode, focusIds);
    const earmarked = isTaskEarmarked(String(_qaItem.id));
    const hasAccept = pending && matched.length > 0;
    const showGoToNearby = _mode === 'embedded'
      && focusMatched.length > 0
      && !pending
      && earmarked;
    return {
      taskId: String(_qaItem.id),
      hasAccept,
      showGoToNearby,
      hasNearby,
    };
  }

  function renderContent(root: any, task: any): void {
    root.html('');

    if (!isMapRouletteTagFix(task)) {
      root.classed('hide', true);
      setEmbeddedHostVisible(root, false);
      return;
    }

    root.classed('hide', false);
    setEmbeddedHostVisible(root, true);
    const { matched, unmatched } = matchMapRouletteTagFixes(context, task);
    const focusIds = new Set(_focusEntityIds.filter(Boolean));
    const pending = hasPendingTagDiffs(matched);
    const earmarked = isTaskEarmarked(String(_qaItem.id));
    const showSuccess = !pending && earmarked;
    const showAlreadyMatches = !pending && !earmarked;

    root.append('h4')
      .attr('class', 'mr-tag-fix-heading')
      .text(t('map_data.layers.maproulette.tag_fix_heading'));

    if (!matched.length) {
      const msg = root.append('p').attr('class', 'mr-tag-fix-unavailable notice');
      msg.append('span')
        .text(t('map_data.layers.maproulette.tag_fix_unavailable'));
      if (unmatched.length) {
        msg.append('span').text(' ');
        unmatched.forEach(function(id, i) {
          if (i > 0) msg.append('span').text(', ');
          msg.append('a')
            .attr('href', '#')
            .attr('class', 'mr-tag-fix-entity-link')
            .attr('data-entity-id', id)
            .text(longFormId(id));
        });
        attachEntityJump(msg);
      }
      return;
    }

    // Embedded: only show Accept when the selection is a matched target
    if (_mode === 'embedded' && focusIds.size) {
      const focusMatched = matched.some(function(m) { return focusIds.has(m.entityId); });
      if (!focusMatched) {
        root.append('p')
          .attr('class', 'mr-tag-fix-note')
          .text(t('map_data.layers.maproulette.tag_fix_not_selected_target'));
        renderMatchSections(root, matched, unmatched, focusIds);
        return;
      }
    }

    if (showSuccess) {
      root.append('p')
        .attr('class', 'mr-tag-fix-applied notice')
        .text(t('map_data.layers.maproulette.tag_fix_applied'));
    }

    if (showAlreadyMatches) {
      root.append('p')
        .attr('class', 'mr-tag-fix-already-matches notice')
        .text(t('map_data.layers.maproulette.tag_fix_already_matches'));
    }

    renderMatchSections(root, matched, unmatched, focusIds);

    if (pending) {
      root.append('button')
        .attr('class', 'button action mr-tag-fix-accept')
        .text(t('map_data.layers.maproulette.tag_fix_accept'))
        .on('click', function(this: HTMLElement) {
          this.blur();
          acceptFixes(task);
        });
    }
  }

  function render(selection: any): void {
    const isShown = !!_qaItem;
    let root = selection.selectAll('.mr-tag-fix')
      .data(isShown ? [_qaItem] : [], function(d: any) { return d.id; });

    root.exit().remove();

    const enter = root.enter()
      .append('div')
      .attr('class', `mr-tag-fix mr-tag-fix-${_mode}`);

    root = enter.merge(root);
    if (!isShown) return;

    const mr = services.maproulette;
    const placeholder = root;
    const requestId = ++_loadSeq;
    const requestTaskId = String(_qaItem.id);
    const focusSnapshot = _focusEntityIds.slice().join('\0');
    placeholder.classed('loading', true);
    if (_mode === 'embedded') {
      placeholder.classed('hide', true);
      setEmbeddedHostVisible(placeholder, false);
    }

    function stillCurrent(): boolean {
      if (requestId !== _loadSeq) return false;
      if (!_qaItem || String(_qaItem.id) !== requestTaskId) return false;
      if (_focusEntityIds.slice().join('\0') !== focusSnapshot) return false;
      if (_mode === 'panel') {
        const selected = context.selectedErrorID && context.selectedErrorID();
        if (selected !== undefined && selected !== null
          && String(selected) !== requestTaskId) {
          return false;
        }
      }
      return true;
    }

    function paint(detail?: any): void {
      if (!stillCurrent()) return;
      placeholder.classed('loading', false);
      const task = taskPayload(_qaItem, detail);
      const hasNearby = !!(mr && typeof mr.getNearestItem === 'function'
        && mr.getNearestItem(context.map().center(), requestTaskId));
      renderContent(placeholder, task);
      if (_onPainted) {
        if (isMapRouletteTagFix(task)) {
          const { matched } = matchMapRouletteTagFixes(context, task);
          const focusIds = new Set(_focusEntityIds.filter(Boolean));
          _onPainted(tagFixPaintInfo(task, matched, focusIds, hasNearby));
        } else {
          _onPainted({
            taskId: requestTaskId,
            hasAccept: false,
            showGoToNearby: false,
            hasNearby: false,
          });
        }
      }
    }

    if (mr && typeof mr.loadTaskDetailAsync === 'function') {
      mr.loadTaskDetailAsync(_qaItem)
        .then(function(detail: any) { paint(detail); })
        .catch(function() { paint(); });
    } else {
      paint();
    }
  }

  render.task = function(val?: any) {
    if (!arguments.length) return _qaItem;
    if (val !== _qaItem) _loadSeq += 1;
    _qaItem = val;
    return render;
  };

  render.mode = function(val?: 'panel' | 'embedded') {
    if (!arguments.length) return _mode;
    _mode = val || 'panel';
    return render;
  };

  /** When set (entity inspector), prefer diffs for these ids. */
  render.focusEntityIds = function(val?: string[]) {
    if (!arguments.length) return _focusEntityIds;
    _focusEntityIds = val || [];
    return render;
  };

  render.onAccepted = function(val?: (() => void) | null) {
    if (!arguments.length) return _onAccepted;
    _onAccepted = val || null;
    return render;
  };

  render.onPainted = function(
    val?: ((info: MapRouletteTagFixPaintInfo) => void) | null,
  ) {
    if (!arguments.length) return _onPainted;
    _onPainted = val || null;
    return render;
  };

  /** Whether Accept is available for the current task + graph (sync, needs cooperativeWork on task). */
  render.hasAcceptableFixes = function(): boolean {
    if (!_qaItem) return false;
    const task = taskPayload(_qaItem);
    if (!isMapRouletteTagFix(task)) return false;
    const { matched } = matchMapRouletteTagFixes(context, task);
    return hasPendingTagDiffs(matched);
  };

  return render;
}
