import { createRouter, createWebHashHistory, RouterOptions } from "vue-router";
import FontWatcher from "../views/FontWatcher.vue";
import Content from "../views/Content.vue";
import Font from "../views/FontWatcher/font.vue";
import License from "../views/FontWatcher/license.vue";
const routes = [
    {
        path: "/home",
        name: "Home",
        component: Content,
    },
    {
        path: "/font/:fontName",
        component: FontWatcher,
        children: [
            {
                path: "font",
                meta: {
                    type: "font",
                },
                component: Font,
            },
            {
                path: "license",
                meta: {
                    type: "license",
                },
                component: License,
            },
        ],
    },
    // { path: "*", redirect: { name: "Home" } },
] as RouterOptions["routes"];

export const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
});
