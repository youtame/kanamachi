<!-- pages/Menu.vue -->
<template>
    <v-container fluid>
        <h1 class="main-title">Menu</h1>

        <!-- Textbook section-->
        <div class="textbook-section mb-10">
            <div
                class="d-flex justify-space-between align-center position-relative"
            >
                <div
                    class="d-flex align-center flex-grow-1 mr-4"
                    :class="{ 'd-none d-sm-flex': isSearchOpen }"
                >
                    <h2 class="sub-title text-medium-emphasis mb-0 lh-1">
                        Textbook
                    </h2>
                </div>

                <div
                    class="search-container d-flex align-center justify-end"
                    :class="{ 'flex-grow-1': isSearchOpen }"
                >
                    <v-fade-transition hide-on-leave>
                        <v-btn
                            v-if="!isSearchOpen"
                            :icon="mdiMagnify"
                            variant="text"
                            color="primary"
                            density="compact"
                            class="custom-search-btn"
                            @click="toggleSearch"
                        ></v-btn>
                    </v-fade-transition>

                    <v-fade-transition>
                        <v-text-field
                            v-if="isSearchOpen"
                            ref="searchFieldRef"
                            v-model="searchQuery"
                            :prepend-inner-icon="mdiMagnify"
                            label="Search Textbook…"
                            variant="outlined"
                            density="compact"
                            hide-details
                            clearable
                            class="search-box"
                            @click:clear="clearSearch"
                            @blur="handleBlur"
                        ></v-text-field>
                    </v-fade-transition>
                </div>
            </div>

            <v-divider :thickness="2" class="mt-1 mb-4"></v-divider>

            <v-row justify="start">
                <v-col
                    v-for="(item, index) in filteredTextbookContents"
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
import { ref, nextTick, computed } from "vue";
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
    mdiMagnify,
    mdiMap,
} from "@mdi/js";
import type { IconValue } from "vuetify";

// --- Textbook Search States ---
const searchQuery = ref("");
const isSearchOpen = ref(false);
const searchFieldRef = ref(null);

const toggleSearch = async () => {
    isSearchOpen.value = true;
    await nextTick();
    searchFieldRef.value?.focus();
};

const handleBlur = () => {
    if (!searchQuery.value) {
        isSearchOpen.value = false;
    }
};

const clearSearch = () => {
    searchQuery.value = "";
    isSearchOpen.value = false;
};

const filteredTextbookContents = computed(() => {
    if (!searchQuery.value) return textbookContents.value; // 未入力なら全件表示
    return textbookContents.value.filter(
        (item) =>
            item.title
                .toLowerCase()
                .includes(searchQuery.value.toLowerCase()) ||
            item.subject
                .toLowerCase()
                .includes(searchQuery.value.toLowerCase()),
    );
});
// --- end: Utility Search States ---

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
        color: "green-darken-3",
    },
    {
        title: "Fast Read Eitango",
        subject: "English",
        icon: mdiAbTesting,
        link: "/setup/fast-read-eitango",
        color: "purple-darken-3",
    },
    {
        title: "Geography Easy",
        subject: "SocialStudy Geography",
        icon: mdiMap,
        link: "/setup/geography-easy",
        color: "amber-darken-3",
    },
    {
        title: "Kotowaza Easy",
        subject: "Japanese Kokugo",
        icon: mdiTranslate,
        link: "/setup/kotowaza-easy",
        color: "red-darken-3",
    },
    {
        title: "Keisan Easy",
        subject: "Math",
        icon: mdiCalculatorVariant,
        link: "/setup/keisan-easy",
        color: "indigo-darken-3",
    },
    {
        title: "Technology Easy",
        subject: "Technology",
        icon: mdiLaptop,
        link: "/setup/technology-easy",
        color: "light-blue-darken-3",
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
}

.search-container {
    height: 40px;
    min-width: 48px;
    transition: all 0.3s ease;
}

.search-box {
    width: 300px;
    transition: all 0.3s ease;

    @media (max-width: 599px) {
        width: 100%;
    }
}

.custom-search-btn {
    transform: translateY(10px);
}

// Coming soon section
.coming-soon-card {
    opacity: 0.5;
    pointer-events: none;
    filter: grayscale(30%);
}
</style>
