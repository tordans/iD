import { select as d3_select } from 'd3-selection';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

import { utilHighlightEntities } from '../util';
import { linkifyOsmReferences } from '../util/maproulette_markdown';
import { modeSelect } from '../modes';
import { modeSelectError } from '../modes/select_error';
import { t } from '../core/localizer';
import { services } from '../services';
import { appendMapRoulettePinIcon } from '../svg/maproulette_logo';
import { updateMapRouletteV4Pin } from '../svg/maproulette_marker';
import { pinDisplayStatusOf } from '../util/maproulette_status';
import { uiDisclosure } from './disclosure';

export function uiMapRouletteDetails(context: any) {
  const mr = services.maproulette;
  let _qaItem: any;
  /** When true, render for the entity inspector (no pin-selection guard; instructions only). */
  let _embedded = false;
  /** Task is queued/resolved — Details/Instructions default collapsed. */
  let _done = false;
  /** Session expand overrides for Details/Instructions (keyed by taskId:section). */
  const _sectionExpanded: Record<string, boolean> = {};

  /**
   * Escape a value for interpolation into HTML text or attribute context.
   * Challenge markdown, task titles and task GeoJSON properties are all
   * arbitrary remote input (any MapRoulette challenge author controls them).
   */
  function escapeHTML(value: unknown): string {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function generateDropdownHtml(dropdownName: string, options: string[]): string {
    return `<select name="${escapeHTML(dropdownName)}"><option value=""></option>${options
      .map(function(option) {
        return `<option value="${escapeHTML(option.trim())}">${escapeHTML(option.trim())}</option>`;
      })
      .join('')}</select>`;
  }

  function generateDynamicContent(text: string): string {
    if (!text) return '';
    const segments = text.split(
      /\[select\s+&quot;\s*[^\"]*?\s*&quot;\s+name=&quot;/,
    );
    let transformedText = segments[0];
    segments.slice(1).forEach(function(segment) {
      const endIndex = segment.indexOf('&quot;');
      const dropdownName = segment.substring(0, endIndex);
      const valuesStart =
        segment.indexOf('values=&quot;') + 'values=&quot;'.length;
      const valuesEnd = segment.indexOf('&quot;', valuesStart);
      const options = segment
        .substring(valuesStart, valuesEnd)
        .split(',');
      const dropdownHtml = generateDropdownHtml(dropdownName, options);
      const remainder = segment
        .substring(valuesEnd + '&quot;'.length)
        .trim()
        .replace(/^\]/, '');
      transformedText += dropdownHtml + remainder;
    });
    return transformedText;
  }

  function replaceMustacheTags(text: string, task: any): string {
    if (!text) return '';
    const tagRegex = /\{\{([\w:]+)\}\}/g;

    function buildAllProperties(obj: any): Map<string, any> {
      const all = new Map<string, any>();
      if (!obj) return all;
      if (Array.isArray(obj.taskFeatures)) {
        obj.taskFeatures
          .map(function(f: any) { return (f && f.properties) || {}; })
          .forEach(function(props: any) {
            Object.keys(props).forEach(function(key) {
              all.set(key, props[key]);
            });
          });
      }
      if (obj.properties) {
        Object.keys(obj.properties).forEach(function(key) {
          all.set(key, obj.properties[key]);
        });
      }
      const geom = obj.geometries || obj.geojson || obj.geometry;
      if (geom) {
        if (geom.properties) {
          Object.keys(geom.properties).forEach(function(key) {
            all.set(key, geom.properties[key]);
          });
        }
        if (Array.isArray(geom.features) && geom.features.length) {
          const featProps =
            geom.features[0] && geom.features[0].properties;
          if (featProps) {
            Object.keys(featProps).forEach(function(key) {
              all.set(key, featProps[key]);
            });
          }
        }
      }
      Object.keys(obj).forEach(function(key) {
        if (!all.has(key)) all.set(key, obj[key]);
      });
      return all;
    }

    const allProps = buildAllProperties(task);

    return text.replace(tagRegex, function(match, propertyName) {
      if (propertyName === 'osmIdentifier' && task && task.title) {
        const osmId = String(task.title).split('@')[0];
        const longForm = osmId.replace(/^([wnr])(\d+)$/, function(_match, prefix: string, num: string) {
          const type = { w: 'way', n: 'node', r: 'relation' }[prefix];
          return type ? `${type}/${num}` : osmId;
        });
        // Only linkify well-formed ids; anything else could break out of
        // the attribute context below.
        if (!/^(way|node|relation)\/\d+$/.test(longForm)) return escapeHTML(osmId);
        return longForm;
      }
      if (allProps.has(propertyName)) {
        const val = allProps.get(propertyName);
        return val !== undefined && val !== null ? escapeHTML(val) : '';
      }
      return match;
    });
  }

  function sanitizeHTML(dirty: string): string {
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: [
        'a', 'b', 'br', 'code', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'hr', 'i', 'img', 'li', 'mark', 'ol', 'option', 'p', 'pre', 'select',
        'small', 'span', 'strong', 'sub', 'sup', 'table', 'tbody', 'td', 'th',
        'thead', 'tr', 'u', 'ul',
      ],
      ALLOWED_ATTR: [
        'class', 'href', 'id', 'name', 'rel', 'src', 'target', 'title', 'alt',
        'value', 'data-osm-id',
      ],
      ALLOW_DATA_ATTR: false,
      FORBID_TAGS: ['style', 'script', 'iframe', 'form', 'input', 'button'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'style'],
    });
  }

  function renderMarkdown(text: string, task: any): string {
    if (!text) return '';
    const html = marked.parse(replaceMustacheTags(text, task)) as string;
    return sanitizeHTML(
      generateDynamicContent(linkifyOsmReferences(html)),
    );
  }

  function attachExternalLinkAttrs(selection: any): void {
    selection
      .selectAll('a:not(.highlight-link)')
      .attr('rel', 'noopener')
      .attr('target', '_blank');
  }

  function clearLoadingState(detailsSel: any): void {
    detailsSel.select('.qa-details-loading')
      .classed('loading', false)
      .attr('aria-busy', null);
  }

  function clearTaskBody(detailsSel: any): void {
    clearLoadingState(detailsSel);
    detailsSel.select('.qa-details-loading').remove();
    detailsSel.selectAll('.mr-section-disclosure, .mr-task-load-notice').remove();
  }

  function showTaskBodyMessage(detailsSel: any, message: string): void {
    clearTaskBody(detailsSel);
    detailsSel.append('p')
      .attr('class', 'mr-task-load-notice')
      .text(message);
  }

  function taskIdKey(): string | null {
    return _qaItem && _qaItem.id !== undefined && _qaItem.id !== null ? String(_qaItem.id) : null;
  }

  function sectionExpandedKey(section: 'detail' | 'instruction'): string | null {
    const id = taskIdKey();
    return id ? `${id}:${section}` : null;
  }

  function isSectionExpanded(section: 'detail' | 'instruction'): boolean {
    const key = sectionExpandedKey(section);
    if (key && Object.prototype.hasOwnProperty.call(_sectionExpanded, key)) {
      return !!_sectionExpanded[key];
    }
    // Open while working the task; closed after a status decision.
    return !_done;
  }

  function setSectionExpanded(section: 'detail' | 'instruction', expanded: boolean): void {
    const key = sectionExpandedKey(section);
    if (!key) return;
    _sectionExpanded[key] = expanded;
  }

  /** Keep existing disclosures in sync when done/active flips before async reload finishes. */
  function syncSectionDisclosureOpen(detailsSel: any): void {
    (['detail', 'instruction'] as const).forEach(function(section) {
      const wrap = detailsSel.select(`.mr-section-${section} details.disclosure-wrap`);
      if (wrap.empty()) return;
      const expanded = isSectionExpanded(section);
      wrap.property('open', expanded);
      const summary = wrap.select('summary.hide-toggle');
      summary
        .classed('expanded', expanded)
        .attr('title', t(`icons.${expanded ? 'collapse' : 'expand'}`));
      summary.select('.hide-toggle-icon')
        .attr('xlink:href', expanded ? '#iD-icon-down' : '#iD-icon-forward');
    });
  }

  /** Open statuses may show the priority wedge; done / terminal pins are solid fill only. */
  function pinPriorityForDisplay(d: any, status: number): number | null {
    if (_done) return null;
    if (status !== 0 && status !== 3) return null;
    return taskPriorityOf(d);
  }

  /**
   * Details / Instructions as iD disclosures (blue hide-toggle + arrow).
   * Default open when the task is active; default closed when done.
   */
  function panelDisclosureTitle(section: 'detail' | 'instruction'): string {
    return section === 'detail'
      ? t('map_data.layers.maproulette.detail_title')
      : t('map_data.layers.maproulette.instruction_title');
  }

  function appendSectionDisclosure(
    parent: any,
    section: 'detail' | 'instruction',
    label: string | ((sel: any) => void),
    html: string,
  ): void {
    const id = taskIdKey() || 'unknown';
    const disclosureKey = `maproulette-${section}-${id}`;
    const host = parent
      .append('section')
      .attr('class', `mr-section-disclosure mr-section-${section}`);

    host.call(
      (uiDisclosure(context, disclosureKey, !_done) as any)
        .updatePreference(false)
        .expanded(isSectionExpanded(section))
        .label(label)
        .content(function(contentSel: any) {
          const box = contentSel
            .selectAll('.qa-details-container')
            .data([0]);
          const boxEnter = box.enter()
            .append('div')
            .attr('class', 'qa-details-container');
          boxEnter.merge(box)
            .html(html);
          attachExternalLinkAttrs(contentSel);
          attachHighlightLinkHandlers(contentSel);
        })
        .on('toggled', function(expanded: boolean) {
          setSectionExpanded(section, expanded);
        }),
    );
  }

  function attachHighlightLinkHandlers(selection: any): void {
    selection
      .selectAll('.highlight-link')
      .on('mouseover', function(this: Element) {
        const osmId = transformId(d3_select(this).attr('data-osm-id'));
        utilHighlightEntities([osmId], true, context);
      })
      .on('mouseout', function(this: Element) {
        const osmId = transformId(d3_select(this).attr('data-osm-id'));
        utilHighlightEntities([osmId], false, context);
      })
      .on('click', function(this: Element, d3_event: Event) {
        d3_event.preventDefault();
        const osmId = transformId(d3_select(this).attr('data-osm-id'));
        utilHighlightEntities([osmId], false, context);
        if (context.hasEntity && context.hasEntity(osmId)) {
          if (typeof context.zoomToEntities === 'function') {
            context.zoomToEntities([osmId], true);
          }
          context.enter(modeSelect(context, [osmId]));
        }
      });
  }

  /**
   * Transform OSM-style ids like "way/123" to iD-style shorthand "w123".
   */
  function transformId(id: string): import('../osm').EntityId {
    return id.replace(/^(way|node|relation)\//, function(match) {
      switch (match) {
        case 'way/': return 'w';
        case 'node/': return 'n';
        case 'relation/': return 'r';
        default: return match;
      }
    }) as import('../osm').EntityId;
  }

  /** Transform iD-style "w123" to display form "way/123". */
  function longFormId(id: string): string {
    return id.replace(/^[wnr]/, function(prefix) {
      switch (prefix) {
        case 'w': return 'way/';
        case 'n': return 'node/';
        case 'r': return 'relation/';
        default: return prefix;
      }
    });
  }

  /** Shared label + value row for task meta (challenge id, recognised OSM objects, …). */
  function appendMetaHeader(
    parent: any,
    title: string,
    fill: (section: any) => void,
  ): void {
    const section = parent
      .append('div')
      .attr('class', 'qa-details-header');
    section.append('h4').text(title);
    fill(section);
  }

  /** Render recognised OSM entity links from task.elems (iD ids like w123). */
  function appendRecognisedElems(parent: any, elems: string[] | undefined): void {
    if (!Array.isArray(elems) || !elems.length) return;

    appendMetaHeader(parent, t('map_data.layers.maproulette.elems_title'), function(section) {
      const p = section.append('p').attr('class', 'mr-recognised-elems');
      elems.forEach(function(entityId, i) {
        if (i > 0) p.append('span').text(', ');
        const longForm = longFormId(entityId);
        p.append('a')
          .attr('href', '#')
          .attr('class', 'highlight-link')
          .attr('data-osm-id', longForm)
          .text(longForm);
      });
    });
  }

  /**
   * Challenge/task id + recognised OSM objects sit under the DEU header,
   * above the status banner / next-step actions.
   */
  function renderTaskMeta(detailsSel: any, task: any): void {
    if (_embedded) return;

    let meta = detailsSel.selectAll('.mr-task-meta').data([0]);
    meta.exit().remove();
    meta = meta.enter()
      .insert('section', '.mr-resolved-banner, .mr-queued-banner, .mr-next-actions, .qa-details-loading, .mr-section-disclosure')
      .attr('class', 'mr-task-meta')
      .merge(meta);

    meta.html('');

    if (task && task.id) {
      appendMetaHeader(meta, t('map_data.layers.maproulette.id_title'), function(section) {
        section.append('p').text(`${task.parentId} / ${task.id}`);
      });
    }

    appendRecognisedElems(
      meta,
      (_qaItem && _qaItem.elems) || (task && task.elems),
    );
    attachHighlightLinkHandlers(meta);
  }

  function taskPriorityOf(d: any): number | null {
    const raw = (d && d.taskPriority !== undefined && d.taskPriority !== null)
      ? d.taskPriority
      : (d && d.task && d.task.priority);
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }

  function render(selection: any): void {
    let details = selection
      .selectAll('.error-details')
      .data(_qaItem ? [_qaItem] : [], function(d: any) { return d.id; });
    details.exit().remove();

    const detailsEnter = details
      .enter()
      .append('div')
      .attr('class', 'error-details');

    if (!_embedded) {
      const headerEnter = detailsEnter
        .append('header')
        .attr('class', 'qa-header');

      const iconEnter = headerEnter
        .append('div')
        .attr('class', 'qa-header-icon');

      iconEnter.each(function(this: HTMLElement, d: any) {
        const status = pinDisplayStatusOf(mr, d);
        appendMapRoulettePinIcon(d3_select(this), {
          width: 20,
          height: 27,
          className: `preset-icon-28 qaItem ${d.service} itemId-${d.id} itemType-${d.itemType}`,
          status,
          priority: pinPriorityForDisplay(d, status),
        });
      });

      headerEnter.append('div').attr('class', 'qa-header-label');
    }

    detailsEnter
      .append('div')
      .attr('class', 'qa-details-loading loading')
      .attr('aria-busy', 'true')
      .append('span')
      .attr('class', 'qa-details-loading-spinner')
      .attr('aria-hidden', 'true');

    detailsEnter.select('.qa-details-loading')
      .append('span')
      .attr('class', 'qa-details-loading-text')
      .text(t('map_data.layers.maproulette.loading_task_details'));

    details = details.merge(detailsEnter);

    // Collapse/expand existing sections immediately when done state flips.
    syncSectionDisclosureOpen(details);

    if (!_embedded) {
      details.select('.qa-header-icon').each(function(this: HTMLElement, d: any) {
        const pin = d3_select(this).select('svg .maproulette-pin');
        if (pin.empty()) return;
        const status = pinDisplayStatusOf(mr, d);
        updateMapRouletteV4Pin(pin, {
          status,
          priority: pinPriorityForDisplay(d, status),
        });
      });
    }

    if (mr && _qaItem) {
      const thisItem = _qaItem;
      mr.loadTaskDetailAsync(_qaItem)
        .then(function(task: any) {
          if (details.empty()) return;

          // Do nothing if the UI has moved on by the time this resolves
          // (same guard as osmose_details: still selected or still hovered).
          // Embedded inspector mode skips this — the entity editor owns lifetime.
          const thisTaskId = String(thisItem.id);
          const selectedId = context.selectedErrorID();
          const stale = (
            !_embedded &&
            String(selectedId) !== thisTaskId &&
            context.container().selectAll(`.qaItem.maproulette.hover.itemId-${thisTaskId}`).empty()
          );
          if (stale) {
            clearLoadingState(details);
            return;
          }

          if (!task) {
            showTaskBodyMessage(details, t('map_data.layers.maproulette.no_instruction'));
            return;
          }

          try {
          clearTaskBody(details);

          if (_embedded) {
            // Entity-inspector embed: same Details + Instructions content as the
            // pin panel (no action buttons). First section title links to the task.
            let linkedTitleUsed = false;

            function embeddedDisclosureLabel(kind: 'detail' | 'instruction') {
              return function(labelSel: any) {
                if (!linkedTitleUsed && _qaItem && _qaItem.id) {
                  linkedTitleUsed = true;
                  labelSel
                    .append('span')
                    .text(
                      kind === 'detail'
                        ? t('map_data.layers.maproulette.detail_title_for_task')
                        : t('map_data.layers.maproulette.instruction_title_for_task'),
                    );
                  labelSel
                    .append('a')
                    .attr('href', '#')
                    .attr('class', 'mr-task-select-link')
                    .attr('data-task-id', String(_qaItem.id))
                    .text('#' + _qaItem.id);
                } else {
                  labelSel.text(
                    kind === 'detail'
                      ? t('map_data.layers.maproulette.detail_title')
                      : t('map_data.layers.maproulette.instruction_title'),
                  );
                }
              };
            }

            const hasDescription = !!task.description;
            const hasInstruction = !!task.instruction &&
              task.instruction !== task.description;

            if (hasDescription) {
              appendSectionDisclosure(
                details,
                'detail',
                embeddedDisclosureLabel('detail'),
                renderMarkdown(task.description, task),
              );
            }

            if (hasInstruction || (!hasDescription && task.instruction)) {
              appendSectionDisclosure(
                details,
                'instruction',
                embeddedDisclosureLabel('instruction'),
                renderMarkdown(task.instruction, task),
              );
            }

            if (!hasDescription && !task.instruction) {
              showTaskBodyMessage(details, t('map_data.layers.maproulette.no_instruction'));
            }

            details.selectAll('.mr-task-select-link')
              .on('click', function(this: Element, d3_event: Event) {
                d3_event.preventDefault();
                const taskId = d3_select(this).attr('data-task-id');
                if (!taskId) return;
                context.selectedErrorID(taskId);
                context.enter(modeSelectError(context, taskId, 'maproulette'));
              });
            return;
          }

          const headerLabel = details.selectAll('.qa-header .qa-header-label');
          const headerText =
            task.parentName || t('map_data.layers.maproulette.title');
          headerLabel.text(headerText);

          renderTaskMeta(details, task);

          const description = renderMarkdown(task.description, task);
          const instruction = renderMarkdown(task.instruction, task);

          const explicitChallengeIdGiven = Boolean(
            mr && mr.challengeIDs && mr.challengeIDs(),
          );

          if (!explicitChallengeIdGiven && task.description) {
            appendSectionDisclosure(
              details,
              'detail',
              panelDisclosureTitle('detail'),
              description,
            );
          }

          if (task.instruction && task.instruction !== task.description) {
            appendSectionDisclosure(
              details,
              'instruction',
              panelDisclosureTitle('instruction'),
              instruction,
            );
          }

          attachHighlightLinkHandlers(details);
          } catch {
            showTaskBodyMessage(details, t('map_data.layers.maproulette.error_loading_task_details'));
          }
        })
        .catch(function() {
          if (details.empty()) return;
          showTaskBodyMessage(details, t('map_data.layers.maproulette.error_loading_task_details'));
        });
    }
  }

  render.task = function(val?: any) {
    if (!arguments.length) return _qaItem;
    _qaItem = val;
    return render;
  };

  render.done = function(val?: boolean) {
    if (!arguments.length) return _done;
    const next = !!val;
    if (next !== _done) {
      // Reset session overrides so defaults apply (open active / closed done).
      const id = taskIdKey();
      if (id) {
        delete _sectionExpanded[`${id}:detail`];
        delete _sectionExpanded[`${id}:instruction`];
      }
    }
    _done = next;
    return render;
  };

  render.embedded = function(val?: boolean) {
    if (!arguments.length) return _embedded;
    _embedded = !!val;
    return render;
  };

  return render;
}
