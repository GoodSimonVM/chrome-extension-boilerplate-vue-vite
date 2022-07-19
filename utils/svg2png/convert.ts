import path from "path";
import fs from "fs";
import { Resvg } from "@resvg/resvg-js";
import type { ResvgRenderOptions } from "@resvg/resvg-js";

import { FitConfigModeShort, type ParsedEntry } from "./types";

import type { ConvertSvgConfig, ConversionResult } from "./types";

import {
  svgExt,
  pngExt,
  outputFileRegEx,
  defaultHashCodeLength,
  maxHashCodeLength,
} from "./constants";
import { getHashCode } from "./hash";

// ----- functions ----- //
export function convertSvg(config: ConvertSvgConfig): ConversionResult {
  const fileName = path.basename(config.input.svgFilePath, svgExt);

  config = {
    ...config,
    force: config.force === undefined ? false : config.force,
    useHash: config.useHash === undefined ? true : config.useHash,
    output: {
      ...config.output,
      dirPath: config.addOutputToDirWithInputName
        ? path.resolve(config.output.dirPath, fileName)
        : config.output.dirPath,
    },
    hashLength:
      !!config.hashLength &&
      config.hashLength >= 0 &&
      config.hashLength <= maxHashCodeLength
        ? config.hashLength
        : defaultHashCodeLength,
  };

  const inputStat = fs.lstatSync(config.input.svgFilePath);
  if (!inputStat.isFile() || path.extname(config.input.svgFilePath) !== svgExt)
    throw `the resource '${config.input.svgFilePath}' isn't a SVG file`;
  const hashCode = getHashCode(config);

  const outputDirStat = fs.lstatSync(config.output.dirPath, {
    throwIfNoEntry: false,
  });

  if (!!outputDirStat?.isDirectory()) {
    const oldFiles: ParsedEntry[] = [];
    let isNeedConversion = false;
    fs.readdirSync(config.output.dirPath, { withFileTypes: true }).forEach(
      (entry) => {
        const match = entry.name.match(outputFileRegEx);

        if (!!match && !!match.groups) {
          let parsedEntry: ParsedEntry = {
            filePath: path.resolve(config.output.dirPath, entry.name),
            name: match.groups.name,
            mode: match.groups.mode as FitConfigModeShort,
            size: Number.parseInt(match.groups.size),
            hash: match.groups.hash,
          };
          oldFiles.push(parsedEntry);
          isNeedConversion =
            config.force || isNeedConversion || parsedEntry.hash !== hashCode;
        }
      }
    );
    isNeedConversion = isNeedConversion || !oldFiles.length;
    if (!isNeedConversion) {
      const conversionResult = makeConversionResult(oldFiles);
      return conversionResult;
    }
    oldFiles.forEach((fileEntry) => fs.unlinkSync(fileEntry.filePath));
  }

  const svg = fs.readFileSync(config.input.svgFilePath);
  const hash = config.useHash ? `_${hashCode}` : "";

  if (!outputDirStat) {
    fs.mkdirSync(config.output.dirPath, { recursive: true });
  }

  const outputEntries: ParsedEntry[] = config.output.fitOptions.map(
    (fitOption) => {
      const resvgOptions: ResvgRenderOptions = {
        fitTo: fitOption,
      };
      const png = resvgConvert(svg, resvgOptions);
      const shortMode: FitConfigModeShort = FitConfigModeShort[fitOption.mode];
      const size =
        fitOption.mode !== "original" ? fitOption.value : png.size.width;
      const outputFilePath = path.resolve(
        config.output.dirPath,
        `${fileName}_${shortMode}_${size}${hash}${pngExt}`
      );
      fs.writeFileSync(outputFilePath, png.buffer, { flag: "w" });
      return {
        filePath: outputFilePath,
        name: fileName,
        mode: shortMode,
        size: size,
        hash: hashCode,
      };
    }
  );
  return makeConversionResult(outputEntries);
}

function makeConversionResult(parsedEntries: ParsedEntry[]): ConversionResult {
  return parsedEntries
    .map((entry) => {
      const key = `${entry.mode}.${entry.size}`;
      const value = entry.filePath;
      const tempResult: ConversionResult = {
        [key]: value,
      };
      return tempResult;
    })
    .reduce((prev, curr) => {
      const x = { ...prev, ...curr };
      return x;
    }, {});
}

function resvgConvert(
  svgFile: Buffer,
  resvgOpt: ResvgRenderOptions
): { buffer: Buffer; size: { width: number; height: number } } {
  const converter = new Resvg(svgFile, resvgOpt);
  const pngData = converter.render();
  const pngBuffer = pngData.asPng();
  return {
    buffer: pngBuffer,
    size: { width: pngData.width, height: pngData.height },
  };
}
