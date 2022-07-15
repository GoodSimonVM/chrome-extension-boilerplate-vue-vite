import packageJson from "../package.json";
import type { ManifestType } from "utils/plugins/make-manifest";

const manifest: ManifestType = {
  manifest_version: 3,
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  options_page: "pages/options/index.html",
  background: { service_worker: "pages/background/index.js" },
  action: {
    default_popup: "pages/popup/index.html",
    default_icon: { "34": "icon-34.png" },
  },
  chrome_url_overrides: {
    newtab: "pages/newtab/index.html",
  },
  icons: {
    "128": "icon-128.png",
  },
  content_scripts: [
    {
      matches: ["http://*/*", "https://*/*", "<all_urls>"],
      js: ["pages/content/index.js"],
    },
  ],
  devtools_page: "pages/devtools/index.html",
  web_accessible_resources: [
    {
      resources: [
        "assets/js/*.js",
        "assets/css/*.css",
        "icon-128.png",
        "icon-34.png",
      ],
      matches: ["*://*/*"],
    },
  ],
};

export default manifest;
