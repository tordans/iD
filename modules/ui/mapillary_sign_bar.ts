import { select as d3_select } from 'd3-selection';

import { actionChangeTags } from '../actions';
import { t, localizer } from '../core/localizer';
import { services } from '../services';
import { svgIcon } from '../svg/icon';
import { loadSignRecommender, loadedSignDescriber, type SignDescription } from '../traffic_sign/recommender';
import { signGroupsOf, signMeaning, signName } from '../mapillary/sign_groups';
import { clearSelectedSign, selectedSign, showSignImage, signSelectEvents, type SelectedSign } from '../mapillary/sign_select';
import { changeLabel, directionalTags, sideOfLine, signButtonKeys, signDirectionOnWay, signSourceChanges, signTagChanges, type SignDirection } from '../mapillary/sign_tagging';
import { dayLabels, type ImageDay } from '../mapillary/sign_view';
import type { coreContext } from '../core';

/**
 * The bar of the selected Mapillary traffic sign in the photo viewer (WORKDOC feature 26): what the
 * sign is, its images by capture day, and buttons that write it to the selected way.
 */

type Action = {
    id: string;
    label: string;
    title: string;
    present: boolean;
    replaces?: string;
    /** sign buttons: the sign value, and whether the key fits the sign's direction */
    sign?: string;
    suggested?: boolean;
    /** the image as source of the sign */
    source?: boolean;
    changes: Record<string, string>;
};



export function initMapillarySignBar(context: coreContext) {
    const render = () => renderSignBar(context);
    signSelectEvents.on('change.signBar', render);
    context.history().on('change.signBar', render);
    context.on('enter.signBar', render);
    services.mapillary?.event.on('imageChanged.signBar', () => {
        // closing the viewer ends the sign selection too (one close for both)
        const sign = selectedSign();
        // (`hideViewer` sends this before it marks the viewer as closed; its `hide` class is already set)
        const closed = context.container().select('.photoviewer').classed('hide');
        if (sign && !sign.loading && closed) {
            clearSelectedSign();
        } else {
            render();
        }
    });
}


/** `regulatory--turn-right-ahead--g1` → "Turn right ahead" */
function mapillaryLabel(value: string): string {
    const name = signName(value).replace(/-/g, ' ');
    return name.charAt(0).toUpperCase() + name.slice(1);
}


function describe(context: coreContext, signs: string[]): SignDescription[] | undefined {
    const describer = loadedSignDescriber();
    if (!describer) {
        // the traffic sign tool's names and icons load with its bundle
        loadSignRecommender(context).then(() => renderSignBar(context)).catch(() => {});
        return undefined;
    }
    return signs.flatMap(sign => describer(sign));
}


/** The selected way, if exactly one way is selected */
function selectedWay(context: coreContext): iD.OsmWay | undefined {
    const ids = context.selectedIDs();
    if (ids.length !== 1) return undefined;
    const entity = context.hasEntity(ids[0]);
    return entity?.type === 'way' ? entity as iD.OsmWay : undefined;
}


function labelled(tags: Record<string, string>, changes: Record<string, string>, title: string) {
    const { label, present, replaces } = changeLabel(tags, changes);
    const note = present ? t('mapillary_sign_bar.present') : replaces ? t('mapillary_sign_bar.replaces', { value: replaces }) : '';
    return { label, present, replaces, changes, title: note ? `${title} (${note})` : title };
}


function actionsFor(sign: SelectedSign, tags: Record<string, string>, keys: string[], suggested: string, direction?: SignDirection): Action[] {
    const meaning = signMeaning(sign.value);
    if (!meaning) return [];
    // speed signs: the direction the sign applies to first (`maxspeed:forward`), then both directions
    const tagSets = (meaning.tags ?? []).flatMap(changes => direction ? [directionalTags(changes, direction), changes] : [changes]);
    // the label is the main tag (with what is tagged now); the tooltip lists all of them (with the source)
    const actions: Action[] = tagSets.map((changes, i) => {
        const list = Object.entries(changes).map(([k, v]) => `${k}=${v}`);
        return { id: `tags-${i}`, ...labelled(tags, changes, `${t('mapillary_sign_bar.write_tags')}: ${list.join(', ')}`) };
    });
    // each possible sign as `key=value` for the plain key and its directions
    for (const value of meaning.signs) {
        for (const key of keys) {
            const changes = signTagChanges(tags, key, value);
            actions.push({
                id: `sign-${value}-${key}`,
                sign: value,
                suggested: key === suggested,
                ...labelled(tags, changes, t('mapillary_sign_bar.write_sign', { key }))
            });
        }
    }
    // the image as source of the suggested key: `source:traffic_sign:mapillary=1586…`
    if (sign.imageId) {
        const changes = signSourceChanges(tags, suggested, sign.imageId);
        actions.push({ id: 'source', source: true, ...labelled(tags, changes, t('mapillary_sign_bar.write_source')) });
    }
    return actions;
}


export function renderSignBar(context: coreContext) {
    // the bar sits above the viewer, over the map, so the image stays free
    const viewer = context.container().select('.photoviewer');
    const mapillaryShown = !context.container().select('.photoviewer .mly-wrapper:not(.hide)').empty();
    if (viewer.empty()) return;
    const sign = mapillaryShown ? selectedSign() : null;

    let bar = viewer.selectAll<HTMLDivElement, SelectedSign>('.mapillary-sign-bar')
        .data(sign ? [sign] : []);
    bar.exit().remove();
    const enter = bar.enter()
        .append('div')
        .attr('class', 'mapillary-sign-bar');

    const head = enter.append('div').attr('class', 'mapillary-sign-bar-head');
    head.append('span').attr('class', 'mapillary-sign-bar-icons');
    head.append('span').attr('class', 'mapillary-sign-bar-name');
    head.append('span').attr('class', 'mapillary-sign-bar-direction hide');
    enter.append('div').attr('class', 'mapillary-sign-bar-days');
    // what can be written to the selected way, separated from the images above
    const write = enter.append('div').attr('class', 'mapillary-sign-bar-write');
    write.append('div').attr('class', 'mapillary-sign-bar-actions mapillary-sign-bar-tags');
    write.append('div').attr('class', 'mapillary-sign-bar-signs');
    write.append('div').attr('class', 'mapillary-sign-bar-actions mapillary-sign-bar-source');

    bar = enter.merge(bar);
    if (!sign) return;

    renderHead(context, bar, sign);
    renderDays(context, bar.select('.mapillary-sign-bar-days'), sign);
    renderActions(context, bar, sign);
}


function renderHead(context: coreContext, bar: d3.Selection<HTMLDivElement>, sign: SelectedSign) {
    const meaning = signMeaning(sign.value);
    const described = meaning ? describe(context, [meaning.signs[0]]) : undefined;

    // the Mapillary icon, then the German sign(s) when we know them
    const icons = [{
        id: `mapillary-${sign.value}`,
        href: `#${sign.value}`,
        svg: undefined as string | undefined,
        title: t('mapillary_sign_bar.icon.mapillary', { value: sign.value })
    }].concat((described ?? []).filter(d => d.svgName).map(d => ({
        id: d.value,
        href: '',
        svg: context.asset(`traffic-sign-converter/data-svgs/DE/svgs/${d.svgName}.svg`),
        title: t('mapillary_sign_bar.icon.sign', { sign: d.value.startsWith('DE:') ? d.value : `DE:${d.value}`, name: d.name })
    })));
    const icon = bar.select('.mapillary-sign-bar-icons').selectAll<HTMLElement, typeof icons[0]>('.mapillary-sign-bar-icon')
        .data(icons, d => d.id);
    icon.exit().remove();
    const iconEnter = icon.enter()
        .append(d => document.createElement(d.svg ? 'img' : 'span'))
        .attr('class', 'mapillary-sign-bar-icon')
        .each(function(d) {
            if (d.svg) {
                d3_select(this).attr('src', d.svg).attr('alt', d.id);
            } else {
                d3_select(this).append('svg').append('use').attr('href', d.href);
            }
        });
    iconEnter.merge(icon)
        .attr('title', d => d.title)
        .order();

    const name = described?.[0]?.known
        ? `${meaning!.signs[0]} ${described[0].name}`
        : meaning ? `${meaning.signs[0]} · ${mapillaryLabel(sign.value)}` : mapillaryLabel(sign.value);
    bar.select('.mapillary-sign-bar-name')
        .text(sign.loading ? `${name} – ${t('mapillary_sign_bar.loading')}` : name)
        .attr('title', sign.value);
}


function renderDays(context: coreContext, selection: d3.Selection<HTMLDivElement>, sign: SelectedSign) {
    const shownId = services.mapillary?.getActiveImage()?.id;
    const isShown = (day: ImageDay) => day.images.some(image => image.id === shownId);

    const buttons = selection.selectAll<HTMLButtonElement, ImageDay>('.mapillary-sign-bar-day')
        .data(sign.days, d => d.day);
    buttons.exit().remove();
    const enter = buttons.enter()
        .append('button')
        .attr('type', 'button')
        .attr('class', 'mapillary-sign-bar-day')
        .on('click', (_event, day) => {
            // a click on the shown day steps through its images
            const index = day.images.findIndex(image => image.id === services.mapillary?.getActiveImage()?.id);
            const next = index >= 0 ? day.images[(index + 1) % day.images.length] : day.best;
            showSignImage(context, next.id);
        });
    // left: month and year over the age; right: an image icon with "2/4"
    const dates = enter.append('span').attr('class', 'mapillary-sign-bar-day-dates');
    dates.append('span').attr('class', 'mapillary-sign-bar-day-month');
    dates.append('span').attr('class', 'mapillary-sign-bar-day-age');
    const count = enter.append('span').attr('class', 'mapillary-sign-bar-day-count');
    count.call(svgIcon('#far-image', 'mapillary-sign-bar-day-icon'));
    count.append('span').attr('class', 'mapillary-sign-bar-day-position');

    const all = enter.merge(buttons)
        .classed('active', isShown)
        .attr('title', day => {
            const creators = [...new Set(day.images.map(image => image.creator).filter(Boolean))].join(', ');
            const pano = day.images.every(image => image.isPano) ? ' · 360°' : '';
            const index = day.images.findIndex(image => image.id === shownId);
            const position = index >= 0 && day.images.length > 1 ? ` · ${t('mapillary_sign_bar.image_of', { n: index + 1, count: day.images.length })}` : '';
            const date = new Date(`${day.day}T12:00:00Z`).toLocaleDateString(localizer.languageCode(), { dateStyle: 'long', timeZone: 'UTC' });
            return `${date} · ${creators}${pano}${position}`;
        });
    const now = new Date();
    const locale = localizer.languageCode();
    all.select('.mapillary-sign-bar-day-month').text(day => dayLabels(day.day, now, locale).month);
    all.select('.mapillary-sign-bar-day-age').text(day => dayLabels(day.day, now, locale).age);
    all.attr('aria-label', day => new Date(`${day.day}T12:00:00Z`).toLocaleDateString(locale, { dateStyle: 'long', timeZone: 'UTC' }));
    // keep the shown day in view when the row scrolls
    const active = all.filter(isShown).node();
    if (active && active.parentElement) {
        const row = active.parentElement;
        if (active.offsetLeft < row.scrollLeft || active.offsetLeft + active.offsetWidth > row.scrollLeft + row.clientWidth) {
            row.scrollLeft = active.offsetLeft - 4;
        }
    }
    all.select('.mapillary-sign-bar-day-position').text(day => {
        const index = day.images.findIndex(image => image.id === shownId);
        return index >= 0 ? `${index + 1}/${day.images.length}` : String(day.images.length);
    });
}


function renderActions(context: coreContext, bar: d3.Selection<HTMLDivElement>, sign: SelectedSign) {
    const way = selectedWay(context);
    const tags = (way?.tags ?? {}) as Record<string, string>;
    const coords = way ? context.graph().childNodes(way).map(node => node.loc as [number, number]) : [];
    const direction = way ? signDirectionOnWay(coords, sign.loc, sign.facing) : undefined;
    const { keys, suggested } = signButtonKeys(tags, {
        bikeSign: signGroupsOf(sign.value).includes('bike'),
        side: sideOfLine(coords, sign.loc),
        direction
    });
    const actions = way ? actionsFor(sign, tags, keys, suggested, direction) : [];

    // which way along the selected way the sign applies to
    bar.select('.mapillary-sign-bar-direction')
        .classed('hide', !direction)
        .text(direction ? t(`mapillary_sign_bar.direction.${direction}`) : '')
        .attr('title', direction ? t('mapillary_sign_bar.direction.tooltip') : null);

    const tagActions = actions.filter(action => !action.sign && !action.source);
    const signActions = actions.filter(action => action.sign);
    const sourceActions = actions.filter(action => action.source);
    bar.select('.mapillary-sign-bar-write').classed('hide', !actions.length);
    renderButtons(context, bar.select<HTMLDivElement>('.mapillary-sign-bar-tags').classed('hide', !tagActions.length), tagActions);
    renderButtons(context, bar.select<HTMLDivElement>('.mapillary-sign-bar-source').classed('hide', !sourceActions.length), sourceActions);

    // one row of `key=value` buttons per possible sign
    const signValues = [...new Set(signActions.map(action => action.sign!))];
    const rows = bar.select('.mapillary-sign-bar-signs')
        .classed('hide', !signActions.length)
        .selectAll<HTMLDivElement, string>('.mapillary-sign-bar-actions')
        .data(signValues, d => d);
    rows.exit().remove();
    rows.enter()
        .append('div')
        .attr('class', 'mapillary-sign-bar-actions')
        .merge(rows)
        .order()
        .each(function(value) {
            renderButtons(context, d3_select<HTMLDivElement, string>(this), signActions.filter(action => action.sign === value));
        });
}


function renderButtons(context: coreContext, row: d3.Selection<HTMLDivElement>, actions: Action[]) {
    const buttons = row.selectAll<HTMLButtonElement, Action>('.mapillary-sign-bar-action')
        .data(actions, d => d.id);
    buttons.exit().remove();
    buttons.enter()
        .append('button')
        .attr('type', 'button')
        .attr('class', 'mapillary-sign-bar-action')
        .merge(buttons)
        .order()
        .text(d => d.label)
        .attr('title', d => d.suggested ? `${d.title} – ${t('mapillary_sign_bar.suggested')}` : d.title)
        .classed('present', d => d.present)
        .classed('replaces', d => !!d.replaces)
        .classed('suggested', d => !!d.suggested && !d.present)
        .property('disabled', d => d.present)
        .on('click', (_event, d) => {
            const entity = selectedWay(context);
            if (!entity) return;
            context.perform(
                actionChangeTags(entity.id, { ...entity.tags, ...d.changes }),
                t('mapillary_sign_bar.annotation')
            );
        });
}
