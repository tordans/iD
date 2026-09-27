import { QUESTION_NIL_ANSWER_ID, } from '../data-definitions/TrafficSignDataTypes.js';
export const resolveEffectiveAnswerId = (question, selectedAnswerId) => {
    if (selectedAnswerId !== undefined) {
        return selectedAnswerId;
    }
    if (question.defaultAnswerId) {
        return question.defaultAnswerId;
    }
    return QUESTION_NIL_ANSWER_ID;
};
export const getSelectedAnswerId = (answers, signOsmValuePart, questionId) => answers?.[signOsmValuePart]?.[questionId];
export const resolveQuestionAnswer = (question, answers, signOsmValuePart) => {
    const selectedAnswerId = getSelectedAnswerId(answers, signOsmValuePart, question.questionId);
    const effectiveAnswerId = resolveEffectiveAnswerId(question, selectedAnswerId);
    const answer = question.answers.find((item) => item.answerId === effectiveAnswerId);
    return {
        selectedAnswerId,
        effectiveAnswerId,
        answer,
    };
};
export const isExplicitNilSelection = (question, answers, signOsmValuePart) => {
    const selected = getSelectedAnswerId(answers, signOsmValuePart, question.questionId);
    return selected === QUESTION_NIL_ANSWER_ID;
};
//# sourceMappingURL=resolveQuestionAnswer.js.map