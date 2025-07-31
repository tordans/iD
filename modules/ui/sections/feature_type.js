import { dispatch as d3_dispatch } from 'd3-dispatch';
import { select as d3_select } from 'd3-selection';

import { presetManager } from '../../presets';
import { utilArrayIdentical } from '../../util/array';
import { t } from '../../core/localizer';
import { uiTooltip } from '../tooltip';
import { utilRebind } from '../../util';
import { uiPresetIcon } from '../preset_icon';
import { uiSection } from '../section';
import { uiTagReference } from '../tag_reference';
import { presetShortcuts } from '../../core/preset_shortcuts';
import { svgIcon } from '../../svg';


export function uiSectionFeatureType(context) {

    var dispatch = d3_dispatch('choose');

    var _entityIDs = [];
    var _presets = [];

    var _tagReference;

    var section = uiSection('feature-type', context)
        .label(() => t.append('inspector.feature_type'))
        .disclosureContent(renderDisclosureContent);

    function renderDisclosureContent(selection) {

        selection.classed('preset-list-item', true);
        selection.classed('mixed-types', _presets.length > 1);

        var presetButtonWrap = selection
            .selectAll('.preset-list-button-wrap')
            .data([0])
            .enter()
            .append('div')
            .attr('class', 'preset-list-button-wrap');

        var presetButton = presetButtonWrap
            .append('button')
            .attr('class', 'preset-list-button preset-reset')
            .call(uiTooltip()
                .title(() => t.append('inspector.back_tooltip'))
                .placement('bottom')
            );

        presetButton.append('div')
            .attr('class', 'preset-icon-container');

        presetButton
            .append('div')
            .attr('class', 'label')
            .append('div')
            .attr('class', 'label-inner');

        presetButtonWrap.append('div')
            .attr('class', 'accessory-buttons');

        var tagReferenceBodyWrap = selection
            .selectAll('.tag-reference-body-wrap')
            .data([0]);

        tagReferenceBodyWrap = tagReferenceBodyWrap
            .enter()
            .append('div')
            .attr('class', 'tag-reference-body-wrap')
            .merge(tagReferenceBodyWrap);

        // update header
        if (_tagReference) {
            selection.selectAll('.preset-list-button-wrap .accessory-buttons')
                .style('display', _presets.length === 1 ? null : 'none')
                .call(_tagReference.button);

            tagReferenceBodyWrap
                .style('display', _presets.length === 1 ? null : 'none')
                .call(_tagReference.body);
        }



        selection.selectAll('.preset-reset')
            .on('click', function() {
                 dispatch.call('choose', this, _presets);
            })
            .on('pointerdown pointerup mousedown mouseup', function(d3_event) {
                d3_event.preventDefault();
                d3_event.stopPropagation();
            });

        var geometries = entityGeometries();
        selection.select('.preset-list-item button')
            .call(uiPresetIcon()
                .geometry(_presets.length === 1 ? (geometries.length === 1 && geometries[0]) : null)
                .preset(_presets.length === 1 ? _presets[0] : presetManager.item('point'))
            );

        var names = _presets.length === 1 ? [
            _presets[0].nameLabel(),
            _presets[0].subtitleLabel()
        ].filter(Boolean) : [ t.append('inspector.multiple_types') ];

        var label = selection.select('.label-inner');
        var nameparts = label.selectAll('.namepart')
            .data(names, d => d.stringId);

        nameparts.exit()
            .remove();

        nameparts
            .enter()
            .append('div')
            .attr('class', 'namepart')
            .text('')
            .each(function(d) { d(d3_select(this)); });

        // Add inline shortcut editor for single preset
        if (_presets.length === 1) {
            addInlineShortcutEditor(selection, _presets[0]);
        } else {
            // Remove shortcut editor if multiple presets
            selection.selectAll('.shortcut-editor').remove();
        }
    }

    function addInlineShortcutEditor(selection, preset) {
        
        // Remove any existing shortcut editor
        selection.selectAll('.shortcut-editor').remove();
        
        // Create shortcut editor container
        const shortcutEditor = selection.selectAll('.shortcut-editor')
            .data([preset])
            .enter()
            .append('div')
            .attr('class', 'shortcut-editor');

        // Shortcut display/edit row
        const shortcutRow = shortcutEditor
            .append('div')
            .attr('class', 'shortcut-row');

        // Label
        shortcutRow
            .append('span')
            .attr('class', 'shortcut-label')
            .text(t('preset_shortcut.inline_label'));

        // Current shortcut display or input
        const shortcutValue = shortcutRow
            .append('span')
            .attr('class', 'shortcut-value');

        // Edit button
        const editButton = shortcutRow
            .append('button')
            .attr('class', 'shortcut-edit-btn')
            .call(svgIcon('#iD-icon-edit'));

        function updateDisplay() {
            const currentShortcut = presetShortcuts.getShortcut(preset.id);
            shortcutValue.selectAll('*').remove();
            
            // Clear any error messages when switching back to display mode
            shortcutEditor.selectAll('.shortcut-error-message').remove();
            
            // Show the edit button again
            editButton.style('display', null);
            
            if (currentShortcut) {
                shortcutValue
                    .append('span')
                    .attr('class', 'shortcut-display')
                    .text(currentShortcut);
                
                editButton
                    .call(uiTooltip()
                        .title(t('preset_shortcut.edit_tooltip'))
                        .placement('bottom')
                    );
            } else {
                shortcutValue
                    .append('span')
                    .attr('class', 'shortcut-none')
                    .text(t('preset_shortcut.none_display'));
                
                editButton
                    .call(uiTooltip()
                        .title(t('preset_shortcut.add_tooltip'))
                        .placement('bottom')
                    );
            }
        }

        function showEditor() {
            const currentShortcut = presetShortcuts.getShortcut(preset.id);
            shortcutValue.selectAll('*').remove();
            
            // Hide the edit button while in edit mode
            editButton.style('display', 'none');
            
            const input = shortcutValue
                .append('input')
                .attr('type', 'number')
                .attr('min', '8')
                .attr('max', '999')
                .attr('class', 'shortcut-input')
                .attr('placeholder', '8-999')
                .property('value', currentShortcut || '');

            const buttonGroup = shortcutValue
                .append('span')
                .attr('class', 'shortcut-buttons');

            // Helper functions for error handling
            function showError(message) {
                input.classed('error', true);
                errorMessage
                    .style('display', 'block')
                    .text(message);
            }

            function clearError() {
                input.classed('error', false);
                errorMessage.style('display', 'none');
            }

            // Save button
            buttonGroup
                .append('button')
                .attr('class', 'shortcut-save')
                .call(svgIcon('#iD-icon-apply'))
                .call(uiTooltip()
                    .title(t('preset_shortcut.save_tooltip'))
                    .placement('bottom')
                )
                .on('click', function() {
                    const value = input.property('value').trim();
                    
                    // Clear any previous error
                    clearError();
                    
                    if (!value) {
                        // Remove shortcut
                        presetShortcuts.removeShortcut(preset.id);
                        updateDisplay();
                        return;
                    }
                    
                    const num = parseInt(value, 10);
                    if (isNaN(num) || num < 8 || num > 999) {
                        showError(t('preset_shortcut.error_range'));
                        return;
                    }
                    
                    try {
                        presetShortcuts.setShortcut(preset.id, value);
                        updateDisplay();
                    } catch (error) {
                        showError(error.message || t('preset_shortcut.error_conflict', { shortcut: value }));
                    }
                });

            // Cancel button
            buttonGroup
                .append('button')
                .attr('class', 'shortcut-cancel')
                .call(svgIcon('#iD-icon-close'))
                .call(uiTooltip()
                    .title(t('preset_shortcut.cancel_tooltip'))
                    .placement('bottom')
                )
                .on('click', updateDisplay);

            // Remove button (if shortcut exists)
            if (currentShortcut) {
                buttonGroup
                    .append('button')
                    .attr('class', 'shortcut-remove')
                    .call(svgIcon('#iD-operation-delete'))
                    .call(uiTooltip()
                        .title(t('preset_shortcut.remove'))
                        .placement('bottom')
                    )
                    .on('click', function() {
                        presetShortcuts.removeShortcut(preset.id);
                        updateDisplay();
                    });
            }

            // Error message display (appears below the entire shortcut row)
            const errorMessage = shortcutEditor
                .append('div')
                .attr('class', 'shortcut-error-message')
                .style('display', 'none');

            // Focus input and handle keyboard
            setTimeout(() => {
                input.node().focus();
                input.node().select();
            }, 50);

            input.on('keydown', function(d3_event) {
                if (d3_event.keyCode === 13) { // Enter
                    d3_event.preventDefault();
                    buttonGroup.select('.shortcut-save').node().click();
                } else if (d3_event.keyCode === 27) { // Escape
                    d3_event.preventDefault();
                    updateDisplay();
                }
            });

            input.on('input', function() {
                clearError();
            });
        }

        editButton.on('click', function(d3_event) {
            d3_event.stopPropagation();
            d3_event.preventDefault();
            showEditor();
        });

        updateDisplay();
    }

    section.entityIDs = function(val) {
        if (!arguments.length) return _entityIDs;
        _entityIDs = val;
        return section;
    };

    section.presets = function(val) {
        if (!arguments.length) return _presets;

        // don't reload the same preset
        if (!utilArrayIdentical(val, _presets)) {
            _presets = val;

            if (_presets.length === 1) {
                _tagReference = uiTagReference(_presets[0].reference(), context)
                    .showing(false);
            }
        }

        return section;
    };

    function entityGeometries() {

        var counts = {};

        for (var i in _entityIDs) {
            var geometry = context.graph().geometry(_entityIDs[i]);
            if (!counts[geometry]) counts[geometry] = 0;
            counts[geometry] += 1;
        }

        return Object.keys(counts).sort(function(geom1, geom2) {
            return counts[geom2] - counts[geom1];
        });
    }

    return utilRebind(section, dispatch, 'on');
}
