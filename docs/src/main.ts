import { createApp } from "vue";
import App from "./App.vue";
import pinia from "./store";
import { router } from "./routes/index";
createApp(App).use(pinia).use(router).mount("#app");
