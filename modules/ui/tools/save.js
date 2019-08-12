import { interpolateRgb as d3_interpolateRgb } from 'd3-interpolate';

import { t } from '../../core/localizer';
import { modeSave } from '../../modes';
import { svgIcon } from '../../svg';
import { uiCmd } from '../cmd';
import { uiTooltip } from '../tooltip';


export function uiToolSave(context) {

    var tool = {
        id: 'save',
        label: t.html('save.title'),
        userToggleable: false
    };

    var button = null;
    var tooltipBehavior = null;
    var history = context.history();
    var key = uiCmd('⌘S');
    var _numChanges;

    function isSaving() {
        var mode = context.mode();
        return mode && mode.id === 'save';
    }

    function isDisabled() {
        return !_numChanges || isSaving();
    }

    function save(d3_event) {
        d3_event.preventDefault();
        if (!context.inIntro() && !isSaving() && history.hasChanges()) {
            context.enter(modeSave(context));
        }
    }

    function bgColor(count) {
        var step;
        if (count === 0) {
            return null;
        } else if (count <= 50) {
            step = count / 50;
            return d3_interpolateRgb('#fff0', '#ff08')(step);  // transparent -> yellow
        } else {
            step = Math.min((count - 50) / 50, 1.0);
            return d3_interpolateRgb('#ff08', '#f008')(step);  // yellow -> red
        }
    }

    function updateCount() {
        var val = history.difference().summary().length;
        if (val === _numChanges) return;

        _numChanges = val;

        if (tooltipBehavior) {
            tooltipBehavior
                .title(() => t.append(val > 0 ? 'save.help' : 'save.no_changes'))
                .keys([key]);
        }

        if (button) {
            button
                .classed('disabled', isDisabled())
                .style('--accent-color', bgColor(_numChanges));

            button.select('span.count')
                .html(val);
        }
    }


    tool.render = function(selection) {
        if (!tooltipBehavior) {
            tooltipBehavior = uiTooltip()
                .placement('bottom')
                .title(() => t.append('save.no_changes'))
                .keys([key])
                .scrollContainer(context.container().select('.top-toolbar'));
        }

        var lastPointerUpType;

        button = selection
            .selectAll('.bar-button')
            .data([0]);

        var buttonEnter = button
            .enter()
            .append('button')
            .attr('class', 'save disabled bar-button')
            .on('pointerup', function(d3_event) {
                lastPointerUpType = d3_event.pointerType;
            })
            .on('click', function(d3_event) {
                save(d3_event);

                if (_numChanges === 0 && (
                    lastPointerUpType === 'touch' ||
                    lastPointerUpType === 'pen')
                ) {
                    // there are no tooltips for touch interactions so flash feedback instead
                    context.ui().flash
                        .duration(2000)
                        .iconName('#iD-icon-save')
                        .iconClass('disabled')
                        .label(t.append('save.no_changes'))();
                }
                lastPointerUpType = null;
            })
            .call(tooltipBehavior);

        buttonEnter
            .call(svgIcon('#iD-icon-save'));

        buttonEnter
            .append('span')
            .attr('class', 'count')
            .attr('aria-hidden', 'true')
            .text('0');

        button = buttonEnter.merge(button);

        updateCount();
    };

    var disallowedModes = new Set([
        'save',
        'add-point',
        'add-line',
        'add-area',
        'draw-line',
        'draw-area'
    ]);

    tool.allowed = function() {
        return !disallowedModes.has(context.mode().id);
    };

    tool.install = function() {
        context.keybinding()
            .on(key, save, true);

        context.history()
            .on('change.save', updateCount);

        context
            .on('enter.save', function() {
                if (button) {
                    button
                        .classed('disabled', isDisabled());

                    if (isSaving()) {
                        button.call(tooltipBehavior.hide);
                    }
                }
            });
    };


    tool.uninstall = function() {

        _numChanges = null;

        context.keybinding()
            .off(key, true);

        context.history()
            .on('change.save', null);

        context
            .on('enter.save', null);

        button = null;
        tooltipBehavior = null;
    };

    return tool;
}
