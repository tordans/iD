import { t } from '../../util/locale';
import { svgIcon } from '../../svg/icon';
import { uiTooltip } from '../tooltip';

export function uiToolRepeatAdd(context) {

    var key = t('toolbar.repeat.key');

    var tool = {
        id: 'repeat_add',
        label: t('toolbar.repeat.title'),
        iconName: 'iD-icon-repeat'
    };

    var button;

    var tooltipBehavior = uiTooltip()
        .placement('bottom')
        .scrollContainer(context.container().select('.top-toolbar'));

    tool.render = function(selection) {

        var mode = context.mode();
        var geom = mode.id.indexOf('point') !== -1 ? 'point' : 'way';

        tooltipBehavior
            .title(function() {
                return t.append('toolbar.repeat.tooltip.' + geom, {
                    feature: appendStrong(mode.title)
                });
            })
            .keys([key]);

        button = selection
            .selectAll('.bar-button')
            .data([0]);

        button = button
            .enter()
            .append('button')
            .attr('class', 'bar-button wide')
            .classed('active', mode.repeatAddedFeature())
            .attr('tabindex', -1)
            .call(tooltipBehavior)
            .on('click', function() {
                toggleRepeat();
            })
            .call(svgIcon('#' + tool.iconName))
            .merge(button);
    };

    function toggleRepeat() {
        var mode = context.mode();
        mode.repeatAddedFeature(!mode.repeatAddedFeature());
        button.classed('active', mode.repeatAddedFeature());
    }

    tool.allowed = function() {
        var mode = context.mode();
        if (mode.id === 'add-point' || mode.id === 'add-line' || mode.id === 'add-area') return true;
        return (mode.id === 'draw-line' || mode.id === 'draw-area') && !mode.isContinuing;
    };

    tool.install = function() {
        context.keybinding()
            .on(key, toggleRepeat, true);
    };

    tool.uninstall = function() {
        context.keybinding()
            .off(key, true);

        button = null;
    };

    function appendStrong(label) {
        return function(selection) {
            var strong = selection.append('strong');
            if (typeof label === 'function') {
                strong.call(label);
            } else {
                strong.text(label || '');
            }
        };
    }

    return tool;
}
