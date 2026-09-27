import { dispatch as d3_dispatch } from 'd3-dispatch';

import { presetManager } from '../presets';
import { presetFavorites } from '../core/preset_favorites';
import { modeAddPoint, modeAddLine, modeAddArea, modeBrowse } from '../modes';
import { actionChangePreset } from '../actions';
import { utilRebind } from '../util';
import { t } from '../core/localizer';

/**
 * Preset Favorites Behavior
 *
 * Handles keyboard input for preset favorites shortcuts, providing multi-digit number detection
 * with timeout handling. This behavior allows users to press number keys to activate
 * preset favorites quickly.
 *
 * Features:
 * - Multi-digit shortcut detection (e.g., pressing "2", "2" for shortcut 22)
 * - Fast timeout for single digits (150ms) with multi-digit override capability
 * - Smart timeout mechanism (500ms) to distinguish between single and multi-digit shortcuts
 * - Automatic buffer cleanup (800ms) to prevent infinite buffer growth
 * - Integration with existing drawing mode shortcuts (1-3 for point/line/area)
 * - Smart conflict resolution between built-in shortcuts and user shortcuts
 * - Supports both drawing new features and applying presets to selected entities
 *
 * Behavior:
 * - Numbers 1-3: Execute immediately (normal drawing modes) but can be cancelled by multi-digit shortcuts
 * - Numbers 8-999: User-defined preset favorites shortcuts
 * - Single-digit shortcuts: Execute after 150ms (can be cancelled by additional digits)
 * - Multi-digit shortcuts: Execute after 500ms, can override single-digit actions
 * - Cancellation: Multi-digit shortcuts cancel previous single-digit actions seamlessly
 * - Buffer cleanup: Automatically cleared after 800ms to prevent infinite growth
 * - Ignores input when user is typing in form fields
 * - Respects modifier keys (Ctrl, Alt, etc.) for other shortcuts
 *
 * Usage:
 *   const behavior = behaviorPresetFavorites(context)
 *     .on('shortcutUsed', function(preset, shortcut, action) { ... });
 *   behavior.on();
 *
 * Events:
 *   'shortcutUsed' - fired when a preset favorite shortcut is successfully activated
 */

export function behaviorPresetFavorites(context: iD.Context) {
    const dispatch = d3_dispatch('shortcutUsed');

    let _numberBuffer = '';
    let _numberTimeout: ReturnType<typeof setTimeout> | null = null;
    let _immediateTimeout: ReturnType<typeof setTimeout> | null = null;
    let _cleanupTimeout: ReturnType<typeof setTimeout> | null = null;
    let _executed = false;
    let _singleDigitExecuted = false;
    let _waitDuration = 500;
    let _immediateDelay = 150;
    let _cleanupDelay = 800;

    function behavior(selection: d3.Selection) {
        selection
            .on('keydown.preset-favorites', keydown, true);
    }

    function clearNumberBuffer() {
        _numberBuffer = '';
        _executed = false;
        _singleDigitExecuted = false;
        if (_numberTimeout) {
            clearTimeout(_numberTimeout);
            _numberTimeout = null;
        }
        if (_immediateTimeout) {
            clearTimeout(_immediateTimeout);
            _immediateTimeout = null;
        }
        if (_cleanupTimeout) {
            clearTimeout(_cleanupTimeout);
            _cleanupTimeout = null;
        }
    }

    function executeShortcut(shortcut: string) {
        const presetId = presetFavorites.getPreset(shortcut);
        if (!presetId) {
            return false;
        }

        const preset = presetManager.item(presetId);
        if (!preset || !preset.addable()) {
            return false;
        }

        const mode = context.mode();
        const selectedIDs = context.selectedIDs();

        if ((mode.id === 'browse' || /^add-/.test(mode.id)) && !selectedIDs.length) {
            const geometries = preset.geometry;
            let drawingMode;

            if (geometries.includes('point')) {
                drawingMode = modeAddPoint(context, {
                    title: t.append('modes.add_point.title'),
                    button: 'point',
                    description: t.append('modes.add_point.description'),
                    preset: preset,
                    key: shortcut
                });
            } else if (geometries.includes('line')) {
                drawingMode = modeAddLine(context, {
                    title: t.append('modes.add_line.title'),
                    button: 'line',
                    description: t.append('modes.add_line.description'),
                    preset: preset,
                    key: shortcut
                });
            } else if (geometries.includes('area')) {
                drawingMode = modeAddArea(context, {
                    title: t.append('modes.add_area.title'),
                    button: 'area',
                    description: t.append('modes.add_area.description'),
                    preset: preset,
                    key: shortcut
                });
            } else {
                return false;
            }

            context.enter(drawingMode);

            setTimeout(() => {
                try {
                    const presetName = preset.nameLabel();
                    context.ui().flash
                        .duration(3000)
                        .iconName('#iD-icon-apply')
                        .iconClass('success')
                        .label(function(selection: d3.Selection) {
                            selection.text('');
                            selection.append('span').text('Drawing mode: ');
                            presetName(selection.append('span').attr('class', 'preset-name'));
                            selection.append('span').text(' (shortcut: ' + shortcut + ')');
                        })();
                } catch {
                    // Flash notification failed
                }
            }, 50);

            dispatch.call('shortcutUsed', behavior, preset, shortcut, 'draw');
            return true;
        }

        const entityIDs = context.selectedIDs();
        if (entityIDs.length > 0) {
            // @ts-expect-error - perform exists on Context but not in type definition
            context.perform(
                function(graph: iD.Graph) {
                    for (let i = 0; i < entityIDs.length; i++) {
                        const entityID = entityIDs[i];
                        const entity = graph.entity(entityID);
                        // @ts-expect-error - match exists on presetManager but not in type definition
                        const oldPreset = presetManager.match(entity, graph);

                        const entityGeometry = entity.geometry(graph);
                        if (preset.geometry.includes(entityGeometry)) {
                            graph = actionChangePreset(entityID, oldPreset, preset)(graph);
                        }
                    }
                    return graph;
                },
                t('operations.change_tags.annotation')
            );

            context.validator().validate();

            setTimeout(() => {
                try {
                    const presetName = preset.nameLabel();
                    const entityCount = entityIDs.length;
                    context.ui().flash
                        .duration(3000)
                        .iconName('#iD-icon-apply')
                        .iconClass('success')
                        .label(function(selection: d3.Selection) {
                            selection.text('');
                            selection.append('span').text('Applied ');
                            presetName(selection.append('span').attr('class', 'preset-name'));
                            selection.append('span').text(' to ' + entityCount + ' feature' + (entityCount === 1 ? '' : 's'));
                            selection.append('span').text(' (shortcut: ' + shortcut + ')');
                        })();
                } catch {
                    // Flash notification failed
                }
            }, 50);

            dispatch.call('shortcutUsed', behavior, preset, shortcut, 'apply');
            return true;
        }

        return false;
    }

    function processNumberBuffer() {
        if (!_numberBuffer) {
            return false;
        }

        if (_executed) {
            clearNumberBuffer();
            return true;
        }

        const shortcut = _numberBuffer;
        clearNumberBuffer();

        const num = parseInt(shortcut, 10);
        if (num >= 8 && num <= 999) {
            if (executeShortcut(shortcut)) {
                return true;
            }
        }

        if (shortcut.length === 1) {
            const digit = parseInt(shortcut, 10);
            if (digit >= 1 && digit <= 3) {
                return false;
            }
        }

        return false;
    }

    function keydown(d3_event: KeyboardEvent) {
        const key = d3_event.key;
        if (!/^[0-9]$/.test(key)) {
            return;
        }

        const target = d3_event.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
            return;
        }

        if (d3_event.ctrlKey || d3_event.metaKey || d3_event.altKey) {
            return;
        }

        const digit = key;
        const wasEmpty = _numberBuffer === '';

        _numberBuffer += digit;

        if (_numberTimeout) {
            clearTimeout(_numberTimeout);
        }
        if (_immediateTimeout) {
            clearTimeout(_immediateTimeout);
        }
        if (_cleanupTimeout) {
            clearTimeout(_cleanupTimeout);
        }

        _cleanupTimeout = setTimeout(() => {
            clearNumberBuffer();
        }, _cleanupDelay);

        if (!wasEmpty) {
            _executed = false;
        }

        const allShortcuts = presetFavorites.getAllShortcuts();
        const allShortcutKeys = Object.keys(allShortcuts);

        const hasExactMatch = allShortcutKeys.includes(_numberBuffer);
        const hasLongerShortcuts = allShortcutKeys.some(shortcut =>
            shortcut.startsWith(_numberBuffer) && shortcut.length > _numberBuffer.length
        );

        if (_numberBuffer.length === 1 && digit >= '1' && digit <= '3') {
            if (!hasExactMatch && !hasLongerShortcuts) {
                clearNumberBuffer();
                return;
            } else if (hasLongerShortcuts && !hasExactMatch) {
                _singleDigitExecuted = true;
            }
        }

        if (hasExactMatch) {
            _immediateTimeout = setTimeout(() => {
                if (!_executed) {
                    const handled = executeShortcut(_numberBuffer);
                    if (handled) {
                        _executed = true;
                    }
                }
            }, _immediateDelay);
        }

        if (hasLongerShortcuts || hasExactMatch) {
            _numberTimeout = setTimeout(() => {
                const handled = processNumberBuffer();
                if (handled) {
                    d3_event.preventDefault();
                    d3_event.stopImmediatePropagation();
                }
            }, _waitDuration);
        }

        if (_numberBuffer.length > 1 && _singleDigitExecuted) {
            context.enter(modeBrowse(context));
            _singleDigitExecuted = false;

            try {
                context.ui().flash
                    .duration(1500)
                    .iconName('#iD-icon-backward')
                    .iconClass('blue')
                    .label('Switching to shortcut: ' + _numberBuffer)();
            } catch {
                // Flash notification failed
            }
        }

        const bufferNum = parseInt(_numberBuffer, 10);
        if (bufferNum >= 8 || (_numberBuffer.length > 1)) {
            d3_event.preventDefault();
            d3_event.stopImmediatePropagation();
        }
    }

    behavior.waitDuration = function(val?: number) {
        if (!arguments.length) return _waitDuration;
        _waitDuration = val || 500;
        return behavior;
    };

    return utilRebind(behavior, dispatch, 'on');
}
