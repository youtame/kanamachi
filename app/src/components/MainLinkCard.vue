<template>
    <v-card
        :to="to"
        :href="href"
        :target="target"
        :color="color"
        variant="flat"
        class="mainlink-btn-card pa-4 w-100 d-flex align-center cursor-pointer"
        v-ripple
    >
        <v-avatar size="48" class="icon-avatar mr-4">
            <v-icon :icon="icon" size="28" color="white"></v-icon>
        </v-avatar>

        <div class="text-container text-white">
            <div class="text-h6 font-weight-bold line-height-tight">
                {{ label }}
            </div>
            <div
                v-if="subject"
                class="text-caption text-grey-lighten-2 mt-1 subject-text"
            >
                {{ subject }}
            </div>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import type { IconValue } from "vuetify";

interface Props {
    label: string;
    icon: IconValue;
    to?: string;
    href?: string;
    target?: string;
    color?: string;
    subject?: string;
}

withDefaults(defineProps<Props>(), {
    color: "primary",
    target: undefined,
    subject: "",
});
</script>

<style lang="scss" scoped>
.mainlink-btn-card {
    border-radius: 12px;
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
    min-height: 82px;
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15) !important;
    }
}

.icon-avatar {
    background: rgba(255, 255, 255, 0.2);
}

.line-height-tight {
    line-height: 1.2;
}

.subject-text {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
}
</style>
