<!-- components/QuizPlayChoice.vue -->
<template>
    <div class="choice-mode-wrapper">
        <!-- 問題文カード -->
        <v-card
            class="question-card glass-card border-0 my-3 my-sm-6"
            variant="flat"
        >
            <div class="pa-6 pa-sm-8 text-center">
                <h2 class="question-text font-weight-bold leading-relaxed">
                    {{ quizStore.currentQuestion?.question }}
                </h2>
            </div>
        </v-card>

        <!-- 選択肢グリッド -->
        <v-row class="choices-grid" justify="center">
            <v-col
                v-for="(choice, index) in quizStore.currentQuestion?.choices"
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
                    <span class="choice-index mr-4">
                        {{ String.fromCharCode(65 + index) }}
                    </span>
                    <span class="choice-text text-truncate">
                        {{ choice }}
                    </span>
                </v-btn>
            </v-col>
        </v-row>

        <!-- アクションエリア（次へボタン） -->
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
import { useQuizStore } from "../stores/QuizStore";
import { mdiArrowRight, mdiCheckCircle } from "@mdi/js";

const quizStore = useQuizStore();

function getChoiceClass(choice: string) {
    if (quizStore.selectedAnswer === null) return "bg-surface";
    const isCurrentChoice = quizStore.selectedAnswer === choice;
    const isCorrectAnswer = choice === quizStore.currentQuestion?.answer;

    if (isCorrectAnswer) return "choice-correct";
    if (isCurrentChoice && !isCorrectAnswer) return "choice-wrong";
    return "choice-disabled";
}
</script>

<style lang="scss" scoped>
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

// A, B, C, Dのブランド・配色デザイン
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

// 正誤判定時のスタイル
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
