export const normalizeOptionalTags = (optionalTags) => {
    if (!optionalTags) {
        return { tags: [] };
    }
    if (Array.isArray(optionalTags)) {
        return { tags: optionalTags };
    }
    return {
        tags: optionalTags.tags,
        guidance: optionalTags.guidance,
    };
};
export const hasOptionalTags = (optionalTags) => normalizeOptionalTags(optionalTags).tags.length > 0;
//# sourceMappingURL=normalizeOptionalTags.js.map