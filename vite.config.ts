import { defineConfig } from "vite";
import { resolve, parse } from "path";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import ViteIconsResolver from "unplugin-icons/resolver";

import makeManifest from "./utils/plugins/make-manifest";
import { getCustomCollection } from "./utils/make-custom-icons-collection";

import manifest from "./src/manifest";
import { assetsDir, outDir, pagesDir, publicDir, root } from "./src/constants";

const customIconFileNames: string[] = [
  "img/ext-logo.svg",
  "img/svg/vue-logo.svg",
];

const customIcons = getCustomCollection({
  pathToAssetsDir: assetsDir,
  iconFilePaths: customIconFileNames,
});

export default defineConfig({
  resolve: {
    alias: {
      "@src": root,
      "@assets": assetsDir,
      "@pages": pagesDir,
    },
  },
  plugins: [
    vue(),
    Components({
      dts: true,
      extensions: ["vue"],
      include: [/\.vue$/],
      resolvers: [
        // https://github.com/antfu/vite-plugin-icons
        ViteIconsResolver({
          customCollections: ["custom"],
          enabledCollections: ["bi", "bx"],
        }),
      ],
    }),
    Icons({
      autoInstall: true,
      customCollections: {
        custom: customIcons,
      },
    }),
    makeManifest({
      manifest: manifest,
      outputDir: publicDir,
    }),
  ],
  publicDir,
  root,
  build: {
    emptyOutDir: true,
    outDir,
    sourcemap: process.env.__DEV__ === "true",
    rollupOptions: {
      input: {
        devtools: resolve(pagesDir, "devtools", "index.html"),
        panel: resolve(pagesDir, "panel", "index.html"),
        content: resolve(pagesDir, "content", "index.ts"),
        background: resolve(pagesDir, "background", "index.ts"),
        popup: resolve(pagesDir, "popup", "index.html"),
        newtab: resolve(pagesDir, "newtab", "index.html"),
        options: resolve(pagesDir, "options", "index.html"),
      },
      output: {
        entryFileNames: "pages/[name]/index.js",
        chunkFileNames: "assets/js/[name].[hash].js",
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) throw "no asset name";
          const { dir, name: _name } = parse(assetInfo.name);
          const assetFolder = getLastElement(dir.split("/"));
          const name = assetFolder + firstUpperCase(_name);
          return `assets/[ext]/${name}.chunk.[ext]`;
        },
      },
    },
  },
});

function getLastElement<T>(array: ArrayLike<T>): T {
  const length = array.length;
  const lastIndex = length - 1;
  return array[lastIndex];
}

function firstUpperCase(str: string) {
  const firstAlphabet = new RegExp(/( |^)[a-z]/, "g");
  return str.toLowerCase().replace(firstAlphabet, (L) => L.toUpperCase());
}
