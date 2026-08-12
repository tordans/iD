import { dispatch as d3_dispatch } from 'd3-dispatch';
import { select as d3_select } from 'd3-selection';

import { t } from '../core/localizer';
import { services } from '../services';
import { MR_STATUS } from '../services/maproulette';
import { modeBrowse } from '../modes/browse';
import { modeSelect } from '../modes/select';
import { goToMapRouletteTask } from '../util/maproulette_nearby';
import {
  getMapRouletteUpdateTiming,
  setMapRouletteUpdateTiming,
  type MapRouletteUpdateTiming,
} from '../util/maproulette_update_timing';
import {
  nextTaskActionsForPool,
  pickNearest,
  pickPriority,
  pickRandomNearby,
  resolveCandidatePool,
  setLastWorkedChallengeId,
} from '../util/maproulette_next_task';
import { svgIcon } from '../svg/icon';
import { MAPROULETTE_ACTION_ICONS } from '../svg/maproulette_marker';
import { uiMapRouletteDetails } from './maproulette_details';
import { uiMapRouletteTagFix } from './maproulette_tag_fix';
import { uiTooltip } from './tooltip';
import { uiViewOnMapRoulette } from './view_on_maproulette';

import { utilNoAuto, utilRebind } from '../util';
import { collectOsmEntityIds } from '../util/maproulette_osm_ids';
import { doneTaskStatusOf, statusLabelKey } from '../util/maproulette_status';

/** How long a MapRoulette submit may run before we abort and show a timeout error. */
const SUBMIT_TIMEOUT_MS = 30000;
const COMMENT_MAX_LENGTH = 1000;

type ActionKey = 'fixed' | 'alreadyFixed' | 'notAnIssue' | 'cantComplete';

/** Order matches MapRoulette V4 TaskActions (2×2: Fixed, Already Fixed / Not an Issue, Can't Complete). */
const ACTIONS: Array<{ key: ActionKey; status: number; className: string }> = [
  { key: 'fixed', status: 1, className: 'fixedIt-button' },
  { key: 'alreadyFixed', status: 5, className: 'alreadyFixed-button' },
  { key: 'notAnIssue', status: 2, className: 'notAnIssue-button' },
  { key: 'cantComplete', status: 6, className: 'cantComplete-button' },
];

const SAVE_CONTROL_SELECTOR =
  '.mr-update-timing, .mr-optional-comment, .mr-completion-heading, .buttons.mr-actions, .mr-submit-status, .mr-auth-warning, .mr-generic-warning';

export function uiMapRouletteEditor(context: any) {
  const dispatch = d3_dispatch('change');

  let _qaItem: any;
  let _mapRouletteApiKey: string | undefined;
  let _submitError: any = null;
  let _submitting = false;
  let _activeAction: ActionKey | null = null;
  /** Completion actions hidden until tag-fix/detail paint finishes. */
  let _tagFixReady = false;
  let _tagFixHasAccept = false;
  let _tagFixTaskId: string | null = null;
  let _updateTiming: MapRouletteUpdateTiming = getMapRouletteUpdateTiming();
  const _details = uiMapRouletteDetails(context);
  const _tagFix = uiMapRouletteTagFix(context);

  function editorRoot(): any {
    return context.container().select('.mr-editor');
  }

  function render(selection: any): void {
    const headerEnter = selection
      .selectAll('.header')
      .data([0])
      .enter()
      .append('div')
      .attr('class', 'header fillL');

    headerEnter
      .append('button')
      .attr('class', 'close')
      .attr('title', t('icons.close'))
      .on('click', function() { context.enter(modeBrowse(context)); })
      .call(svgIcon('#iD-icon-close', ''));

    headerEnter.append('h2').text(t('map_data.layers.maproulette.title'));

    let body = selection.selectAll('.body').data([0]);
    body = body.enter().append('div').attr('class', 'body').merge(body);

    const { isResolved, isQueued } = taskDoneState();
    const isDone = isResolved || isQueued;

    const editor = body.selectAll('.mr-editor').data([0]);
    editor
      .enter()
      .append('div')
      .attr('class', 'modal-section mr-editor')
      .merge(editor)
      .classed('mr-task-done', isDone)
      .call(mRStatusBanner)
      .call(mRNextActions)
      .call(_details.task(_qaItem).done(isDone))
      .call(mRSaveSection);

    const footer = selection.selectAll('.footer').data([0]);

    footer
      .enter()
      .append('div')
      .attr('class', 'footer')
      .merge(footer)
      .call(uiViewOnMapRoulette().what(_qaItem));
  }

  function taskDoneState(): { isShown: boolean; isResolved: boolean; isQueued: boolean } {
    const isSelected =
      _qaItem && String(_qaItem.id) === String(context.selectedErrorID());
    const isShown = !!_qaItem && isSelected;
    const mr = services.maproulette;
    const isResolved = !!(
      isShown && mr && mr.isRecentlyResolved && mr.isRecentlyResolved(_qaItem)
    );
    const isQueued = !!(
      isShown && mr && mr.isEarmarked && mr.isEarmarked(_qaItem.id)
    );
    return { isShown, isResolved, isQueued };
  }

  function refreshSaveArea(): void {
    const root = editorRoot();
    const { isResolved, isQueued } = taskDoneState();
    const isDone = isResolved || isQueued;
    root.classed('mr-task-done', isDone);
    root.call(mRStatusBanner);
    root.call(mRNextActions);
    root.call(_details.task(_qaItem).done(isDone));
    root.call(mRSaveSection);
  }

  function rememberWorkedChallenge(d: any): void {
    const ch = d && (d.parentId || (d.task && d.task.parentId));
    if (ch !== undefined && ch !== null && ch !== '') setLastWorkedChallengeId(String(ch));
  }

  /** Long-form OSM id for display (w123 → way/123). */
  function longFormOsmId(id: string): string {
    return String(id).replace(/^[wnr]/, function(prefix) {
      switch (prefix) {
        case 'w': return 'way/';
        case 'n': return 'node/';
        case 'r': return 'relation/';
        default: return prefix;
      }
    });
  }

  function preferredShowOsmId(d: any): string | null {
    const elems = snapshotAssociatedElems(d);
    if (!elems.length) return null;
    const ranked = elems.slice().sort(function(a, b) {
      return entityRank(a) - entityRank(b);
    });
    return ranked[0] || null;
  }

  function mRNextActions(sel: any): void {
    const { isShown, isResolved, isQueued } = taskDoneState();
    const show = isShown && (isResolved || isQueued);
    let wrap = sel.selectAll('.mr-next-actions').data(show ? [0] : []);
    wrap.exit().remove();
    const enter = wrap
      .enter()
      .insert('div', '.error-details, .mr-save')
      .attr('class', 'mr-next-actions');
    enter.append('div').attr('class', 'mr-next-actions-buttons');
    enter.append('p').attr('class', 'mr-next-actions-none');
    wrap = enter.merge(wrap);
    if (!show || !_qaItem) return;

    const mr = services.maproulette;
    const excludeId = _qaItem.id;
    const currentChallengeId = _qaItem.parentId || (_qaItem.task && _qaItem.task.parentId);
    // Button visibility from pool at paint time; picks re-resolve on click
    // so pan/zoom after done still affects nearest / priority / random.
    const poolForVisibility = resolveCandidatePool(mr, {
      excludeId,
      currentChallengeId,
    });
    const actions = nextTaskActionsForPool(poolForVisibility);
    const osmId = preferredShowOsmId(_qaItem);

    function livePool() {
      return resolveCandidatePool(services.maproulette, {
        excludeId,
        currentChallengeId,
      });
    }

    function liveViewportOpenTasks() {
      const svc = services.maproulette;
      if (!svc || typeof svc.getItems !== 'function') return [];
      return (svc.getItems(context.projection) || []).filter(function(d: any) {
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
          const next = pickNearest(livePool().tasks, context.map().center());
          if (next) goToMapRouletteTask(context, next);
        },
      });
    }
    if (actions.showPriority) {
      buttonDefs.push({
        key: 'priority',
        label: t('map_data.layers.maproulette.next_priority'),
        enabled: true,
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
        enabled: true,
        onClick: function() {
          const next = pickRandomNearby(livePool().tasks, liveViewportOpenTasks());
          if (next) goToMapRouletteTask(context, next);
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
          selectAssociatedOsmEntity([osmId], function() { /* leave MR panel */ });
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
      .attr('class', 'button mr-next-action');
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

  function mRStatusBanner(sel: any): void {
    const { isResolved, isQueued } = taskDoneState();
    const showResolved = isResolved && !isQueued;
    const showQueued = isQueued;
    const mr = services.maproulette;
    const status = _qaItem ? doneTaskStatusOf(mr, _qaItem) : MR_STATUS.FIXED;
    const statusTitle = t(statusLabelKey(status));

    let resolved = sel.selectAll('.mr-resolved-banner').data(showResolved ? [0] : []);
    resolved.exit().remove();
    const resolvedEnter = resolved
      .enter()
      .insert('div', ':first-child')
      .attr('class', 'mr-resolved-banner notice');
    resolvedEnter.append('h3');
    resolvedEnter.append('p');
    resolved = resolvedEnter.merge(resolved);
    resolved.select('h3').text(statusTitle);
    resolved.select('p').text(t('map_data.layers.maproulette.resolved_message'));

    let queued = sel.selectAll('.mr-queued-banner').data(showQueued ? [0] : []);
    queued.exit().remove();
    const queuedEnter = queued
      .enter()
      .insert('div', ':first-child')
      .attr('class', 'mr-queued-banner notice');
    queuedEnter.append('h3');
    queuedEnter.append('p');
    queuedEnter
      .append('button')
      .attr('type', 'button')
      .attr('class', 'button mr-queued-undo')
      .text(t('map_data.layers.maproulette.queued_undo'));
    queued = queuedEnter.merge(queued);
    queued.select('h3').text(statusTitle);
    queued.select('p').text(t('map_data.layers.maproulette.queued_message'));
    queued.select('.mr-queued-undo')
      .on('click.mr-queued-undo', function(this: HTMLElement, d3_event: Event) {
        d3_event.preventDefault();
        this.blur();
        const mrService = services.maproulette;
        if (!mrService || !_qaItem || typeof mrService.unearmarkTask !== 'function') return;
        mrService.unearmarkTask(_qaItem.id);
        _tagFixReady = false;
        _tagFixHasAccept = false;
        refreshSaveArea();
        dispatch.call('change');
      });
  }

  function mRSaveSection(sel: any): void {
    const { isShown, isResolved, isQueued } = taskDoneState();
    let saveSection = sel
      .selectAll('.mr-save')
      .data(isShown ? [_qaItem] : [], function(d: any) { return d.id; });

    saveSection.exit().remove();

    const saveEnter = saveSection
      .enter()
      .append('div')
      .attr('class', 'mr-save save-section cf');

    saveSection = saveEnter.merge(saveSection);
    saveSection.classed('mr-resolved', isResolved || isQueued);

    // Prefer queued UI whenever an earmark remains (including with-save +
    // markLocalDone, which also sets recently-resolved locally).
    if (isQueued || isResolved) {
      saveSection
        .selectAll(SAVE_CONTROL_SELECTOR + ', .mr-tag-fix, .mr-earmark-wrap')
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

    renderSaveControls(saveSection);
  }

  /** Interactive controls only — must not re-enter tagFixSection (avoids paint→save→paint loop). */
  function renderSaveControls(selection: any): void {
    const rightAway = _updateTiming === 'right_away';
    selection.call(updateTimingToggle);
    if (rightAway) {
      selection.call(optionalComment);
    } else {
      selection.selectAll('.mr-optional-comment').remove();
    }
    selection
      .call(mRSaveButtons)
      .call(statusFeedback)
      .call(authWarning);
  }

  function tagFixSection(selection: any): void {
    const taskId = _qaItem ? String(_qaItem.id) : null;
    if (taskId !== _tagFixTaskId) {
      _tagFixTaskId = taskId;
      _tagFixReady = false;
      _tagFixHasAccept = false;
    }

    selection.call(
      _tagFix
        .mode('panel')
        .task(_qaItem)
        .onAccepted(function() {
          rememberWorkedChallenge(_qaItem);
          refreshSaveArea();
          dispatch.call('change');
        })
        .onPainted(function(info: { taskId: string; hasAccept: boolean }) {
          if (!_qaItem || String(_qaItem.id) !== info.taskId) return;
          _tagFixReady = true;
          _tagFixHasAccept = !!info.hasAccept;
          // Only mount controls — calling mRSaveSection here re-ran tagFixSection
          // and retriggered paint → infinite loop / browser freeze on pin click.
          renderSaveControls(selection);
        }),
    );
  }

  function updateTimingToggle(selection: any): void {
    let wrap = selection.selectAll('.mr-update-timing').data([0]);
    const wrapEnter = wrap
      .enter()
      .append('div')
      .attr('class', 'mr-update-timing');

    wrapEnter.append('div')
      .attr('class', 'mr-update-timing-label')
      .text(t('map_data.layers.maproulette.update_timing_label'));

    const groupEnter = wrapEnter
      .append('div')
      .attr('class', 'mr-update-timing-group')
      .attr('role', 'radiogroup')
      .attr('aria-label', t('map_data.layers.maproulette.update_timing_label'));

    (['with_save', 'right_away'] as MapRouletteUpdateTiming[]).forEach(function(value) {
      const btn = groupEnter
        .append('button')
        .attr('type', 'button')
        .attr('class', 'mr-update-timing-option')
        .attr('data-timing', value)
        .attr('role', 'radio')
        .call((uiTooltip() as any)
          .title(() => t.append(
            value === 'with_save'
              ? 'map_data.layers.maproulette.update_with_save_tooltip'
              : 'map_data.layers.maproulette.update_right_away_tooltip',
          ))
          .placement('bottom'));
      btn.append('span')
        .attr('class', 'mr-update-timing-option-label')
        .text(t(
          value === 'with_save'
            ? 'map_data.layers.maproulette.update_with_save'
            : 'map_data.layers.maproulette.update_right_away',
        ));
    });

    wrap = wrapEnter.merge(wrap);

    wrap.selectAll('.mr-update-timing-option')
      .classed('active', function(this: Element) {
        return d3_select(this).attr('data-timing') === _updateTiming;
      })
      .attr('aria-checked', function(this: Element) {
        return d3_select(this).attr('data-timing') === _updateTiming ? 'true' : 'false';
      })
      .attr('disabled', _submitting ? true : null)
      .on('click.mr-timing', function(this: HTMLElement, d3_event: Event) {
        d3_event.preventDefault();
        if (_submitting) return;
        const next = d3_select(this).attr('data-timing') as MapRouletteUpdateTiming;
        if (next !== 'with_save' && next !== 'right_away') return;
        if (next === _updateTiming) return;
        _updateTiming = next;
        setMapRouletteUpdateTiming(next);
        refreshSaveArea();
      });
  }

  function optionalComment(selection: any): void {
    let comment = selection.selectAll('.mr-optional-comment').data([0]);

    const commentEnter = comment
      .enter()
      .append('div')
      .attr('class', 'mr-optional-comment');

    commentEnter
      .append('label')
      .attr('for', 'mr-optional-comment-input')
      .text(t('map_data.layers.maproulette.comment'));

    commentEnter
      .append('textarea')
      .attr('id', 'mr-optional-comment-input')
      .attr('class', 'new-comment-input')
      .call(utilNoAuto)
      .style('resize', 'none')
      .on('input.note-input', changeInput)
      .on('blur.note-input', changeInput);

    commentEnter
      .append('div')
      .attr('class', 'mr-optional-comment-error field-warning')
      .style('display', 'none')
      .text(t('map_data.layers.maproulette.comment_too_long'));

    comment = commentEnter.merge(comment);

    const currentValue = (_qaItem && _qaItem.newComment) || '';
    const tooLong = String(currentValue).length > COMMENT_MAX_LENGTH;

    comment
      .select('.new-comment-input')
      .property('value', currentValue)
      .attr('disabled', _submitting ? true : null)
      .classed('mr-comment-too-long', tooLong);

    comment
      .select('.mr-optional-comment-error')
      .style('display', tooLong ? null : 'none')
      .attr('hidden', tooLong ? null : true);

    function changeInput(this: Element): void {
      if (!_qaItem) return;
      const input = d3_select(this);
      const raw = String(input.property('value') || '');
      const tooLongNow = raw.length > COMMENT_MAX_LENGTH;
      _qaItem = _qaItem.update({ newComment: raw || undefined });
      const mr = services.maproulette;
      if (mr) mr.replaceItem(_qaItem);

      const root = d3_select(this.parentNode as Element);
      input.classed('mr-comment-too-long', tooLongNow);
      root.select('.mr-optional-comment-error')
        .style('display', function() { return tooLongNow ? null : 'none'; })
        .attr('hidden', tooLongNow ? null : true);

      // Refresh action disabled state when the comment crosses the limit.
      editorRoot().select('.mr-save').call(mRSaveButtons);
    }
  }

  function mRSaveButtons(selection: any): void {
    const isSelected =
      _qaItem && String(_qaItem.id) === String(context.selectedErrorID());
    const showCompletion = isSelected && _tagFixReady;

    // Single section label lives on the timing control ("Update MapRoulette").
    selection.selectAll('.mr-completion-heading').remove();

    let buttonSection = selection
      .selectAll('.buttons.mr-actions')
      .data(showCompletion ? [_qaItem] : [], function(d: any) { return d.id; });

    buttonSection.exit().remove();

    const buttonEnter = buttonSection
      .enter()
      .append('div')
      .attr('class', 'buttons mr-actions');

    ACTIONS.forEach(function(action) {
      const btn = buttonEnter
        .append('button')
        .attr('class', `button ${action.className} action`)
        .attr('data-action', action.key);

      btn.append('span')
        .attr('class', 'mr-action-icon')
        .attr('aria-hidden', 'true')
        .html(MAPROULETTE_ACTION_ICONS[action.key]);
      btn.append('span').attr('class', 'mr-action-label');
      btn.append('span').attr('class', 'mr-action-spinner').attr('aria-hidden', 'true');
    });

    buttonSection = buttonSection.merge(buttonEnter);

    // Completion actions are hidden until detail paint finishes; hide Fixed when Accept applies.
    const hideFixed = _tagFixReady && _tagFixHasAccept;
    const commentTooLong = isCommentTooLong();

    ACTIONS.forEach(function(action) {
      const isActive = _submitting && _activeAction === action.key;
      const isFixed = action.key === 'fixed';
      const hide = isFixed && hideFixed;
      const disabled = !_qaItem || _submitting || hide || commentTooLong;

      buttonSection
        .select(`.${action.className}`)
        .classed('hide', hide)
        .attr('disabled', disabled ? true : null)
        .classed('loading', isActive)
        .classed('disabled', disabled)
        .attr('aria-busy', isActive ? 'true' : null)
        .on(`click.${action.key}`, function(this: HTMLElement, _d3_event: any, d: any) {
          if (_submitting || hide || isCommentTooLong()) return;
          this.blur();
          beginAction(d || _qaItem, action);
        })
        .select('.mr-action-label')
        .text(
          isActive
            ? t('map_data.layers.maproulette.submitting')
            : t(`map_data.layers.maproulette.${action.key}`),
        );
    });
  }

  function isCommentTooLong(): boolean {
    if (_updateTiming !== 'right_away') return false;
    const input = editorRoot().select('.new-comment-input');
    if (!input.empty()) {
      return String(input.property('value') || '').length > COMMENT_MAX_LENGTH;
    }
    const stored = _qaItem && _qaItem.newComment ? String(_qaItem.newComment) : '';
    return stored.length > COMMENT_MAX_LENGTH;
  }

  function statusFeedback(selection: any): void {
    const show = _submitting && _activeAction;
    let feedback = selection.selectAll('.mr-submit-status').data(show ? [0] : []);

    feedback.exit().remove();

    const enter = feedback
      .enter()
      .append('div')
      .attr('class', 'mr-submit-status');

    enter.append('span').attr('class', 'mr-submit-status-text');

    feedback = enter.merge(feedback);
    feedback
      .select('.mr-submit-status-text')
      .text(t('map_data.layers.maproulette.submitting_status'));
  }

  function beginAction(d: any, action: { key: ActionKey; status: number }): void {
    if (!d) return;
    if (isCommentTooLong()) return;

    if (_updateTiming === 'with_save') {
      queueOutcome(d, action);
      return;
    }

    d._status = action.status;
    _activeAction = action.key;
    _submitError = null;
    _submitting = true;

    // Refresh UI immediately so the clicked button shows a spinner.
    refreshSaveArea();

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

  function queueOutcome(d: any, action: { key: ActionKey; status: number }): void {
    const mr = services.maproulette;
    if (!mr || typeof mr.earmarkTask !== 'function') {
      finishSubmit({ message: 'MapRoulette service unavailable', status: 0 });
      return;
    }

    mr.earmarkTask(d, action.status, { markLocalDone: true });
    rememberWorkedChallenge(d);
    _submitError = null;
    // Stay on this task: banner + next-step actions (no auto-nav).
    refreshSaveArea();
    dispatch.call('change');
  }

  function finishSubmit(err?: any): void {
    _submitting = false;
    _activeAction = null;
    if (err) _submitError = err;
    refreshSaveArea();
  }

  function submitErrorMessage(err: any): string {
    if (err && err.status === -1) {
      return t('map_data.layers.maproulette.error_submitting_timeout');
    }
    if (err && err.status === -2) {
      return t('map_data.layers.maproulette.error_submitting_inflight');
    }
    if (err && typeof err.status === 'number' && err.status > 0) {
      return t('map_data.layers.maproulette.error_submitting_status', {
        status: String(err.status),
      });
    }
    if (err && (err.name === 'TypeError' || err.message === 'Failed to fetch')) {
      return t('map_data.layers.maproulette.error_submitting_network');
    }
    return t('map_data.layers.maproulette.error_submitting');
  }

  function isAuthError(err: any): boolean {
    if (err && err.status === 401) return true;
    if (err && err.body && err.body.status === 'NotAuthorized') return true;
    return false;
  }

  function submitTask(d: any): void {
    const mr = services.maproulette;
    if (!mr) {
      finishSubmit({ message: 'MapRoulette service unavailable', status: 0 });
      return;
    }

    const commentInput = editorRoot().select('.new-comment-input');
    d.comment = commentInput.empty()
      ? ''
      : commentInput.property('value').trim();
    d.mapRouletteApiKey = _mapRouletteApiKey;

    mr.postUpdate(d, function(err: any) {
      if (err) {
        finishSubmit(err);
        return;
      }

      _submitError = null;
      _submitting = false;
      _activeAction = null;
      rememberWorkedChallenge(d);
      // Stay on this task with resolved banner + next-step actions.
      refreshSaveArea();
      dispatch.call('change');
    }, { timeoutMs: SUBMIT_TIMEOUT_MS });
  }

  /** OSM entity ids linked to this task (ways first when choosing what to select). */
  function snapshotAssociatedElems(d: any): string[] {
    const fromItem = Array.isArray(d.elems) ? d.elems.slice() : [];
    if (fromItem.length) return fromItem;
    return collectOsmEntityIds(d.task, d.task && d.task.title, d);
  }

  /**
   * Select the first associated OSM object that is (or can be) loaded.
   * Prefers ways, then nodes, then relations — matching typical MR tasks.
   */
  function selectAssociatedOsmEntity(elems: string[], done: (selected: boolean) => void): void {
    if (!elems || !elems.length) {
      done(false);
      return;
    }

    const ranked = elems.slice().sort(function(a, b) {
      return entityRank(a) - entityRank(b);
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
      // Not in the graph yet — download then select, or skip to the next id.
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

  function entityRank(id: string): number {
    const ch = id && id.charAt(0);
    if (ch === 'w') return 0;
    if (ch === 'n') return 1;
    if (ch === 'r') return 2;
    return 3;
  }

  function authWarning(selection: any): void {
    const showAuth = _submitError && isAuthError(_submitError);
    const showGeneric = _submitError && !showAuth;

    let warning = selection.selectAll('.mr-auth-warning').data(showAuth ? [0] : []);

    warning.exit()
      .transition()
      .duration(200)
      .style('opacity', 0)
      .remove();

    const warningEnter = warning.enter()
      .append('div')
      .attr('class', 'mr-auth-warning field-warning')
      .style('opacity', 0);

    warningEnter
      .call(svgIcon('#iD-icon-alert', 'inline'));

    warningEnter.append('strong')
      .text(t('map_data.layers.maproulette.auth_error_title'));

    warningEnter.append('p')
      .text(t('map_data.layers.maproulette.auth_error_instructions'));

    const steps = warningEnter.append('ol');

    const step1 = steps.append('li');
    step1.append('a')
      .attr('href', 'https://maproulette.org/user/profile#apikey')
      .attr('target', '_blank')
      .attr('rel', 'noopener')
      .text(t('map_data.layers.maproulette.auth_error_link'));

    steps.append('li')
      .text(t('map_data.layers.maproulette.auth_error_step2'));

    steps.append('li')
      .text(t('map_data.layers.maproulette.auth_error_step3'));

    warningEnter
      .transition()
      .duration(200)
      .style('opacity', 1);

    let genericWarning = selection.selectAll('.mr-generic-warning').data(showGeneric ? [0] : []);

    genericWarning.exit()
      .transition()
      .duration(200)
      .style('opacity', 0)
      .remove();

    const genericEnter = genericWarning.enter()
      .append('div')
      .attr('class', 'mr-generic-warning field-warning')
      .style('opacity', 0);

    genericEnter
      .call(svgIcon('#iD-icon-alert', 'inline'));

    genericEnter.append('span');

    genericEnter
      .transition()
      .duration(200)
      .style('opacity', 1);

    genericWarning
      .merge(genericEnter)
      .select('span')
      .text(submitErrorMessage(_submitError));
  }

  render.error = function(val?: any) {
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

  return utilRebind(render, dispatch, 'on');
}
