<!-- pages/QuizSetup.vue -->
<template>
    <v-container fluid class="bg-background">
        <tomenu />
        <h1 class="main-title text-high-emphasis mt-4">{{ textbookName }}</h1>

        <!-- Setup section-->
        <div class="setup-section mb-10">
            <h2 class="sub-title text-medium-emphasis">
                Quiz Settings
                <v-divider
                    :thickness="1"
                    class="mt-2 border-opacity-25"
                ></v-divider>
            </h2>

            <v-card
                class="pa-6 mt-6 setup-card glass-card border-0 bg-surface"
                variant="flat"
                elevation-0
            >
                <div v-if="isLoading" class="d-flex justify-center pa-6">
                    <v-progress-circular
                        indeterminate
                        color="primary"
                    ></v-progress-circular>
                </div>

                <v-form v-else @submit.prevent="startQuiz">
                    <v-select
                        v-model="selectedChapter"
                        :items="chapterOptions"
                        item-title="label"
                        item-value="value"
                        label="Select Chapter..."
                        :prepend-inner-icon="mdiBookOpenPageVariant"
                        variant="filled"
                        class="mb-4"
                        color="primary"
                        flat
                    ></v-select>

                    <v-select
                        v-model="selectedMode"
                        :items="modeOptions"
                        item-title="label"
                        item-value="value"
                        label="Select Options..."
                        :prepend-inner-icon="mdiPlayCircleOutline"
                        variant="filled"
                        class="mb-4"
                        color="primary"
                        flat
                    ></v-select>

                    <div class="mb-6 px-2">
                        <div class="text-caption text-medium-emphasis mb-1">
                            Number of Questions:
                            {{
                                selectedLimit === maxQuestions
                                    ? `All Questions (${maxQuestions})`
                                    : `${selectedLimit} Questions`
                            }}
                        </div>
                        <v-slider
                            v-model="selectedLimit"
                            :min="5"
                            :max="maxQuestions"
                            :step="1"
                            thumb-label
                            color="primary"
                            hide-details
                        ></v-slider>
                    </div>

                    <v-btn
                        type="submit"
                        color="primary"
                        size="large"
                        block
                        variant="flat"
                        elevation-0
                        class="start-btn font-weight-bold"
                        :prepend-icon="mdiPlay"
                        :disabled="chapterOptions.length === 0"
                    >
                        Start
                    </v-btn>
                </v-form>
            </v-card>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
    mdiPlay,
    mdiBookOpenPageVariant,
    mdiPlayCircleOutline,
    mdiFormatListNumbered,
} from "@mdi/js";

import tomenu from "../components/ToMenu.vue";

const route = useRoute();
const router = useRouter();

const textbookId = computed(() => (route.params.textname as string) || "");

const textbookName = ref<string>("Loading...");

const selectedChapter = ref<number | null>(null);
const selectedMode = ref<string>("flashcard");
const selectedLimit = ref<number>(10);
const quizData = ref<any>(null);

const chapterOptions = ref<{ label: string; value: number }[]>([]);
const isLoading = ref<boolean>(false);

const modeOptions = [
    { label: "FlashCard", value: "flashcard" },
    { label: "Choice", value: "choice" },
    { label: "Input", value: "input" },
];

const maxQuestions = computed(() => {
    if (!quizData.value || selectedChapter.value === null) return 20;

    const chapterObj = quizData.value.chapters.find(
        (ch: any) => Number(ch.chapter) === selectedChapter.value,
    );

    return chapterObj?.vocabulary?.length || 20;
});

const limitOptions = computed(() => {
    if (!quizData.value || selectedChapter.value === null) {
        return [{ label: "All Questions", value: 1000 }];
    }

    const chapterObj = quizData.value.chapters.find(
        (ch: any) => Number(ch.chapter) === selectedChapter.value,
    );

    const totalQuestions = chapterObj?.vocabulary?.length || 0;

    const options = [];
    const steps = [5, 10, 15, 20];

    for (const step of steps) {
        if (step < totalQuestions) {
            options.push({ label: `${step} Questions`, value: step });
        }
    }

    options.push({
        label: `All Questions (${totalQuestions})`,
        value: totalQuestions,
    });

    return options;
});

watch(selectedChapter, () => {
    selectedLimit.value = maxQuestions.value;
});

watch(
    textbookId,
    async (newId) => {
        if (!newId) {
            chapterOptions.value = [];
            textbookName.value = "Textbook";
            return;
        }

        isLoading.value = true;
        try {
            const response = await fetch(`/quiz/${newId}.json`);

            if (!response.ok) throw new Error("Network response was not ok");

            const data = await response.json();
            quizData.value = data;
            textbookName.value = data.title || "Unknown Quiz";
            const chaptersArray = data.chapters;

            if (Array.isArray(chaptersArray)) {
                const chapters = Array.from(
                    new Set(
                        chaptersArray.map((item: any) => Number(item.chapter)),
                    ),
                ).sort((a, b) => a - b);

                chapterOptions.value = chapters.map((ch) => ({
                    label: `Chapter ${ch}`,
                    value: ch,
                }));

                if (chapters.length > 0) {
                    selectedChapter.value = chapters[0];
                }
            }
        } catch (error) {
            console.error(`Failed to fetch JSON: ${newId}`, error);
            chapterOptions.value = [];
            textbookName.value = "Error Loading Quiz";
        } finally {
            isLoading.value = false;
        }
    },
    { immediate: true },
);

function startQuiz() {
    if (selectedChapter.value === null) return;

    router.push({
        path: `/play/${textbookId.value}`,
        query: {
            chapter: selectedChapter.value,
            mode: selectedMode.value,
            limit: selectedLimit.value,
        },
    });
}
</script>
<style lang="scss" scoped>
.main-title {
    font-size: clamp(32px, 5vw, 40px);
    margin-bottom: 10px;
    font-weight: 800;
}
.sub-title {
    font-size: clamp(20px, 4vw, 22px);
    margin-bottom: 10px;
}
.setup-card {
    border-radius: 16px;
}
.start-btn {
    border-radius: 12px;
    height: 54px !important;
    font-size: 16px;
    letter-spacing: 0.5px;
    transition: opacity 0.2s ease;
    &:hover {
        opacity: 0.9;
    }
}
.glass-card {
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    box-shadow: 0 8px 32px 0 rgba(var(--v-theme-primary), 0.1) !important;
}
.v-theme--dark .glass-card {
    background: rgba(30, 30, 30, 0.4) !important;
}
</style>
