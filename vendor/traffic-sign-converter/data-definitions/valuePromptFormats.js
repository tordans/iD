/** All `valuePrompt.format` values used in sign data definitions. */
export const valuePromptFormats = ['integer', 'float', 'opening_hours', 'time_restriction'];
export const valuePromptInputFormats = {
    integer: { type: 'number' },
    float: { type: 'number', step: '0.1' },
    opening_hours: { type: 'text' },
    time_restriction: { type: 'text' },
};
export const getValuePromptInputAttributes = (format) => valuePromptInputFormats[format];
export const isOpeningHoursValuePromptFormat = (format) => format === 'opening_hours' || format === 'time_restriction';
//# sourceMappingURL=valuePromptFormats.js.map