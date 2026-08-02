import { geoLatToMeters, geoLonToMeters, geoMetersToLat, geoMetersToLon, geoSphericalDistance } from '../geo';

export interface ClosestLineResult {
  loc: [number, number];
  distanceAlong: number;
  distanceToLine: number;
}

function closestPointOnSegment(
  a: [number, number],
  b: [number, number],
  loc: [number, number]
): { loc: [number, number]; t: number; dist: number } {
  const midLat = (a[1] + b[1] + loc[1]) / 3;
  const ax = geoLonToMeters(a[0], midLat);
  const ay = geoLatToMeters(a[1]);
  const bx = geoLonToMeters(b[0], midLat);
  const by = geoLatToMeters(b[1]);
  const px = geoLonToMeters(loc[0], midLat);
  const py = geoLatToMeters(loc[1]);

  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  let t = lenSq > 0 ? ((px - ax) * dx + (py - ay) * dy) / lenSq : 0;
  t = Math.max(0, Math.min(1, t));

  const cx = ax + t * dx;
  const cy = ay + t * dy;
  const dist = Math.sqrt((px - cx) ** 2 + (py - cy) ** 2);

  return {
    loc: [geoMetersToLon(cx, midLat), geoMetersToLat(cy)],
    t,
    dist
  };
}

/** Find the closest point on a polyline to `loc`, in meters. */
export function closestPointOnLine(
  coordinates: [number, number][],
  loc: [number, number]
): ClosestLineResult | null {
  if (coordinates.length < 2) return null;

  let bestDist = Infinity;
  let bestLoc: [number, number] = coordinates[0];
  let bestAlong = 0;
  let total = 0;

  for (let i = 1; i < coordinates.length; i++) {
    const a = coordinates[i - 1];
    const b = coordinates[i];
    const segLen = geoSphericalDistance(a, b);
    if (segLen <= 0) continue;

    const { loc: segLoc, t, dist } = closestPointOnSegment(a, b, loc);

    if (dist < bestDist) {
      bestDist = dist;
      bestLoc = segLoc;
      bestAlong = total + segLen * t;
    }

    total += segLen;
  }

  return {
    loc: bestLoc,
    distanceAlong: bestAlong,
    distanceToLine: bestDist
  };
}
