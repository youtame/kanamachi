<template>
    <div class="flashcard-mode-wrapper">
        <div class="flashcard-container my-4 my-sm-8">
            <div
                class="flashcard"
                :class="{ 'is-flipped': isFlipped }"
                @click="toggleFlip"
            >
                <v-card
                    class="card-face card-front glass-card border-0 pa-6 pa-sm-8 text-center"
                    variant="flat"
                >
                    <div class="card-content">
                        <div class="text-caption text-medium-emphasis mb-4">
                            QUESTION
                        </div>
                        <h2 class="card-text font-weight-bold leading-relaxed">
                            {{ quizStore.currentQuestion?.question }}
                        </h2>
                        <div
                            class="hint-text text-primary font-weight-bold mt-auto pt-6"
                        >
                            Press to show the Answer
                        </div>
                    </div>
                </v-card>

                <v-card
                    class="card-face card-back glass-card border-0 pa-6 pa-sm-8 text-center"
                    variant="flat"
                >
                    <div class="card-content">
                        <div class="text-caption text-medium-emphasis mb-4">
                            ANSWER
                        </div>
                        <h2
                            class="card-text font-weight-black text-success leading-relaxed"
                        >
                            {{ quizStore.currentQuestion?.answer }}
                        </h2>
                        <div
                            class="hint-text text-medium-emphasis font-weight-bold mt-auto pt-6"
                        >
                            Press to back the Question.
                        </div>
                    </div>
                </v-card>
            </div>
        </div>

        <div class="action-area flex-column flex-sm-row">
            <v-slide-y-transition mode="out-in">
                <v-row
                    v-if="!hasAnswered"
                    class="w-100 choices-grid"
                    justify="center"
                >
                    <v-col cols="6" class="choice-col">
                        <v-btn
                            block
                            color="error"
                            variant="flat"
                            class="choice-btn font-weight-bold"
                            :prepend-icon="mdiCloseCircle"
                            @click.stop="handleAnswer(false)"
                        >
                            Incorrect
                        </v-btn>
                    </v-col>
                    <v-col cols="6" class="choice-col">
                        <v-btn
                            block
                            color="success"
                            variant="flat"
                            class="choice-btn font-weight-bold"
                            :prepend-icon="mdiCheckCircle"
                            @click.stop="handleAnswer(true)"
                        >
                            Correct
                        </v-btn>
                    </v-col>
                </v-row>

                <v-btn
                    v-else
                    color="primary"
                    size="x-large"
                    block
                    variant="flat"
                    class="next-btn font-weight-bold"
                    @click="handleNext"
                    :append-icon="
                        quizStore.currentIndex + 1 === quizStore.totalQuestions
                            ? mdiCheckCircle
                            : mdiArrowRight
                    "
                >
                    {{
                        quizStore.currentIndex + 1 === quizStore.totalQuestions
                            ? "Finish"
                            : "Next Card"
                    }}
                </v-btn>
            </v-slide-y-transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useQuizStore } from "../stores/QuizStore";
import { mdiArrowRight, mdiCheckCircle, mdiCloseCircle } from "@mdi/js";

const quizStore = useQuizStore();

const isFlipped = ref(false);
const hasAnswered = ref(false);

function toggleFlip() {
    isFlipped.value = !isFlipped.value;
}

function handleAnswer(isCorrect: boolean) {
    hasAnswered.value = true;

    const fakeAnswer = isCorrect
        ? quizStore.currentQuestion?.answer || ""
        : "__WRONG_ANSWER__";

    quizStore.checkAnswer(fakeAnswer);
}

function handleNext() {
    quizStore.nextQuestion();
}

watch(
    () => quizStore.currentIndex,
    () => {
        isFlipped.value = false;
        hasAnswered.value = false;
    },
);
</script>

<style lang="scss" scoped>
.leading-relaxed {
    line-height: 1.4 !important;
}

.flashcard-container {
    perspective: 1000px;
    height: clamp(260px, 45vh, 400px);
    width: 100%;
}

.flashcard {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;

    &.is-flipped {
        transform: rotateY(180deg);
    }
}

.card-face {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 16px;

    .card-content {
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: center;
        align-items: center;
    }
}

.card-back {
    transform: rotateY(180deg);
}

.card-text {
    font-size: clamp(18px, 4vw, 26px);
    word-break: break-word;
}

.hint-text {
    font-size: clamp(12px, 1.5vw, 14px);
    letter-spacing: 0.05em;
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
    height: 54px !important;
    font-size: 15px;
}

.action-area {
    min-height: 64px;
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 12px;
}

.next-btn {
    border-radius: 12px;
    height: 48px !important;
}

@media (min-width: 600px) {
    .choice-col {
        padding: 8px !important;
    }
    .choice-btn {
        height: 64px !important;
        font-size: 16px;
    }
    .action-area {
        margin-top: 24px;
        padding-bottom: 0;
    }
}
</style>
