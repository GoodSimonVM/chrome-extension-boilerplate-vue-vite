import "@assets/style/style.scss";
import { createApp } from "vue";
import App from "@pages/content/Content.vue";
// /**
//  * @description
//  * Chrome extensions don't support modules in content scripts.
//  */
// import("@pages/content/Content.vue");

const MOUNT_EL_ID = generateMountElementId();

console.log("content loaded");

let mountEl = document.getElementById(MOUNT_EL_ID);
if (mountEl) {
  mountEl.innerHTML = "";
}
mountEl = document.createElement("div");
mountEl.setAttribute("id", MOUNT_EL_ID);
document.body.appendChild(mountEl);
createApp(App).mount(mountEl);

function generateMountElementId(): string {
  let elId: string = "app-mount-root-";
  do {
    elId += Math.round(Math.random() * 27644437) % 3010349;
  } while (!!document.getElementById(elId));
  return elId;
}
