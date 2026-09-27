import { t } from '../../core/localizer';

/**
 * Renders the explanation text below the favorites list
 */
export function renderExplanation(selection: d3.Selection, hasFavorites: boolean) {
    const explanation = selection.selectAll('.favorite-presets-explanation')
        .data(hasFavorites ? [0] : []);

    explanation.exit().remove();

    explanation.enter()
        .append('div')
        .attr('class', 'favorite-presets-explanation')
        .append('p')
        .html(t('preferences.favorite_presets.explanation'));
}
