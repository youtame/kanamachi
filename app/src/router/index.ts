// router/index.ts
import {
    createRouter,
    createWebHistory,
    type RouteRecordRaw,
} from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "home",
        component: () => import("../pages/Home.vue"),
        meta: { title: "A easy JSON-based quiz app" },
    },
    {
        path: "/menu",
        name: "menu",
        component: () => import("../pages/Menu.vue"),
        meta: { title: "A easy JSON-base quiz app" },
    },
    {
        path: "/setup/:textname",
        name: "setup",
        component: () => import("../pages/QuizSetup.vue"),
        meta: { title: "A easy JSON-base quiz app" },
    },
    {
        path: "/play/:textname",
        name: "play",
        component: () => import("../pages/QuizPlay.vue"),
        meta: { title: "Playing Quiz" },
    },
];

export const router = createRouter({
    history: createWebHistory("/"),
    routes,
    scrollBehavior: (to, from, savedPosition) => savedPosition || { top: 0 },
});
