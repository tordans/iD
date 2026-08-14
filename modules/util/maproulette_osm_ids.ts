/**
 * Collect iD-style OSM entity ids (w123 / n456 / r789) from MapRoulette
 * task payloads: titles like `w123@0`, long-form `way/123`, short-form `w123`,
 * nested property bags, and MapRoulette V4-style feature properties
 * (`@id: "way/123"`, numeric `osmid` + geometry type). See
 * docs/research-maproulette-osm-feature-ids.md and maproulette3 v4 osmUtils.ts.
 */
const TITLE_ID = /^([wnr])(\d+)(?:@\d+)?$/i;
const LONG_ID = /\b(way|node|relation)\/(\d+)\b/gi;
const SHORT_ID = /\b([wnr])(\d+)\b/gi;
const TYPED_ID = /^(node|way|relation)\/(\d+)$/i;
const TYPE_PREFIX: Record<string, string> = {
  way: 'w',
  node: 'n',
  relation: 'r',
  w: 'w',
  n: 'n',
  r: 'r',
};

const PREFERRED_KEYS = [
  'title',
  'name',
  '@id',
  '@osmId',
  '@type',
  'osm_type',
  'osmId',
  'osm_id',
  'osmid',
  'id',
  'identifier',
];

function addMatch(found: Set<string>, prefix: string, num: string | number): void {
  const p = TYPE_PREFIX[String(prefix).toLowerCase()];
  const n = String(num);
  if (!p || !n || !/^\d+$/.test(n)) return;
  found.add(`${p}${n}`);
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

/**
 * Infer OSM element type from GeoJSON geometry type (MapRoulette V4).
 */
function inferOsmTypeFromGeometry(geomType: string | undefined): string | null {
  switch (geomType) {
    case 'Point':
      return 'node';
    case 'LineString':
    case 'MultiLineString':
    case 'Polygon':
      return 'way';
    case 'MultiPolygon':
      return 'relation';
    default:
      return null;
  }
}

/**
 * Parse one OSM entity id from a GeoJSON feature's properties using the same
 * rules as MapRoulette V4 (`parseOsmFeatureFromProperties` in osmUtils.ts).
 * Returns an iD id (`w123`) or null.
 */
export function parseOsmEntityIdFromFeatureProperties(
  properties: Record<string, unknown> | null | undefined,
  geomType?: string,
): string | null {
  if (!properties || typeof properties !== 'object') return null;

  // 1. Typed string IDs like "node/123", "way/456" on @id → id → osm_id
  const typedId = properties['@id'] || properties.id || properties.osm_id;
  if (typedId && typeof typedId === 'string') {
    const match = typedId.trim().match(TYPED_ID);
    if (match) {
      const p = TYPE_PREFIX[match[1].toLowerCase()];
      return p ? `${p}${match[2]}` : null;
    }
  }

  // 2. Numeric ID (osmid → osm_id → @osmId) + explicit or inferred type
  const numericId = properties.osmid ?? properties.osm_id ?? properties['@osmId'];
  if (numericId !== null && numericId !== undefined && numericId !== '') {
    const numId = Number(numericId);
    if (Number.isFinite(numId) && numId > 0) {
      const osmType = properties['@type'] || properties.osm_type;
      if (osmType) {
        const type = String(osmType).toLowerCase();
        if (type === 'node' || type === 'way' || type === 'relation') {
          const p = TYPE_PREFIX[type];
          return p ? `${p}${Math.trunc(numId)}` : null;
        }
      }
      const inferred = inferOsmTypeFromGeometry(geomType);
      if (inferred) {
        const p = TYPE_PREFIX[inferred];
        return p ? `${p}${Math.trunc(numId)}` : null;
      }
    }
  }

  return null;
}

/**
 * Collect entity ids from a FeatureCollection, features array, or single Feature
 * using V4 property rules (all matching features, not only the first).
 */
export function collectOsmEntityIdsFromGeometries(geometries: unknown): string[] {
  const found = new Set<string>();
  collectFromGeometriesInto(found, geometries);
  return Array.from(found);
}

function collectFromGeometriesInto(found: Set<string>, geometries: unknown): void {
  if (!geometries) return;
  let features: unknown[] = [];
  if (Array.isArray(geometries)) {
    features = geometries;
  } else if (typeof geometries === 'object') {
    const obj = geometries as Record<string, unknown>;
    if (Array.isArray(obj.features)) {
      features = obj.features;
    } else if (obj.type === 'Feature' || (obj.properties && obj.geometry)) {
      features = [obj];
    }
  }
  for (let i = 0; i < features.length; i++) {
    collectFromFeatureInto(found, features[i], 0, false);
  }
}

/**
 * Apply V4 property parse, then free-text-walk properties (and optional sibling keys).
 */
function collectFromFeatureInto(
  found: Set<string>,
  feature: unknown,
  depth: number,
  walkOtherKeys: boolean,
): void {
  if (!feature || typeof feature !== 'object') return;
  const f = feature as Record<string, unknown>;
  const props = f.properties;
  const geom = f.geometry as { type?: string } | undefined;
  const geomType = geom && typeof geom === 'object' ? geom.type : undefined;

  if (props && typeof props === 'object') {
    const id = parseOsmEntityIdFromFeatureProperties(
      props as Record<string, unknown>,
      geomType,
    );
    if (id) found.add(id);
    // Free-text / short-form ids inside property values (broader than V4).
    walk(found, props, depth + 1);
  }

  if (!walkOtherKeys) return;
  for (const key of Object.keys(f)) {
    if (
      key === 'geometry' ||
      key === 'geometries' ||
      key === 'coordinates' ||
      key === 'properties'
    ) {
      continue;
    }
    walk(found, f[key], depth + 1);
  }
}

function isGeoJsonFeature(obj: Record<string, unknown>): boolean {
  if (obj.type === 'Feature') return true;
  // MR sometimes omits type but still has properties + geometry.
  return !!(obj.properties && obj.geometry && typeof obj.geometry === 'object');
}

function walk(found: Set<string>, value: unknown, depth: number): void {
  if (value === null || value === undefined || depth > 5) return;
  if (typeof value === 'string') {
    addFromString(found, value);
    return;
  }
  // Bare numbers are not OSM ids (V4 requires type); do not invent short forms.
  if (typeof value === 'number') return;
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      walk(found, value[i], depth + 1);
    }
    return;
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;

    if (obj.type === 'FeatureCollection' && Array.isArray(obj.features)) {
      collectFromGeometriesInto(found, obj);
      return;
    }

    if (isGeoJsonFeature(obj)) {
      collectFromFeatureInto(found, obj, depth, true);
      return;
    }

    // Prefer well-known identity fields before a deep walk.
    for (let i = 0; i < PREFERRED_KEYS.length; i++) {
      const key = PREFERRED_KEYS[i];
      if (key in obj) walk(found, obj[key], depth + 1);
    }
    for (const key of Object.keys(obj)) {
      if (key === 'coordinates') continue;
      if (key === 'geometries') {
        collectFromGeometriesInto(found, obj[key]);
        continue;
      }
      // Skip geometry coordinates / nested non-feature geometry blobs.
      if (key === 'geometry') continue;
      walk(found, obj[key], depth + 1);
    }
  }
}

/** Display iD id `w123` as `way/123`. */
export function longFormOsmId(id: string): string {
  return String(id).replace(/^[wnr]/, function(prefix) {
    switch (prefix) {
      case 'w': return 'way/';
      case 'n': return 'node/';
      case 'r': return 'relation/';
      default: return prefix;
    }
  });
}

/** Return deduped iD entity ids found in any of the given values. */
export function collectOsmEntityIds(...values: unknown[]): string[] {
  const found = new Set<string>();
  for (let i = 0; i < values.length; i++) {
    walk(found, values[i], 0);
  }
  return Array.from(found);
}
