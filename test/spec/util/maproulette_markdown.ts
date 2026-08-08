import { marked } from 'marked';
import { linkifyOsmReferences } from '../../../modules/util/maproulette_markdown';

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
