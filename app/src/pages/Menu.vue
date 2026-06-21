<template>
    <v-container fluid>
        <h1 class="main-title">Menu</h1>

        <div class="textbook-section mb-10">
            <h2 class="sub-title">
                Textbook<v-divider :thickness="2"></v-divider>
            </h2>

            <v-row justify="start" class="mt-4">
                <v-col
                    v-for="(item, index) in contents"
                    :key="index"
                    cols="12"
                    sm="4"
                    class="d-flex"
                >
                    <MainLinkCard
                        :label="item.title"
                        :subject="item.subject"
                        :icon="item.icon"
                        :to="item.link"
                        :color="item.color"
                        class="w-100"
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
import { mdiTranslate, mdiTrain, mdiBeaker } from "@mdi/js";
import type { IconValue } from "vuetify";

// TypeScript interface
interface ButtonItem {
    title: string;
    subject: string;
    icon: IconValue;
    link: string;
    color?: string;
}

const contents = ref<ButtonItem[]>([
    {
        title: "Fast Read Eitango",
        subject: "English",
        icon: mdiTranslate,
        link: "/setup/fast-read-eitango",
        color: "blue-darken-1",
    },
    {
        title: "Elements Easy",
        subject: "Science Chemistry",
        icon: mdiBeaker,
        link: "/setup/elements-easy",
        color: "green-lighten-1",
    },
    {
        title: "Tetsudo Quiz Easy",
        subject: "Tekken2026",
        icon: mdiTrain,
        link: "/setup/tetsudo-quiz-easy",
        color: "orange-darken-3",
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
</style>
