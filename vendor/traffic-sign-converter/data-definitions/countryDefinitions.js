import { trafficSignDataDE } from './DE/trafficSignDataDE.js';
// Data Definitions per Country
export const countryDefinitions = {
    DE: trafficSignDataDE,
};
export const countries = Object.keys(countryDefinitions);
export const countryDefinitionMap = new Map(Object.entries(countryDefinitions));
//# sourceMappingURL=countryDefinitions.js.map