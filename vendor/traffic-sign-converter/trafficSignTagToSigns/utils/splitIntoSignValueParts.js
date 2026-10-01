export const splitIntoSignValueParts = (input) => {
    // Split on , or ; but NOT if inside [] brackets or "" quotes
    // Negative lookahead ensures we don't split inside brackets or quotes
    const split = input.split(/[,;](?![^\[\]]*\])(?![^"]*"(?:[^"]*"[^"]*")*[^"]*$)/);
    return split.map((s) => s.trim());
};
//# sourceMappingURL=splitIntoSignValueParts.js.map