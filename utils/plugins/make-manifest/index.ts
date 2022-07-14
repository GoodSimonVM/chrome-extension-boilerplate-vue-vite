import * as fs from "fs";
import * as path from "path";
import colorLog from "@utils/color-log";
import type { PluginOption } from "vite";
import type { ManifestType } from "./manifest-type";

const { resolve } = path;

interface MakeManifestConfig {
  manifest: ManifestType;
  outputDir: string;
  // pathToPackageJson?: string;
}

function makeManifest(config: MakeManifestConfig): PluginOption {
  const outDir = resolve(__dirname, config.outputDir);
  return {
    name: "make-manifest",
    buildEnd() {
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir);
      }
      const manifestPath = resolve(outDir, "manifest.json");

      fs.writeFileSync(manifestPath, JSON.stringify(config.manifest, null, 2));

      colorLog(`Manifest file copy complete: ${manifestPath}`, "success");
    },
  };
}

export default makeManifest;
export type { ManifestType, MakeManifestConfig };
