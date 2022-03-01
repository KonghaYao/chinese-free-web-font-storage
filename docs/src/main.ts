import { createApp } from "vue";
import App from "./App.vue";
import pinia from "./store";
import { router } from "./routes/index";

import "@duandz/vue-router-transition/dist/style.css";
createApp(App).use(pinia).use(router).mount("#app");
