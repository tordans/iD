import { joinImageIds, splitImageIds, suggestedMapillaryKeys } from './tag_keys';

/**
 * Pure logic of "set photo from viewer" for Mapillary (WORKDOC feature 20): which key the id is
 * written to, the appended value and why the button is disabled.
 */

type TagsLike = Record<string, string | string[] | undefined>;

export const DEFAULT_TARGET_KEY = 'mapillary';

export type DisabledReason = 'already_set' | 'too_far';


/** The key the main button writes to */
export function resolveTargetKey(active: string | undefined): string {
    return active || DEFAULT_TARGET_KEY;
}


/** Value of `key` with `id` added to the `;` list (no duplicates) */
export function appendImageId(tags: TagsLike, key: string, id: string): string {
    const value = tags[key];
    const ids = splitImageIds(typeof value === 'string' ? value : undefined);
    return joinImageIds([...ids, id]) ?? id;
}


export function hasImageId(tags: TagsLike, key: string, id: string): boolean {
    const value = tags[key];
    return splitImageIds(typeof value === 'string' ? value : undefined).includes(id);
}


/** The keys offered in the dropdown: the existing image keys and the likely new ones */
export function targetKeys(tags: TagsLike): string[] {
    return suggestedMapillaryKeys(tags);
}


/** "Already set" is per target key: every selected entity has the id in that key's list */
export function disabledReason(entitiesTags: TagsLike[], key: string, id: string | undefined, tooFar: boolean): DisabledReason | false {
    if (id && entitiesTags.length && entitiesTags.every(tags => hasImageId(tags, key, id))) return 'already_set';
    if (tooFar) return 'too_far';
    return false;
}
