import nearestPointOnLine from '@turf/nearest-point-on-line';

import { mrGeometryFeatures } from './maproulette_api_schema';


type LngLat = [number, number];

type GeoFeature = {
  type?: string;
  geometry?: { type?: string; coordinates?: unknown };
  properties?: Record<string, unknown>;
};


function featureGeometryType(feature: GeoFeature): string | null {
  if (feature.type === 'Feature' && feature.geometry) {
    return feature.geometry.type || null;
  }
  // Bare geometry objects (rare in MR payloads).
  if (feature.type === 'LineString' || feature.type === 'MultiLineString') {
    return feature.type;
  }
  return null;
}


function asLineFeature(feature: unknown): GeoFeature | null {
  if (!feature || typeof feature !== 'object') return null;
  const f = feature as GeoFeature;
  const geomType = featureGeometryType(f);
  if (geomType !== 'LineString' && geomType !== 'MultiLineString') return null;
  if (f.type === 'Feature') return f;
  return { type: 'Feature', properties: {}, geometry: f as GeoFeature['geometry'] };
}


/**
 * Collect LineString / MultiLineString features from a MapRoulette geometries
 * FeatureCollection (or features array).
 */
export function mapRouletteLineFeatures(geometries: unknown): GeoFeature[] {
  const raw = mrGeometryFeatures(geometries);
  const lines: GeoFeature[] = [];
  for (let i = 0; i < raw.length; i++) {
    const line = asLineFeature(raw[i]);
    if (line) lines.push(line);
  }
  return lines;
}


/**
 * Snap a MapRoulette display pin onto LineString geometry when possible.
 *
 * MapRoulette’s stored `location` / API `task.point` is often a geometric
 * center that does not lie on curved ways. maproulette3 already snaps in the
 * UI (`nearestPointToCenter`); until the backend stores an on-line point
 * (https://github.com/maproulette/maproulette3/issues/2891), iD does the same
 * client-side: project `task.point` onto the nearest line feature.
 *
 * Mixed FeatureCollections: only line features are snap targets (points are
 * ignored for placement). If there are no lines, `loc` is returned unchanged.
 */
export function snapMapRoulettePinLoc(loc: LngLat, geometries: unknown): LngLat {
  if (!loc || !Number.isFinite(loc[0]) || !Number.isFinite(loc[1])) return loc;

  const lines = mapRouletteLineFeatures(geometries);
  if (!lines.length) return loc;

  let best: LngLat | null = null;
  let bestDist = Infinity;

  for (let i = 0; i < lines.length; i++) {
    try {
      const snapped = nearestPointOnLine(lines[i] as any, loc);
      const coords = snapped && snapped.geometry && snapped.geometry.coordinates;
      if (!coords || !Number.isFinite(coords[0]) || !Number.isFinite(coords[1])) continue;
      const props = snapped.properties || {};
      // Turf v6 used `dist`; v7 prefers `pointDistance` (with `dist` deprecated).
      const dist = Number(
        props.pointDistance !== undefined ? props.pointDistance : props.dist
      );
      const score = Number.isFinite(dist) ? dist : Infinity;
      if (score < bestDist) {
        bestDist = score;
        best = [coords[0], coords[1]];
      }
    } catch {
      // Bad geometry can throw in Turf; keep the original point.
    }
  }

  return best || loc;
}
