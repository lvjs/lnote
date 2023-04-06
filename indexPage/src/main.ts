import { createApp } from "vue";
import { createPinia } from "pinia";
import { Message } from "@arco-design/web-vue";
import App from "./App.vue";
import router from "./router";
import ArcoVue from "@arco-design/web-vue";
import ArcoVueIcon from "@arco-design/web-vue/es/icon";
import "@arco-design/web-vue/dist/arco.css";

import "./assets/main.css";

export const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ArcoVue);
app.use(ArcoVueIcon);
app.mount("#app");

Message._context = app._context;
