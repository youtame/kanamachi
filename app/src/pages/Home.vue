<!-- pages/Home.vue -->
<template>
    <v-container fluid class="px-4 px-sm-6">
        <!-- Hero section-->
        <div class="hero">
            <v-img :src="logoimage" alt="Main Visual" class="hero-image" />
            <div class="main-title">
                <h1>Squizee</h1>
                <h2>Quiz Creation<br />Simplified</h2>
                <h3>Start your first quiz in just 30 seconds</h3>
                <v-btn
                    variant="outlined"
                    class="code-style-btn px-10"
                    size="x-large"
                    to="/dashboard"
                >
                    <span class="btn-text font-weight-bold">Let's start</span>
                    <v-icon
                        end
                        :icon="mdiChevronRight"
                        class="arrow-icon"
                    ></v-icon>
                </v-btn>
            </div>
        </div>

        <!-- Features section-->
        <div class="features-section rounded-lg">
            <v-row>
                <v-col cols="12" md="4">
                    <div class="feature-item glass-card">
                        <div class="feature-icon-wrapper mb-4">
                            <v-icon
                                :icon="mdiCheck"
                                color="primary"
                                size="40"
                            ></v-icon>
                        </div>
                        <h3 class="text-h6 font-weight-bold mb-3">
                            Simple & Intuitive
                        </h3>
                        <p
                            class="text-body-2 text-medium-emphasis leading-relaxed"
                        >
                            Minimal features mean a clutter-free, effortless
                            experience for everyone.
                        </p>
                    </div>
                </v-col>
                <v-col cols="12" md="4">
                    <div class="feature-item glass-card">
                        <div class="feature-icon-wrapper mb-4">
                            <v-icon
                                :icon="mdiFastForward30"
                                color="primary"
                                size="40"
                            ></v-icon>
                        </div>
                        <h3 class="text-h6 font-weight-bold mb-3">
                            30-Second Bites
                        </h3>
                        <p
                            class="text-body-2 text-medium-emphasis leading-relaxed"
                        >
                            Every quiz is short and sweet—perfect for a quick
                            brain workout.
                        </p>
                    </div>
                </v-col>
                <v-col cols="12" md="4">
                    <div class="feature-item glass-card">
                        <div class="feature-icon-wrapper mb-4">
                            <v-icon
                                :icon="mdiAccountMultiple"
                                color="primary"
                                size="40"
                            ></v-icon>
                        </div>
                        <h3 class="text-h6 font-weight-bold mb-3">
                            Built for Everyone
                        </h3>
                        <p
                            class="text-body-2 text-medium-emphasis leading-relaxed"
                        >
                            A welcoming quiz platform designed for learners of
                            all levels.
                        </p>
                    </div>
                </v-col>
            </v-row>
        </div>

        <!-- Steps section-->
        <div class="steps-section">
            <h2 class="section-title text-center font-weight-bold mb-12">
                How Squizee Works
            </h2>

            <div class="step-row">
                <div class="step-content">
                    <div class="step-number text-primary font-weight-bold mb-2">
                        01. EASY MANAGEMENT
                    </div>
                    <h3 class="text-h4 font-weight-bold mb-4">
                        No PC Required. Add Questions via GitHub
                    </h3>
                    <p class="text-body-1 text-medium-emphasis leading-relaxed">
                        Manage your quiz data effortlessly. Just edit the JSON
                        file directly on GitHub—you can seamlessly add or update
                        questions from your smartphone anytime, anywhere.
                    </p>
                </div>
                <div class="step-image-wrapper">
                    <v-img
                        :src="step1Image"
                        alt="GitHub JSON Management"
                        class="step-image rounded-lg glass-card"
                    />
                </div>
            </div>

            <div class="step-row reverse">
                <div class="step-content">
                    <div class="step-number text-primary font-weight-bold mb-2">
                        02. ZERO COST
                    </div>
                    <h3 class="text-h4 font-weight-bold mb-4">
                        Powered by GitHub Pages. 100% Free Hosting
                    </h3>
                    <p class="text-body-1 text-medium-emphasis leading-relaxed">
                        Keep your project running with absolutely zero
                        maintenance fees. By leveraging GitHub Pages, your quiz
                        platform is hosted securely and reliably without costing
                        a single dime.
                    </p>
                </div>
                <div class="step-image-wrapper">
                    <v-img
                        :src="step2Image"
                        alt="GitHub Pages Hosting"
                        class="step-image rounded-lg glass-card"
                    />
                </div>
            </div>

            <div class="step-row">
                <div class="step-content">
                    <div class="step-number text-primary font-weight-bold mb-2">
                        03. MINIMAL DESIGN
                    </div>
                    <h3 class="text-h4 font-weight-bold mb-4">
                        Clean, Intuitive, and Distraction-Free
                    </h3>
                    <p class="text-body-1 text-medium-emphasis leading-relaxed">
                        We believe less is more. Squizee offers a beautiful,
                        clutter-free user interface designed focused entirely on
                        the learning experience, making it welcoming for
                        everyone.
                    </p>
                </div>
                <div class="step-image-wrapper">
                    <v-img
                        :src="step3Image"
                        alt="Minimal UI Design"
                        class="step-image rounded-lg glass-card"
                    />
                </div>
            </div>
        </div>

        <!-- Notice section-->
        <div class="notice-section">
            <v-alert v-if="loading" type="info" variant="tonal"
                >Loading…</v-alert
            >
            <v-alert v-else-if="error" type="error" variant="tonal">
                Failed to retrieve notifications. Please contact the site staff.
            </v-alert>

            <v-list class="rounded-lg mb-1 pa-1" v-else>
                <v-expansion-panels variant="accordion">
                    <v-expansion-panel
                        v-for="(item, index) in notices"
                        :key="index"
                        elevation="0"
                        class="pt-2 pb-2"
                    >
                        <v-expansion-panel-title>
                            <div class="notice-header">
                                <span class="notice-date font-weight-bold">
                                    {{ formatDate(item.info_date) }}
                                </span>
                                <span class="notice-title">
                                    {{ item.title || item.information }}
                                </span>
                            </div>
                        </v-expansion-panel-title>

                        <v-expansion-panel-text>
                            <p
                                class="notice-text text-body-1 text-high-emphasis mb-3"
                            >
                                {{ item.information }}
                            </p>
                            <div
                                v-if="item.links?.length"
                                class="d-flex flex-wrap gap-2"
                            >
                                <template v-for="(link, i) in item.links">
                                    <v-btn
                                        v-if="link.external"
                                        :key="'external-' + i"
                                        :href="link.url"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        variant="text"
                                        color="primary"
                                        class="notice-link font-weight-bold"
                                    >
                                        {{ link.text }}
                                    </v-btn>
                                    <v-btn
                                        v-else
                                        :key="'internal-' + i"
                                        :to="link.url"
                                        variant="outlined"
                                        color="primary"
                                        class="notice-link font-weight-bold"
                                    >
                                        {{ link.text }}
                                    </v-btn>
                                </template>
                            </div>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-list>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import logoimage from "@/assets/logo.svg";

import step1Image from "@/assets/step1.jpg";
import step2Image from "@/assets/step2.jpg";
import step3Image from "@/assets/step3.jpg";

import {
    mdiChevronRight,
    mdiCheck,
    mdiFastForward30,
    mdiAccountMultiple,
} from "@mdi/js";

export interface NoticeLink {
    text: string;
    url: string;
    external?: boolean;
}

type Notice = {
    title: string;
    information: string;
    info_date: string;
    links?: NoticeLink[];
};

const notices = ref<Notice[]>([]);
const loading = ref(true);
const error = ref(false);

onMounted(async () => {
    try {
        const baseUrl = "http://localhost:5173/";
        const res = await fetch(`${baseUrl}information/squizee-info.json`);

        if (!res.ok) throw new Error("fetch failed");
        notices.value = await res.json();
    } catch (e) {
        error.value = true;
    } finally {
        loading.value = false;
    }
});

const formatDate = (dateStr: string) => {
    const [y, m, d, hm] = dateStr.split("-");
    return `${y}/${m}/${d} ${hm}`;
};
</script>

<style lang="scss" scoped>
.glass-card {
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    box-shadow: 0 8px 32px 0 rgba(var(--v-theme-primary), 0.1) !important;
}

.v-theme--dark .glass-card {
    background: rgba(30, 30, 30, 0.4) !important;
}

.code-style-btn {
    font-family: "Fira Code", "Courier New", monospace;
    color: rgb(var(--v-theme-primary));
    border-width: 2px;
}
.btn-text::before {
    content: "$ ";
    opacity: 0.6;
}
.leading-relaxed {
    line-height: 1.8 !important;
    letter-spacing: 0.02em;
}

.hero,
.features-section,
.steps-section,
.notice-section {
    max-width: 1100px;
    margin-left: auto;
    margin-right: auto;
}

.hero {
    margin-top: 60px;
    margin-bottom: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 35px;
    animation: fadeUp 0.6s ease-out;
}

.features-section,
.steps-section,
.notice-section {
    margin-top: 80px;
    margin-bottom: 80px;
}

.hero-image {
    flex: 1;
    order: 2;
    width: 500px;
    height: 250px;
    flex-shrink: 0;
}

.main-title {
    flex: 1.2;
    order: 1;
    font-size: 25px;
}

.main-title h1 {
    font-family: "Inter", sans-serif;
    letter-spacing: 1px;
    font-size: 60px;
    font-weight: bold;
    line-height: 1;
    margin-bottom: 12px;
    color: rgb(var(--v-theme-primary));
}

.main-title h2 {
    font-family: "Inter", "Zen Kaku Gothic New", sans-serif;
    font-size: 50px;
    font-weight: bold;
    line-height: 1.3;
    margin-bottom: 12px;
}

.main-title h3 {
    font-weight: bold;
    font-size: 24px;
    color: #999999;
    margin-bottom: 24px;
}

.feature-item {
    padding: 24px;
    border-radius: 12px;
    transition: background-color 0.3s ease;
}

.feature-item:hover {
    background-color: rgba(var(--v-theme-primary), 0.05);
}

.section-title {
    font-size: 36px;
    color: rgb(var(--v-theme-primary));
}

.step-row {
    display: flex;
    align-items: center;
    gap: 60px;
    margin-bottom: 80px;

    &:last-child {
        margin-bottom: 0;
    }

    &.reverse {
        flex-direction: row-reverse;
    }
}

.step-content {
    flex: 1;

    .step-number {
        font-family: "Fira Code", monospace;
        font-size: 14px;
        letter-spacing: 0.1em;
    }
}

.step-image-wrapper {
    flex: 1.2;

    .step-image {
        width: 100%;
        max-height: 360px;
        object-fit: cover;
    }
}

.notice-text {
    line-height: 1.6;
    word-break: break-word;
}

.notice-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 24px;

    .notice-title {
        font-weight: 600;
        font-size: 18px;
        line-height: 1.5;
        flex: 1 1 auto;
        min-width: 0;
        word-break: break-word;
    }

    .notice-date {
        padding: 4px 18px;
        border-radius: 5px;
        font-size: 14px;
        color: #fff;
        background-color: rgb(var(--v-theme-primary));
        flex-shrink: 0;
    }
}

@media (max-width: 1100px) and (min-width: 961px) {
    .main-title {
        flex: 1;
    }
    .hero-image {
        flex: 1;
        width: 400px;
    }
    .main-title h1 {
        font-size: 48px;
    }
    .main-title h2 {
        font-size: 42px;
    }
}

@media (max-width: 960px) {
    .hero {
        margin-top: 40px;
        margin-bottom: 60px;
        flex-direction: column;
        text-align: center;
    }

    .hero-image {
        order: 1;
    }

    .main-title {
        order: 2;
    }

    .main-title h1,
    .main-title h2,
    .main-title h3 {
        text-align: center;
    }

    .main-title h1 {
        font-size: 45px;
    }
    .main-title h2 {
        font-size: 40px;
    }
    .main-title h3 {
        font-size: 20px;
    }

    .features-section,
    .steps-section,
    .notice-section {
        margin-top: 60px;
        margin-bottom: 60px;
    }

    .step-row {
        flex-direction: column !important;
        gap: 24px;
        text-align: center;
        margin-bottom: 60px;

        &.reverse {
            flex-direction: column !important;
        }
    }

    .step-image-wrapper {
        width: 100%;

        .step-image {
            width: 100%;
            :deep(img) {
                object-fit: cover !important;
            }
        }
    }

    .section-title {
        font-size: 28px;
        margin-bottom: 40px !important;
    }
}

@media (max-width: 600px) {
    .hero-image {
        width: 90% !important;
        max-width: 400px;
        height: auto !important;
        margin: 0 auto;
    }
}

@media (max-width: 480px) {
    .notice-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;

        .notice-date {
            margin-top: 4px;
        }
    }
}

@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
