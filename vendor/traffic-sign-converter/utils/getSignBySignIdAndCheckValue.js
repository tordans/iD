export const getSignBySignIdAndCheckValue = (map, signId, signValue) => {
    const matches = [];
    // Case 1: For `signId` there is only one match in `map` => Return this
    for (const [_, value] of map.entries()) {
        if (value.signId === signId) {
            matches.push(value);
        }
    }
    if (matches.length === 1) {
        return matches[0];
    }
    // There are multiple results for `signId`
    // Case 2: If our input sign has a signValue => Return the match that also has a sign value
    // Case 3: If our input sign has doe snot have a signValue => Return the corresponding sign
    if (matches.length > 1) {
        if (!signValue) {
            return matches.find((value) => !value.signValue) || undefined;
        }
        else {
            return matches.find((value) => value.signValue) || undefined;
        }
    }
    return undefined;
};
//# sourceMappingURL=getSignBySignIdAndCheckValue.js.map