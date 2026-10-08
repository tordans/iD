import { geoSphericalDistance } from '../geo';
import { DemTileCache } from './tile_cache';
import { elevationAtTileCoord } from './terrarium';
import { PROFILE_SAMPLE_STEP_METERS, PROFILE_TILE_ZOOM } from './constants';

export interface ProfilePoint {
  loc: [number, number];
  distance: number;
  elevation: number | null;
}

function interpolateLoc(a: [number, number], b: [number, number], t: number): [number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

/** Densify a line into sample points spaced roughly `stepMeters` apart. */
export function densifyLine(
  coordinates: [number, number][],
  stepMeters = PROFILE_SAMPLE_STEP_METERS
): { loc: [number, number]; distance: number }[] {
  if (coordinates.length < 2) {
    return coordinates.map((loc, i) => ({ loc, distance: i === 0 ? 0 : 0 }));
  }

  const samples: { loc: [number, number]; distance: number }[] = [];
  let total = 0;
  samples.push({ loc: coordinates[0], distance: 0 });

  for (let i = 1; i < coordinates.length; i++) {
    const a = coordinates[i - 1];
    const b = coordinates[i];
    const segLen = geoSphericalDistance(a, b);
    if (segLen <= 0) continue;

    const steps = Math.max(1, Math.ceil(segLen / stepMeters));
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      const loc = interpolateLoc(a, b, t);
      total += segLen / steps;
      samples.push({ loc, distance: total });
    }
  }

  return samples;
}

interface SampleTileInfo {
  sample: { loc: [number, number]; distance: number };
  tileKey: string;
  fracX: number;
  fracY: number;
}

function tileCoordForLoc(
  lon: number,
  lat: number,
  zoom: number
): { x: number; y: number; fracX: number; fracY: number } {
  const n = Math.pow(2, zoom);
  const xf = (lon + 180) / 360 * n;
  const latRad = lat * Math.PI / 180;
  const yf = (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n;
  const x = Math.floor(xf);
  const y = Math.floor(yf);
  return { x, y, fracX: xf - x, fracY: yf - y };
}

export async function buildElevationProfile(
  coordinates: [number, number][],
  template: string,
  tileSize: number,
  cache: DemTileCache,
  zoom = PROFILE_TILE_ZOOM
): Promise<ProfilePoint[]> {
  const samples = densifyLine(coordinates);
  const sampleInfos: SampleTileInfo[] = [];
  const uniqueTiles = new Map<string, { url: string; z: number; x: number; y: number }>();

  for (const sample of samples) {
    const { x, y, fracX, fracY } = tileCoordForLoc(sample.loc[0], sample.loc[1], zoom);
    const tileKey = DemTileCache.key(zoom, x, y);

    sampleInfos.push({ sample, tileKey, fracX, fracY });

    if (!uniqueTiles.has(tileKey)) {
      const url = template
        .replace(/\{z\}/g, String(zoom))
        .replace(/\{x\}/g, String(x))
        .replace(/\{y\}/g, String(y));
      uniqueTiles.set(tileKey, { url, z: zoom, x, y });
    }
  }

  const tiles = new Map<string, Awaited<ReturnType<DemTileCache['fetch']>>>();
  await Promise.all([...uniqueTiles.entries()].map(async ([key, coord]) => {
    tiles.set(key, await cache.fetch(coord.url, coord.z, coord.x, coord.y, tileSize));
  }));

  return sampleInfos.map(({ sample, tileKey, fracX, fracY }) => {
    const tile = tiles.get(tileKey);
    const elevation = tile
      ? elevationAtTileCoord(tile.data, tile.tileSize, fracX, fracY)
      : null;
    return {
      loc: sample.loc,
      distance: sample.distance,
      elevation
    };
  });
}

/** Find closest profile point to a map location. */
export function closestProfilePoint(
  profile: ProfilePoint[],
  loc: [number, number]
): ProfilePoint | null {
  if (!profile.length) return null;

  let best = profile[0];
  let bestDist = geoSphericalDistance(best.loc, loc);

  for (let i = 1; i < profile.length; i++) {
    const d = geoSphericalDistance(profile[i].loc, loc);
    if (d < bestDist) {
      bestDist = d;
      best = profile[i];
    }
  }

  return best;
}

/** Find profile point nearest to a distance along the line. */
export function profilePointAtDistance(profile: ProfilePoint[], distance: number): ProfilePoint | null {
  if (!profile.length) return null;
  if (distance <= profile[0].distance) return profile[0];

  for (let i = 1; i < profile.length; i++) {
    if (distance <= profile[i].distance) {
      const prev = profile[i - 1];
      const next = profile[i];
      const span = next.distance - prev.distance;
      const t = span > 0 ? (distance - prev.distance) / span : 0;
      return {
        distance,
        loc: interpolateLoc(prev.loc, next.loc, t),
        elevation: prev.elevation !== null && next.elevation !== null
          ? prev.elevation + (next.elevation - prev.elevation) * t
          : (prev.elevation ?? next.elevation)
      };
    }
  }

  return profile[profile.length - 1];
}
