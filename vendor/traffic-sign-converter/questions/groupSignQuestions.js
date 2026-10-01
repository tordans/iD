import { resolveEffectiveAnswerId } from './resolveQuestionAnswer.js';
const normalizeAnswer = (answer) => ({
    id: answer.answerId,
    tags: answer.tags ?? null,
    remove: answer.removeTags ?? null,
    hw: answer.highwayValue ?? null,
    geo: answer.geometries ?? null,
});
/** Stable key for questions with identical options and tagging effects. */
export const getQuestionEquivalenceKey = (question) => JSON.stringify({
    id: question.questionId,
    aff: question.affectsHighway ?? false,
    def: question.defaultAnswerId ?? null,
    geo: question.geometries ?? null,
    answers: question.answers.map(normalizeAnswer),
});
export const collectSignQuestionGroups = (signs) => {
    const groups = [];
    const indexByKey = new Map();
    for (const sign of signs) {
        if (!sign.recodgnizedSign || !sign.questions?.length) {
            continue;
        }
        for (const question of sign.questions) {
            const equivalenceKey = getQuestionEquivalenceKey(question);
            const existingIndex = indexByKey.get(equivalenceKey);
            if (existingIndex === undefined) {
                indexByKey.set(equivalenceKey, groups.length);
                groups.push({
                    equivalenceKey,
                    question,
                    signOsmValueParts: [sign.osmValuePart],
                    signs: [sign],
                });
                continue;
            }
            const group = groups[existingIndex];
            if (!group.signOsmValueParts.includes(sign.osmValuePart)) {
                group.signOsmValueParts.push(sign.osmValuePart);
                group.signs.push(sign);
            }
        }
    }
    return groups;
};
export const resolveGroupedSelectedAnswerId = (answers, signOsmValueParts, questionId) => {
    for (const signKey of signOsmValueParts) {
        const selected = answers?.[signKey]?.[questionId];
        if (selected !== undefined) {
            return selected;
        }
    }
    return undefined;
};
export const resolveGroupedEffectiveAnswerId = (question, answers, signOsmValueParts) => resolveEffectiveAnswerId(question, resolveGroupedSelectedAnswerId(answers, signOsmValueParts, question.questionId));
/** Copy one explicit answer onto every sign that shares the same question. */
export const syncEquivalentQuestionAnswers = (answers, signs) => {
    const next = {};
    for (const [signKey, signAnswers] of Object.entries(answers)) {
        next[signKey] = { ...signAnswers };
    }
    for (const group of collectSignQuestionGroups(signs)) {
        if (group.signOsmValueParts.length <= 1) {
            continue;
        }
        const selected = resolveGroupedSelectedAnswerId(answers, group.signOsmValueParts, group.question.questionId);
        if (selected === undefined) {
            continue;
        }
        for (const signKey of group.signOsmValueParts) {
            next[signKey] = {
                ...(next[signKey] ?? {}),
                [group.question.questionId]: selected,
            };
        }
    }
    return next;
};
/** Keep one sign entry per shared question in URL/cache payloads. */
export const dedupeEquivalentAnswersForUrl = (answers, signs) => {
    const synced = syncEquivalentQuestionAnswers(answers, signs);
    const next = {};
    for (const [signKey, signAnswers] of Object.entries(synced)) {
        next[signKey] = { ...signAnswers };
    }
    for (const group of collectSignQuestionGroups(signs)) {
        if (group.signOsmValueParts.length <= 1) {
            continue;
        }
        const [, ...duplicateSignKeys] = group.signOsmValueParts;
        for (const signKey of duplicateSignKeys) {
            const signAnswers = next[signKey];
            if (!signAnswers?.[group.question.questionId]) {
                continue;
            }
            const { [group.question.questionId]: _removed, ...rest } = signAnswers;
            if (Object.keys(rest).length > 0) {
                next[signKey] = rest;
            }
            else {
                delete next[signKey];
            }
        }
    }
    return next;
};
//# sourceMappingURL=groupSignQuestions.js.map