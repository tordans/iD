export const splitIntoSignGroups = (signs) => {
    const groups = [];
    let currentGroup = [];
    signs.forEach((sign) => {
        if (sign.kind === 'traffic_sign') {
            if (currentGroup.length > 0) {
                groups.push(currentGroup);
            }
            currentGroup = [sign];
        }
        else if (['exception_modifier', 'condition_modifier'].includes(sign.kind)) {
            currentGroup.push(sign);
        }
    });
    if (currentGroup.length > 0) {
        groups.push(currentGroup);
    }
    return groups;
};
//# sourceMappingURL=splitIntoSignGroups.js.map