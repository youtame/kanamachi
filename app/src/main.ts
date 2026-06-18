import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

// Vue-router
import { router } from "./router";
// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
// MDI icon svg
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";

const vuetify = createVuetify({
    theme: {
        defaultTheme: "light",

        themes: {
            light: {
                colors: {
                    primary: "#008080",
                },
            },
            dark: {
                colors: {
                    primary: "#00a0a0",
                },
            },
        },
    },
    icons: {
        defaultSet: "mdi",
        aliases,
        sets: {
            mdi,
        },
    },
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);

app.mount("#app");
