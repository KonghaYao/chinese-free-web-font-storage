import { createRouter, createWebHashHistory, RouterOptions } from "vue-router";
import FontWatcher from "../views/FontWatcher.vue";
import Content from "../views/Content.vue";
import Font from "../views/FontWatcher/font.vue";
import License from "../views/FontWatcher/license.vue";
import Editor from "../views/FontWatcher/Editor.vue";
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
                name: "Font",
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
            {
                path: "editor/:fontWeight",
                meta: {
                    type: "editor",
                },
                component: Editor,
            },
            { path: ":pathMatch(.*)*", redirect: { name: "Font" } },
        ],
    },
    { path: "/:pathMatch(.*)*", redirect: "/home" },
] as RouterOptions["routes"];

export const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
});
