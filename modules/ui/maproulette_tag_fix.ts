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

/**
 * Shared Tag Fix UI for the MR task panel and entity-inspector embed.
 * Accept applies matched targets locally and earmarks Fixed (no MR /fix/apply).
 */
export function uiMapRouletteTagFix(context: any): any {
  let _qaItem: any = null;
  let _mode: 'panel' | 'embedded' = 'panel';
  let _focusEntityIds: string[] = [];
  let _onAccepted: (() => void) | null = null;
  let _onPainted: (() => void) | null = null;

  function renderTagDiffTable(parent: any, matched: MapRouletteMatchedTagFix): void {
    const tagDiff = utilTagDiff(matched.currentTags, matched.proposedTags);
    if (!tagDiff.length) {
      parent.append('p')
        .attr('class', 'mr-tag-fix-unchanged')
        .text(t('map_data.layers.maproulette.tag_fix_no_changes'));
      return;
    }

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
    const showMatched = _mode === 'embedded' && focusIds.size
      ? matched.filter(function(m) { return focusIds.has(m.entityId); })
      : matched;

    if (_mode === 'embedded' && focusIds.size && !showMatched.length && matched.length) {
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
      renderTagDiffTable(block, m);
    });

    if (matched.length > showMatched.length) {
      const others = matched.filter(function(m) { return !focusIds.has(m.entityId); });
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

  function renderContent(root: any, task: any): void {
    root.html('');

    if (!isMapRouletteTagFix(task)) {
      root.classed('hide', true);
      return;
    }

    root.classed('hide', false);
    const { matched, unmatched } = matchMapRouletteTagFixes(context, task);
    const focusIds = new Set(_focusEntityIds.filter(Boolean));

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

    renderMatchSections(root, matched, unmatched, focusIds);

    root.append('button')
      .attr('class', 'button action mr-tag-fix-accept')
      .text(t('map_data.layers.maproulette.tag_fix_accept'))
      .on('click', function(this: HTMLElement) {
        this.blur();
        acceptFixes(task);
      });
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
    placeholder.classed('loading', true);

    function paint(detail?: any): void {
      placeholder.classed('loading', false);
      const task = taskPayload(_qaItem, detail);
      renderContent(placeholder, task);
      if (_onPainted) _onPainted();
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

  render.onPainted = function(val?: (() => void) | null) {
    if (!arguments.length) return _onPainted;
    _onPainted = val || null;
    return render;
  };

  /** Whether Accept is available for the current task + graph (sync, needs cooperativeWork on task). */
  render.hasAcceptableFixes = function(): boolean {
    if (!_qaItem) return false;
    const task = taskPayload(_qaItem);
    if (!isMapRouletteTagFix(task)) return false;
    return matchMapRouletteTagFixes(context, task).matched.length > 0;
  };

  return render;
}
