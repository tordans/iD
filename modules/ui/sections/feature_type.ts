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
import { presetFavorites } from '../../core/preset_favorites';
import { svgIcon } from '../../svg/icon';

export function uiSectionFeatureType(context: iD.Context) {
    const dispatch = d3_dispatch('choose');

    let _entityIDs: string[] = [];
    let _presets: Array<{ id: string; nameLabel: () => any; subtitleLabel: () => any; reference: () => any }> = [];
    let _tagReference: ReturnType<typeof uiTagReference> | null = null;

    const section = uiSection('feature-type', context);
    // @ts-expect-error - label exists on uiSection but not in type definition
    section.label(() => t.append('inspector.feature_type'));
    // @ts-expect-error - disclosureContent exists on uiSection but not in type definition
    section.disclosureContent(renderDisclosureContent);

    /**
     * Renders the feature type section with preset buttons and favorite controls
     */
    function renderDisclosureContent(selection: d3.Selection) {
        selection.classed('preset-list-item', true);
        selection.classed('mixed-types', _presets.length > 1);

        let presetButtonWrap = selection
            .selectAll('.preset-list-button-wrap')
            .data([0]);

        const presetButtonWrapEnter = presetButtonWrap.enter()
            .append('div')
            .attr('class', 'preset-list-button-wrap');

        const presetButton = presetButtonWrapEnter
            .append('button')
            .attr('class', 'preset-list-button preset-reset')
            .call(function(selection) {
                const tooltip = uiTooltip();
                // @ts-expect-error - title and placement exist on uiTooltip but not in type definition
                tooltip.title(() => t.append('inspector.back_tooltip'));
                // @ts-expect-error - placement exists on uiTooltip but not in type definition
                tooltip.placement('bottom');
                selection.call(tooltip as any);
            });

        presetButton.append('div')
            .attr('class', 'preset-icon-container');

        presetButton
            .append('div')
            .attr('class', 'label')
            .append('div')
            .attr('class', 'label-inner');

        presetButtonWrapEnter.append('div')
            .attr('class', 'accessory-buttons');

        // @ts-expect-error - merge types are compatible at runtime
        presetButtonWrap = presetButtonWrapEnter.merge(presetButtonWrap);

        const accessoryButtons = presetButtonWrap.select('.accessory-buttons');

        const tagReferenceBodyWrap = selection
            .selectAll('.tag-reference-body-wrap')
            .data([0]);

        tagReferenceBodyWrap.enter()
            .append('div')
            .attr('class', 'tag-reference-body-wrap')
            .merge(tagReferenceBodyWrap as any);

        /**
         * Generic/fallback presets that shouldn't have favorite button or tag reference
         */
        const GENERIC_PRESETS = ['point', 'line', 'area', 'vertex', 'relation'];

        if (_presets.length === 1) {
            const currentPreset = _presets[0];
            const currentPresetId = currentPreset.id;
            const isGeneric = GENERIC_PRESETS.includes(currentPresetId);

            if (!isGeneric) {
                const currentShortcut = presetFavorites.getShortcut(currentPresetId);
                const isFavoriteNow = !!currentShortcut;

                accessoryButtons.selectAll('.favorite-heart-button, .tag-reference-button').remove();

                const heartButton = accessoryButtons
                    .append('button')
                    .attr('class', 'favorite-heart-button')
                    .classed('active', isFavoriteNow)
                    .on('click', function(d3_event) {
                        if (_presets.length !== 1) return;
                        const clickPreset = _presets[0];
                        const clickPresetId = clickPreset.id;

                        d3_event.stopPropagation();
                        d3_event.preventDefault();

                        const clickShortcut = presetFavorites.getShortcut(clickPresetId);
                        const isClickFavorite = !!clickShortcut;

                        if (isClickFavorite) {
                            presetFavorites.removeShortcut(clickPresetId);
                        } else {
                            // Find the next available shortcut starting from 8
                            let nextShortcut = 8;
                            while (presetFavorites.getPreset(String(nextShortcut))) {
                                nextShortcut++;
                            }
                            presetFavorites.setShortcut(clickPresetId, String(nextShortcut));
                        }
                    })
                    .on('contextmenu', function(d3_event) {
                        d3_event.preventDefault();
                        d3_event.stopPropagation();
                        const preferencesPane = context.container().select('.map-pane.preferences-pane');
                        if (!preferencesPane.empty()) {
                            context.ui().togglePanes(preferencesPane);
                        }
                    });

                const heartIconContainer = heartButton
                    .append('div')
                    .attr('class', 'heart-icon-container');

                heartIconContainer.call(svgIcon('#iD-icon-favorite'));

                const badge = heartIconContainer
                    .append('kbd')
                    .attr('class', 'shortcut shortcut-badge')
                    .text(currentShortcut || '');

                if (!currentShortcut) {
                    badge.style('visibility', 'hidden');
                } else {
                    badge.style('visibility', null);
                }

                const presetId = currentPresetId;
                const tooltipId = 'favorite-heart-tooltip-' + presetId.replace(/[^a-zA-Z0-9]/g, '-');

                heartButton.append('span')
                    .attr('class', 'tooltip-reference')
                    .attr('id', tooltipId)
                    .style('display', 'none');

                heartButton.attr('aria-describedby', tooltipId);

                const tooltip = uiTooltip();
                // @ts-expect-error - title, keys, and placement exist on uiTooltip but not in type definition
                tooltip.title(() => {
                    const shortcut = presetFavorites.getShortcut(presetId);
                    if (shortcut) {
                        return t('preferences.favorite_presets.heart_tooltip_active');
                    }
                    return t('preferences.favorite_presets.heart_tooltip_inactive');
                });
                // @ts-expect-error - keys exists on uiTooltip but not in type definition
                tooltip.keys(() => {
                    const shortcut = presetFavorites.getShortcut(presetId);
                    return shortcut ? [shortcut] : [];
                });
                // @ts-expect-error - placement exists on uiTooltip but not in type definition
                tooltip.placement('bottom');
                heartButton.call(tooltip as any);

                if (_tagReference) {
                    accessoryButtons
                        .style('display', null)
                        .call(_tagReference.button);
                }
            } else {
                accessoryButtons.style('display', 'none');
            }
        } else {
            accessoryButtons.selectAll('.favorite-heart-button').remove();
            if (_tagReference) {
                accessoryButtons
                    // @ts-expect-error - style accepts null/undefined for removing style
                    .style('display', 'none');
            }
        }

        if (_tagReference) {
            const isGeneric = _presets.length === 1 && GENERIC_PRESETS.includes(_presets[0].id);
            tagReferenceBodyWrap
                // @ts-expect-error - style accepts null/undefined for removing style
                .style('display', (_presets.length === 1 && !isGeneric) ? null : 'none')
                .call(_tagReference.body);
        }

        selection.selectAll('.preset-reset')
            .on('click', function(d3_event) {
                 dispatch.call('choose', d3_event.target, _presets);
            })
            .on('pointerdown pointerup mousedown mouseup', function(d3_event) {
                d3_event.preventDefault();
                d3_event.stopPropagation();
            });

        const geometries = entityGeometries();
        const presetForIcon = _presets.length === 1 ? _presets[0] : presetManager.item('point');
        if (presetForIcon) {
            selection.select('.preset-list-item button')
                .call(uiPresetIcon()
                    .geometry(_presets.length === 1 ? (geometries.length === 1 && geometries[0]) : null)
                    .preset(presetForIcon)
                );
        }

        const names = _presets.length === 1 ? [
            _presets[0].nameLabel(),
            _presets[0].subtitleLabel()
        ].filter(Boolean) : [ t.append('inspector.multiple_types') ];

        const label = selection.select('.label-inner');
        const nameparts = label.selectAll('.namepart')
            .data(names, (d) => d.stringId);

        nameparts.exit()
            .remove();

        nameparts
            .enter()
            .append('div')
            .attr('class', 'namepart')
            .text('')
            .each(function(d) { d(d3_select(this)); });
    }

    // @ts-expect-error - entityIDs exists on section but not in type definition
    section.entityIDs = function(val?: string[]) {
        if (!arguments.length) return _entityIDs;
        _entityIDs = val || [];
        return section;
    };

    // @ts-expect-error - presets exists on section but not in type definition
    section.presets = function(val?: Array<{ id: string; nameLabel: () => any; subtitleLabel: () => any; reference: () => any }>) {
        if (!arguments.length) return _presets;

        if (val && !utilArrayIdentical(val, _presets)) {
            _presets = val;

            if (_presets.length === 1) {
                // @ts-expect-error - reference() returns object compatible with uiTagReference
                _tagReference = uiTagReference(_presets[0].reference(), context)
                    .showing(false);
            } else {
                _tagReference = null;
            }
        }

        return section;
    };

    /**
     * Returns geometries of selected entities, sorted by frequency
     */
    function entityGeometries() {
        const counts: Record<string, number> = {};
        // @ts-expect-error - graph() exists on Context but not in type definition
        const graph = context.graph();

        for (const entityID of _entityIDs) {
            const geometry = graph.geometry(entityID);
            if (!counts[geometry]) counts[geometry] = 0;
            counts[geometry] += 1;
        }

        return Object.keys(counts).sort(function(geom1, geom2) {
            return counts[geom2] - counts[geom1];
        });
    }

    // @ts-expect-error - reRender exists on section but not in type definition
    presetFavorites.on('favoriteAdded.featureType', function() {
        section.reRender();
    });
    // @ts-expect-error - reRender exists on section but not in type definition
    presetFavorites.on('favoriteRemoved.featureType', function() {
        section.reRender();
    });
    // @ts-expect-error - reRender exists on section but not in type definition
    presetFavorites.on('favoriteChanged.featureType', function() {
        section.reRender();
    });

    return utilRebind(section, dispatch, 'on');
}
