import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// Vite Devtools
import VueDevTools from "vite-plugin-vue-devtools";

// Vuetify
import vuetify from "vite-plugin-vuetify";

export default defineConfig({
    plugins: [VueDevTools(), vue(), vuetify({ autoImport: true })],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
});
