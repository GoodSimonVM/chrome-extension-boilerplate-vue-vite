import { resolve, relative } from "path";
import { convertSvg } from "../utils/svg2png/convert";
import packageJson from "../package.json";
import { assetsDir, publicDir } from "./constants";
import type { ManifestType } from "../utils/plugins/make-manifest";

const pathToLogoSvg = resolve(assetsDir, "img", "ext-logo.svg");

const publicAssetsDir = resolve(publicDir, "assets");

const extLogoIconConversionResult = convertSvg({
  input: {
    svgFilePath: pathToLogoSvg,
  },
  output: {
    dirPath: publicAssetsDir,
    fitOptions: [
      { mode: "width", value: 16 },
      { mode: "width", value: 32 },
      { mode: "width", value: 48 },
      { mode: "width", value: 64 },
      { mode: "width", value: 128 },
      { mode: "width", value: 256 },
    ],
  },
  force: false,
  useHash: true,
  addOutputToDirWithInputName: true,
});

const extLogoIcon = Object.keys(extLogoIconConversionResult)
  .map((key) => ({
    [key.slice(2)]: relative(__dirname, extLogoIconConversionResult[key]),
  }))
  .reduce((prev, current) => ({ ...prev, ...current }), {});

const manifest: ManifestType = {
  manifest_version: 3,
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  options_page: "pages/options/index.html",
  background: { service_worker: "pages/background/index.js" },
  action: {
    default_popup: "pages/popup/index.html",
    default_icon: extLogoIcon,
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
