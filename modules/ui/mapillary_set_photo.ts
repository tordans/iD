import { select as d3_select, type Selection } from 'd3-selection';

import { t } from '../core/localizer';
import { actionChangeTags } from '../actions';
import { geoSphericalDistance } from '../geo';
import { services } from '../services';
import { svgIcon } from '../svg/icon';
import { uiTooltip } from './tooltip';
import { activeTargetEvents, clearActiveTarget, getActiveTarget, setActiveTarget } from '../mapillary/active_target';
import { mapillaryKeyLabel } from '../mapillary/tag_keys';
import { appendImageId, disabledReason, hasImageId, resolveTargetKey, targetKeys } from '../mapillary/set_photo';

/**
 * "Set photo from viewer" for Mapillary (WORKDOC feature 20), used by `photoviewer.js` instead of
 * iD's button: the main button adds the shown image to the active target key (the row last
 * focused in the Mapillary images field, else `mapillary`); the caret opens a list of target keys.
 */
export function uiMapillarySetPhoto(context: iD.Context) {
    let _menuOpen = false;
    let _recompute: (() => void) | undefined;
    let _lastSelection = '';

    const selectionKey = () => context.selectedIDs().join(',');

    context.on('enter.mapillarySetPhoto', () => {
        const key = selectionKey();
        if (key !== _lastSelection) {
            _lastSelection = key;
            _menuOpen = false;
            clearActiveTarget();
        }
    });
    activeTargetEvents.on('change.mapillarySetPhoto', () => { refresh(); });
    let _subscribed = false;


    /** re-evaluate whether and how the button is shown (`photoviewer.js`'s `setPhotoTagButton`) */
    function refresh() {
        _recompute?.();
    }

    function selectedEntities() {
        const graph = context.graph();
        return context.selectedIDs().map(id => graph.hasEntity(id)).filter(Boolean) as iD.OsmEntity[];
    }

    function activeImage() {
        return services.mapillary?.getActiveImage?.();
    }

    function tooFar(entities: iD.OsmEntity[], image: { loc: [number, number] } | undefined) {
        return !!image && entities.every(entity => geoSphericalDistance(entity.extent(context.graph()).center(), image.loc) > 100);
    }

    function addImage(key: string) {
        const image = activeImage();
        if (!image) return;
        const id = String(image.id);
        const action = (graph: iD.Graph) =>
            context.selectedIDs().reduce((g, entityID) => {
                const entity = g.hasEntity(entityID);
                if (!entity) return g;
                const tags = entity.tags;
                return actionChangeTags(entityID, { ...tags, [key]: appendImageId(tags, key, id) })(g);
            }, graph);
        context.perform(action, t('operations.change_tags.annotation'));
    }

    function closeMenu() {
        if (!_menuOpen) return;
        _menuOpen = false;
        refresh();
    }

    function setTooltip(button: Selection<any, any, any, any>, text: string, placement = 'right') {
        const tooltip = uiTooltip as any;
        button.call(tooltip().destroyAny);
        button.call(tooltip().title(() => text).placement(placement));
        button.select('.tooltip').classed('dark', true).style('width', '300px');
    }


    function render(selection: Selection<any, unknown, any, any>, shouldDisplay: boolean, recompute: () => void) {
        _recompute = recompute;
        // (the service is initialized after the viewer is created)
        if (!_subscribed && services.mapillary?.event) {
            _subscribed = true;
            services.mapillary.event.on('imageChanged.mapillarySetPhoto', () => { refresh(); });
        }
        const group = selection.selectAll<HTMLDivElement, number>('.mly-set-photo').data(shouldDisplay ? [0] : []);
        group.exit().remove();
        if (!shouldDisplay) {
            _menuOpen = false;
            return;
        }

        const groupEnter = group.enter().append('div').attr('class', 'mly-set-photo');
        groupEnter.append('button')
            .attr('type', 'button')
            .attr('class', 'mly-set-photo-main')
            .call(svgIcon('#fas-eye-dropper', ''));
        groupEnter.append('button')
            .attr('type', 'button')
            .attr('class', 'mly-set-photo-caret')
            .call(svgIcon('#iD-icon-down', ''));
        groupEnter.append('ul').attr('class', 'mly-set-photo-menu');
        const merged = groupEnter.merge(group);

        const entities = selectedEntities();
        const image = activeImage();
        const id = image ? String(image.id) : undefined;
        const far = tooFar(entities, image as { loc: [number, number] } | undefined);
        const targetKey = resolveTargetKey(getActiveTarget(selectionKey()));
        const reason = disabledReason(entities.map(entity => entity.tags), targetKey, id, far);

        const main = merged.select<HTMLButtonElement>('.mly-set-photo-main');
        main.attr('disabled', reason ? 'true' : null)
            .classed('disabled', !!reason)
            .on('click', (d3_event: Event) => {
                d3_event.preventDefault();
                d3_event.stopPropagation();
                addImage(targetKey);
            });
        setTooltip(main, reason
            ? t(`inspector.set_photo_from_viewer.disable.${reason}`)
            : t('inspector.set_photo_from_viewer.mapillary_add_to', { key: targetKey }));

        const caret = merged.select<HTMLButtonElement>('.mly-set-photo-caret');
        caret.attr('disabled', far ? 'true' : null)
            .classed('disabled', far)
            .classed('active', _menuOpen)
            .on('click', (d3_event: Event) => {
                d3_event.preventDefault();
                d3_event.stopPropagation();
                _menuOpen = !_menuOpen;
                recompute();
            });
        setTooltip(caret, far ? t('inspector.set_photo_from_viewer.disable.too_far') : t('inspector.set_photo_from_viewer.mapillary_choose_target'));

        drawMenu(merged.select<HTMLUListElement>('.mly-set-photo-menu'), entities, id, far);
    }


    function drawMenu(menu: Selection<HTMLUListElement, any, any, any>, entities: iD.OsmEntity[], id: string | undefined, far: boolean) {
        menu.classed('open', _menuOpen && !far);
        const keys = _menuOpen && !far && entities.length ? targetKeys(entities[0].tags) : [];
        const items = menu.selectAll<HTMLLIElement, string>('li').data(keys, d => d).join(enter => {
            const li = enter.append('li');
            const button = li.append('button')
                .attr('type', 'button')
                .attr('class', 'mly-set-photo-item');
            button.append('span').attr('class', 'mly-set-photo-item-label');
            button.append('code').attr('class', 'mly-set-photo-item-key');
            return li;
        });
        const buttons = items.select<HTMLButtonElement>('button');
        const active = resolveTargetKey(getActiveTarget(selectionKey()));
        buttons.classed('active-target', d => d === active);
        buttons.select('.mly-set-photo-item-label').text(d => mapillaryKeyLabel(d));
        buttons.select('.mly-set-photo-item-key').text(d => d);
        buttons.each(function(d) {
            const already = !!id && entities.length > 0 && entities.every(entity => hasImageId(entity.tags, d, id));
            const button = d3_select(this);
            button.attr('disabled', already ? 'true' : null).classed('disabled', already);
            setTooltip(button, already
                ? t('inspector.set_photo_from_viewer.mapillary_already_in_key', { key: d })
                : t('inspector.set_photo_from_viewer.mapillary_add_to_key', { key: d }), 'left');
        });
        buttons.on('click', (d3_event: Event, d: string) => {
            d3_event.preventDefault();
            d3_event.stopPropagation();
            _menuOpen = false;
            setActiveTarget(selectionKey(), d);
            addImage(d);
        });

        if (_menuOpen) {
            d3_select(document)
                .on('pointerdown.mapillarySetPhoto keydown.mapillarySetPhoto', (d3_event: Event) => {
                    const target = d3_event.target as Element | null;
                    const escape = d3_event.type === 'keydown' && (d3_event as KeyboardEvent).key === 'Escape';
                    if (escape || (d3_event.type === 'pointerdown' && !target?.closest?.('.mly-set-photo'))) {
                        d3_select(document).on('pointerdown.mapillarySetPhoto keydown.mapillarySetPhoto', null);
                        closeMenu();
                    }
                });
        }
    }


    return { render };
}
