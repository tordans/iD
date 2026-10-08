import { marked } from 'marked';
import {
  applyCompletionResponsesToElement,
  collectCompletionResponsesFromElement,
  expandInstructionShortcodes,
  linkifyOsmReferences,
} from '../../../modules/util/maproulette_markdown';

describe('linkifyOsmReferences', () => {
  it('linkifies plain prose long-form ids', () => {
    const html = '<p>Berlin · OSM way/4764105 nearby</p>';
    expect(linkifyOsmReferences(html)).toBe(
      '<p>Berlin · OSM <a href="#" class="highlight-link" data-osm-id="way/4764105">way/4764105</a> nearby</p>',
    );
  });

  it('wraps highlight links outside code spans for long-form ids', () => {
    const html = '<p>Berlin · OSM <code>way/4764105</code></p>';
    expect(linkifyOsmReferences(html)).toBe(
      '<p>Berlin · OSM <a href="#" class="highlight-link" data-osm-id="way/4764105"><code>way/4764105</code></a></p>',
    );
  });

  it('wraps highlight links outside code spans for short-form ids', () => {
    const html = '<p>Check <code>w4764105</code> on the map</p>';
    expect(linkifyOsmReferences(html)).toBe(
      '<p>Check <a href="#" class="highlight-link" data-osm-id="way/4764105"><code>w4764105</code></a> on the map</p>',
    );
  });

  it('linkifies short-form ids in prose', () => {
    const html = '<p>See w123 and n456</p>';
    expect(linkifyOsmReferences(html)).toBe(
      '<p>See <a href="#" class="highlight-link" data-osm-id="way/123">w123</a> and <a href="#" class="highlight-link" data-osm-id="node/456">n456</a></p>',
    );
  });

  it('enriches existing anchors to OSM entity URLs without rewriting link text', () => {
    const html =
      '<p><a href="https://www.openstreetmap.org/way/4764105">OpenStreetMap</a></p>';
    expect(linkifyOsmReferences(html)).toBe(
      '<p><a href="#" class="highlight-link" data-osm-id="way/4764105">OpenStreetMap</a></p>',
    );
  });

  it('does not break markdown links to OSM entities (Hilfsmittel regression)', () => {
    const md = '* [OpenStreetMap](https://www.openstreetmap.org/way/4764105)';
    const html = marked.parse(md) as string;
    const result = linkifyOsmReferences(html);

    expect(result).not.toContain('[OpenStreetMap](');
    expect(result).not.toMatch(/href="[^"]*<a\b/);
    expect(result).toMatch(
      /<a\b[^>]*class="highlight-link"[^>]*data-osm-id="way\/4764105"[^>]*>OpenStreetMap<\/a>/,
    );
  });

  it('leaves arbitrary code spans alone', () => {
    const html = '<p>Use <code>highway=residential</code> here</p>';
    expect(linkifyOsmReferences(html)).toBe(html);
  });

  it('does not linkify ids inside pre blocks', () => {
    const html = '<pre><code>way/4764105</code></pre>';
    expect(linkifyOsmReferences(html)).toBe(html);
  });

  it('does not linkify long-form ids inside URL paths in free text', () => {
    const html =
      '<p>See https://www.openstreetmap.org/way/4764105 for context</p>';
    expect(linkifyOsmReferences(html)).toBe(html);
  });

  it('does not linkify ids inside HTML tag attributes', () => {
    const md = 'Check ![OSM way/4764105](https://example.com/x.jpg)';
    const html = marked.parse(md) as string;
    const result = linkifyOsmReferences(html);

    expect(result).not.toMatch(/alt="[^"]*<a\b/);
    expect(result).toMatch(/alt="OSM way\/4764105"/);
  });
});

describe('expandInstructionShortcodes', () => {
  it('expands select shortcodes with double quotes', () => {
    const html = '<p>[select "L" name="k" values="foo, bar"]</p>';
    const out = expandInstructionShortcodes(html);
    expect(out).toContain('class="mr-instruction-select"');
    expect(out).toContain('name="k"');
    expect(out).toContain('<option value=""></option>');
    expect(out).toContain('<option value="foo">foo</option>');
    expect(out).toContain('<option value="bar">bar</option>');
    expect(out).toMatch(/<label class="mr-instruction-label"><select class="mr-instruction-select"/);
    expect(out).toContain(' L</label>');
  });

  it('expands select shortcodes with &quot; entities', () => {
    const html = '<p>[select &quot;L&quot; name=&quot;k&quot; values=&quot;foo, bar&quot;]</p>';
    const out = expandInstructionShortcodes(html);
    expect(out).toContain('name="k"');
    expect(out).toContain('<option value="foo">foo</option>');
    expect(out).toMatch(/<label class="mr-instruction-label"><select class="mr-instruction-select"/);
    expect(out).toContain(' L</label>');
  });

  it('expands deprecated {{{select …}}} tokens', () => {
    const html = '<p>{{{select "L" name="k" values="a,b"}}}</p>';
    const out = expandInstructionShortcodes(html);
    expect(out).toContain('class="mr-instruction-select"');
    expect(out).toContain('<option value="a">a</option>');
    expect(out).toContain('<option value="b">b</option>');
  });

  it('expands checkbox shortcodes', () => {
    const html = '<p>[checkbox "Agree" name="c"]</p>';
    const out = expandInstructionShortcodes(html);
    expect(out).toContain('type="checkbox"');
    expect(out).toContain('class="mr-instruction-checkbox"');
    expect(out).toContain('name="c"');
    expect(out).toMatch(/<label class="mr-instruction-label"><input type="checkbox"/);
    expect(out).toContain(' Agree</label>');
  });

  it('wraps checkbox input inside label for click targeting', () => {
    const html = '<p>[checkbox "OK" name="x"]</p>';
    const out = expandInstructionShortcodes(html);
    expect(out.indexOf('<label')).toBeLessThan(out.indexOf('<input'));
    expect(out.indexOf('<input')).toBeLessThan(out.indexOf('</label>'));
  });

  it('renders basic markdown in checkbox labels', () => {
    const html = '<p>[checkbox "*Required*" name="c"]</p>';
    const out = expandInstructionShortcodes(html);
    expect(out).toContain('<em>Required</em>');
  });

  it('expands deprecated {{{checkbox …}}} tokens', () => {
    const html = '<p>{{{checkbox "OK" name="ok"}}}</p>';
    const out = expandInstructionShortcodes(html);
    expect(out).toContain('name="ok"');
    expect(out).toMatch(/<label class="mr-instruction-label"><input type="checkbox"/);
    expect(out).toContain(' OK</label>');
  });

  it('expands copyable shortcodes with clipboard control', () => {
    const html = '<p>[copyable "abc"]</p>';
    const out = expandInstructionShortcodes(html);
    expect(out).toContain('class="mr-copyable"');
    expect(out).toContain('<span class="mr-copyable-text">abc</span>');
    expect(out).toContain('class="mr-copyable-btn"');
    expect(out).toContain('data-copy-text="abc"');
    expect(out).not.toContain('<button');
  });

  it('removes empty copyable shortcodes', () => {
    const html = '<p>Before [copyable ""] after</p>';
    expect(expandInstructionShortcodes(html)).toBe('<p>Before  after</p>');
  });

  it('leaves markdown-link-like select tokens unchanged', () => {
    const html = '<p>[select "x"](http://x)</p>';
    expect(expandInstructionShortcodes(html)).toBe(html);
  });
});

describe('completion response helpers', () => {
  it('collectCompletionResponsesFromElement skips empty selections', () => {
    document.body.innerHTML =
      '<div id="root"><select name="a"><option value=""></option><option value="x">X</option></select></div>';
    const root = document.getElementById('root');
    expect(collectCompletionResponsesFromElement(root)).toEqual({});
    (root!.querySelector('select') as HTMLSelectElement).value = 'x';
    expect(collectCompletionResponsesFromElement(root)).toEqual({ a: 'x' });
  });

  it('collectCompletionResponsesFromElement records checkbox booleans', () => {
    document.body.innerHTML =
      '<div id="root-cb"><input type="checkbox" name="box" class="mr-instruction-checkbox"></div>';
    const root = document.getElementById('root-cb');
    expect(collectCompletionResponsesFromElement(root)).toEqual({ box: false });
    (root!.querySelector('input') as HTMLInputElement).checked = true;
    expect(collectCompletionResponsesFromElement(root)).toEqual({ box: true });
  });

  it('collectCompletionResponsesFromElement handles mixed fields', () => {
    document.body.innerHTML =
      '<div id="root-mix">' +
      '<select name="q"><option value=""></option><option value="yes">Yes</option></select>' +
      '<input type="checkbox" name="agree">' +
      '</div>';
    const root = document.getElementById('root-mix');
    (root!.querySelector('select') as HTMLSelectElement).value = 'yes';
    (root!.querySelector('input') as HTMLInputElement).checked = true;
    expect(collectCompletionResponsesFromElement(root)).toEqual({ q: 'yes', agree: true });
  });

  it('applyCompletionResponsesToElement restores select values', () => {
    document.body.innerHTML =
      '<div id="root2"><select name="q"><option value=""></option><option value="yes">Yes</option></select></div>';
    const root = document.getElementById('root2');
    applyCompletionResponsesToElement(root, { q: 'yes' });
    expect((root!.querySelector('select') as HTMLSelectElement).value).toBe('yes');
  });

  it('applyCompletionResponsesToElement restores checkbox state strictly', () => {
    document.body.innerHTML =
      '<div id="root-cb2"><input type="checkbox" name="box"></div>';
    const root = document.getElementById('root-cb2');
    const input = root!.querySelector('input') as HTMLInputElement;

    applyCompletionResponsesToElement(root, { box: true });
    expect(input.checked).toBe(true);

    applyCompletionResponsesToElement(root, { box: false });
    expect(input.checked).toBe(false);

    applyCompletionResponsesToElement(root, { box: 'true' as unknown as boolean });
    expect(input.checked).toBe(false);
  });
});
