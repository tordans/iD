import { select as d3_select } from 'd3-selection';

import { services } from '../services';
import { modeSelect } from '../modes/select';
import {
  effectiveUpdateTiming,
  isCommentTooLong as isCommentTextTooLong,
  osmEntityRank,
  SAVE_CONTROL_SELECTOR,
  shouldClearHiddenComment,
  showCompletionButtons,
  stripEmptyCompletionResponses,
  SUBMIT_TIMEOUT_MS,
  type CompletionAction,
  type CompletionActionKey,
  type CompletionMode,
} from '../util/maproulette_completion';
import {
  getMapRouletteUpdateTiming,
  setMapRouletteUpdateTiming,
  type MapRouletteUpdateTiming,
} from '../util/maproulette_update_timing';
import { setLastWorkedChallengeId } from '../util/maproulette_next_task';
import { uiMapRouletteTagFix } from './maproulette_tag_fix';
import { renderDonePanel } from './maproulette_done_panel';
import {
  renderActionButtons,
  renderGoToNearby,
  renderSaveControls,
  type SaveControlsDeps,
} from './maproulette_save_controls';

import { collectOsmEntityIds } from '../util/maproulette_osm_ids';
import { isMapRouletteTagFix } from '../util/maproulette_cooperative';
import { collectCompletionResponsesFromElement } from '../util/maproulette_markdown';
import { taskDoneStateOf } from '../util/maproulette_status';

export function uiMapRouletteCompletion(context: any) {
  let _qaItem: any;
  let _mode: CompletionMode = 'panel';
  let _focusEntityIds: string[] = [];
  let _onChange: (() => void) | null = null;
  let _mapRouletteApiKey: string | undefined;
  let _submitError: any = null;
  let _submitting = false;
  let _activeAction: CompletionActionKey | null = null;
  /** Completion actions hidden until tag-fix/detail paint finishes. */
  let _tagFixReady = false;
  let _tagFixHasAccept = false;
  let _tagFixTaskId: string | null = null;
  let _updateTiming: MapRouletteUpdateTiming = getMapRouletteUpdateTiming();
  let _selection: any;
  const _tagFix = uiMapRouletteTagFix(context);

  function isTagFixTask(): boolean {
    if (!_qaItem) return false;
    return isMapRouletteTagFix(_qaItem.task || _qaItem);
  }

  function getEffectiveUpdateTiming(): MapRouletteUpdateTiming {
    return effectiveUpdateTiming(isTagFixTask(), _updateTiming);
  }

  function instructionDetailsRoot(): ParentNode | null {
    if (!_selection) return null;
    const details = _selection.select('.error-details');
    return details.empty() ? null : details.node();
  }

  function syncCompletionResponsesFromDom(): void {
    if (!_qaItem) return;
    const root = instructionDetailsRoot();
    if (!root) return;
    const collected = collectCompletionResponsesFromElement(root);
    const hasKeys = Object.keys(collected).length > 0;
    const next = hasKeys ? collected : undefined;
    if (JSON.stringify(_qaItem.completionResponses || {}) === JSON.stringify(collected)) return;
    _qaItem = _qaItem.update({ completionResponses: next });
    const mr = services.maproulette;
    if (mr) mr.replaceItem(_qaItem);
  }

  function clearHiddenCommentIfNeeded(): void {
    if (!shouldClearHiddenComment(getEffectiveUpdateTiming())) return;
    if (!_qaItem || !_qaItem.newComment) return;
    _qaItem = _qaItem.update({ newComment: undefined });
    const mr = services.maproulette;
    if (mr) mr.replaceItem(_qaItem);
  }

  function taskDoneState(): { isShown: boolean; isResolved: boolean; isQueued: boolean } {
    const isShown = _mode === 'embedded'
      ? !!_qaItem
      : !!(_qaItem && String(_qaItem.id) === String(context.selectedErrorID()));
    const { isResolved, isQueued } = taskDoneStateOf(services.maproulette, isShown ? _qaItem : null);
    return { isShown, isResolved, isQueued };
  }

  function refresh(): void {
    if (!_selection) return;
    render(_selection);
  }

  function notifyChange(): void {
    if (_onChange) _onChange();
  }

  function rememberWorkedChallenge(d: any): void {
    const ch = d && (d.parentId || (d.task && d.task.parentId));
    if (ch !== undefined && ch !== null && ch !== '') setLastWorkedChallengeId(String(ch));
  }

  function snapshotAssociatedElems(d: any): string[] {
    const fromItem = Array.isArray(d.elems) ? d.elems.slice() : [];
    if (fromItem.length) return fromItem;
    return collectOsmEntityIds(d.task, d.task && d.task.title, d);
  }

  function selectAssociatedOsmEntity(elems: string[], done: (selected: boolean) => void): void {
    if (!elems || !elems.length) {
      done(false);
      return;
    }

    const ranked = elems.slice().sort(function(a, b) {
      return osmEntityRank(a) - osmEntityRank(b);
    });

    function tryNext(index: number): void {
      if (index >= ranked.length) {
        done(false);
        return;
      }
      const id = ranked[index];
      if (context.hasEntity(id)) {
        context.enter(modeSelect(context, [id]));
        done(true);
        return;
      }
      context.loadEntity(id, function() {
        if (context.hasEntity(id)) {
          context.enter(modeSelect(context, [id]));
          done(true);
        } else {
          tryNext(index + 1);
        }
      });
    }

    tryNext(0);
  }

  function isCommentTooLong(saveRoot?: any): boolean {
    const root = saveRoot || (_selection && _selection.select('.mr-save'));
    if (root && !root.empty()) {
      const input = root.select('.new-comment-input');
      if (!input.empty()) {
        return isCommentTextTooLong(String(input.property('value') || ''));
      }
    }
    const stored = _qaItem && _qaItem.newComment ? String(_qaItem.newComment) : '';
    return isCommentTextTooLong(stored);
  }

  const saveControlsDeps: SaveControlsDeps = {
    context,
    getState: () => ({
      qaItem: _qaItem,
      submitting: _submitting,
      activeAction: _activeAction,
      submitError: _submitError,
      tagFixReady: _tagFixReady,
      tagFixHasAccept: _tagFixHasAccept,
      forcedWithSave: isTagFixTask(),
      effectiveTiming: getEffectiveUpdateTiming(),
      updateTiming: _updateTiming,
      showCompletionButtons: showCompletionButtons(
        _mode,
        _qaItem,
        context.selectedErrorID && context.selectedErrorID(),
        _tagFixReady,
      ),
    }),
    beginAction,
    onTimingChange: (next) => {
      _updateTiming = next;
      setMapRouletteUpdateTiming(next);
      if (shouldClearHiddenComment(next)) {
        clearHiddenCommentIfNeeded();
      }
      refresh();
    },
    onCommentInput: (comment) => {
      if (!_qaItem) return;
      _qaItem = _qaItem.update({ newComment: comment });
      const mr = services.maproulette;
      if (mr) mr.replaceItem(_qaItem);
    },
    refreshActionButtons: (saveRoot) => {
      renderActionButtons(saveRoot, saveControlsDeps);
    },
    isCommentTooLongForSubmit: isCommentTooLong,
  };

  function mRSaveSection(sel: any): void {
    const { isShown, isResolved, isQueued } = taskDoneState();
    let saveSection = sel
      .selectAll('.mr-save')
      .data(isShown ? [_qaItem] : [], function(d: any) { return d.id; });

    saveSection.exit().remove();

    const saveEnter = saveSection
      .enter()
      .append('section')
      .attr('class', 'mr-save save-section cf');

    saveSection = saveEnter.merge(saveSection);
    saveSection.classed('mr-resolved', isResolved || isQueued);

    if (isQueued || isResolved) {
      saveSection
        .selectAll(SAVE_CONTROL_SELECTOR + ', .mr-tag-fix-host, .mr-go-to-nearby-host')
        .remove();
      return;
    }

    saveSection.call(tagFixSection);

    if (!_tagFixReady) {
      saveSection
        .selectAll(SAVE_CONTROL_SELECTOR)
        .remove();
      return;
    }

    renderSaveControlsSection(saveSection);
  }

  /** Interactive controls only — must not re-enter tagFixSection (avoids paint→save→paint loop). */
  function renderSaveControlsSection(selection: any): void {
    clearHiddenCommentIfNeeded();
    renderSaveControls(selection, saveControlsDeps);
  }

  function tagFixSection(selection: any): void {
    const taskId = _qaItem ? String(_qaItem.id) : null;
    if (taskId !== _tagFixTaskId) {
      _tagFixTaskId = taskId;
      _tagFixReady = false;
      _tagFixHasAccept = false;
    }

    let host = selection.selectAll('.mr-tag-fix-host').data([0]);
    host = host.enter()
      .append('div')
      .attr('class', 'mr-tag-fix-host')
      .merge(host);

    host.call(
      _tagFix
        .mode(_mode)
        .focusEntityIds(_focusEntityIds.slice())
        .task(_qaItem)
        .onAccepted(function() {
          rememberWorkedChallenge(_qaItem);
          refresh();
          notifyChange();
        })
        .onPainted(function(info: { taskId: string; hasAccept: boolean; showGoToNearby: boolean; hasNearby: boolean }) {
          if (!_qaItem || String(_qaItem.id) !== info.taskId) return;
          _tagFixReady = true;
          _tagFixHasAccept = !!info.hasAccept;
          renderSaveControlsSection(selection);
          if (_mode === 'embedded') {
            renderGoToNearby(selection, _qaItem, context, info);
          }
        }),
    );
  }

  function beginAction(d: any, action: CompletionAction): void {
    if (!d) return;
    if (isCommentTooLong()) return;

    syncCompletionResponsesFromDom();

    if (getEffectiveUpdateTiming() === 'with_save') {
      queueOutcome(d, action);
      return;
    }

    d._status = action.status;
    _activeAction = action.key;
    _submitError = null;
    _submitting = true;

    refresh();

    const osm: any = services.osm;
    if (osm && typeof osm.loadMapRouletteKey === 'function') {
      osm.loadMapRouletteKey(function(err: any, prefs: any) {
        if (!_submitting || _activeAction !== action.key) return;
        if (err) {
          finishSubmit({ message: 'Failed to load MapRoulette API key', status: 0 });
          return;
        }
        _mapRouletteApiKey = prefs && prefs.maproulette_apikey_v2;
        submitTask(d);
      });
    } else {
      submitTask(d);
    }
  }

  function queueOutcome(d: any, action: { key: CompletionActionKey; status: number }): void {
    const mr = services.maproulette;
    if (!mr || typeof mr.earmarkTask !== 'function') {
      finishSubmit({ message: 'MapRoulette service unavailable', status: 0 });
      return;
    }

    syncCompletionResponsesFromDom();
    mr.earmarkTask(d, action.status, { markLocalDone: true });
    rememberWorkedChallenge(d);
    _submitError = null;
    refresh();
    notifyChange();
  }

  function finishSubmit(err?: any): void {
    _submitting = false;
    _activeAction = null;
    if (err) _submitError = err;
    refresh();
  }

  function submitTask(d: any): void {
    const mr = services.maproulette;
    if (!mr) {
      finishSubmit({ message: 'MapRoulette service unavailable', status: 0 });
      return;
    }

    syncCompletionResponsesFromDom();

    const saveRoot = _selection && _selection.select('.mr-save');
    const commentInput = saveRoot && !saveRoot.empty()
      ? saveRoot.select('.new-comment-input')
      : d3_select(null);
    d.comment = commentInput.empty()
      ? ''
      : commentInput.property('value').trim();
    d.mapRouletteApiKey = _mapRouletteApiKey;
    const stripped = stripEmptyCompletionResponses(d.completionResponses);
    if (stripped) {
      d.completionResponses = stripped;
    } else {
      delete d.completionResponses;
    }

    mr.postUpdate(d, function(err: any) {
      if (err) {
        finishSubmit(err);
        return;
      }

      _submitError = null;
      _submitting = false;
      _activeAction = null;
      rememberWorkedChallenge(d);
      refresh();
      notifyChange();
    }, { timeoutMs: SUBMIT_TIMEOUT_MS });
  }

  function render(selection: any): void {
    _selection = selection;
    const { isShown, isResolved, isQueued } = taskDoneState();
    selection.classed('mr-task-done', isResolved || isQueued);
    renderDonePanel(selection, {
      context,
      getState: () => ({
        qaItem: _qaItem,
        mode: _mode,
        isShown,
        isResolved,
        isQueued,
      }),
      onQueuedUndo: () => {
        const mrService = services.maproulette;
        if (!mrService || !_qaItem || typeof mrService.unearmarkTask !== 'function') return;
        mrService.unearmarkTask(_qaItem.id);
        _tagFixReady = false;
        _tagFixHasAccept = false;
        refresh();
        notifyChange();
      },
      selectAssociatedOsmEntity,
      snapshotAssociatedElems,
    });
    selection.call(mRSaveSection);
  }

  render.task = function(val?: any) {
    if (!arguments.length) return _qaItem;
    if (val !== _qaItem) {
      _tagFixReady = false;
      _tagFixHasAccept = false;
      _tagFixTaskId = val && val.id !== undefined && val.id !== null ? String(val.id) : null;
    }
    _qaItem = val;
    _submitError = null;
    _submitting = false;
    _activeAction = null;
    _updateTiming = getMapRouletteUpdateTiming();
    return render;
  };

  render.mode = function(val?: CompletionMode) {
    if (!arguments.length) return _mode;
    _mode = val === 'embedded' ? 'embedded' : 'panel';
    return render;
  };

  render.focusEntityIds = function(val?: string[]) {
    if (!arguments.length) return _focusEntityIds;
    _focusEntityIds = val || [];
    return render;
  };

  render.onChange = function(val?: (() => void) | null) {
    if (!arguments.length) return _onChange;
    _onChange = val || null;
    return render;
  };

  return render;
}
