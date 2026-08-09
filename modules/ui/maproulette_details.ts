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

export function uiMapRouletteDetails(context: any) {
  const mr = services.maproulette;
  let _qaItem: any;
  /** When true, render for the entity inspector (no pin-selection guard; instructions only). */
  let _embedded = false;

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

  function clearLoadingState(selection: any): void {
    selection
      .classed('loading', false)
      .classed('qa-details-loading', false)
      .attr('aria-busy', null);
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

  /** Render recognised OSM entity links from task.elems (iD ids like w123). */
  function appendRecognisedElems(parent: any, elems: string[] | undefined): void {
    if (!Array.isArray(elems) || !elems.length) return;

    const section = parent
      .append('header')
      .attr('class', 'qa-details-header');
    section
      .append('h4')
      .text(t('map_data.layers.maproulette.elems_title'));

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
        .append('div')
        .attr('class', 'qa-header');

      const iconEnter = headerEnter
        .append('div')
        .attr('class', 'qa-header-icon');

      iconEnter.each(function(this: HTMLElement, d: any) {
        const status = (d && d.taskStatus !== undefined && d.taskStatus !== null)
          ? Number(d.taskStatus)
          : (d && d.task && d.task.status !== undefined && d.task.status !== null
            ? Number(d.task.status)
            : 0);
        const priority = (d && d.taskPriority !== undefined && d.taskPriority !== null)
          ? Number(d.taskPriority)
          : (d && d.task && d.task.priority !== undefined && d.task.priority !== null
            ? Number(d.task.priority)
            : null);
        appendMapRoulettePinIcon(d3_select(this), {
          width: 20,
          height: 27,
          className: `preset-icon-28 qaItem ${d.service} itemId-${d.id} itemType-${d.itemType}`,
          status: Number.isFinite(status) ? status : 0,
          priority: Number.isFinite(priority as number) ? (priority as number) : null,
        });
      });

      headerEnter.append('div').attr('class', 'qa-header-label');
    }

    const loadingSection = detailsEnter
      .append('div')
      .attr('class', 'qa-details-subsection qa-details-loading loading')
      .attr('aria-busy', 'true');

    loadingSection
      .append('span')
      .attr('class', 'qa-details-loading-spinner')
      .attr('aria-hidden', 'true');

    loadingSection
      .append('span')
      .attr('class', 'qa-details-loading-text')
      .text(t('map_data.layers.maproulette.loading_task_details'));

    details = details.merge(detailsEnter);

    if (mr && _qaItem) {
      const thisItem = _qaItem;
      mr.loadTaskDetailAsync(_qaItem)
        .then(function(task: any) {
          const sel = details.selectAll('.qa-details-subsection');
          if (sel.empty()) return;

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
            // Panel was replaced for another task — clear spinner if this node is still mounted.
            if (!details.selectAll('.error-details').empty()) {
              clearLoadingState(sel);
            }
            return;
          }

          clearLoadingState(sel);

          if (!task) {
            sel.text(t('map_data.layers.maproulette.no_instruction'));
            return;
          }

          try {
          sel.html('');

          if (_embedded) {
            // Entity-inspector embed: same Details + Instructions content as the
            // pin panel (no action buttons). First section title links to the task.
            let linkedTitleUsed = false;

            function appendEmbeddedTitle(parent: any, kind: 'detail' | 'instruction') {
              const h4 = parent
                .append('header')
                .attr('class', 'qa-details-header')
                .append('h4');

              if (!linkedTitleUsed && _qaItem && _qaItem.id) {
                linkedTitleUsed = true;
                h4.append('span')
                  .text(
                    kind === 'detail'
                      ? t('map_data.layers.maproulette.detail_title_for_task')
                      : t('map_data.layers.maproulette.instruction_title_for_task'),
                  );
                h4.append('a')
                  .attr('href', '#')
                  .attr('class', 'mr-task-select-link')
                  .attr('data-task-id', String(_qaItem.id))
                  .text('#' + _qaItem.id);
              } else {
                h4.text(
                  kind === 'detail'
                    ? t('map_data.layers.maproulette.detail_title')
                    : t('map_data.layers.maproulette.instruction_title'),
                );
              }
            }

            const hasDescription = !!task.description;
            const hasInstruction = !!task.instruction &&
              task.instruction !== task.description;

            if (hasDescription) {
              const art = sel.append('article');
              appendEmbeddedTitle(art, 'detail');
              const descContent = art.append('section')
                .attr('class', 'qa-details-container')
                .html(renderMarkdown(task.description, task));
              attachExternalLinkAttrs(descContent);
            }

            if (hasInstruction || (!hasDescription && task.instruction)) {
              const art2 = sel.append('article');
              appendEmbeddedTitle(art2, 'instruction');
              const instructionContent = art2.append('article')
                .attr('class', 'qa-details-container')
                .html(renderMarkdown(task.instruction, task));
              attachExternalLinkAttrs(instructionContent);
            }

            if (!hasDescription && !task.instruction) {
              sel.text(t('map_data.layers.maproulette.no_instruction'));
            }

            attachHighlightLinkHandlers(sel);
            sel.selectAll('.mr-task-select-link')
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

          if (task.id) {
            const titleSection = sel
              .append('header')
              .attr('class', 'qa-details-header');
            titleSection
              .append('h4')
              .text(t('map_data.layers.maproulette.id_title'));
            titleSection
              .append('p')
              .text(`${task.parentId} / ${task.id}`);
          }

          // Prefer elems merged onto the live QAItem during loadTaskDetailAsync.
          appendRecognisedElems(
            sel,
            (_qaItem && _qaItem.elems) || task.elems,
          );

          const description = renderMarkdown(task.description, task);
          const instruction = renderMarkdown(task.instruction, task);

          const explicitChallengeIdGiven = Boolean(
            mr && mr.challengeIDs && mr.challengeIDs(),
          );

          if (!explicitChallengeIdGiven && task.description) {
            const art = sel.append('article');
            art.append('header')
              .attr('class', 'qa-details-header')
              .append('h4')
              .text(t('map_data.layers.maproulette.detail_title'));
            const descContent = art.append('section')
              .attr('class', 'qa-details-container')
              .html(description);
            attachExternalLinkAttrs(descContent);
          }

          if (task.instruction && task.instruction !== task.description) {
            const art2 = sel.append('article');
            art2.append('header')
              .attr('class', 'qa-details-header')
              .append('h4')
              .text(t('map_data.layers.maproulette.instruction_title'));
            const instructionContent = art2.append('article')
              .attr('class', 'qa-details-container')
              .html(instruction);
            attachExternalLinkAttrs(instructionContent);
          }

          attachHighlightLinkHandlers(sel);
          } catch (err) {
            clearLoadingState(sel);
            sel.text(t('map_data.layers.maproulette.error_loading_task_details'));
          }
        })
        .catch(function() {
          const sel = details.selectAll('.qa-details-subsection');
          if (sel.empty()) return;
          clearLoadingState(sel);
          sel.text(t('map_data.layers.maproulette.error_loading_task_details'));
        });
    }
  }

  render.task = function(val?: any) {
    if (!arguments.length) return _qaItem;
    _qaItem = val;
    return render;
  };

  render.embedded = function(val?: boolean) {
    if (!arguments.length) return _embedded;
    _embedded = !!val;
    return render;
  };

  return render;
}
