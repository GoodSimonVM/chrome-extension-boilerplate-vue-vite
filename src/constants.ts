import {resolve} from "path"
const root = resolve(__dirname, ".");
const pagesDir = resolve(root, "pages");
const assetsDir = resolve(root, "assets");
const outDir = resolve(__dirname, "../dist");
const publicDir = resolve(__dirname, "public");

export { root, pagesDir, assetsDir, outDir, publicDir };
