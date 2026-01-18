import { select as d3_select } from 'd3-selection';
import { drag as d3_drag } from 'd3-drag';

import { presetManager } from '../../presets';
import { presetFavorites } from '../../core/preset_favorites';
import { t } from '../../core/localizer';
import { uiTooltip } from '../tooltip';
import { svgIcon } from '../../svg/icon';
import { uiPresetIcon } from '../preset_icon';


function renderGeometryIcons(container: d3.Selection, geometries: string[]) {
    const geometryIcons: Record<string, string> = {
        'point': '#iD-icon-point',
        'line': '#iD-icon-line',
        'area': '#iD-icon-area',
        'vertex': '#iD-icon-vertex',
        'relation': '#iD-icon-relation'
    };

    geometries.forEach((geom: string) => {
        const iconId = geometryIcons[geom];
        if (iconId) {
            container
                .append('li')
                .call(svgIcon(iconId));
        }
    });
}

export function renderFavoritesList(
    container: d3.Selection<HTMLOListElement>,
    favorites: string[],
    onReorder: (newOrder: string[]) => void,
    onRemove: (presetId: string) => void
) {
    const list = container
        .selectAll('.favorite-presets-item')
        // @ts-expect-error - data key function types are compatible at runtime
        .data(favorites, (d: string) => d);

    list.exit().remove();

    const listEnter = list.enter()
        .append('li')
        .attr('class', 'favorite-presets-item');

    // Drag indicator
    listEnter
        .append('nav')
        .attr('class', 'drag-indicator')
        .call(svgIcon('#iD-operation-move', 'inline operation'));

    // Preset icon
    listEnter
        .append('figure')
        .attr('class', 'preset-icon-wrapper')
        .each(function(presetId: string) {
            const preset = presetManager.item(presetId);
            if (preset) {
                const geometries = preset.geometry || [];
                const primaryGeometry = geometries.length > 0 ? geometries[0] : null;
                d3_select(this)
                    .call(uiPresetIcon()
                        .geometry(primaryGeometry)
                        .preset(preset));
            }
        });

    // Preset name
    listEnter
        .append('h4')
        .attr('class', 'preset-name')
        .each(function(presetId: string) {
            const preset = presetManager.item(presetId);
            if (preset) {
                preset.nameLabel()(d3_select(this));
            }
        });

    // Right-side group: geometry icons, shortcut, delete button
    const rightGroup = listEnter
        .append('div')
        .attr('class', 'preset-right-group');

    // Geometry icons
    rightGroup
        .append('ul')
        .attr('class', 'preset-geometries')
        .each(function(presetId: string) {
            const preset = presetManager.item(presetId);
            if (preset && preset.geometry) {
                renderGeometryIcons(d3_select(this), preset.geometry);
            }
        });

    rightGroup
        .append('div')
        .attr('class', 'shortcut-display')
        .each(function(presetId: string) {
            const shortcut = presetFavorites.getShortcut(presetId);
            if (shortcut) {
                d3_select(this)
                    .append('kbd')
                    .attr('class', 'shortcut')
                    .text(shortcut);
            }
        });

    // Remove favorite button
    rightGroup
        .append('button')
        .attr('class', 'favorite-remove')
        .call(svgIcon('#iD-operation-delete'))
        .call(function(selection) {
            const tooltip = uiTooltip();
            // @ts-expect-error - title and placement exist on uiTooltip but not in type definition
            tooltip.title(() => t('preferences.favorite_presets.remove_tooltip'));
            // @ts-expect-error - placement exists on uiTooltip but not in type definition
            tooltip.placement('bottom');
            selection.call(tooltip as any);
        });

    // Update existing items
    // @ts-expect-error - merge types are compatible at runtime
    const items = listEnter.merge(list);

    items.select('.favorite-remove')
        .on('click', function(d3_event) {
            d3_event.stopPropagation();
            const parent = (this as HTMLElement).parentElement;
            if (!parent) return;
            const presetId = d3_select(parent).datum() as string;
            onRemove(presetId);
        });

    items.select('.preset-icon-wrapper')
        .each(function(presetId: string) {
            const preset = presetManager.item(presetId);
            if (preset) {
                const geometries = preset.geometry || [];
                const primaryGeometry = geometries.length > 0 ? geometries[0] : null;
                d3_select(this).selectAll('*').remove();
                d3_select(this)
                    .call(uiPresetIcon()
                        .geometry(primaryGeometry)
                        .preset(preset));
            }
        });

    items.select('.preset-name')
        .each(function(presetId: string) {
            const preset = presetManager.item(presetId);
            if (preset) {
                d3_select(this).selectAll('*').remove();
                preset.nameLabel()(d3_select(this));
            }
        });

    items.select('.preset-right-group .preset-geometries')
        .each(function(presetId: string) {
            const preset = presetManager.item(presetId);
            const container = d3_select(this);
            container.selectAll('*').remove();

            if (preset && preset.geometry) {
                renderGeometryIcons(container, preset.geometry);
            }
        });

    items.select('.preset-right-group .shortcut-display')
        .each(function(presetId: string) {
            const shortcut = presetFavorites.getShortcut(presetId);
            const container = d3_select(this);
            container.selectAll('*').remove();

            if (shortcut) {
                container
                    .append('kbd')
                    .attr('class', 'shortcut')
                    .text(shortcut);
            }
        });

    // Drag and drop
    let dragOrigin: { x: number; y: number } | null = null;
    let targetIndex: number | null = null;

    // @ts-expect-error - d3_drag types are compatible at runtime
    items.call(d3_drag()
        .on('start', function(d3_event) {
            dragOrigin = {
                x: d3_event.x,
                y: d3_event.y
            };
            targetIndex = null;
        })
        .on('drag', function(d3_event) {
            if (!dragOrigin) return;

            const x = d3_event.x - dragOrigin.x;
            const y = d3_event.y - dragOrigin.y;

            if (!d3_select(this).classed('dragging') &&
                Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) <= 5) return;

            const index = (items.nodes() as Element[]).indexOf(this as Element);

            d3_select(this)
                .classed('dragging', true);

            targetIndex = null;

            items.style('transform', function(d2: string, index2: number) {
                const node = d3_select(this).node() as HTMLElement;
                if (index === index2) {
                    return 'translate(' + x + 'px, ' + y + 'px)';
                } else if (index2 > index && d3_event.y > node.offsetTop) {
                    if (targetIndex === null || index2 > targetIndex) {
                        targetIndex = index2;
                    }
                    return 'translateY(-100%)';
                } else if (index2 < index && d3_event.y < node.offsetTop + node.offsetHeight) {
                    if (targetIndex === null || index2 < targetIndex) {
                        targetIndex = index2;
                    }
                    return 'translateY(100%)';
                }
                return null;
            });
        })
        .on('end', function() {
            if (!d3_select(this).classed('dragging')) return;

            const index = (items.nodes() as Element[]).indexOf(this as Element);

            d3_select(this)
                .classed('dragging', false);

            items.style('transform', null);

            if (targetIndex !== null && targetIndex !== index) {
                // Reorder favorites
                const newOrder = [...favorites];
                const [removed] = newOrder.splice(index, 1);
                newOrder.splice(targetIndex, 0, removed);

                // Reassign shortcuts sequentially
                presetFavorites.reorderShortcuts(newOrder);
                onReorder(newOrder);
            }
        })
    ) as any;
}
