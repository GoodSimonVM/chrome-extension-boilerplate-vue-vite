import crypto from "crypto";
import fs from "fs";
import type { ConvertSvgConfig } from "./types";
import { defaultHashCodeLength } from "./constants";

export function getHashCode(config: ConvertSvgConfig) {
  const hash = crypto.createHash("shake256", { outputLength: config.hashLength });
  const fileBuffer = fs.readFileSync(config.input.svgFilePath);
  const data = Buffer.concat([
    Buffer.from(JSON.stringify(config), "base64"),
    fileBuffer,
  ]);
  const hashcode = hash.update(data).digest("hex");
  return hashcode;
}
