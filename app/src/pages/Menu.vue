<!-- pages/Menu.vue -->
<template>
    <v-container fluid>
        <h1 class="main-title">Menu</h1>

        <!-- Textbook section-->
        <div class="textbook-section mb-10">
            <h2 class="sub-title text-medium-emphasis">
                Textbook<v-divider :thickness="2"></v-divider>
            </h2>

            <v-row justify="start" class="mt-4">
                <v-col
                    v-for="(item, index) in textbookContents"
                    :key="index"
                    cols="12"
                    sm="4"
                    class="d-flex"
                >
                    <MainLinkCard
                        :label="item.title"
                        :subject="
                            item.comingSoon
                                ? `${item.subject} Coming Soon...`
                                : item.subject
                        "
                        :icon="item.icon"
                        :to="item.comingSoon ? '' : item.link"
                        :color="item.color"
                        class="w-100"
                        :class="{ 'coming-soon-card': item.comingSoon }"
                    />
                </v-col>
            </v-row>
        </div>

        <!-- Extra section-->
        <div class="extra-section mb-10">
            <h2 class="sub-title text-medium-emphasis">
                Extra<v-divider :thickness="2"></v-divider>
            </h2>

            <v-row justify="start" class="mt-4">
                <v-col
                    v-for="(item, index) in extraContents"
                    :key="index"
                    cols="12"
                    sm="4"
                    class="d-flex"
                >
                    <MainLinkCard
                        :label="item.title"
                        :subject="
                            item.comingSoon
                                ? `${item.subject} Coming Soon...`
                                : item.subject
                        "
                        :icon="item.icon"
                        :to="item.comingSoon ? '' : item.link"
                        :color="item.color"
                        class="w-100"
                        :class="{ 'coming-soon-card': item.comingSoon }"
                    />
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import MainLinkCard from "../components/MainLinkCard.vue";

// For MDI icon
import {
    mdiTranslate,
    mdiTrain,
    mdiBeaker,
    mdiAccountMultiple,
    mdiAbTesting,
    mdiCalculatorVariant,
    mdiLaptop,
    mdiMessageBulleted,
    mdiMessage,
} from "@mdi/js";
import type { IconValue } from "vuetify";

// Type Definition
interface ButtonItem {
    title: string;
    subject: string;
    icon: IconValue;
    link: string;
    color?: string;
    comingSoon?: boolean;
}

// Contents Links for MainLinkCard
const textbookContents = ref<ButtonItem[]>([
    {
        title: "Elements Easy",
        subject: "Science Chemistry",
        icon: mdiBeaker,
        link: "/setup/elements-easy",
        color: "teal-darken-3",
    },
    {
        title: "Fast Read Eitango",
        subject: "English",
        icon: mdiAbTesting,
        link: "/setup/fast-read-eitango",
        color: "purple-darken-3",
    },
    {
        title: "Kanji Easy",
        subject: "Japanese Kokugo",
        icon: mdiTranslate,
        link: "/setup/kanji-easy",
        color: "red-darken-3",
        comingSoon: true,
    },
    {
        title: "Keisan Easy",
        subject: "Math",
        icon: mdiCalculatorVariant,
        link: "/setup/keisan-easy",
        color: "indigo-darken-3",
        comingSoon: true,
    },
    {
        title: "Technology Easy",
        subject: "Technology",
        icon: mdiLaptop,
        link: "/setup/technology-easy",
        color: "light-blue-darken-3",
        comingSoon: true,
    },
]);

const extraContents = ref<ButtonItem[]>([
    {
        title: "Tetsudo Quiz Easy",
        subject: "Tekken2026",
        icon: mdiTrain,
        link: "/setup/tetsudo-quiz-easy",
        color: "orange-darken-3",
    },
    {
        title: "Genius Quiz",
        subject: "102do",
        icon: mdiAccountMultiple,
        link: "/setup/genius-quiz",
        color: "lime-darken-3",
    },
    {
        title: "Trivia Easy",
        subject: "Trivia",
        icon: mdiMessageBulleted,
        link: "/setup/trivia-easy",
        color: "deep-orange-darken-3",
        comingSoon: true,
    },
]);
</script>

<style lang="scss" scoped>
.main-title {
    font-size: clamp(32px, 5vw, 40px);
    margin-bottom: 10px;
}

.sub-title {
    font-size: clamp(24px, 5vw, 25px);
    margin-bottom: 10px;
}

// Coming soon section
.coming-soon-card {
    opacity: 0.5;
    pointer-events: none;
    filter: grayscale(30%);
}
</style>
