import { countryDefinitions, } from '../data-definitions/countryDefinitions.js';
import { transformToSignState } from './transformToSignState.js';
export const getSignsMap = (countryPrefix) => {
    const signsMap = new Map();
    for (const sign of countryDefinitions[countryPrefix]) {
        signsMap.set(sign.osmValuePart, transformToSignState(countryPrefix, sign));
    }
    return signsMap;
};
//# sourceMappingURL=getSignsMap.js.map