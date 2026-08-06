import { dispatch as d3_dispatch } from 'd3-dispatch';
import { select as d3_select } from 'd3-selection';

import { t } from '../core/localizer';
import { services } from '../services';
import { modeBrowse } from '../modes/browse';
import { modeSelect } from '../modes/select';
import { modeSelectError } from '../modes/select_error';
import { svgIcon } from '../svg/icon';
import { MAPROULETTE_ACTION_ICONS } from '../svg/maproulette_marker';
import { uiMapRouletteDetails } from './maproulette_details';
import { uiMapRouletteEarmarkToggle } from './maproulette_earmark_toggle';
import { uiMapRouletteTagFix } from './maproulette_tag_fix';
import { uiViewOnMapRoulette } from './view_on_maproulette';

import { utilNoAuto, utilRebind } from '../util';
import { collectOsmEntityIds } from '../util/maproulette_osm_ids';
import { isMapRouletteTagFix, matchMapRouletteTagFixes } from '../util/maproulette_cooperative';

/** How long a MapRoulette submit may run before we abort and show a timeout error. */
const SUBMIT_TIMEOUT_MS = 30000;

type ActionKey = 'fixed' | 'alreadyFixed' | 'notAnIssue' | 'cantComplete';

/** Order matches MapRoulette V4 TaskActions (2×2: Fixed, Already Fixed / Not an Issue, Can't Complete). */
const ACTIONS: Array<{ key: ActionKey; status: number; className: string }> = [
  { key: 'fixed', status: 1, className: 'fixedIt-button' },
  { key: 'alreadyFixed', status: 5, className: 'alreadyFixed-button' },
  { key: 'notAnIssue', status: 2, className: 'notAnIssue-button' },
  { key: 'cantComplete', status: 6, className: 'cantComplete-button' },
];

export function uiMapRouletteEditor(context: any) {
  const dispatch = d3_dispatch('change');

  let _qaItem: any;
  let _mapRouletteApiKey: string | undefined;
  let _goToNearbyTask = true;
  let _submitError: any = null;
  let _submitting = false;
  let _activeAction: ActionKey | null = null;

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

    const editor = body.selectAll('.mr-editor').data([0]);
    editor
      .enter()
      .append('div')
      .attr('class', 'modal-section mr-editor')
      .merge(editor)
      .call(uiMapRouletteDetails(context).task(_qaItem))
      .call(mRSaveSection);

    const footer = selection.selectAll('.footer').data([0]);

    footer
      .enter()
      .append('div')
      .attr('class', 'footer')
      .merge(footer)
      .call(uiViewOnMapRoulette().what(_qaItem));
  }

  function mRSaveSection(sel: any): void {
    const isSelected =
      _qaItem && String(_qaItem.id) === String(context.selectedErrorID());
    const isShown = !!_qaItem && isSelected;
    const mr = services.maproulette;
    const isResolved = !!(
      isShown && mr && mr.isRecentlyResolved && mr.isRecentlyResolved(_qaItem)
    );
    let saveSection = sel
      .selectAll('.mr-save')
      .data(isShown ? [_qaItem] : [], function(d: any) { return d.id; });

    saveSection.exit().remove();

    const saveEnter = saveSection
      .enter()
      .append('div')
      .attr('class', 'mr-save save-section cf');

    saveSection = saveEnter.merge(saveSection);
    saveSection.classed('mr-resolved', isResolved);

    if (isResolved) {
      saveSection
        .call(resolvedBanner)
        .selectAll('.mr-earmark-wrap, .nearby-task-toggle, .mr-optional-comment, .mr-tag-fix, .mr-completion-heading, .buttons.mr-actions, .mr-status-feedback, .mr-auth-warning')
        .remove();
      return;
    }

    saveSection
      .selectAll('.mr-resolved-banner')
      .remove();

    saveSection
      .call(earmarkToggle)
      .call(nearbyTaskToggle)
      .call(optionalComment)
      .call(tagFixSection)
      .call(mRSaveButtons)
      .call(statusFeedback)
      .call(authWarning);
  }

  function tagFixSection(selection: any): void {
    selection.call(
      uiMapRouletteTagFix(context)
        .mode('panel')
        .task(_qaItem)
        .onAccepted(function() {
          editorRoot().call(mRSaveSection);
          dispatch.call('change');
        })
        .onPainted(function() {
          selection.call(mRSaveButtons);
        }),
    );
  }

  function resolvedBanner(selection: any): void {
    let banner = selection.selectAll('.mr-resolved-banner').data([0]);
    const enter = banner
      .enter()
      .append('div')
      .attr('class', 'mr-resolved-banner notice');
    enter.append('h3');
    enter.append('p');
    banner = enter.merge(banner);
    banner.select('h3').text(t('map_data.layers.maproulette.resolved_title'));
    banner.select('p').text(t('map_data.layers.maproulette.resolved_message'));
  }

  function earmarkToggle(selection: any): void {
    selection.call(uiMapRouletteEarmarkToggle(context).task(_qaItem));
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
      .attr('placeholder', t('map_data.layers.maproulette.inputPlaceholder'))
      .attr('maxlength', 1000)
      .call(utilNoAuto)
      .style('resize', 'none')
      .on('input.note-input', changeInput)
      .on('blur.note-input', changeInput);

    comment = commentEnter.merge(comment);

    comment
      .select('.new-comment-input')
      .property('value', (_qaItem && _qaItem.newComment) || '')
      .attr('disabled', _submitting ? true : null);

    function changeInput(this: Element): void {
      if (!_qaItem) return;
      const input = d3_select(this);
      const val = input.property('value').trim() || undefined;
      _qaItem = _qaItem.update({ newComment: val });
      const mr = services.maproulette;
      if (mr) mr.replaceItem(_qaItem);
    }
  }

  function mRSaveButtons(selection: any): void {
    const isSelected =
      _qaItem && String(_qaItem.id) === String(context.selectedErrorID());

    let heading = selection
      .selectAll('.mr-completion-heading')
      .data(isSelected ? [0] : []);
    heading.exit().remove();
    heading
      .enter()
      .append('h4')
      .attr('class', 'mr-completion-heading')
      .text(t('map_data.layers.maproulette.completion_heading'));

    let buttonSection = selection
      .selectAll('.buttons.mr-actions')
      .data(isSelected ? [_qaItem] : [], function(d: any) { return d.id; });

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

    const taskForFix = _qaItem && (_qaItem.task || _qaItem);
    const hideFixed = !!(
      taskForFix
      && isMapRouletteTagFix(taskForFix)
      && matchMapRouletteTagFixes(context, taskForFix).matched.length > 0
    );

    ACTIONS.forEach(function(action) {
      const isActive = _submitting && _activeAction === action.key;
      const disabled = !_qaItem || _submitting;
      const hide = action.key === 'fixed' && hideFixed;

      buttonSection
        .select(`.${action.className}`)
        .classed('hide', hide)
        .attr('disabled', disabled || hide ? true : null)
        .classed('loading', isActive)
        .classed('disabled', disabled || hide)
        .attr('aria-busy', isActive ? 'true' : null)
        .on(`click.${action.key}`, function(this: HTMLElement, _d3_event: any, d: any) {
          if (_submitting || hide) return;
          this.blur();
          beginSubmit(d || _qaItem, action);
        })
        .select('.mr-action-label')
        .text(
          isActive
            ? t('map_data.layers.maproulette.submitting')
            : t(`map_data.layers.maproulette.${action.key}`),
        );
    });
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

  function beginSubmit(d: any, action: { key: ActionKey; status: number }): void {
    if (!d) return;

    d._status = action.status;
    _activeAction = action.key;
    _submitError = null;
    _submitting = true;

    // Refresh UI immediately so the clicked button shows a spinner.
    editorRoot().call(mRSaveSection);

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

  function finishSubmit(err?: any): void {
    _submitting = false;
    _activeAction = null;
    if (err) _submitError = err;
    editorRoot().call(mRSaveSection);
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

    // Snapshot before postUpdate → removeItem clears the reverse index.
    // Prefer elems already collected on the QAItem; fall back to title/props.
    const associatedElems = snapshotAssociatedElems(d);

    mr.postUpdate(d, function(err: any) {
      if (err) {
        finishSubmit(err);
        return;
      }

      _submitError = null;
      _submitting = false;
      _activeAction = null;
      // Drop the closed task from the editor so a late details-render cannot
      // keep showing “Loading task details…” for something that no longer exists.
      _qaItem = null;

      afterSuccessfulSubmit(mr, d, associatedElems);
    }, { timeoutMs: SUBMIT_TIMEOUT_MS });
  }

  /** OSM entity ids linked to this task (ways first when choosing what to select). */
  function snapshotAssociatedElems(d: any): string[] {
    const fromItem = Array.isArray(d.elems) ? d.elems.slice() : [];
    if (fromItem.length) return fromItem;
    return collectOsmEntityIds(d.task, d.task && d.task.title, d);
  }

  /**
   * After a task is closed: nearby MR task (if enabled), else the first
   * associated OSM way/entity still available, else browse with a clear sidebar.
   */
  function afterSuccessfulSubmit(mr: any, closed: any, elems: string[]): void {
    if (_goToNearbyTask && typeof mr.getNearestItem === 'function') {
      const next = mr.getNearestItem(context.map().center(), closed && closed.id);
      if (next && next.id) {
        context.enter(modeSelectError(context, next.id, 'maproulette'));
        dispatch.call('change', closed);
        return;
      }
    }

    selectAssociatedOsmEntity(elems, function(didSelect: boolean) {
      if (!didSelect) {
        context.enter(modeBrowse(context));
      }
      dispatch.call('change', closed);
    });
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

  function nearbyTaskToggle(selection: any): void {
    const section = selection.selectAll('.checkbox-section').data([0]);
    const enter = section
      .enter()
      .append('div')
      .attr('class', 'checkbox-section modal-section');

    enter
      .append('input')
      .attr('type', 'checkbox')
      .attr('id', 'nearbyTaskCheckbox')
      .property('checked', _goToNearbyTask)
      .on('change', function(this: HTMLInputElement) {
        _goToNearbyTask = !!this.checked;
      });

    enter
      .append('label')
      .attr('for', 'nearbyTaskCheckbox')
      .text(t('map_data.layers.maproulette.nearbyTask.title'));

    section
      .merge(enter)
      .select('input')
      .property('checked', _goToNearbyTask)
      .attr('disabled', _submitting ? true : null);
  }

  render.error = function(val?: any) {
    if (!arguments.length) return _qaItem;
    _qaItem = val;
    _submitError = null;
    _submitting = false;
    _activeAction = null;
    return render;
  };

  return utilRebind(render, dispatch, 'on');
}
