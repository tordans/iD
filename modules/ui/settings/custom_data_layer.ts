import { t } from '../../core/localizer';
import { CUSTOM_DATA_COLORS, customDataLayers, type CustomDataLayer } from '../../renderer/custom_data_layers';
import { utilNoAuto } from '../../util';
import { uiConfirm } from '../confirm';


/**
 * Modal to add a custom data layer, or to edit one when `layer` is given.
 */
export function uiSettingsCustomDataLayer(context: iD.Context, layer?: CustomDataLayer) {
    const modal = uiConfirm(context.container()).okButton();

    modal
        .classed('settings-modal settings-custom-data-layer', true);

    modal.select('.modal-section.header')
        .append('h3')
        .call(t.append(layer
            ? 'map_data.custom_data_layers.settings.header_edit'
            : 'map_data.custom_data_layers.settings.header_add'
        ));

    const textSection = modal.select('.modal-section.message-text');

    textSection
        .append('label')
        .call(t.append('map_data.custom_data_layers.settings.name'));

    const nameInput = textSection
        .append('input')
        .attr('class', 'field-name')
        .attr('type', 'text')
        .call(utilNoAuto)
        .property('value', layer?.name ?? '');

    textSection
        .append('label')
        .call(t.append('map_data.custom_data_layers.settings.url'));

    const urlInput = textSection
        .append('textarea')
        .attr('class', 'field-url')
        .attr('placeholder', t('map_data.custom_data_layers.settings.url_placeholder'))
        .call(utilNoAuto)
        .on('input.custom-data-layer', updateSaveDisabled)
        .property('value', layer?.url ?? '');

    textSection
        .append('div')
        .attr('class', 'instructions-formats deemphasize')
        .call(t.append('map_data.custom_data_layers.settings.formats'));

    textSection
        .append('label')
        .call(t.append('map_data.custom_data_layers.settings.filter'));

    const filterRow = textSection
        .append('div')
        .attr('class', 'filter-row');

    const filterKeyInput = filterRow
        .append('input')
        .attr('class', 'field-filter-key')
        .attr('type', 'text')
        .attr('placeholder', t('map_data.custom_data_layers.settings.filter_key'))
        .attr('aria-label', t('map_data.custom_data_layers.settings.filter_key'))
        .call(utilNoAuto)
        .property('value', layer?.filterKey ?? '');

    filterRow
        .append('span')
        .attr('class', 'filter-equals')
        .text('=');

    const filterValueInput = filterRow
        .append('input')
        .attr('class', 'field-filter-value')
        .attr('type', 'text')
        .attr('placeholder', t('map_data.custom_data_layers.settings.filter_value'))
        .attr('aria-label', t('map_data.custom_data_layers.settings.filter_value'))
        .call(utilNoAuto)
        .property('value', layer?.filterValue ?? '');

    textSection
        .append('div')
        .attr('class', 'instructions-filter deemphasize')
        .call(t.append('map_data.custom_data_layers.settings.filter_help'));

    textSection
        .append('label')
        .call(t.append('map_data.custom_data_layers.settings.color'));

    const colorInput = textSection
        .append('input')
        .attr('class', 'field-color')
        .attr('type', 'color')
        .property('value', layer?.color ?? CUSTOM_DATA_COLORS[customDataLayers.all().length % CUSTOM_DATA_COLORS.length]);

    const buttonSection = modal.select('.modal-section.buttons');

    buttonSection
        .insert('button', '.ok-button')
        .attr('class', 'button cancel-button secondary-action')
        .call(t.append('confirm.cancel'))
        .on('click.cancel', () => modal.close());

    buttonSection.select('.ok-button')
        .on('click.save', clickSave);

    updateSaveDisabled();
    nameInput.node()?.focus();


    function currentUrl() {
        return String(urlInput.property('value')).replace(/[\r\n]+/g, '').trim();
    }

    function updateSaveDisabled() {
        buttonSection.select('.ok-button')
            .attr('disabled', currentUrl() ? null : true);
    }

    function clickSave() {
        const url = currentUrl();
        if (!url) return;

        const name = String(nameInput.property('value'));
        const color = String(colorInput.property('value'));
        const filter = {
            filterKey: String(filterKeyInput.property('value')),
            filterValue: String(filterValueInput.property('value'))
        };
        modal.close();

        if (layer) {
            customDataLayers.update(layer.id, { name, url, color, ...filter });
        } else {
            const added = customDataLayers.add(url, name, filter);
            customDataLayers.update(added.id, { color });
        }
    }
}
