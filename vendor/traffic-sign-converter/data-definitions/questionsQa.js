export const questionsQaFilters = ['all', 'with', 'without'];
export const signHasQuestions = (sign) => Boolean(sign.questions?.length);
export const classifySignQuestionsQa = (sign) => signHasQuestions(sign) ? 'withQuestions' : 'withoutQuestions';
export const matchesQuestionsQaFilter = (sign, filter) => {
    if (filter === 'all') {
        return true;
    }
    const category = classifySignQuestionsQa(sign);
    switch (filter) {
        case 'with':
            return category === 'withQuestions';
        case 'without':
            return category === 'withoutQuestions';
        default:
            return true;
    }
};
export const filterSignsByQuestionsQa = (signs, filter) => signs.filter((sign) => matchesQuestionsQaFilter(sign, filter));
export const countSignsByQuestionsQa = (signs) => {
    const counts = {
        all: signs.length,
        with: 0,
        without: 0,
    };
    for (const sign of signs) {
        if (signHasQuestions(sign)) {
            counts.with++;
        }
        else {
            counts.without++;
        }
    }
    return counts;
};
//# sourceMappingURL=questionsQa.js.map