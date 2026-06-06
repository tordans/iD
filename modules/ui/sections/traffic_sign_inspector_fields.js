import { presetField } from '../../presets/field';
import {
    fieldIdForTrafficSignTagKey,
    labelForTrafficSignTagKey,
    trafficSignTagKeysFromTags
} from '../../presets/traffic_sign_fields';
import { uiField } from '../field';


/**
 * Append traffic sign fields at the bottom of the inspector when matching tags exist.
 * Skips keys already covered by preset fields.
 */
export function appendTrafficSignInspectorFields(fieldsArr, tags, context, entityIDs, presetsManager, geometries, dispatch) {
    const shownKeys = new Set(fieldsArr.map(field => field.key));
    const tagKeys = trafficSignTagKeysFromTags(tags);

    tagKeys.forEach(tagKey => {
        if (shownKeys.has(tagKey)) return;

        const fieldID = fieldIdForTrafficSignTagKey(tagKey);
        let presetFieldObj = presetsManager.field(fieldID);

        if (!presetFieldObj || presetFieldObj.key !== tagKey || presetFieldObj.type !== 'trafficSign') {
            presetFieldObj = presetField(fieldID, {
                key: tagKey,
                type: 'trafficSign',
                label: labelForTrafficSignTagKey(tagKey),
                snake_case: false,
                caseSensitive: true
            }, {});
        }

        if (!presetFieldObj.matchAllGeometry(geometries)) return;

        const inspectorField = uiField(context, presetFieldObj, entityIDs, { show: true });

        inspectorField
            .on('change', function(t, onInput) {
                dispatch.call('change', inspectorField, entityIDs, t, onInput);
            })
            .on('revert', function(keys) {
                dispatch.call('revert', inspectorField, keys);
            });

        fieldsArr.push(inspectorField);
        shownKeys.add(tagKey);
    });
}
