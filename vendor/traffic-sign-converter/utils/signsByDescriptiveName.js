import { transformToSignState } from './transformToSignState.js';
/** @description Looks at the start of the `descriptiveName` property */
export const signsByDescriptiveName = (signDefinition, names) => {
    const signs = names
        .map((name) => {
        const exactMatch = signDefinition.find((s) => s.descriptiveName == name);
        const startsWithMatch = signDefinition.find((s) => s.descriptiveName?.startsWith(name));
        return exactMatch || startsWithMatch;
    })
        .filter(Boolean);
    if (signs.length !== names.length) {
        console.info('ERROR', {
            nameCount: names.length,
            signCount: signs.length,
            missing: names.filter((n) => !signs.some((s) => s.descriptiveName === n)),
        });
    }
    return signs;
};
export const signsStateByDescriptiveName = (countryPrefix, signDefinition, names) => {
    const signs = signsByDescriptiveName(signDefinition, names);
    return signs.map((sign) => transformToSignState(countryPrefix, sign));
};
//# sourceMappingURL=signsByDescriptiveName.js.map