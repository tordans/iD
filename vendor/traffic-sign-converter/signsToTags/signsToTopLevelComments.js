export const signsToTopLevelComments = (signs) => {
    const signCommentsMap = new Map();
    for (const sign of signs) {
        if (sign.recodgnizedSign === false)
            continue;
        if (sign.comments?.length) {
            signCommentsMap.set(sign.osmValuePart, sign.comments);
        }
    }
    return signCommentsMap;
};
//# sourceMappingURL=signsToTopLevelComments.js.map