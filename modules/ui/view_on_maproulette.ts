import { t } from '../core/localizer';
import { services } from '../services';
import { svgIcon } from '../svg/icon';
import { QAItem } from '../osm';

export function uiViewOnMapRoulette() {
  let _qaItem: any;

  function viewOnMapRoulette(selection: any): void {
    let url: string | undefined;
    if (services.maproulette && _qaItem instanceof QAItem) {
      url = services.maproulette.issueURL(_qaItem);
    }

    const footer = selection
      .selectAll('.view-on-maproulette')
      .data(url ? [url] : []);

    footer.exit().remove();

    const linkEnter = footer
      .enter()
      .append('a')
      .attr('class', 'view-on-maproulette')
      .attr('target', '_blank')
      .attr('rel', 'noopener')
      .attr('href', function(d: string) { return d; })
      .call(svgIcon('#iD-icon-out-link', 'inline'));

    linkEnter
      .append('span')
      .call(t.append('inspector.view_on_maproulette'));
  }

  viewOnMapRoulette.what = function(val?: any) {
    if (!arguments.length) return _qaItem;
    _qaItem = val;
    return viewOnMapRoulette;
  };

  return viewOnMapRoulette;
}
