import "@assets/style/style.scss";
import { createApp } from "vue";
import App from "@pages/newtab/Newtab.vue";

function init() {
  const app = createApp(App);
  app.mount("#app-container");
}

init();
