import { dispatch as d3_dispatch } from 'd3-dispatch';
import { select as d3_select, type Selection } from 'd3-selection';

import { localizer, t } from '../../core/localizer';
import { svgIcon } from '../../svg/icon';
import { utilNoAuto, utilRebind } from '../../util';
import { mapillaryKeyLabel } from '../../mapillary/tag_keys';
import { addableKeys, buildImageRows, removeImageChange, setImageChange, type ImageRow } from '../../mapillary/field_rows';
import { formatRelativeAge, loadImageInfo, type MapillaryImageInfo } from '../../mapillary/image_info';
import { showMapillaryImage } from '../../mapillary/viewer';

/**
 * "Mapillary images" field (WORKDOC feature 19): every Mapillary image key of the feature as a row
 * with its images (`;`-separated ids), each with link, "show in viewer" button, capture age, user
 * and panorama flag. Replaces the schema's `mapillary` identifier field.
 */

type ImageEntry = { key: string; index: number; id: string };


function imageInfoText(info: MapillaryImageInfo): { text: string; title: string } {
    const parts: string[] = [];
    let title = '';
    if (info.capturedAt) {
        const age = formatRelativeAge(info.capturedAt, new Date(), localizer.localeCode());
        if (age) parts.push(age);
        title = new Date(info.capturedAt).toLocaleString(localizer.localeCode());
    }
    if (info.username) parts.push(info.username);
    if (info.isPano) parts.push(t('inspector.mapillary_images.panorama'));
    return { text: parts.join(' · '), title };
}


export function uiFieldMapillaryImages(field: unknown, context: iD.Context) {
    const dispatch = d3_dispatch('change');
    let _tags: TagsMulti = {};
    let _entityIDs: string[] = [];
    /** keys with an extra empty input ("+" clicked) */
    let _pendingKeys = new Set<string>();
    /** "Add image" was clicked: a key chooser row is shown */
    let _adding = false;
    let _addKey: string | undefined;
    let _wrap = d3_select<HTMLDivElement, unknown>(null!);
    let _focusSelector: string | null = null;

    const singleTags = (): Tags => {
        const tags: Tags = {};
        for (const [key, value] of Object.entries(_tags)) {
            if (typeof value === 'string') tags[key] = value;
        }
        return tags;
    };


    function change(changes: TagsUpdate) {
        dispatch.call('change', mapillaryImages, changes);
    }


    function fillInfo(node: HTMLElement, id: string) {
        const info = d3_select(node);
        if (!id) {
            info.text('').attr('title', null);
            return;
        }
        info.text('…').attr('title', null).datum(id);
        loadImageInfo(id).then(result => {
            if (info.datum() !== id) return;   // the row shows another image by now
            if (!result) {
                info.text('');
                return;
            }
            const { text, title } = imageInfoText(result);
            info.text(text).attr('title', title || null);
        });
    }


    function drawImages(selection: Selection<any, ImageRow, any, any>) {
        const list = selection.selectAll<HTMLUListElement, ImageRow>('.mly-image-list')
            .data(d => [d]);
        const listEnter = list.enter().append('ul').attr('class', 'mly-image-list');

        const items = listEnter.merge(list).selectAll<HTMLLIElement, ImageEntry>('.mly-image')
            .data(row => row.ids.map((id, index) => ({ key: row.key, index, id })), d => d.index);
        items.exit().remove();

        const itemEnter = items.enter().append('li').attr('class', 'mly-image');
        const main = itemEnter.append('div').attr('class', 'mly-image-main');

        main.append('input')
            .attr('type', 'text')
            .attr('class', 'mly-image-input')
            .attr('placeholder', t('inspector.mapillary_images.image_id'))
            .call(utilNoAuto)
            .on('change', function(d3_event, d) {
                const value = (this as HTMLInputElement).value;
                _pendingKeys.delete(d.key);
                change(setImageChange(_tags, d.key, d.index, value));
                if (!value.trim()) render();
            });

        main.append('a')
            .attr('class', 'form-field-button mly-image-link')
            .attr('target', '_blank')
            .attr('rel', 'noopener noreferrer')
            .attr('title', t('inspector.mapillary_images.view_on_mapillary'))
            .call(svgIcon('#iD-icon-out-link', ''));

        main.append('button')
            .attr('type', 'button')
            .attr('class', 'form-field-button mly-image-show')
            .attr('title', t('inspector.mapillary_images.show_in_viewer'))
            .call(svgIcon('#fas-eye', ''))
            .on('click', function(d3_event, d) {
                d3_event.preventDefault();
                if (d.id) showMapillaryImage(context, d.id);
            });

        main.append('button')
            .attr('type', 'button')
            .attr('class', 'form-field-button mly-image-remove')
            .attr('title', t('inspector.mapillary_images.remove_image'))
            .call(svgIcon('#iD-icon-close', ''))
            .on('click', function(d3_event, d) {
                d3_event.preventDefault();
                if (!d.id) {
                    _pendingKeys.delete(d.key);
                    render();
                } else {
                    change(removeImageChange(_tags, d.key, d.index));
                }
            });

        itemEnter.append('div').attr('class', 'mly-image-info');

        const merged = itemEnter.merge(items);
        merged.classed('empty', d => !d.id);
        merged.select<HTMLInputElement>('.mly-image-input').each(function(d) {
            if (this !== document.activeElement) this.value = d.id;
        });
        merged.select<HTMLAnchorElement>('.mly-image-link')
            .attr('href', d => d.id ? `https://www.mapillary.com/app/?pKey=${encodeURIComponent(d.id)}` : null)
            .classed('disabled', d => !d.id);
        merged.select('.mly-image-show').property('disabled', d => !d.id);
        merged.select<HTMLElement>('.mly-image-info').each(function(d) {
            if (d3_select(this).datum() !== d.id || !this.textContent) fillInfo(this, d.id);
        });
    }


    function drawAddRow(wrap: Selection<HTMLDivElement, unknown, any, any>) {
        const keys = addableKeys(_tags);
        if (!_addKey || !keys.includes(_addKey)) _addKey = keys[0];

        const data = _adding && keys.length ? [0] : [];
        const row = wrap.selectAll<HTMLDivElement, number>('.mly-add-row').data(data);
        row.exit().remove();

        const rowEnter = row.enter().append('div').attr('class', 'mly-add-row');
        rowEnter.append('select')
            .attr('class', 'mly-add-key')
            .on('change', function() { _addKey = (this as HTMLSelectElement).value; });
        rowEnter.append('input')
            .attr('type', 'text')
            .attr('class', 'mly-add-input')
            .attr('placeholder', t('inspector.mapillary_images.image_id'))
            .call(utilNoAuto)
            .on('change', function() {
                const value = (this as HTMLInputElement).value;
                if (!_addKey || !value.trim()) return;
                const key = _addKey;
                _adding = false;
                _addKey = undefined;
                change(setImageChange(_tags, key, 0, value));
            });
        rowEnter.append('button')
            .attr('type', 'button')
            .attr('class', 'form-field-button mly-add-cancel')
            .call(svgIcon('#iD-icon-close', ''))
            .on('click', function(d3_event) {
                d3_event.preventDefault();
                _adding = false;
                render();
            });

        const options = row.merge(rowEnter).select('select').selectAll<HTMLOptionElement, string>('option')
            .data(keys, d => d);
        options.exit().remove();
        options.enter().append('option')
            .attr('value', d => d)
            .text(d => mapillaryKeyLabel(d) + ' — ' + d);
        row.merge(rowEnter).select<HTMLSelectElement>('select')
            .property('value', _addKey!)
            .selectAll<HTMLOptionElement, string>('option')
            .order();

        // the button
        const button = wrap.selectAll<HTMLButtonElement, number>('.mly-add-image')
            .data(_adding || !keys.length ? [] : [0]);
        button.exit().remove();
        button.enter().append('button')
            .attr('type', 'button')
            .attr('class', 'mly-add-image')
            .call(svgIcon('#iD-icon-plus', 'inline'))
            .call(t.append('inspector.mapillary_images.add_image'))
            .on('click', function(d3_event) {
                d3_event.preventDefault();
                _adding = true;
                _focusSelector = '.mly-add-input';
                render();
            });
    }


    function render() {
        if (_wrap.empty()) return;
        const rows = buildImageRows(singleTags(), _pendingKeys);

        const rowSel = _wrap.selectAll<HTMLDivElement, ImageRow>('.mly-key-row')
            .data(rows, d => d.key);
        rowSel.exit().remove();

        const rowEnter = rowSel.enter().append('div').attr('class', 'mly-key-row');
        const header = rowEnter.append('div').attr('class', 'mly-key-header');
        header.append('span').attr('class', 'mly-key-label');
        header.append('code').attr('class', 'mly-key-name');
        header.append('button')
            .attr('type', 'button')
            .attr('class', 'form-field-button mly-key-add')
            .attr('title', t('inspector.mapillary_images.add_to_key'))
            .call(svgIcon('#iD-icon-plus', ''))
            .on('click', function(d3_event, d) {
                d3_event.preventDefault();
                _pendingKeys.add(d.key);
                _focusSelector = `.mly-key-row[data-key="${d.key}"] .mly-image:last-child .mly-image-input`;
                render();
            });

        const merged = rowEnter.merge(rowSel)
            .attr('data-key', d => d.key)
            .order();
        merged.select('.mly-key-label').text(d => d.label);
        merged.select('.mly-key-name').text(d => d.key);
        merged.select<HTMLButtonElement>('.mly-key-add').property('disabled', d => _pendingKeys.has(d.key));
        merged.call(drawImages);

        // the add row/button always come last
        drawAddRow(_wrap);
        // (`select` would overwrite the children's data with the wrapper's)
        _wrap.selectAll('.mly-add-row, .mly-add-image').raise();

        if (_focusSelector) {
            const node = _wrap.node()?.querySelector<HTMLInputElement>(_focusSelector);
            _focusSelector = null;
            node?.focus();
        }
    }


    function mapillaryImages(selection: Selection<any, unknown, any, any>) {
        const wrap = selection.selectAll<HTMLDivElement, number>('.form-field-input-mapillary-images')
            .data([0]);
        const wrapEnter = wrap.enter()
            .append('div')
            .attr('class', 'form-field-input-mapillary-images');
        _wrap = wrapEnter.merge(wrap) as unknown as typeof _wrap;
        render();
    }


    mapillaryImages.tags = function(tags: TagsMulti) {
        _tags = tags;
        // pending inputs whose key got its first image are real rows now
        _pendingKeys = new Set([..._pendingKeys].filter(key => typeof tags[key] === 'string'));
        render();
        return mapillaryImages;
    };


    mapillaryImages.entityIDs = function(val?: string[]) {
        if (val === undefined) return _entityIDs;
        if (val.join() !== _entityIDs.join()) {
            _pendingKeys = new Set();
            _adding = false;
            _addKey = undefined;
        }
        _entityIDs = val;
        return mapillaryImages;
    };


    mapillaryImages.focus = function() {
        _wrap.node()?.querySelector<HTMLInputElement>('.mly-image-input')?.focus();
    };


    return utilRebind(mapillaryImages, dispatch, 'on');
}

uiFieldMapillaryImages.supportsMultiselection = false;
