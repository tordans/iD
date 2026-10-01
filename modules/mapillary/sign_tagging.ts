import { newRelatedKey } from '../presets/related_tags';
import { appendImageId } from './set_photo';
import { addSignToValue } from './sign_groups';

/**
 * Writing a Mapillary traffic sign to the selected way (WORKDOC feature 26): the keys it can go to
 * and the tag changes. Pure.
 */

type TagsLike = Record<string, string | string[] | undefined>;

const SIGN_KEY = /^((cycleway|sidewalk):(left|right|both):)?traffic_sign(:(forward|backward))?$/;


/**
 * Keys a sign can be written to: the way's own (`traffic_sign`, `:forward`, `:backward`), every
 * tagged sign key, and the sign key of each road side with a bike lane or a sidewalk open to bikes
 */
export function signTargetKeys(tags: TagsLike): string[] {
    const keys = ['traffic_sign', 'traffic_sign:forward', 'traffic_sign:backward'];
    for (const key of Object.keys(tags)) {
        if (SIGN_KEY.test(key)) keys.push(key);
    }
    for (const side of ['left', 'right', 'both'] as const) {
        const lane = tags[`cycleway:${side}`];
        if (typeof lane === 'string' && lane !== 'no' && lane !== 'separate') keys.push(`cycleway:${side}:traffic_sign`);
        if (tags[`sidewalk:${side}:bicycle`] !== undefined) keys.push(`sidewalk:${side}:traffic_sign`);
    }
    return [...new Set(keys)];
}


/**
 * The key to offer first: the one used last if it fits; for bike signs the sign key of the road side
 * the sign stands on (`side`), if the way has one; else `traffic_sign`
 */
export function defaultSignTargetKey(tags: TagsLike, options: { lastUsed?: string; side?: 'left' | 'right'; bikeSign?: boolean } = {}): string {
    const keys = signTargetKeys(tags);
    if (options.lastUsed && keys.includes(options.lastUsed)) return options.lastUsed;
    if (options.bikeSign && options.side) {
        const sideKey = keys.find(key => key.startsWith(`cycleway:${options.side}:`) || key.startsWith('cycleway:both:'))
            ?? keys.find(key => key.startsWith(`sidewalk:${options.side}:`));
        if (sideKey) return sideKey;
    }
    return 'traffic_sign';
}


/** Which side of the line (way direction) the point is on, by its nearest segment */
export function sideOfLine(coords: readonly [number, number][], point: [number, number]): 'left' | 'right' | undefined {
    if (coords.length < 2) return undefined;
    const scale = Math.cos(point[1] * Math.PI / 180);
    const xy = (p: readonly [number, number]) => [p[0] * scale, p[1]];
    const [px, py] = xy(point);
    let best: { dist: number; cross: number } | undefined;
    for (let i = 0; i < coords.length - 1; i++) {
        const [ax, ay] = xy(coords[i]);
        const [bx, by] = xy(coords[i + 1]);
        const [dx, dy] = [bx - ax, by - ay];
        const lengthSq = dx * dx + dy * dy;
        if (!lengthSq) continue;
        const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSq));
        const dist = Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
        const cross = dx * (py - ay) - dy * (px - ax);
        if (!best || dist < best.dist) best = { dist, cross };
    }
    if (!best || best.cross === 0) return undefined;
    return best.cross > 0 ? 'left' : 'right';
}


/** Tags after writing `sign` to `key`, with the image as its source (`source:traffic_sign:mapillary`) */
export function signTagChanges(tags: TagsLike, key: string, sign: string, imageId?: string): Record<string, string> {
    const current = typeof tags[key] === 'string' ? tags[key] as string : undefined;
    const changes: Record<string, string> = { [key]: addSignToValue(current, sign) };
    if (imageId) {
        const sourceKey = newRelatedKey('mapillary', key);
        changes[sourceKey] = appendImageId(tags, sourceKey, imageId);
    }
    return changes;
}


/** Whether the change would leave every tag as it is */
export function changesNothing(tags: TagsLike, changes: Record<string, string>): boolean {
    return Object.entries(changes).every(([key, value]) => tags[key] === value);
}
