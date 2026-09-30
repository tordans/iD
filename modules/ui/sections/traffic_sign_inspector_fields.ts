import type { Dispatch } from 'd3-dispatch';
import type { Field, Geometry } from '@openstreetmap/id-tagging-schema';

import { presetField } from '../../presets/field';
import {
    TRAFFIC_SIGN_FIELD_TYPE,
    fieldIdForTrafficSignTagKey,
    labelForTrafficSignTagKey,
    trafficSignTagKeysFromTags
} from '../../presets/traffic_sign_fields';
import { uiField } from '../field';

type PresetManager = { field(id: string): presetField | undefined };

/**
 * Append traffic sign fields at the bottom of the inspector when matching tags exist.
 * Skips keys already covered by preset fields (`presetKeys`) or earlier entries of `fieldsArr`.
 */
export function appendTrafficSignInspectorFields(
    fieldsArr: { key?: string }[],
    tags: TagsMulti,
    context: iD.Context,
    entityIDs: string[],
    presetsManager: PresetManager,
    geometries: Geometry[],
    dispatch: Dispatch<object>,
    presetKeys: (string | undefined)[] = []
) {
    const shownKeys = new Set([...presetKeys, ...fieldsArr.map(field => field.key)]);

    for (const tagKey of trafficSignTagKeysFromTags(tags)) {
        if (shownKeys.has(tagKey)) continue;

        const fieldID = fieldIdForTrafficSignTagKey(tagKey);
        let field = presetsManager.field(fieldID);

        if (!field || field.key !== tagKey || (field.type as string) !== TRAFFIC_SIGN_FIELD_TYPE) {
            field = presetField(fieldID, {
                key: tagKey,
                type: TRAFFIC_SIGN_FIELD_TYPE,
                label: labelForTrafficSignTagKey(tagKey),
                snake_case: false,
                caseSensitive: true
            } as unknown as Field);
        }

        if (!field.matchAllGeometry(geometries)) continue;

        const inspectorField = (uiField as any)(context, field, entityIDs, { show: true });

        inspectorField
            .on('change', (tagChange: TagsUpdate, onInput: boolean) => {
                dispatch.call('change', inspectorField, entityIDs, tagChange, onInput);
            })
            .on('revert', (keys: string[]) => {
                dispatch.call('revert', inspectorField, keys);
            });

        fieldsArr.push(inspectorField);
        shownKeys.add(tagKey);
    }
}
