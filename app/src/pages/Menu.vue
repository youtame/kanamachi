<!-- pages/Menu.vue -->
<template>
    <v-container fluid>
        <h1 class="main-title easter-egg-title" @click="handleTitleClick">
            Menu
        </h1>

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

        <v-dialog v-model="isEasterEggOpen" max-width="400">
            <v-card class="pa-6 text-center glass-card bg-surface">
                <v-card-title class="text-h5 font-weight-bold mb-2">
                    UUID v4
                </v-card-title>
                <v-card-text
                    class="text-body-1 text-primary font-weight-mono py-4 text-break"
                >
                    {{ generatedUuid }}
                </v-card-text>
                <v-card-actions class="justify-center">
                    <v-btn
                        color="primary"
                        variant="flat"
                        block
                        @click="isEasterEggOpen = false"
                    >
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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

// --- Icon Mapping Helper ---
const iconMap: Record<string, IconValue> = {
    mdiTranslate,
    mdiTrain,
    mdiBeaker,
    mdiAccountMultiple,
    mdiAbTesting,
    mdiCalculatorVariant,
    mdiLaptop,
    mdiMessageBulleted,
    mdiMap,
};

// --- Type Definition ---
interface ButtonItem {
    title: string;
    subject: string;
    icon: IconValue;
    link: string;
    color?: string;
    comingSoon?: boolean;
}

// --- Dynamic JSON Loading via Vite import.meta.glob ---
const quizModules = import.meta.glob<{
    title: string;
    category?: string;
    subject: string;
    icon: string;
    color?: string;
    comingSoon?: boolean;
}>("../../public/quiz/*.json", { eager: true });

// console.log("Loaded quizModules:", quizModules);

const textbookContents = ref<ButtonItem[]>([]);
const extraContents = ref<ButtonItem[]>([]);

for (const path in quizModules) {
    const mod = quizModules[path];
    const fileName = path.split("/").pop()?.replace(".json", "") || "";

    const item: ButtonItem = {
        title: mod.title,
        subject: mod.subject,
        icon: iconMap[mod.icon] || mdiBeaker,
        link: `/setup/${fileName}`,
        color: mod.color || "primary",
        comingSoon: mod.comingSoon || false,
    };

    if (mod.category === "extra") {
        extraContents.value.push(item);
    } else {
        textbookContents.value.push(item);
    }
}

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
    if (!searchQuery.value) return textbookContents.value;
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

const isEasterEggOpen = ref<boolean>(false);
const generatedUuid = ref<string>("");
let clickCount = 0;
let clickTimer: NodeJS.Timeout | null = null;

function handleTitleClick() {
    clickCount++;

    if (clickTimer) clearTimeout(clickTimer);

    if (clickCount >= 3) {
        try {
            const uuid =
                typeof crypto !== "undefined" && crypto.randomUUID
                    ? crypto.randomUUID()
                    : "xxxx-xxxx-4xxx-yxxx".replace(/[xy]/g, (c) => {
                          const r = (Math.random() * 16) | 0;
                          return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
                      });

            generatedUuid.value = uuid;
            isEasterEggOpen.value = true;
        } catch (e) {
            console.error(e);
        }
        clickCount = 0;
    } else {
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, 600);
    }
}
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

.easter-egg-title {
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    display: inline-block;
}
</style>
