import { defineConfig } from "vite";
import { resolve } from "path";
import { promises as fs } from "fs";
import makeManifest from "@utils/plugins/make-manifest";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import ViteIconsResolver from "unplugin-icons/resolver";
import manifest from "@src/manifest";

const root = resolve(__dirname, "src");
const pagesDir = resolve(root, "pages");
const assetsDir = resolve(root, "assets");
const outDir = resolve(__dirname, "dist");
const publicDir = resolve(__dirname, "public");

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
        (name) => {
          if (name === "MyCustom")
            return resolve(__dirname, "src/CustomResolved.vue").replace(
              /\\\\/g,
              "/"
            );
        },
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
        custom: {
          logo: () => fs.readFile("assets/icons/svg/logo.svg", "utf-8"),
        },
      },
    }),
    makeManifest({
      manifest: manifest,
      outputDir: publicDir,
    }),
  ],
  publicDir,
  build: {
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
        entryFileNames: "src/pages/[name]/index.js",
        chunkFileNames: "assets/js/[name].[hash].js",
        assetFileNames: "assets/[ext]/[name].chunk.[ext]",
      },
    },
  },
});
