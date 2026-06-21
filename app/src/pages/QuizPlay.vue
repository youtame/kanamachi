<!-- pages/QuizPlay.vue -->
<template>
    <v-container fluid class="quiz-container d-flex align-center px-4 px-sm-6">
        <v-progress-linear
            :model-value="quizStore.progress"
            color="primary"
            height="6"
            striped
            class="position-fixed top-0 left-0 z-index-top"
        ></v-progress-linear>

        <div class="max-width-wrapper w-100">
            <div
                v-if="isLoading"
                class="d-flex justify-center align-center flex-column py-12"
            >
                <v-progress-circular
                    indeterminate
                    color="primary"
                    size="64"
                    class="mb-4"
                ></v-progress-circular>
                <p class="text-medium-emphasis">Loading questions...</p>
            </div>

            <div
                v-else-if="!quizStore.isFinished && quizStore.currentQuestion"
                class="quiz-section"
            >
                <div class="quiz-header d-flex justify-between align-center">
                    <span
                        class="text-subtitle-1 font-weight-bold text-primary font-code"
                    >
                        Q. {{ quizStore.currentIndex + 1 }} /
                        {{ quizStore.totalQuestions }}
                    </span>
                    <v-btn
                        variant="text"
                        :to="`/setup/${textbookId}`"
                        color="medium-emphasis"
                        class="font-weight-bold ml-4"
                        >Quit</v-btn
                    >
                </div>

                <v-card
                    class="question-card glass-card border-0 my-3 my-sm-6"
                    variant="flat"
                >
                    <div class="pa-6 pa-sm-8 text-center">
                        <h2
                            class="question-text font-weight-bold leading-relaxed"
                        >
                            {{ quizStore.currentQuestion.question }}
                        </h2>
                    </div>
                </v-card>

                <v-row class="choices-grid" justify="center">
                    <v-col
                        v-for="(choice, index) in quizStore.currentQuestion
                            .choices"
                        :key="index"
                        cols="12"
                        sm="6"
                        class="choice-col"
                    >
                        <v-btn
                            block
                            variant="flat"
                            class="choice-btn text-none justify-start px-6 font-weight-bold"
                            :class="[
                                getChoiceClass(choice),
                                `choice-type-${String.fromCharCode(65 + index).toLowerCase()}`,
                            ]"
                            @click="quizStore.checkAnswer(choice)"
                            :disabled="quizStore.selectedAnswer !== null"
                        >
                            <span class="choice-index mr-4">{{
                                String.fromCharCode(65 + index)
                            }}</span>
                            <span class="choice-text text-truncate">{{
                                choice
                            }}</span>
                        </v-btn>
                    </v-col>
                </v-row>

                <div class="action-area">
                    <v-slide-y-transition>
                        <v-btn
                            v-if="quizStore.selectedAnswer !== null"
                            color="primary"
                            size="x-large"
                            block
                            variant="flat"
                            class="next-btn font-weight-bold"
                            @click="quizStore.nextQuestion"
                            :append-icon="
                                quizStore.currentIndex + 1 ===
                                quizStore.totalQuestions
                                    ? mdiCheckCircle
                                    : mdiArrowRight
                            "
                        >
                            {{
                                quizStore.currentIndex + 1 ===
                                quizStore.totalQuestions
                                    ? "Finish"
                                    : "Next Question"
                            }}
                        </v-btn>
                    </v-slide-y-transition>
                </div>
            </div>

            <div v-else class="result-section text-center">
                <v-card
                    class="pa-8 glass-card rounded-lg border-0 mb-6 text-center"
                    variant="flat"
                >
                    <div
                        class="text-overline text-primary font-weight-bold mb-2"
                    >
                        QUIZ COMPLETED
                    </div>
                    <h2 class="result-title font-weight-black mb-4">
                        Score Result
                    </h2>

                    <div class="score-display mb-4">
                        <span class="text-h2 font-weight-black text-primary">{{
                            quizStore.score
                        }}</span>
                        <span class="text-h4 text-medium-emphasis mx-2">/</span>
                        <span
                            class="text-h4 text-medium-emphasis font-weight-medium"
                            >{{ quizStore.totalQuestions }}</span
                        >
                    </div>

                    <p
                        class="text-subtitle-1 text-high-emphasis font-weight-bold leading-relaxed max-width-text mx-auto"
                    >
                        {{
                            getFeedbackMessage(
                                quizStore.score,
                                quizStore.totalQuestions,
                            )
                        }}
                    </p>
                </v-card>

                <v-row class="choices-grid mt-2" justify="center">
                    <v-col cols="12" sm="6" class="choice-col Vue-Fix">
                        <v-btn
                            color="primary"
                            block
                            variant="flat"
                            class="choice-btn font-weight-bold"
                            @click="retryQuiz"
                            :prepend-icon="mdiRefresh"
                        >
                            Retry
                        </v-btn>
                    </v-col>
                    <v-col cols="12" sm="6" class="choice-col Vue-Fix">
                        <v-btn
                            variant="outlined"
                            block
                            class="choice-btn code-style-btn font-weight-bold"
                            :to="`/setup/${textbookId}`"
                            :prepend-icon="mdiArrowLeft"
                        >
                            Change Settings
                        </v-btn>
                    </v-col>
                </v-row>
            </div>
        </div>
    </v-container>
</template>

<script setup lang="ts">
/* Setup logic for managing route queries, store initializations, and answer checking hooks */
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useQuizStore } from "../stores/QuizStore";
import {
    mdiArrowRight,
    mdiCheckCircle,
    mdiRefresh,
    mdiArrowLeft,
} from "@mdi/js";

const route = useRoute();
const quizStore = useQuizStore();

const isLoading = ref(true);
const rawQuizData = ref<any>(null);

const textbookId = computed(() => (route.params.textname as string) || "");
const chapter = computed(() => Number(route.query.chapter) || 1);
const limit = computed(() => Number(route.query.limit) || 10);

onMounted(async () => {
    try {
        const response = await fetch(`/quiz/${textbookId.value}.json`);
        if (!response.ok) throw new Error("Failed to load quiz data");
        rawQuizData.value = await response.json();

        startSession();
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
});

function startSession() {
    if (rawQuizData.value) {
        quizStore.initQuiz(rawQuizData.value, chapter.value, limit.value);
    }
}

function retryQuiz() {
    startSession();
}

function getChoiceClass(choice: string) {
    if (quizStore.selectedAnswer === null) return "bg-surface";
    const isCurrentChoice = quizStore.selectedAnswer === choice;
    const isCorrectAnswer = choice === quizStore.currentQuestion?.answer;

    if (isCorrectAnswer) return "choice-correct";
    if (isCurrentChoice && !isCorrectAnswer) return "choice-wrong";
    return "choice-disabled";
}

function getFeedbackMessage(score: number, total: number) {
    const rate = score / total;
    if (rate === 1) return "Perfect! You're a Genius!";
    if (rate >= 0.7) return "Great job! Keep it up!";
    return "Nice try! Let's review and challenge again!";
}
</script>

<style lang="scss" scoped>
/* Scoped layout styling ensuring dynamic components and flexible height distributions */
.quiz-container {
    height: calc(
        100vh - var(--v-layout-header-height, 64px) - var(
                --v-layout-footer-height,
                48px
            )
    );
    height: calc(
        100dvh - var(--v-layout-header-height, 64px) - var(
                --v-layout-footer-height,
                48px
            )
    );
    overflow-y: auto;
    background-color: rgb(var(--v-theme-background));
}

.max-width-wrapper {
    max-width: 1100px;
    margin: 0 auto;
}

.max-width-text {
    max-width: 480px;
}

.z-index-top {
    z-index: 9999;
}

.font-code {
    font-family: "Fira Code", monospace;
}

.leading-relaxed {
    line-height: 1.4 !important;
}

.question-card {
    border-radius: 16px;
    min-height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.question-text {
    font-size: clamp(16px, 4vw, 22px);
}

.result-title {
    font-size: clamp(24px, 5vw, 32px);
}

.glass-card {
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    box-shadow: 0 8px 32px 0 rgba(var(--v-theme-primary), 0.05) !important;
}

.choices-grid {
    margin: 0 -4px;
}
.choice-col {
    padding: 4px !important;
}

.choice-btn {
    border-radius: 12px;
    height: max(48px, 6.5vh) !important;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    .choice-index {
        font-family: "Fira Code", monospace;
        font-weight: 900;
        font-size: 16px;
    }
    .choice-text {
        font-size: clamp(13px, 2vw, 15px);
    }
}

.code-style-btn {
    border-width: 2px !important;
}

/* A, B, C, D Brand subtle colors */
.choice-type-a {
    background-color: rgba(var(--v-theme-primary), 0.06) !important;
    border: 1px solid rgba(var(--v-theme-primary), 0.15);
    .choice-index {
        color: rgb(var(--v-theme-primary));
    }
}
.choice-type-b {
    background-color: rgba(76, 175, 80, 0.06) !important;
    border: 1px solid rgba(76, 175, 80, 0.15);
    .choice-index {
        color: #4caf50;
    }
}
.choice-type-c {
    background-color: rgba(255, 152, 0, 0.06) !important;
    border: 1px solid rgba(255, 152, 0, 0.15);
    .choice-index {
        color: #ff9800;
    }
}
.choice-type-d {
    background-color: rgba(156, 39, 176, 0.06) !important;
    border: 1px solid rgba(156, 39, 176, 0.15);
    .choice-index {
        color: #9c27b0;
    }
}

/* Verification states */
.choice-correct {
    background-color: #2e7d32 !important;
    border-color: #2e7d32 !important;
    color: white !important;
    .choice-index {
        color: white !important;
    }
}
.choice-wrong {
    background-color: #c62828 !important;
    border-color: #c62828 !important;
    color: white !important;
    .choice-index {
        color: white !important;
    }
}
.choice-disabled {
    opacity: 0.2;
}

.action-area {
    height: 60px;
    margin-top: 8px;
    display: flex;
    align-items: center;
    padding-bottom: 12px;
}
.next-btn {
    border-radius: 12px;
    height: 48px !important;
}

@media (min-width: 600px) {
    .quiz-container {
        padding-top: 40px !important;
        padding-bottom: 40px !important;
    }
    .choice-col {
        padding: 12px !important;
    }
    .choice-btn {
        height: 76px !important;
        justify-content: center !important;
        .choice-text {
            width: 100%;
            text-align: center;
            font-size: 16px;
        }
    }
    .action-area {
        margin-top: 24px;
        height: auto;
        padding-bottom: 0;
    }
}
</style>
