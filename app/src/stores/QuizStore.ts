import { defineStore } from "pinia";
import { ref, computed } from "vue";

// Type Definition
export interface VocabularyItem {
    id: string;
    expression: string;
    definitions: string[];
    sentence?: string;
    sentence_blank?: string;
    correct?: string;
    correct_jp?: string;
}

export interface ChapterData {
    chapter: number;
    vocabulary: VocabularyItem[];
}

export interface FormattedQuestion {
    id: string;
    question: string;
    answer: string;
    choices?: string[];
    sentenceBlank?: string;
}

export const useQuizStore = defineStore("quiz", () => {
    const questions = ref<FormattedQuestion[]>([]);
    const currentIndex = ref(0);
    const score = ref(0);
    const isFinished = ref(false);
    const selectedAnswer = ref<string | null>(null);
    const isCorrect = ref<boolean | null>(null);

    const currentQuestion = computed(
        () => questions.value[currentIndex.value] || null,
    );
    const totalQuestions = computed(() => questions.value.length);
    const progress = computed(() => {
        if (totalQuestions.value === 0) return 0;
        return (currentIndex.value / totalQuestions.value) * 100;
    });

    function shuffleArray<T>(array: T[]): T[] {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function initQuiz(
        rawData: ChapterData[],
        targetChapter: number,
        limit: number,
    ) {
        const targetData = rawData.find(
            (c) => Number(c.chapter) === targetChapter,
        );
        if (!targetData || !targetData.vocabulary.length) {
            questions.value = [];
            return;
        }

        const vocabList = targetData.vocabulary;
        const allExpressions = vocabList.map((v) => v.expression);

        let formatted: FormattedQuestion[] = vocabList.map((item) => {
            const correctAnswer = item.expression;
            const otherChoices = allExpressions.filter(
                (exp) => exp !== correctAnswer,
            );
            const dummyChoices = shuffleArray(otherChoices).slice(0, 3);
            const finalChoices = shuffleArray([correctAnswer, ...dummyChoices]);

            return {
                id: item.id,
                question: item.definitions[0],
                answer: correctAnswer,
                choices: finalChoices,
            };
        });

        resetStoreState(formatted, limit);
    }

    function initInputQuiz(
        rawData: ChapterData[],
        targetChapter: number,
        limit: number,
    ) {
        const targetData = rawData.find(
            (c) => Number(c.chapter) === targetChapter,
        );
        if (!targetData || !targetData.vocabulary.length) {
            questions.value = [];
            return;
        }

        let formatted: FormattedQuestion[] = targetData.vocabulary.map(
            (item) => {
                const isSentenceQuiz = !!item.sentence_blank;

                return {
                    id: item.id,
                    question: isSentenceQuiz
                        ? item.correct_jp || item.definitions[0]
                        : item.definitions[0],
                    answer: isSentenceQuiz
                        ? item.correct || item.expression
                        : item.expression,
                    sentenceBlank: item.sentence_blank || undefined,
                };
            },
        );

        resetStoreState(formatted, limit);
    }

    function resetStoreState(
        formattedData: FormattedQuestion[],
        limit: number,
    ) {
        let finalData = shuffleArray(formattedData);
        if (limit > 0) {
            finalData = finalData.slice(0, limit);
        }
        questions.value = finalData;
        currentIndex.value = 0;
        score.value = 0;
        isFinished.value = false;
        selectedAnswer.value = null;
        isCorrect.value = null;
    }

    function checkAnswer(inputAnswer: string) {
        if (selectedAnswer.value !== null) return;

        selectedAnswer.value = inputAnswer;

        const userAnswer = inputAnswer.trim().toLowerCase();
        const correctAnswer = currentQuestion
            .value!.answer.trim()
            .toLowerCase();

        const correct = userAnswer === correctAnswer;
        isCorrect.value = correct;

        if (correct) {
            score.value++;
        }
    }

    function nextQuestion() {
        selectedAnswer.value = null;
        isCorrect.value = null;

        if (currentIndex.value + 1 < totalQuestions.value) {
            currentIndex.value++;
        } else {
            isFinished.value = true;
        }
    }

    return {
        questions,
        currentIndex,
        score,
        isFinished,
        selectedAnswer,
        isCorrect,
        currentQuestion,
        totalQuestions,
        progress,
        initQuiz,
        initInputQuiz,
        checkAnswer,
        nextQuestion,
    };
});
