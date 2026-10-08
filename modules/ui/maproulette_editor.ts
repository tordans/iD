import { dispatch as d3_dispatch } from 'd3-dispatch';

import { t } from '../core/localizer';
import { services } from '../services';
import { modeBrowse } from '../modes/browse';
import { svgIcon } from '../svg/icon';
import { taskDoneStateOf } from '../util/maproulette_status';
import { uiMapRouletteDetails } from './maproulette_details';
import { uiMapRouletteCompletion } from './maproulette_completion';
import { uiViewOnMapRoulette } from './view_on_maproulette';

import { utilRebind } from '../util';

export function uiMapRouletteEditor(context: any) {
  const dispatch = d3_dispatch('change');

  let _qaItem: any;
  const _details = uiMapRouletteDetails(context);
  const _completion = uiMapRouletteCompletion(context);

  function taskDoneState(): { isResolved: boolean; isQueued: boolean } {
    const isSelected =
      _qaItem && String(_qaItem.id) === String(context.selectedErrorID());
    return taskDoneStateOf(services.maproulette, isSelected ? _qaItem : null);
  }

  function completionOnChange(): void {
    dispatch.call('change');
  }

  function callCompletion(root: any): void {
    _completion
      .task(_qaItem)
      .mode('panel')
      .onChange(completionOnChange);
    root.call(_completion);
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
      .call(_details.task(_qaItem).done(isDone))
      .call(callCompletion);

    const footer = selection.selectAll('.footer').data([0]);

    footer
      .enter()
      .append('div')
      .attr('class', 'footer')
      .merge(footer)
      .call(uiViewOnMapRoulette().what(_qaItem));
  }

  render.error = function(val?: any) {
    if (!arguments.length) return _qaItem;
    _qaItem = val;
    return render;
  };

  return utilRebind(render, dispatch, 'on');
}
