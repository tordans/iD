import { marked } from 'marked';

/**
 * Post-markdown HTML helpers for MapRoulette task instructions: turn OSM
 * entity references into highlight links without breaking markdown code spans
 * or existing anchors.
 */

const LONG_ID_IN_TEXT = /(?<![/\w])(way|node|relation)\/(\d+)\b/gi;
const SHORT_ID_IN_TEXT = /\b([wnr])(\d+)\b/gi;
const BARE_URL = /(https?:\/\/\S+)/gi;
const PURE_OSM_ID_CODE =
  /<code\b[^>]*>(\s*)((?:way|node|relation)\/\d+|[wnr]\d+)(\s*)<\/code>/gi;
const PRE_BLOCK = /(<pre\b[^>]*>[\s\S]*?<\/pre>)/gi;
const PROTECTED_HTML =
  /(<a\b[^>]*>[\s\S]*?<\/a>|<code\b[^>]*>[\s\S]*?<\/code>)/gi;
const OSM_ENTITY_HREF =
  /^https?:\/\/(?:www\.)?openstreetmap\.org\/(way|node|relation)\/(\d+)(?:[#?].*)?$/i;
const ANCHOR_TAG = /^<a\b([^>]*)>([\s\S]*?)<\/a>$/i;
const HTML_TAG = /(<[^>]+>)/g;

const TYPE_FROM_PREFIX: Record<string, string> = {
  w: 'way',
  n: 'node',
  r: 'relation',
};

/** Normalise short or long OSM ids to long form (`way/123`). */
export function toLongFormOsmId(id: string): string {
  const trimmed = id.trim();
  const longMatch = trimmed.match(/^(way|node|relation)\/(\d+)$/i);
  if (longMatch) {
    return `${longMatch[1].toLowerCase()}/${longMatch[2]}`;
  }
  const shortMatch = trimmed.match(/^([wnr])(\d+)$/i);
  if (shortMatch) {
    const type = TYPE_FROM_PREFIX[shortMatch[1].toLowerCase()];
    if (type) return `${type}/${shortMatch[2]}`;
  }
  return trimmed;
}

function escapeHTMLAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function wrapHighlightLink(osmId: string, label: string): string {
  return `<a href="#" class="highlight-link" data-osm-id="${escapeHTMLAttr(osmId)}">${label}</a>`;
}

function linkifyIdTokens(segment: string): string {
  return segment
    .replace(
      LONG_ID_IN_TEXT,
      function(_match, type: string, num: string) {
        const osmId = `${type.toLowerCase()}/${num}`;
        return wrapHighlightLink(osmId, osmId);
      },
    )
    .replace(
      SHORT_ID_IN_TEXT,
      function(_match, prefix: string, num: string) {
        const type = TYPE_FROM_PREFIX[prefix.toLowerCase()];
        if (!type) return _match;
        const osmId = `${type}/${num}`;
        return wrapHighlightLink(osmId, `${prefix}${num}`);
      },
    );
}

/** Linkify OSM ids in prose while leaving bare URL tokens untouched. */
function linkifyIdTokensInText(segment: string): string {
  return segment
    .split(BARE_URL)
    .map(function(part, i) {
      if (i % 2 === 1) return part;
      return linkifyIdTokens(part);
    })
    .join('');
}

/** Linkify ids only in text nodes — never inside tag names or attributes. */
function linkifyFreeText(segment: string): string {
  return segment
    .split(HTML_TAG)
    .map(function(part, i) {
      if (i % 2 === 1) return part;
      return linkifyIdTokensInText(part);
    })
    .join('');
}

function enrichOsmEntityAnchor(anchorHtml: string): string {
  const tagMatch = anchorHtml.match(ANCHOR_TAG);
  if (!tagMatch) return anchorHtml;

  const attrs = tagMatch[1];
  const inner = tagMatch[2];
  const hrefMatch =
    attrs.match(/\bhref=(["'])([^"']*)\1/i) ||
    attrs.match(/\bhref=([^\s>]+)/i);
  if (!hrefMatch) return anchorHtml;

  const href = hrefMatch[hrefMatch.length - 1];
  const osmMatch = href.match(OSM_ENTITY_HREF);
  if (!osmMatch || /\bdata-osm-id=/i.test(attrs)) return anchorHtml;

  const osmId = `${osmMatch[1].toLowerCase()}/${osmMatch[2]}`;

  let newAttrs = attrs
    .replace(/\bhref=(["'])[^"']*\1/i, 'href="#"')
    .replace(/\bhref=[^\s>]+/i, 'href="#"');

  if (/\bclass=/i.test(newAttrs)) {
    newAttrs = newAttrs.replace(
      /\bclass=(["'])([^"']*)\1/i,
      function(_match, quote: string, classes: string) {
        if (/\bhighlight-link\b/.test(classes)) {
          return `class=${quote}${classes}${quote}`;
        }
        return `class=${quote}${classes} highlight-link${quote}`;
      },
    );
  } else {
    newAttrs += ' class="highlight-link"';
  }

  newAttrs += ` data-osm-id="${escapeHTMLAttr(osmId)}"`;

  return `<a${newAttrs}>${inner}</a>`;
}

function linkifyOutsidePre(html: string): string {
  const withCodeLinks = html.replace(
    PURE_OSM_ID_CODE,
    function(_match, lead: string, id: string, trail: string) {
      const trimmed = id.trim();
      const longForm = toLongFormOsmId(trimmed);
      return wrapHighlightLink(
        longForm,
        `<code>${lead}${trimmed}${trail}</code>`,
      );
    },
  );

  return withCodeLinks
    .split(PROTECTED_HTML)
    .map(function(segment, i) {
      if (i % 2 === 1) {
        if (/^<a\b/i.test(segment)) {
          return enrichOsmEntityAnchor(segment);
        }
        return segment;
      }
      return linkifyFreeText(segment);
    })
    .join('');
}

/**
 * Turn OSM entity references in rendered HTML into highlight links.
 * Skips existing anchors, pre blocks, and non-id code spans; wraps pure-id
 * code spans with a link outside the code element.
 */
export function linkifyOsmReferences(html: string): string {
  if (!html) return '';

  return html
    .split(PRE_BLOCK)
    .map(function(segment, i) {
      if (i % 2 === 1) return segment;
      return linkifyOutsidePre(segment);
    })
    .join('');
}

const Q = '(?:&quot;|")';
const NOT_Q = '(?:(?!&quot;|").)*?';
const NOT_Q_GREEDY = '(?:(?!&quot;|").)*';
const NOT_MD_LINK = '(?!\\()';

const INSTRUCTION_SELECT_RE = new RegExp(
  `(?:\\[|\\{\\{\\{)select[/ ]?${Q}(${NOT_Q})${Q}\\s+name=${Q}(${NOT_Q})${Q}\\s+values=${Q}(${NOT_Q})${Q}\\s*(?:\\]|\\}\\}\\})${NOT_MD_LINK}`,
  'gi',
);

const INSTRUCTION_CHECKBOX_RE = new RegExp(
  `(?:\\[|\\{\\{\\{)checkbox[/ ]?${Q}(${NOT_Q})${Q}\\s+name=${Q}(${NOT_Q})${Q}\\s*(?:\\]|\\}\\}\\})${NOT_MD_LINK}`,
  'gi',
);

const INSTRUCTION_COPYABLE_RE = new RegExp(
  `(?:\\[|\\{\\{\\{)copyable[/ ]?${Q}(${NOT_Q_GREEDY})${Q}\\s*(?:\\]|\\}\\}\\})${NOT_MD_LINK}`,
  'gi',
);

function escapeHTMLText(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderInstructionLabelHtml(label: string): string {
  if (!label) return '';
  return marked.parseInline(label) as string;
}

function buildSelectHtml(name: string, label: string, valuesRaw: string): string {
  const labelHtml = renderInstructionLabelHtml(label);
  const options = valuesRaw
    .split(',')
    .map(function(v) { return v.trim(); })
    .filter(Boolean)
    .map(function(option) {
      const escaped = escapeHTMLAttr(option);
      return `<option value="${escaped}">${escaped}</option>`;
    })
    .join('');
  const labelSuffix = labelHtml ? ` ${labelHtml}` : '';
  return `<label class="mr-instruction-label"><select class="mr-instruction-select" name="${escapeHTMLAttr(name)}"><option value=""></option>${options}</select>${labelSuffix}</label>`;
}

function buildCheckboxHtml(name: string, label: string): string {
  const labelHtml = renderInstructionLabelHtml(label);
  const labelSuffix = labelHtml ? ` ${labelHtml}` : '';
  return `<label class="mr-instruction-label"><input type="checkbox" class="mr-instruction-checkbox" name="${escapeHTMLAttr(name)}">${labelSuffix}</label>`;
}

function buildCopyableHtml(text: string, copyLabel: string): string {
  const escaped = escapeHTMLAttr(text);
  const display = escapeHTMLText(text);
  return `<span class="mr-copyable"><span class="mr-copyable-text">${display}</span><a href="#" class="mr-copyable-btn" data-copy-text="${escaped}" title="${escapeHTMLAttr(copyLabel)}">${escapeHTMLText(copyLabel)}</a></span>`;
}

/**
 * Expand MapRoulette instruction shortcodes (`[select …]`, `[checkbox …]`,
 * `[copyable …]`, and deprecated `{{{…}}}`) in post-markdown HTML.
 */
export function expandInstructionShortcodes(
  html: string,
  opts?: { copyLabel?: string },
): string {
  if (!html) return '';
  const copyLabel = opts?.copyLabel || 'Copy';

  return html
    .replace(INSTRUCTION_SELECT_RE, function(_match, label: string, name: string, values: string) {
      return buildSelectHtml(name, label, values);
    })
    .replace(INSTRUCTION_CHECKBOX_RE, function(_match, label: string, name: string) {
      return buildCheckboxHtml(name, label);
    })
    .replace(INSTRUCTION_COPYABLE_RE, function(_match, text: string) {
      if (!text) return '';
      return buildCopyableHtml(text, copyLabel);
    });
}

/** Read painted instruction form fields into completionResponses. */
export function collectCompletionResponsesFromElement(
  root: ParentNode | null | undefined,
): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  if (!root || typeof (root as Element).querySelectorAll !== 'function') return out;
  (root as Element).querySelectorAll('select[name]').forEach(function(sel) {
    const name = sel.getAttribute('name');
    const value = (sel as HTMLSelectElement).value;
    if (name && value && value.trim()) out[name] = value.trim();
  });
  (root as Element).querySelectorAll('input[type="checkbox"][name]').forEach(function(input) {
    const name = input.getAttribute('name');
    if (name) out[name] = (input as HTMLInputElement).checked;
  });
  return out;
}

/** Apply stored completion responses onto painted instruction form fields. */
export function applyCompletionResponsesToElement(
  root: ParentNode | null | undefined,
  responses: Record<string, string | boolean> | null | undefined,
): void {
  if (!root || !responses || typeof responses !== 'object') return;
  if (typeof (root as Element).querySelectorAll !== 'function') return;
  (root as Element).querySelectorAll('select[name]').forEach(function(sel) {
    const name = sel.getAttribute('name');
    if (!name) return;
    const value = responses[name];
    if (typeof value === 'string' && value) {
      (sel as HTMLSelectElement).value = value;
    }
  });
  (root as Element).querySelectorAll('input[type="checkbox"][name]').forEach(function(input) {
    const name = input.getAttribute('name');
    if (!name) return;
    (input as HTMLInputElement).checked = responses[name] === true;
  });
}
