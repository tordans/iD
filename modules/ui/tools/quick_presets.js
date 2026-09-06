import { debounce } from 'es-toolkit';

import { drag as d3_drag } from 'd3-drag';
import { select as d3_select, selectAll as d3_selectAll } from 'd3-selection';

import { modeAddArea, modeAddLine, modeAddPoint, modeBrowse } from '../../modes';
import { t, localizer } from '../../util/locale';
import { utilSafeClassName } from '../../util/util';
import { uiPresetIcon } from '../preset_icon';
import { uiTooltip } from '../tooltip';


export function uiToolQuickPresets(context) {

    var selection = d3_select(null);

    var tool = {
        itemClass: 'modes'
    };

    tool.itemsToDraw = function() {
        // override in subclass
        return [];
    };

    function enabled(d) {
        return d.id && context.editable();
    }

    function toggleMode(d) {
        if (!enabled(d)) return;

        if (context.mode().id.includes('draw') && context.mode().finish) {
            // gracefully complete the feature currently being drawn
            var didFinish = context.mode().finish();
            if (!didFinish) return;
        }

        if (context.mode().id.includes('add') && d.button === context.mode().button) {
            context.enter(modeBrowse(context));
        } else {
            if (d.preset &&
                // don't set a recent as most recent to avoid reordering buttons
                !d.isRecent()) {
                context.presets().setMostRecent(d.preset);
            }
            context.enter(d);
        }
    }

    tool.render = function(sel) {
        selection = sel;
        update();
    };

    tool.willUpdate = function() {};

    function update() {

        tool.willUpdate();

        var items = tool.itemsToDraw();

        var modes = items.map(function(d) {
            var presetName = d.preset.name().split(' – ')[0];
            var markerClass = 'add-preset add-preset-' + d.preset.safeid
                + ' add-' + d.source; // replace spaces with underscores to avoid css interpretation
            if (d.preset.isFallback()) {
                markerClass += ' add-generic-preset';
            }

            var geometry = d.preset.defaultAddGeometry(context);

            var protoMode = Object.assign({}, d);  // shallow copy
            protoMode.geometry = geometry;
            protoMode.button = markerClass;
            protoMode.title = presetName;

            if (geometry) {
                protoMode.description = t.append('modes.add_preset.title', {
                    feature: appendStrong(presetName)
                });
            } else {
                // 2.43 returns a feature-key string (or false); freeze returned the rule object.
                var hiddenPresetFeaturesId = context.features().isHiddenPreset(d.preset, d.preset.geometry[0]);
                var isAutoHidden = hiddenPresetFeaturesId && context.features().autoHidden(hiddenPresetFeaturesId);
                var tooltipIdSuffix = isAutoHidden ? 'zoom' : 'manual';
                protoMode.description = t.append('inspector.hidden_preset.' + tooltipIdSuffix, {
                    features: hiddenPresetFeaturesId ? t('feature.' + hiddenPresetFeaturesId + '.description') : ''
                });
                protoMode.key = null;
            }

            var mode;
            switch (geometry) {
                case 'point':
                case 'vertex':
                    mode = modeAddPoint(context, protoMode);
                    break;
                case 'line':
                    mode = modeAddLine(context, protoMode);
                    break;
                case 'area':
                    mode = modeAddArea(context, protoMode);
            }

            if (protoMode.key && mode) {
                context.keybinding().off(protoMode.key);
                context.keybinding().on(protoMode.key, function() {
                     toggleMode(mode);
                });
            }

            return mode || protoMode;
        });

        var buttons = selection.selectAll('button.add-button')
            .data(modes, function(d) { return d.button; })
            .order();

        // exit
        buttons.exit()
            .remove();

        // enter
        var buttonsEnter = buttons.enter()
            .append('button')
            .attr('tabindex', -1)
            .attr('class', function(d) {
                return d.button + ' add-button bar-button';
            })
            .attr('id', function(d) {
                return utilSafeClassName(d.button);
            })
            .on('click.mode-buttons', function(d3_event, d) {
                d3_event.preventDefault();
                if (d3_select(this).classed('disabled')) return;
                if (suppressClick) return;
                toggleMode(d);
            })
            .call(uiTooltip()
                .placement('bottom')
                .title(function(d) {
                    return d.description;
                })
                .keys(function(d) {
                    return d.key ? [d.key] : null;
                })
                .scrollContainer(context.container().select('.top-toolbar'))
            );

        buttonsEnter
            .each(function(d) {

                var geometry = d.preset.geometry[0];
                if (d.preset.geometry.length !== 1 ||
                    (geometry !== 'area' && geometry !== 'line' && geometry !== 'vertex')) {
                    geometry = null;
                }

                d3_select(this)
                    .call(uiPresetIcon()
                        .geometry(geometry)
                        .preset(d.preset)
                        .sizeClass('small')
                        .pointMarker(true)
                    );
            });

        var scrollNode = d3_select('.top-toolbar').node();
        var dragOrigin, targetData;
        var suppressClick = false;
        var ltr = localizer.textDirection() === 'ltr',
            rtl = !ltr;

        buttonsEnter
            .filter('.add-favorite, .add-recent')
            .call(d3_drag()
            .on('start', function(d3_event) {
                var node = d3_select(this).node();
                dragOrigin = {
                    x: d3_event.x,
                    y: d3_event.y,
                    nodeLeft: node.offsetLeft,
                    nodeTop: node.offsetTop,
                };
                targetData = null;
            })
            .on('drag', function(d3_event, d) {
                var deltaX = d3_event.x - dragOrigin.x,
                    deltaY = d3_event.y - dragOrigin.y;

                var button = d3_select(this);

                if (!button.classed('dragging')) {
                    // haven't committed to dragging yet

                    // don't display drag until dragging beyond a distance threshold
                    if (Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2)) <= 5) return;

                    // setup dragging

                    d3_select(this.parentNode)
                        .insert('div', '#' + button.attr('id'))
                        .attr('class', 'drag-placeholder');

                    button
                        .classed('dragging', true)
                        // must use absolute position so button will display if dragged out of the toolbar
                        .style('position', 'absolute');
                }

                var draggingNode = button.node();
                var eventX = d3_event.x + draggingNode.parentNode.offsetLeft;
                var origLeft = dragOrigin.nodeLeft;

                button
                    .classed('removing', deltaY > 50)
                    .style('left', dragOrigin.nodeLeft + deltaX - scrollNode.scrollLeft + 'px')
                    .style('top', dragOrigin.nodeTop + deltaY + 'px');

                targetData = null;

                d3_selectAll('.top-toolbar button.add-favorite, .top-toolbar button.add-recent')
                    .style('transform', function(d2) {

                        if (d.button === d2.button) return null;

                        // no need to reposition elements if dragging out of toolbar
                        if (deltaY > 50) return null;

                        var node = d3_select(this).node(),
                            nodeLeft = node.offsetLeft,
                            nodeRight = nodeLeft + node.offsetWidth;

                        if ((ltr && nodeLeft > origLeft && eventX > nodeLeft) ||
                            (rtl && nodeLeft < origLeft && eventX < nodeRight)) {

                            if ((ltr && eventX < nodeRight) ||
                                (rtl && eventX > nodeLeft)) {
                                targetData = d2;
                            }
                            return 'translateX(' + (ltr ? '-' : '') + '100%)';

                        } else if ((ltr && nodeLeft < origLeft && eventX < nodeRight) ||
                                   (rtl && nodeLeft > origLeft && eventX > nodeLeft)) {

                            if ((ltr && eventX > nodeLeft) ||
                                (rtl && eventX < nodeRight)) {
                                targetData = d2;
                            }
                            return 'translateX(' + (ltr ? '' : '-') + '100%)';
                        }

                        return null;
                    });
            })
            .on('end', function(d3_event, d) {

                if (!d3_select(this).classed('dragging')) {
                    // click, or movement below the drag threshold.
                    // d3-drag v3 preventDefault()s mouseup, so the click event
                    // often never fires (freeze relied on d3-drag v1 still firing it).
                    toggleMode(d);
                    suppressClick = true;
                    setTimeout(function() { suppressClick = false; }, 0);
                    return;
                }

                d3_selectAll('.top-toolbar .drag-placeholder')
                    .remove();

                d3_select(this)
                    .classed('dragging', false)
                    .classed('removing', false)
                    .style('position', null);

                d3_selectAll('.top-toolbar button.add-favorite, .top-toolbar button.add-recent')
                    .style('transform', null);

                var deltaY = d3_event.y - dragOrigin.y;
                if (deltaY > 50) {
                    // dragged out of the top bar, remove

                    if (d.isFavorite()) {
                        context.presets().removeFavorite(d.preset);
                        // also remove this as a recent so it doesn't still appear
                        context.presets().removeRecent(d.preset);
                    } else if (d.isRecent()) {
                        context.presets().removeRecent(d.preset);
                    }
                } else if (targetData !== null) {
                    // dragged to a new position, reorder

                    if (d.isFavorite()) {
                        context.presets().removeFavorite(d.preset);
                        if (targetData.isRecent()) {
                            // also remove this as a recent so it doesn't appear twice
                            context.presets().removeRecent(d.preset);
                        }
                    } else if (d.isRecent()) {
                        context.presets().removeRecent(d.preset);
                    }

                    var draggingAfter = (ltr && d3_event.x > dragOrigin.x) ||
                                        (rtl && d3_event.x < dragOrigin.x);

                    if (targetData.isFavorite()) {
                        context.presets().addFavorite(d.preset, targetData.preset, draggingAfter);
                    } else if (targetData.isRecent()) {
                        context.presets().addRecent(d.preset, targetData.preset, draggingAfter);
                    }
                }
            })
        );

        // update
        buttons = buttons
            .merge(buttonsEnter)
            .classed('disabled', function(d) { return !enabled(d); });
    }

    tool.allowed = function() {
        return tool.itemsToDraw().length > 0;
    };

    tool.install = function() {
        context
            .on('enter.editor.' + tool.id, function(entered) {
                selection.selectAll('button.add-button')
                    .classed('active', function(mode) { return entered.button === mode.button; });
            });

        var debouncedUpdate = debounce(update, 500, { edges: ['leading', 'trailing'] });

        context.map()
            .on('move.' + tool.id, debouncedUpdate)
            .on('drawn.' + tool.id, debouncedUpdate);

        context
            .on('enter.' + tool.id, update)
            .presets()
            .on('favoritePreset.' + tool.id, update)
            .on('recentsChange.' + tool.id, update);
    };

    tool.uninstall = function() {

        context
            .on('enter.editor.' + tool.id, null)
            .on('exit.editor.' + tool.id, null)
            .on('enter.' + tool.id, null);

        context.presets()
            .on('favoritePreset.' + tool.id, null)
            .on('recentsChange.' + tool.id, null);

        context.map()
            .on('move.' + tool.id, null)
            .on('drawn.' + tool.id, null);
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
