import { createRouter, createWebHashHistory, RouterOptions } from "vue-router";
import FontWatcher from "../views/FontWatcher.vue";
import Content from "../views/Content.vue";
const routes = [
    {
        path: "/home",
        name: "Home",
        component: Content,
    },
    {
        path: "/font/:fontName/:type",
        component: FontWatcher,
    },
    // { path: "*", redirect: { name: "Home" } },
] as RouterOptions["routes"];

export const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
});
