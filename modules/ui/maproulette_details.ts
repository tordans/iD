import { select as d3_select } from 'd3-selection';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

import { utilHighlightEntities } from '../util';
import {
  applyCompletionResponsesToElement,
  collectCompletionResponsesFromElement,
  expandInstructionShortcodes,
  linkifyOsmReferences,
} from '../util/maproulette_markdown';
import { modeSelect } from '../modes';
import { t } from '../core/localizer';
import { services } from '../services';
import { appendMapRoulettePinIcon } from '../svg/maproulette_logo';
import { updateMapRouletteV4Pin } from '../svg/maproulette_marker';
import { longFormOsmId } from '../util/maproulette_osm_ids';
import { replaceMustacheTags } from '../util/maproulette_mustache';
import { pinDisplayStatusOf } from '../util/maproulette_status';
import { uiDisclosure } from './disclosure';

/** Pin sidebar: Details default open only when the task is active and no challenge filter. */
export function isDetailsExpandedByDefault(opts: {
  done: boolean;
  challengeFilter: boolean;
}): boolean {
  return !opts.done && !opts.challengeFilter;
}

/** Which task text blocks to show in Details / Instructions panels. */
function taskGuidanceSections(task: { description?: string; instruction?: string }): {
  hasDescription: boolean;
  showInstruction: boolean;
} {
  const hasDescription = !!task.description;
  const showInstruction = !!(task.instruction &&
    (task.instruction !== task.description || !hasDescription));
  return { hasDescription, showInstruction };
}

export function uiMapRouletteDetails(context: any) {
  const mr = services.maproulette;
  let _qaItem: any;
  /** When true, render for the entity inspector (no pin-selection guard; instructions only). */
  let _embedded = false;
  /** Task is queued/resolved — Details/Instructions default collapsed. */
  let _done = false;
  /** Session expand overrides for Details/Instructions (keyed by taskId:section). */
  const _sectionExpanded: Record<string, boolean> = {};
  /** Ignore stale loadTaskDetailAsync results after re-render or navigation away. */
  let _loadGeneration = 0;
  /** Task id whose Details/Instructions are already painted in the current host. */
  let _paintedTaskId: string | null = null;
  /** Pin sidebar Details/Instructions disclosure widgets (sync expanded state on re-render). */
  const _sectionDisclosures: {
    detail?: ReturnType<typeof uiDisclosure>;
    instruction?: ReturnType<typeof uiDisclosure>;
  } = {};

  function sanitizeHTML(dirty: string): string {
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: [
        'a', 'b', 'br', 'code', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'hr', 'i', 'img', 'input', 'label', 'li', 'mark', 'ol', 'option', 'p',
        'pre', 'select', 'small', 'span', 'strong', 'sub', 'sup', 'table',
        'tbody', 'td', 'th', 'thead', 'tr', 'u', 'ul',
      ],
      ALLOWED_ATTR: [
        'class', 'href', 'id', 'name', 'rel', 'src', 'target', 'title', 'alt',
        'value', 'data-osm-id', 'data-copy-text', 'type', 'checked', 'for',
        'role', 'tabindex',
      ],
      ALLOW_DATA_ATTR: false,
      FORBID_TAGS: ['style', 'script', 'iframe', 'form', 'button'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'style'],
    });
  }

  function renderMarkdown(text: string, task: any): string {
    if (!text) return '';
    const html = marked.parse(replaceMustacheTags(text, task, { htmlEscape: true })) as string;
    return sanitizeHTML(
      expandInstructionShortcodes(linkifyOsmReferences(html), {
        copyLabel: t('map_data.layers.maproulette.copyable'),
      }),
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
    detailsSel.selectAll('.mr-section-disclosure, .mr-embedded-body, .mr-task-load-notice').remove();
    _sectionDisclosures.detail = undefined;
    _sectionDisclosures.instruction = undefined;
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

  /** Pin sidebar only: still showing this task in select-error mode. */
  function shouldApplyAsyncResult(taskId: string): boolean {
    if (_embedded) return true;
    const mode = context.mode && context.mode();
    if (!mode || mode.id !== 'select-error') return false;
    return String(context.selectedErrorID()) === taskId;
  }

  function taskBodyAlreadyPainted(detailsSel: any, taskId: string | null): boolean {
    if (!taskId || taskId !== _paintedTaskId) return false;
    return !detailsSel.select('.mr-section-disclosure').empty()
      || !detailsSel.select('.mr-embedded-body').empty()
      || !detailsSel.select('.mr-task-load-notice').empty();
  }

  function sectionExpandedKey(section: 'detail' | 'instruction'): string | null {
    const id = taskIdKey();
    return id ? `${id}:${section}` : null;
  }

  function isChallengeFilterActive(): boolean {
    return Boolean(mr && mr.challengeIDs && mr.challengeIDs());
  }

  function isSectionExpanded(section: 'detail' | 'instruction'): boolean {
    const key = sectionExpandedKey(section);
    if (key && Object.prototype.hasOwnProperty.call(_sectionExpanded, key)) {
      return !!_sectionExpanded[key];
    }
    if (section === 'detail') {
      return isDetailsExpandedByDefault({
        done: _done,
        challengeFilter: isChallengeFilterActive(),
      });
    }
    // Instructions: open while working the task; closed after a status decision.
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
      const disclosure = _sectionDisclosures[section];
      const host = detailsSel.select(`.mr-section-${section}`);
      if (!disclosure || host.empty()) return;
      const expanded = isSectionExpanded(section);
      disclosure.expanded(expanded);

      const wrap = host.select('details.disclosure-wrap');
      if (!wrap.empty()) {
        wrap.property('open', expanded);
        const summary = wrap.select('summary.hide-toggle');
        summary
          .classed('expanded', expanded)
          .attr('title', t(`icons.${expanded ? 'collapse' : 'expand'}`));
        summary.select('.hide-toggle-icon')
          .attr('xlink:href', expanded ? '#iD-icon-down' : '#iD-icon-forward');
      }

      if (expanded) {
        const contentUnpainted = host.select('.disclosure-content .qa-details-container').empty();
        if (contentUnpainted) {
          host.call(disclosure);
          restoreCompletionResponses(detailsSel);
        }
      }
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

    // uiDisclosure invokes `_label()`: strings become text, functions are d3 renderers.
    const disclosureLabel = typeof label === 'function'
      ? function() { return label; }
      : label;

    const expandedDefault = isSectionExpanded(section);
    const disclosure = (uiDisclosure(context, disclosureKey, expandedDefault) as any)
      .updatePreference(false)
      .expanded(expandedDefault)
      .label(disclosureLabel)
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
      });
    _sectionDisclosures[section] = disclosure;
    host.call(disclosure);
  }

  function syncCompletionResponses(detailsSel: any): void {
    if (!_qaItem) return;
    const collected = collectCompletionResponsesFromElement(detailsSel.node());
    const hasKeys = Object.keys(collected).length > 0;
    const next = hasKeys ? collected : undefined;
    const current = _qaItem.completionResponses;
    if (JSON.stringify(current || {}) === JSON.stringify(collected)) return;
    _qaItem = _qaItem.update({ completionResponses: next });
    if (mr && typeof mr.replaceItem === 'function') mr.replaceItem(_qaItem);
  }

  function bindCompletionResponseHandlers(detailsSel: any): void {
    detailsSel
      .on('change.mr-completion', function(d3_event: Event) {
        const target = d3_event.target as HTMLElement;
        if (!target || !target.getAttribute('name')) return;
        const tag = target.tagName;
        if (tag !== 'SELECT' && tag !== 'INPUT') return;
        syncCompletionResponses(detailsSel);
      })
      .on('click.mr-copyable', function(d3_event: Event) {
        const target = d3_event.target as HTMLElement;
        if (!target || !target.classList.contains('mr-copyable-btn')) return;
        d3_event.preventDefault();
        const text = target.getAttribute('data-copy-text');
        if (!text || !navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') return;
        navigator.clipboard.writeText(text).catch(function() { /* ignore */ });
      });
  }

  function restoreCompletionResponses(detailsSel: any): void {
    if (!_qaItem || !_qaItem.completionResponses) return;
    detailsSel.selectAll('.qa-details-container').each(function(this: HTMLElement) {
      applyCompletionResponsesToElement(this, _qaItem.completionResponses);
    });
    detailsSel.selectAll('.mr-embedded-body .qa-details-container').each(function(this: HTMLElement) {
      applyCompletionResponsesToElement(this, _qaItem.completionResponses);
    });
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
        const longForm = longFormOsmId(entityId);
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

  function appendEmbeddedMarkdown(parent: any, html: string): void {
    const box = parent.append('div').attr('class', 'qa-details-container');
    box.html(html);
    attachExternalLinkAttrs(box);
    attachHighlightLinkHandlers(box);
  }

  /**
   * Entity inspector: the section is already a disclosure, so paint Details /
   * Instructions as plain content (plus a pin link) instead of nested toggles.
   */
  function renderEmbeddedTaskBody(detailsSel: any, task: any): void {
    const { hasDescription, showInstruction } = taskGuidanceSections(task);

    if (!hasDescription && !task.instruction) {
      showTaskBodyMessage(detailsSel, t('map_data.layers.maproulette.no_instruction'));
      return;
    }

    const body = detailsSel.append('div').attr('class', 'mr-embedded-body');

    const showBoth = hasDescription && showInstruction;
    if (hasDescription) {
      if (showBoth) {
        body.append('h4').text(t('map_data.layers.maproulette.detail_title'));
      }
      appendEmbeddedMarkdown(body, renderMarkdown(task.description, task));
    }
    if (showInstruction) {
      if (showBoth) {
        body.append('h4').text(t('map_data.layers.maproulette.instruction_title'));
      }
      appendEmbeddedMarkdown(body, renderMarkdown(task.instruction, task));
    }
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

    const thisTaskId = taskIdKey();
    if (taskBodyAlreadyPainted(details, thisTaskId)) {
      clearLoadingState(details);
      details.select('.qa-details-loading').remove();
      return;
    }

    if (mr && _qaItem && thisTaskId) {
      const generation = ++_loadGeneration;
      mr.loadTaskDetailAsync(_qaItem)
        .then(function(task: any) {
          if (generation !== _loadGeneration) return;
          if (details.empty()) return;
          if (!shouldApplyAsyncResult(thisTaskId)) return;

          if (!task) {
            showTaskBodyMessage(details, t('map_data.layers.maproulette.no_instruction'));
            _paintedTaskId = null;
            return;
          }

          try {
          clearTaskBody(details);

          if (_embedded) {
            renderEmbeddedTaskBody(details, task);
            bindCompletionResponseHandlers(details);
            restoreCompletionResponses(details);
            _paintedTaskId = thisTaskId;
            return;
          }

          const headerLabel = details.selectAll('.qa-header .qa-header-label');
          const headerText =
            task.parentName || t('map_data.layers.maproulette.title');
          headerLabel.text(headerText);

          renderTaskMeta(details, task);

          const { hasDescription, showInstruction } = taskGuidanceSections(task);
          const description = renderMarkdown(task.description, task);
          const instruction = renderMarkdown(task.instruction, task);

          if (!hasDescription && !showInstruction) {
            showTaskBodyMessage(details, t('map_data.layers.maproulette.no_instruction'));
            bindCompletionResponseHandlers(details);
            restoreCompletionResponses(details);
            _paintedTaskId = thisTaskId;
            return;
          }

          if (hasDescription) {
            appendSectionDisclosure(
              details,
              'detail',
              panelDisclosureTitle('detail'),
              description,
            );
          }

          if (showInstruction) {
            appendSectionDisclosure(
              details,
              'instruction',
              panelDisclosureTitle('instruction'),
              instruction,
            );
          }

          attachHighlightLinkHandlers(details);
          bindCompletionResponseHandlers(details);
          restoreCompletionResponses(details);
          _paintedTaskId = thisTaskId;
          } catch (err) {
            _paintedTaskId = null;
            if (generation !== _loadGeneration) return;
            if (!shouldApplyAsyncResult(thisTaskId)) return;
            console.error('MapRoulette: failed to render task details', err); // eslint-disable-line no-console
            showTaskBodyMessage(details, t('map_data.layers.maproulette.error_loading_task_details'));
          }
        })
        .catch(function(err: unknown) {
          if (generation !== _loadGeneration) return;
          if (details.empty()) return;
          if (!shouldApplyAsyncResult(thisTaskId)) return;
          _paintedTaskId = null;
          console.error('MapRoulette: failed to load task details', err); // eslint-disable-line no-console
          showTaskBodyMessage(details, t('map_data.layers.maproulette.error_loading_task_details'));
        });
    }
  }

  render.task = function(val?: any) {
    if (!arguments.length) return _qaItem;
    if (val && _qaItem && String(val.id) !== String(_qaItem.id)) {
      _paintedTaskId = null;
      _loadGeneration++;
    }
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
