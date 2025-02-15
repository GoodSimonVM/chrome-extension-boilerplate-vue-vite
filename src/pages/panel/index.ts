import "@assets/style/style.scss";
import { createApp } from "vue";
import App from "@pages/panel/Panel.vue";

function init() {
  const app = createApp(App);
  app.mount("#app-container");
}

init();