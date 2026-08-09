import { select as d3_select } from 'd3-selection';

import { t } from '../core/localizer';
import { services } from '../services';
import { MAPROULETTE_ACTION_ICONS } from '../svg/maproulette_marker';
import { uiTooltip } from './tooltip';


/**
 * Full-width “Resolve with upload” toggle (Fixed-adjacent outline button).
 * Shared by the MapRoulette task panel and the entity-inspector MR section.
 */
export function uiMapRouletteEarmarkToggle(context: any) {
  let _qaItem: any;
  let _onChange: (() => void) | null = null;

  function render(selection: any): void {
    const mr = services.maproulette;
    const item = _qaItem;
    const shown = !!(item && item.id && mr);

    let wrap = selection
      .selectAll('.mr-earmark-wrap')
      .data(shown ? [item] : [], function(d: any) { return d.id; });

    wrap.exit().remove();

    const wrapEnter = wrap
      .enter()
      .append('div')
      .attr('class', 'mr-earmark-wrap');

    wrap = wrapEnter.merge(wrap);

    wrap.each(function(this: Element, d: any) {
      const root = d3_select(this);
      const checked = !!(mr && mr.isEarmarked && mr.isEarmarked(d.id));

      let btn = root.selectAll('button.mr-earmark-button')
        .data([d]);

      const btnEnter = btn
        .enter()
        .append('button')
        .attr('type', 'button')
        .attr('class', 'button mr-earmark-button')
        .call((uiTooltip() as any)
          .title(() => t.append('map_data.layers.maproulette.resolve_with_upload_tooltip'))
          .placement('bottom'));

      btnEnter
        .append('span')
        .attr('class', 'mr-earmark-icon')
        .attr('aria-hidden', 'true')
        .html(MAPROULETTE_ACTION_ICONS.fixed);

      btnEnter
        .append('span')
        .attr('class', 'mr-earmark-label');

      btn = btnEnter.merge(btn as any) as any;

      btn
        .classed('active', checked)
        .attr('aria-pressed', checked ? 'true' : 'false')
        .on('click.mr-earmark', function(d3_event: Event) {
          d3_event.preventDefault();
          d3_event.stopPropagation();
          if (!mr) return;
          if (mr.isEarmarked(d.id)) {
            mr.unearmarkTask(d.id);
          } else {
            // Keep optional comment from the pin panel if present.
            const commentInput = context.container().select('.mr-editor .new-comment-input');
            if (!commentInput.empty()) {
              const val = commentInput.property('value').trim();
              if (val) d.newComment = val;
            }
            mr.earmarkTask(d);
          }
          render(selection);
          if (_onChange) _onChange();
        })
        .select('.mr-earmark-label')
        .text(t('map_data.layers.maproulette.resolve_with_upload'));
    });
  }

  render.task = function(val?: any) {
    if (!arguments.length) return _qaItem;
    _qaItem = val;
    return render;
  };

  render.onChange = function(val?: (() => void) | null) {
    if (!arguments.length) return _onChange;
    _onChange = val || null;
    return render;
  };

  return render;
}
