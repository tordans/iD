import { presetFavorites } from '../../core/preset_favorites';
import { t } from '../../core/localizer';
import { uiSection } from '../section';
import { renderEmptyState } from './favorite_presets_empty';
import { renderFavoritesList } from './favorite_presets_list';
import { renderExplanation } from './favorite_presets_explanation';

export function uiSectionFavoritePresets(context: iD.Context) {
    const section = uiSection('preferences-favorite-presets', context);
    // @ts-expect-error - label and expandedByDefault exist on uiSection but not in type definition
    section.label(() => t.append('preferences.favorite_presets.title'));
    // @ts-expect-error - expandedByDefault exists on uiSection but not in type definition
    section.expandedByDefault(true);
    // @ts-expect-error - disclosureContent exists on uiSection but not in type definition
    section.disclosureContent(renderDisclosureContent);

    function renderDisclosureContent(selection: d3.Selection) {
        const favorites = presetFavorites.getFavoritesInOrder();

        if (favorites.length === 0) {
            renderEmptyState(selection);
            renderExplanation(selection, false);
            return;
        }

        selection.selectAll('.favorite-presets-empty').remove();

        const listContainer = selection.selectAll('.favorite-presets-list')
            .data([0]);

        listContainer.exit().remove();

        const listContainerEnter = listContainer.enter()
            .append('ol')
            .attr('class', 'favorite-presets-list');

        // @ts-expect-error - merge types are compatible at runtime
        const listContainerMerged = listContainerEnter.merge(listContainer);

        renderFavoritesList(
            // @ts-expect-error
            listContainerMerged,
            favorites,
            function() {
                // @ts-expect-error - reRender exists on section but not in type definition
                section.reRender();
            },
            function(presetId: string) {
                presetFavorites.removeShortcut(presetId);
                // @ts-expect-error - reRender exists on section but not in type definition
                section.reRender();
            }
        );

        renderExplanation(selection, true);
    }

    presetFavorites.on('favoriteAdded.preferences', function() {
        // @ts-expect-error - reRender exists on section but not in type definition
        section.reRender();
    });
    presetFavorites.on('favoriteRemoved.preferences', function() {
        // @ts-expect-error - reRender exists on section but not in type definition
        section.reRender();
    });
    presetFavorites.on('favoriteChanged.preferences', function() {
        // @ts-expect-error - reRender exists on section but not in type definition
        section.reRender();
    });

    return section;
}
