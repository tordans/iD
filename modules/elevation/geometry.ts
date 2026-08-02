import { geoSphericalDistance } from '../geo';

export interface ClosestLineResult {
  loc: [number, number];
  distanceAlong: number;
  distanceToLine: number;
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

    let t = 0;
    let minSegDist = Infinity;

    // coarse search along segment
    const steps = Math.max(4, Math.ceil(segLen / 5));
    for (let s = 0; s <= steps; s++) {
      const ratio = s / steps;
      const candidate: [number, number] = [
        a[0] + (b[0] - a[0]) * ratio,
        a[1] + (b[1] - a[1]) * ratio
      ];
      const d = geoSphericalDistance(candidate, loc);
      if (d < minSegDist) {
        minSegDist = d;
        t = ratio;
      }
    }

    if (minSegDist < bestDist) {
      bestDist = minSegDist;
      bestLoc = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
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
