import { localizer, t } from '../../core/localizer';
import { customDataLabel, customDataLayers, isSelectable, type CustomDataLayer } from '../../renderer/custom_data_layers';
import { svgIcon } from '../../svg/icon';
import { uiConfirm } from '../confirm';
import { uiLayerModeToggle, type LayerMode } from '../layer_mode_toggle';
import { uiSection } from '../section';
import { uiSettingsCustomDataLayer } from '../settings/custom_data_layer';
import { uiTooltip } from '../tooltip';


function layerName(layer: CustomDataLayer) {
    return layer.name || customDataLabel(layer.url);
}


/**
 * Map Data pane section to add, toggle, edit and delete custom data layers.
 */
export function uiSectionCustomDataLayers(context: iD.Context) {
    const section = (uiSection('custom-data-layers', context) as any)
        .label(() => t.append('map_data.custom_data_layers.title'))
        .disclosureHeaderOptions(renderHeaderOptions)
        .disclosureContent(renderDisclosureContent);

    const tooltipPlacement = () => localizer.textDirection() === 'rtl' ? 'right' : 'left';


    function renderHeaderOptions(selection: d3.Selection) {
        selection.selectAll('button.add-custom-data-layer')
            .data([0])
            .enter()
            .append('button')
            .attr('class', 'disclosure-header-option add-custom-data-layer')
            .attr('aria-label', t('map_data.custom_data_layers.add'))
            .call((uiTooltip() as any)
                .title(() => t.append('map_data.custom_data_layers.add'))
                .placement(tooltipPlacement())
            )
            .on('click', (d3_event: MouseEvent) => {
                d3_event.preventDefault();
                d3_event.stopPropagation();
                uiSettingsCustomDataLayer(context);
            })
            .call(svgIcon('#iD-icon-plus', ''));
    }


    function renderDisclosureContent(selection: d3.Selection) {
        const layers = customDataLayers.all();

        const empty = selection.selectAll<HTMLParagraphElement, number>('.custom-data-layers-empty')
            .data(layers.length ? [] : [0]);

        empty.exit()
            .remove();

        empty.enter()
            .append('p')
            .attr('class', 'custom-data-layers-empty deemphasize')
            .call(t.append('map_data.custom_data_layers.empty'));

        let list = selection.selectAll<HTMLUListElement, number>('ul.layer-list-custom-data')
            .data([0]);

        list = list.enter()
            .append('ul')
            .attr('class', 'layer-list layer-list-custom-data')
            .merge(list);

        let items = list.selectAll<HTMLLIElement, CustomDataLayer>('li')
            .data(layers, d => d.id);

        items.exit()
            .remove();

        const itemsEnter = items.enter()
            .append('li')
            .attr('class', 'layer-custom-data');

        const labelEnter = itemsEnter
            .append('label');

        labelEnter
            .append('span')
            .attr('class', 'custom-data-swatch');

        labelEnter
            .append('span')
            .attr('class', 'custom-data-name');

        itemsEnter
            .append('button')
            .attr('class', 'layer-edit-custom-data')
            .call((uiTooltip() as any)
                .title(() => t.append('map_data.custom_data_layers.edit_tooltip'))
                .placement(tooltipPlacement())
            )
            .on('click', (d3_event: MouseEvent, d: CustomDataLayer) => {
                d3_event.preventDefault();
                d3_event.stopPropagation();
                uiSettingsCustomDataLayer(context, d);
            })
            .call(svgIcon('#iD-icon-edit', ''));

        itemsEnter
            .append('button')
            .attr('class', 'layer-delete-custom-data')
            .call((uiTooltip() as any)
                .title(() => t.append('map_data.custom_data_layers.delete.tooltip'))
                .placement(tooltipPlacement())
            )
            .on('click', (d3_event: MouseEvent, d: CustomDataLayer) => {
                d3_event.preventDefault();
                d3_event.stopPropagation();
                confirmDelete(d);
            })
            .call(svgIcon('#iD-operation-delete', ''));

        items = items.merge(itemsEnter)
            .order()
            .classed('active', d => d.enabled)
            .attr('title', d => d.url);

        // the mode toggle goes before the edit and delete buttons
        items.call(modeToggle);
        items.each(function() {
            const toggle = this.querySelector('.layer-mode');
            const label = this.querySelector('label');
            if (toggle && label && label.nextSibling !== toggle) label.after(toggle);
        });

        items.select('.custom-data-swatch')
            .style('background-color', d => d.color);

        items.select('.custom-data-name')
            .text(layerName);
    }


    const modeToggle = uiLayerModeToggle<CustomDataLayer>({
        getMode: layer => !layer.enabled ? 'hidden' : isSelectable(layer) ? 'interactive' : 'readonly',
        setMode: (layer: CustomDataLayer, mode: LayerMode) => customDataLayers.update(layer.id, {
            enabled: mode !== 'hidden',
            ...(mode === 'hidden' ? {} : { selectable: mode === 'interactive' })
        }),
        name: layerName,
        tooltipPrefix: 'map_data.layer_mode.custom_data'
    });


    function confirmDelete(layer: CustomDataLayer) {
        const modal = uiConfirm(context.container());

        modal.select('.modal-section.header')
            .append('h3')
            .call(t.append('map_data.custom_data_layers.delete.header'));

        modal.select('.modal-section.message-text')
            .append('p')
            .call(t.append('map_data.custom_data_layers.delete.message', { name: layerName(layer) }));

        const buttons = modal.select('.modal-section.buttons');

        // close() (not remove()) so the modal's document keybinding is unbound
        buttons
            .append('button')
            .attr('class', 'button cancel-button secondary-action')
            .call(t.append('confirm.cancel'))
            .on('click.cancel', () => modal.close());

        buttons
            .append('button')
            .attr('class', 'button action')
            .call(t.append('map_data.custom_data_layers.delete.confirm'))
            .on('click.delete', () => {
                modal.close();
                customDataLayers.remove(layer.id);
            });
    }


    customDataLayers.on('change.uiSectionCustomDataLayers', section.reRender);

    return section;
}
