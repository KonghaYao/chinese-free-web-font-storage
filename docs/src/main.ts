import { createApp } from "vue";
import App from "./App.vue";
import pinia from "./store/index";
import { Lazyload } from "vant";
import { router } from "./routes/index";
createApp(App)
    .use(pinia)
    .use(Lazyload, {
        preload: 1.5,
        lazyComponent: true,
        throttleWait: 500,
    })
    .use(router)
    .mount("#app");
