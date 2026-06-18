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
];

export const router = createRouter({
    history: createWebHistory("/"),
    routes,
    scrollBehavior: (to, from, savedPosition) => savedPosition || { top: 0 },
});
