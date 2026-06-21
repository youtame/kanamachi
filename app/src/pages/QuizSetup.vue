<template>
    <v-container fluid class="bg-background">
        <tomenu />
        <h1 class="main-title text-high-emphasis mt-4">{{ textbookName }}</h1>

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

                    <v-select
                        v-model="selectedLimit"
                        :items="limitOptions"
                        item-title="label"
                        item-value="value"
                        label="Number of Questions..."
                        :prepend-inner-icon="mdiFormatListNumbered"
                        variant="filled"
                        class="mb-6"
                        color="primary"
                        flat
                    ></v-select>

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

const textbookName = computed(() => {
    if (!textbookId.value) return "Textbook";
    return textbookId.value
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
});

const selectedChapter = ref<number | null>(null);
const selectedMode = ref<string>("choice");
const selectedLimit = ref<number>(10);

const chapterOptions = ref<{ label: string; value: number }[]>([]);
const isLoading = ref<boolean>(false);

const modeOptions = [
    { label: "Choice", value: "choice" },
    { label: "Type", value: "type" },
];

const limitOptions = [
    { label: "10 Questions", value: 10 },
    { label: "20 Questions", value: 20 },
    { label: "30 Questions", value: 30 },
    { label: "All Questions", value: 0 },
];

watch(
    textbookId,
    async (newId) => {
        if (!newId) {
            chapterOptions.value = [];
            return;
        }

        isLoading.value = true;
        try {
            const response = await fetch(`/quiz/${newId}.json`);
            if (!response.ok) throw new Error("Network response was not ok");

            const data = await response.json();

            if (Array.isArray(data)) {
                const chapters = Array.from(
                    new Set(data.map((item: any) => Number(item.chapter))),
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
