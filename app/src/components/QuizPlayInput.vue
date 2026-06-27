<template>
    <div class="input-mode-wrapper">
        <v-card
            class="question-card glass-card border-0 my-3 my-sm-6"
            variant="flat"
        >
            <div class="pa-6 pa-sm-8 text-center w-100">
                <template v-if="quizStore.currentQuestion?.sentenceBlank">
                    <h2
                        class="blank-sentence-text font-weight-bold mb-4 font-code"
                    >
                        {{ quizStore.currentQuestion.sentenceBlank }}
                    </h2>
                    <p
                        class="text-subtitle-1 text-medium-emphasis font-weight-medium"
                    >
                        {{ quizStore.currentQuestion?.question }}
                    </p>
                </template>

                <template v-else>
                    <h2 class="question-text font-weight-bold leading-relaxed">
                        {{ quizStore.currentQuestion?.question }}
                    </h2>
                </template>
            </div>
        </v-card>

        <v-row justify="center" class="input-grid">
            <v-col cols="12" class="input-col">
                <v-text-field
                    v-model="userInput"
                    label="Answer"
                    placeholder="Input Answer..."
                    variant="outlined"
                    persistent-placeholder
                    :disabled="quizStore.selectedAnswer !== null"
                    :error="quizStore.isCorrect === false"
                    :success="quizStore.isCorrect === true"
                    :prepend-inner-icon="getInputIcon()"
                    :messages="getFeedbackMessage()"
                    class="answer-field font-weight-bold"
                    @keyup.enter="submitAnswer"
                ></v-text-field>
            </v-col>
        </v-row>

        <div class="action-area">
            <v-btn
                v-if="quizStore.selectedAnswer === null"
                color="primary"
                size="x-large"
                block
                variant="flat"
                class="action-btn font-weight-bold"
                :disabled="!userInput.trim()"
                @click="submitAnswer"
                :append-icon="mdiAlertCircleOutline"
            >
                Check Answer
            </v-btn>

            <v-slide-y-transition>
                <v-btn
                    v-if="quizStore.selectedAnswer !== null"
                    :color="quizStore.isCorrect ? 'success' : 'primary'"
                    size="x-large"
                    block
                    variant="flat"
                    class="action-btn font-weight-bold"
                    @click="goNext"
                    :append-icon="
                        quizStore.currentIndex + 1 === quizStore.totalQuestions
                            ? mdiCheckCircle
                            : mdiArrowRight
                    "
                >
                    {{
                        quizStore.currentIndex + 1 === quizStore.totalQuestions
                            ? "Finish"
                            : "Next Question"
                    }}
                </v-btn>
            </v-slide-y-transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useQuizStore } from "../stores/QuizStore";
import {
    mdiArrowRight,
    mdiCheckCircle,
    mdiPencilOutline,
    mdiCheck,
    mdiClose,
    mdiAlertCircleOutline,
} from "@mdi/js";

const quizStore = useQuizStore();
const userInput = ref("");

watch(
    () => quizStore.currentIndex,
    () => {
        userInput.value = "";
    },
);

function submitAnswer() {
    if (!userInput.value.trim() || quizStore.selectedAnswer !== null) return;
    quizStore.checkAnswer(userInput.value);
}

function goNext() {
    quizStore.nextQuestion();
}

function getInputIcon() {
    if (quizStore.isCorrect === true) return mdiCheck;
    if (quizStore.isCorrect === false) return mdiClose;
    return mdiPencilOutline;
}

function getFeedbackMessage() {
    if (quizStore.isCorrect === true) return "Correct";
    if (quizStore.isCorrect === false) {
        return `Incorrect Answer: ${quizStore.currentQuestion?.answer}`;
    }
    return "";
}
</script>

<style lang="scss" scoped>
.leading-relaxed {
    line-height: 1.4 !important;
}

.font-code {
    font-family: "Courier New", Courier, monospace;
}

.question-card {
    border-radius: 16px;
    min-height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.question-text {
    font-size: clamp(16px, 4vw, 22px);
}

.blank-sentence-text {
    font-size: clamp(18px, 4.5vw, 26px);
    letter-spacing: 0.5px;
    color: rgb(var(--v-theme-on-surface));
    word-break: break-word;
}

.glass-card {
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    box-shadow: 0 8px 32px 0 rgba(var(--v-theme-primary), 0.05) !important;
}

.input-grid {
    margin: 0 -4px;
}
.input-col {
    padding: 4px !important;
}

.answer-field {
    :deep(.v-field) {
        border-radius: 12px !important;
        background-color: rgba(var(--v-theme-surface), 0.6);
        transition: all 0.2s ease;
    }

    &.v-input--success :deep(.v-field) {
        background-color: rgba(76, 175, 80, 0.08) !important;
    }

    &.v-input--error :deep(.v-field) {
        background-color: rgba(244, 67, 54, 0.08) !important;
    }

    :deep(.v-messages) {
        font-size: 14px;
        font-weight: 600;
        padding-top: 6px;
        opacity: 1;
    }
}

.action-area {
    height: 60px;
    margin-top: 12px;
    display: flex;
    align-items: center;
    padding-bottom: 12px;
}

.action-btn {
    border-radius: 12px;
    height: 48px !important;
    transition: all 0.2s ease;
}

@media (min-width: 600px) {
    .input-col {
        padding: 12px !important;
    }
    .action-area {
        margin-top: 24px;
        height: auto;
        padding-bottom: 0;
    }
    .action-btn {
        height: 56px !important;
    }
}
</style>
