import { createApp } from "vue";
import App from "./App.vue";
import pinia from "./store";
import { Lazyload } from "vant";
import { router } from "./routes/index";
createApp(App)
    .use(pinia)
    .use(Lazyload, {
        lazyComponent: true,
    })
    .use(router)
    .mount("#app");
