// Runtime preset integration for the surface/smoothness composite field.
//
// Rather than editing id-tagging-schema, we override the schema's `surface` field
// type to our composite `surfaceSmoothness` field wherever it appears. The composite
// reads and writes both `surface` and `smoothness` from the entity's full tag set.
// This runs inside presetManager.merge(), so it applies to the core schema load and
// any later merges.

export function applySurfaceSmoothnessFieldType(fields) {
    if (!fields) return;
    for (const fieldID of Object.keys(fields)) {
        const f = fields[fieldID];
        if (!f) continue;

        if (f.key === 'surface') {
            f.type = 'surfaceSmoothness';
            // The composite reads/writes BOTH keys, so iD's remove/revert/modified
            // logic (presetField.allKeys()) must know it controls `smoothness` too —
            // otherwise the field's trash button orphans the smoothness tag.
            f.keys = Array.from(new Set([...(f.keys || []), 'surface', 'smoothness']));

        } else if (f.key === 'smoothness') {
            // The composite supersedes the standalone smoothness field; drop it so the
            // inspector doesn't show two editors for the same key. Presets that still
            // reference this field id resolve it to nothing (preset.js skips unknown ids).
            delete fields[fieldID];
        }
    }
}
