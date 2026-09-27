export const fillTemplate = (template, values) => Object.entries(values).reduce((url, [key, value]) => url.replaceAll(`{${key}}`, value), template);
//# sourceMappingURL=fillTemplate.js.map