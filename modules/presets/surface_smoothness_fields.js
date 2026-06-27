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
        if (f && f.key === 'surface') {
            f.type = 'surfaceSmoothness';
        }
    }
}
