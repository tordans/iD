import { geoMetersToLat, geoMetersToLon } from '../geo';

type Loc = [number, number];

/**
 * A line parallel to `locs`, `meters` to the right (or left) of its direction.
 * Each vertex moves along the average normal of its two segments, scaled so both segments
 * keep the distance; very sharp angles are capped at twice the distance so the line does not
 * shoot off. Computed in a local metric plane around the line's middle latitude.
 */
export function offsetLine(locs: Loc[], meters: number, side: 'left' | 'right'): Loc[] {
    if (locs.length < 2) return locs.slice();

    const lat0 = locs.reduce((sum, loc) => sum + loc[1], 0) / locs.length;
    const degLon = geoMetersToLon(1, lat0);
    const degLat = geoMetersToLat(1);
    const points = locs.map(([lon, lat]) => [lon / degLon, lat / degLat]);
    const sign = side === 'right' ? 1 : -1;

    // right-hand unit normal of each segment (x east, y north)
    const normals = points.slice(1).map((point, i) => {
        const dx = point[0] - points[i][0];
        const dy = point[1] - points[i][1];
        const length = Math.hypot(dx, dy) || 1;
        return [dy / length, -dx / length];
    });

    return points.map((point, i) => {
        const before = normals[i - 1] ?? normals[i];
        const after = normals[i] ?? normals[i - 1];
        let nx = before[0] + after[0];
        let ny = before[1] + after[1];
        const length = Math.hypot(nx, ny);
        if (length < 1e-9) {
            // the line turns back on itself: use one segment's normal
            [nx, ny] = before;
        } else {
            nx /= length;
            ny /= length;
        }
        const cos = nx * before[0] + ny * before[1];
        const scale = 1 / Math.max(cos, 0.5);
        const distance = sign * meters * scale;
        return [(point[0] + nx * distance) * degLon, (point[1] + ny * distance) * degLat] as Loc;
    });
}


/** Length of a line in meters (local plane, good enough for a street) */
export function lineLengthMeters(locs: Loc[]) {
    if (locs.length < 2) return 0;
    const lat0 = locs[0][1];
    const degLon = geoMetersToLon(1, lat0);
    const degLat = geoMetersToLat(1);
    let length = 0;
    for (let i = 1; i < locs.length; i++) {
        length += Math.hypot((locs[i][0] - locs[i - 1][0]) / degLon, (locs[i][1] - locs[i - 1][1]) / degLat);
    }
    return length;
}
