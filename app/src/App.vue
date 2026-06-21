<!-- App.vue -->
<template>
    <div class="d-flex flex-column min-vh-100">
        <v-app>
            <v-app-bar
                app
                flat
                :class="{ 'v-app-bar--is-scrolled': isScrolled }"
                color="transparent"
                class="px-0"
            >
                <v-container
                    class="d-flex align-center pa-0"
                    style="max-width: 95%"
                >
                    <v-app-bar-title
                        class="cursor-pointer"
                        @click="$router.push('/')"
                    >
                        <v-img
                            v-if="headericon.icon"
                            :src="headericon.icon"
                            height="40"
                            width="140"
                            alt="logo"
                            class="mr-2"
                        />
                    </v-app-bar-title>

                    <v-spacer></v-spacer>

                    <v-btn
                        v-if="isNotHomeMenu"
                        icon
                        variant="text"
                        @click="$router.push('/menu')"
                        class="mr-1 d-none d-md-flex"
                    >
                        <v-icon :icon="mdiHome"></v-icon>
                        <v-tooltip activator="parent" location="bottom"
                            >Menu</v-tooltip
                        >
                    </v-btn>

                    <div class="d-none d-md-flex align-center">
                        <v-btn icon @click="() => toggleTheme()" variant="text">
                            <v-icon
                                :icon="
                                    theme.global.current.value.dark
                                        ? mdiWhiteBalanceSunny
                                        : mdiWeatherNight
                                "
                            />
                            <v-tooltip activator="parent" location="bottom"
                                >Appearance</v-tooltip
                            >
                        </v-btn>

                        <v-btn
                            icon
                            href="https://github.com/youtame/kanamachi"
                            target="_blank"
                            variant="text"
                            class="mr-1"
                        >
                            <v-icon :icon="mdiGithub"></v-icon>
                            <v-tooltip activator="parent" location="bottom"
                                >GitHub</v-tooltip
                            >
                        </v-btn>
                    </div>

                    <v-app-bar-nav-icon
                        class="d-md-none"
                        @click.stop="drawer = !drawer"
                    />
                </v-container>
            </v-app-bar>

            <v-navigation-drawer
                v-model="drawer"
                location="right"
                temporary
                width="280"
            >
                <v-divider></v-divider>
                <v-list nav>
                    <v-list-item v-if="isNotHomeMenu" link to="/menu">
                        <template v-slot:prepend>
                            <v-icon :icon="mdiHome"></v-icon>
                        </template>
                        <v-list-item-title class="font-weight-bold"
                            >Menu</v-list-item-title
                        >
                    </v-list-item>

                    <v-divider v-if="isNotHomeMenu" class="my-2"></v-divider>

                    <v-list-item>
                        <template v-slot:prepend>
                            <v-icon
                                :icon="
                                    theme.global.current.value.dark
                                        ? mdiWhiteBalanceSunny
                                        : mdiWeatherNight
                                "
                            />
                        </template>

                        <v-list-item-title class="font-weight-bold"
                            >Dark Mode</v-list-item-title
                        >

                        <template v-slot:append>
                            <v-switch
                                :model-value="theme.global.current.value.dark"
                                @update:model-value="
                                    (val) => toggleTheme(val ?? undefined)
                                "
                                color="primary"
                                hide-details
                                density="compact"
                            ></v-switch>
                        </template>
                    </v-list-item>

                    <v-divider class="my-2"></v-divider>

                    <v-list-item
                        link
                        href="https://github.com/youtame/kanamachi"
                        target="_blank"
                    >
                        <template v-slot:prepend>
                            <v-icon :icon="mdiGithub"></v-icon>
                        </template>
                        <v-list-item-title class="font-weight-bold"
                            >GitHub</v-list-item-title
                        >
                    </v-list-item>
                    <v-divider class="my-2"></v-divider>
                </v-list>
            </v-navigation-drawer>

            <v-main class="flex-grow-1 d-flex main-view">
                <router-view />
            </v-main>

            <v-footer
                class="text-center d-flex flex-column align-center ga-1 py-6"
            >
                <v-divider
                    class="my-2 mx-auto"
                    thickness="2"
                    width="40"
                ></v-divider>
                <div class="text-caption font-weight-bold opacity-80">
                    Squizee
                </div>
                <div class="text-caption opacity-60">
                    {{ new Date().getFullYear() }} — <strong>102℃</strong>
                </div>
            </v-footer>
        </v-app>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useTheme } from "vuetify";
import {
    mdiWhiteBalanceSunny,
    mdiWeatherNight,
    mdiHome,
    mdiGithub,
} from "@mdi/js";

import logo from "@/assets/logo.svg";

const route = useRoute();

const isNotHomeMenu = computed(() => {
    const normalizedPath = route.path.replace(/^\/|\/$/g, "");
    return !["menu", ""].includes(normalizedPath);
});

const drawer = ref(false);
const isScrolled = ref(false);
const theme = useTheme();

const headericon = computed(() => ({
    name: "",
    icon: logo,
}));

const handleScroll = () => {
    isScrolled.value = window.scrollY > 0;
};

function toggleTheme(targetValue?: boolean) {
    const nextTheme =
        (targetValue ?? !theme.global.current.value.dark) ? "dark" : "light";
    theme.global.name.value = nextTheme;
    localStorage.setItem("user-theme", nextTheme);
}

const updateThemeFromSystem = (e: MediaQueryList | MediaQueryListEvent) => {
    if (!localStorage.getItem("user-theme")) {
        theme.global.name.value = e.matches ? "dark" : "light";
    }
};

let mediaQuery: MediaQueryList | null = null;

onMounted(() => {
    const savedTheme = localStorage.getItem("user-theme");
    mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    if (savedTheme) {
        theme.global.name.value = savedTheme;
    } else {
        theme.global.name.value = mediaQuery.matches ? "dark" : "light";
    }

    mediaQuery.addEventListener("change", updateThemeFromSystem);
    window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
    if (mediaQuery) {
        mediaQuery.removeEventListener("change", updateThemeFromSystem);
    }
});
</script>

<style lang="css" scoped>
:deep(.v-app-bar) {
    transition: all 0.4s ease !important;
}

:deep(.v-navigation-drawer) {
    border: none !important;
    background-color: rgba(var(--v-theme-surface), 0.8) !important;
    backdrop-filter: blur(15px);
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1) !important;
    margin: 8px 0;
    height: calc(100% - 16px) !important;
    border-radius: 16px 0 0 16px !important;
}

.v-app-bar--is-scrolled {
    background-color: rgba(var(--v-theme-surface), 0.9) !important;
    backdrop-filter: blur(12px) !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
    border-bottom: none !important;
}

.v-theme--dark .v-app-bar--is-scrolled {
    box-shadow: 0 4px 25px rgba(0, 0, 0, 0.3) !important;
    background-color: rgba(var(--v-theme-surface), 0.9) !important;
}

.v-theme--dark :deep(.v-navigation-drawer) {
    box-shadow: -10px 0 40px rgba(0, 0, 0, 0.4) !important;
}

:deep(.v-divider) {
    opacity: 0.05;
}

.main-view {
    width: 90%;
    max-width: 1100px;
    margin: auto;
}
</style>
