import { select as d3_select } from 'd3-selection';

import { t } from '../core/localizer';
import { goToNearbyMapRouletteTask } from '../util/maproulette_nearby';
import {
  classifySubmitError,
  COMPLETION_ACTIONS,
  isAuthError,
  isCommentTooLong,
  type CompletionAction,
  type CompletionActionKey,
} from '../util/maproulette_completion';
import type { MapRouletteUpdateTiming } from '../util/maproulette_update_timing';
import { svgIcon } from '../svg/icon';
import { MAPROULETTE_ACTION_ICONS } from '../svg/maproulette_marker';
import { utilNoAuto } from '../util';
import { uiTooltip } from './tooltip';

export interface SaveControlsState {
  qaItem: any;
  submitting: boolean;
  activeAction: CompletionActionKey | null;
  submitError: any;
  tagFixReady: boolean;
  tagFixHasAccept: boolean;
  forcedWithSave: boolean;
  effectiveTiming: MapRouletteUpdateTiming;
  updateTiming: MapRouletteUpdateTiming;
  showCompletionButtons: boolean;
}

export interface SaveControlsDeps {
  context: any;
  getState: () => SaveControlsState;
  beginAction: (d: any, action: CompletionAction) => void;
  onTimingChange: (timing: MapRouletteUpdateTiming) => void;
  onCommentInput: (comment: string | undefined) => void;
  refreshActionButtons: (saveRoot: any) => void;
  isCommentTooLongForSubmit: (saveRoot?: any) => boolean;
}

export function renderSaveControls(selection: any, deps: SaveControlsDeps): void {
  const rightAway = deps.getState().effectiveTiming === 'right_away';
  selection.call((sel: any) => renderUpdateTimingToggle(sel, deps));
  if (rightAway) {
    selection.call((sel: any) => renderOptionalComment(sel, deps));
  } else {
    selection.selectAll('.mr-optional-comment').remove();
  }
  selection
    .call((sel: any) => renderActionButtons(sel, deps))
    .call((sel: any) => renderSubmitStatus(sel, deps))
    .call((sel: any) => renderSubmitWarnings(sel, deps));
}

export function renderGoToNearby(
  root: any,
  qaItem: any,
  context: any,
  info: { showGoToNearby: boolean; hasNearby: boolean },
): void {
  let goToHost = root.selectAll('.mr-go-to-nearby-host')
    .data(info.showGoToNearby ? [qaItem] : []);
  goToHost.exit().remove();
  goToHost = goToHost.enter()
    .append('div')
    .attr('class', 'mr-go-to-nearby-host')
    .merge(goToHost);
  if (!info.showGoToNearby || !qaItem) return;
  let btn = goToHost.selectAll('button.mr-go-to-nearby')
    .data([qaItem]);
  btn = btn.enter()
    .append('button')
    .attr('type', 'button')
    .attr('class', 'button mr-go-to-nearby')
    .text(t('map_data.layers.maproulette.nearbyTask.go_to'))
    .on('click', function(this: HTMLElement, d3_event: Event) {
      d3_event.preventDefault();
      this.blur();
      if (d3_select(this).classed('disabled')) return;
      goToNearbyMapRouletteTask(context, qaItem.id);
    })
    .merge(btn);
  btn
    .classed('disabled', !info.hasNearby)
    .attr('disabled', info.hasNearby ? null : true);
}

function renderUpdateTimingToggle(selection: any, deps: SaveControlsDeps): void {
  const state = deps.getState();
  const forcedWithSave = state.forcedWithSave;
  const timing = state.effectiveTiming;
  let wrap = selection.selectAll('.mr-update-timing').data([0]);
  const wrapEnter = wrap
    .enter()
    .append('div')
    .attr('class', 'mr-update-timing');

  wrapEnter.append('h3')
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
          forcedWithSave
            ? 'map_data.layers.maproulette.update_timing_tag_fix_tooltip'
            : value === 'with_save'
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
      return d3_select(this).attr('data-timing') === timing;
    })
    .attr('aria-checked', function(this: Element) {
      return d3_select(this).attr('data-timing') === timing ? 'true' : 'false';
    })
    .attr('disabled', (state.submitting || forcedWithSave) ? true : null)
    .on('click.mr-timing', function(this: HTMLElement, d3_event: Event) {
      d3_event.preventDefault();
      const current = deps.getState();
      if (current.submitting || current.forcedWithSave) return;
      const next = d3_select(this).attr('data-timing') as MapRouletteUpdateTiming;
      if (next !== 'with_save' && next !== 'right_away') return;
      if (next === current.updateTiming) return;
      deps.onTimingChange(next);
    });
}

function renderOptionalComment(selection: any, deps: SaveControlsDeps): void {
  const state = deps.getState();
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

  const currentValue = (state.qaItem && state.qaItem.newComment) || '';
  const tooLong = isCommentTooLong(String(currentValue));

  comment
    .select('.new-comment-input')
    .property('value', currentValue)
    .attr('disabled', state.submitting ? true : null)
    .classed('mr-comment-too-long', tooLong);

  comment
    .select('.mr-optional-comment-error')
    .style('display', tooLong ? null : 'none')
    .attr('hidden', tooLong ? null : true);

  function changeInput(this: Element): void {
    const input = d3_select(this);
    const raw = String(input.property('value') || '');
    const tooLongNow = isCommentTooLong(raw);
    deps.onCommentInput(raw || undefined);

    const root = d3_select(this.parentNode as Element);
    input.classed('mr-comment-too-long', tooLongNow);
    root.select('.mr-optional-comment-error')
      .style('display', function() { return tooLongNow ? null : 'none'; })
      .attr('hidden', tooLongNow ? null : true);

    const saveRoot = d3_select((this as Element).closest('.mr-save') as Element);
    deps.refreshActionButtons(saveRoot);
  }
}

export function renderActionButtons(selection: any, deps: SaveControlsDeps): void {
  const state = deps.getState();
  const showButtons = state.showCompletionButtons;

  let buttonSection = selection
    .selectAll('.buttons.mr-actions')
    .data(showButtons ? [state.qaItem] : [], function(d: any) { return d.id; });

  buttonSection.exit().remove();

  const buttonEnter = buttonSection
    .enter()
    .append('div')
    .attr('class', 'buttons mr-actions');

  COMPLETION_ACTIONS.forEach(function(action) {
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

  const hideFixed = state.tagFixReady && state.tagFixHasAccept;
  const commentTooLong = deps.isCommentTooLongForSubmit(selection);

  COMPLETION_ACTIONS.forEach(function(action) {
    const isActive = state.submitting && state.activeAction === action.key;
    const isFixed = action.key === 'fixed';
    const hide = isFixed && hideFixed;
    const disabled = !state.qaItem || state.submitting || hide || commentTooLong;

    buttonSection
      .select(`.${action.className}`)
      .classed('hide', hide)
      .attr('disabled', disabled ? true : null)
      .classed('loading', isActive)
      .classed('disabled', disabled)
      .attr('aria-busy', isActive ? 'true' : null)
      .on(`click.${action.key}`, function(this: HTMLElement) {
        const current = deps.getState();
        if (current.submitting || hide || deps.isCommentTooLongForSubmit(selection)) return;
        this.blur();
        deps.beginAction(current.qaItem, action);
      })
      .select('.mr-action-label')
      .text(
        isActive
          ? t('map_data.layers.maproulette.submitting')
          : t(`map_data.layers.maproulette.${action.key}`),
      );
  });
}

function renderSubmitStatus(selection: any, deps: SaveControlsDeps): void {
  const state = deps.getState();
  const show = state.submitting && state.activeAction;
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

function submitErrorMessage(err: any): string {
  const kind = classifySubmitError(err);
  if (kind === 'timeout') {
    return t('map_data.layers.maproulette.error_submitting_timeout');
  }
  if (kind === 'inflight') {
    return t('map_data.layers.maproulette.error_submitting_inflight');
  }
  if (kind === 'http') {
    return t('map_data.layers.maproulette.error_submitting_status', {
      status: String(err.status),
    });
  }
  if (kind === 'network') {
    return t('map_data.layers.maproulette.error_submitting_network');
  }
  return t('map_data.layers.maproulette.error_submitting');
}

function renderSubmitWarnings(selection: any, deps: SaveControlsDeps): void {
  const state = deps.getState();
  const showAuth = state.submitError && isAuthError(state.submitError);
  const showGeneric = state.submitError && !showAuth;

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
    .text(submitErrorMessage(state.submitError));
}
