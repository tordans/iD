/**
 * Collect iD-style OSM entity ids (w123 / n456 / r789) from MapRoulette
 * task payloads: titles like `w123@0`, long-form `way/123`, short-form `w123`,
 * and nested GeoJSON / property bags.
 */
const TITLE_ID = /^([wnr])(\d+)(?:@\d+)?$/i;
const LONG_ID = /\b(way|node|relation)\/(\d+)\b/gi;
const SHORT_ID = /\b([wnr])(\d+)\b/gi;
const TYPE_PREFIX: Record<string, string> = {
  way: 'w',
  node: 'n',
  relation: 'r',
  w: 'w',
  n: 'n',
  r: 'r',
};

function addMatch(found: Set<string>, prefix: string, num: string): void {
  const p = TYPE_PREFIX[prefix.toLowerCase()];
  if (!p || !num) return;
  found.add(`${p}${num}`);
}

function addFromString(found: Set<string>, raw: string): void {
  const s = String(raw).trim();
  if (!s) return;

  const title = s.match(TITLE_ID);
  if (title) {
    addMatch(found, title[1], title[2]);
    return;
  }

  LONG_ID.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = LONG_ID.exec(s))) {
    addMatch(found, m[1], m[2]);
  }

  SHORT_ID.lastIndex = 0;
  while ((m = SHORT_ID.exec(s))) {
    addMatch(found, m[1], m[2]);
  }
}

function walk(found: Set<string>, value: unknown, depth: number): void {
  if (value === null || value === undefined || depth > 5) return;
  if (typeof value === 'string' || typeof value === 'number') {
    addFromString(found, String(value));
    return;
  }
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      walk(found, value[i], depth + 1);
    }
    return;
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    // Prefer well-known identity fields before a deep walk.
    for (const key of ['title', 'name', 'osmId', 'osm_id', 'osmid', 'id', 'identifier']) {
      if (key in obj) walk(found, obj[key], depth + 1);
    }
    for (const key of Object.keys(obj)) {
      // Skip bulky / non-identity blobs.
      if (key === 'geometry' || key === 'geometries' || key === 'coordinates') continue;
      walk(found, obj[key], depth + 1);
    }
  }
}

/** Return deduped iD entity ids found in any of the given values. */
export function collectOsmEntityIds(...values: unknown[]): string[] {
  const found = new Set<string>();
  for (let i = 0; i < values.length; i++) {
    walk(found, values[i], 0);
  }
  return Array.from(found);
}
