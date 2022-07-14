import crypto from "crypto";
import fs from "fs";
import path from "path";
import { Resvg } from "@resvg/resvg-js";
import type { ResvgRenderOptions } from "@resvg/resvg-js";
import yargs from "yargs";

// ----- types ----- //
// enum FitConfigMode {
//     original,
//     width,
//     height,
//     zoom,
// }

type FitConfigModeType = keyof typeof FitConfigMode;
type OriginalFitModeType = keyof typeof OriginalFitMode;
type ScalableFitModeType = keyof typeof ScalableFitMode;

enum OriginalFitMode {
  original = "original",
}

enum ScalableFitMode {
  width = "width",
  height = "height",
  zoom = "zoom",
}

enum FitConfigMode {
  original = OriginalFitMode.original,
  width = ScalableFitMode.width,
  height = ScalableFitMode.height,
  zoom = ScalableFitMode.zoom,
}

type FitConfig =
  | { mode: OriginalFitModeType }
  | { mode: ScalableFitModeType; value: number };

interface ConvertSvgFileConfig {
  readonly pathToSvgFile: string;
  readonly pathToOutputDir: string;
  readonly size: FitConfig;
}

interface ConvertSvgConfig {
  readonly pathToSvgFile: string;
  readonly pathToOutputDir: string;
  readonly fitMode: FitConfigModeType;
  readonly fitSizes?: number[];
}

// ----- constants ----- //
const svgExt = ".svg";

// ----- exec ----- //
const argv = process.argv;
main(argv);
// oldmain(argv);

// ----- main ----- //
function main(argv: string[]) {
  const args = yargs(argv.slice(2))
    // .usage('Usage: $0 <command> [options]')
    .command(
      ["convert", "c"],
      "convert svg to png/jpg/jpeg",
      (yargs) =>
        yargs
          .option("input", {
            alias: "i",
            description:
              "the path to the svg file or to the root directory with svg files",
            type: "string",
            demandOption: true,
            coerce: path.resolve,
          })
          .option("output", {
            alias: "o",
            description:
              "the path to the directory to save the conversion result",
            type: "string",
            demandOption: true,
            coerce: path.resolve,
          })
          .option("create", {
            alias: "c",
            description: "create output directory in not exist",
            type: "boolean",
            default: true,
          })
          .option("mode", {
            alias: "m",
            description: "",
            type: "string",
            choices: values(FitConfigMode),
            default: FitConfigMode.original,
            coerce(arg): FitConfigMode {
              const validValues = values(FitConfigMode);
              if (!validValues.includes(arg)) throw "invalid value: " + arg;
              const mode = FitConfigMode[arg as FitConfigModeType];
              return mode;
            },
          })
          .option("sizes", {
            alias: "s",
            requiresArg: true,
            coerce(arg: any): number[] {
              let args = Array.isArray(arg)
                ? arg
                : typeof arg == "number"
                ? [arg]
                : typeof arg == "string"
                ? arg.replace(/\s+/gm, "").split(",")
                : [];
              if (args.length <= 0)
                throw "param -size should be the array fo numbers ";
              const values = args.map((val) => {
                const num = parseInt(val);
                if (isNaN(num)) throw "value:" + val + "is NaN";
                return num;
              });
              return values;
            },
          })
          .option("force", {
            alias: "f",
            description: "force update output, even if hash is same",
            type: "boolean",
            default: false,
          }),
      (argv) => {
        const inputFiles = fs
          .readdirSync(argv.input, { withFileTypes: true })
          .filter((dirent) => dirent.isFile() && dirent.name.endsWith(svgExt))
          .map((dirent) => path.join(argv.input, dirent.name));

        inputFiles.forEach((svgFilePath) => {
          const convertConfig: ConvertSvgConfig = {
            pathToSvgFile: svgFilePath,
            pathToOutputDir: argv.output,
            fitMode: FitConfigMode[argv.mode] as ScalableFitModeType,
            fitSizes: argv.sizes,
          };

          convertSvgToPngsIfSomethingChanged(convertConfig, argv.force);
        });
      }
    )
    .check((argv, options) => {
      if (!fs.existsSync(argv.input))
        return (
          "the '--input " +
          argv.input +
          "' parameter must be an existing path to an svg file or directory with svg files"
        );

      const fsInput = fs.lstatSync(argv.input);
      if (fsInput.isDirectory()) {
        const files = fs
          .readdirSync(argv.input, { withFileTypes: true })
          .filter((dirent) => dirent.isFile() && dirent.name.endsWith(svgExt))
          .map((dirent) => dirent.name);
        if (files.length <= 0)
          return "the path '" + argv.input + "' does not contain svg files";
      }

      if (argv.create) {
        fs.mkdirSync(argv.output, { recursive: true });
      }

      const isOutputDirExist = fs.existsSync(argv.output);
      if (!isOutputDirExist) {
        return "the '--output' parameter must be the path to the directory to save the conversion result";
      }

      if (argv.mode === FitConfigMode.original && !!argv.sizes)
        return "you can't use --mode='original' with sizes";
      if (argv.mode !== FitConfigMode.original && !argv.sizes)
        return (
          "you mast set at least one value for --size when use '--mode" +
          argv.mode
        );
      return true;
    })
    .demandCommand(1, "You need at least one command before moving on")
    .help().argv;
}

// ----- functions ----- //

function values(obj: any): string[] {
  return Object.keys(obj).map((key) => obj[key]);
}

function convertSvgToPngsIfSomethingChanged(
  config: ConvertSvgConfig,
  force: boolean = false
): void {
  throwIfIsNotPathToSvg(config.pathToSvgFile);
  const hashFileName = path.basename(config.pathToSvgFile, svgExt) + ".hash";
  const hashcode = getHashCode(config);
  const pathToOutputDir = getOutputDirPath(
    config.pathToSvgFile,
    config.pathToOutputDir
  );
  const hashFilePath = path.join(pathToOutputDir, hashFileName);
  const encoding: BufferEncoding = "utf-8";

  if (!force) {
    const isOutputDirExists = fs.existsSync(pathToOutputDir);
    if (isOutputDirExists) {
      const isHashFileExist = fs.existsSync(hashFilePath);
      if (isHashFileExist) {
        const savedHashcode = fs
          .readFileSync(hashFilePath, encoding)
          .toString();
        const isEqualHashs = savedHashcode === hashcode;
        if (isEqualHashs) {
          return;
        }
      }
    }
  }

  fs.mkdirSync(pathToOutputDir, { recursive: true });
  convertSvgToPngs(config);
  fs.writeFileSync(hashFilePath, hashcode, encoding);
}

function getHashCode(config: ConvertSvgConfig) {
  const hash = crypto.createHash("shake256");
  const fileBuffer = fs.readFileSync(config.pathToSvgFile);
  const data = Buffer.concat([
    Buffer.from(JSON.stringify(config), "base64"),
    fileBuffer,
  ]);
  const hashcode = hash.update(data).digest("hex");
  return hashcode;
}

function convertSvgToPngs(config: ConvertSvgConfig): void {
  if (config.fitMode == OriginalFitMode.original) {
    convertSvgToPng({
      pathToSvgFile: config.pathToSvgFile,
      pathToOutputDir: config.pathToOutputDir,
      size: { mode: config.fitMode },
    });
    return;
  }

  if (!config.fitSizes) throw "no sizes";

  getScalableFitConfigs(config.fitMode, config.fitSizes).forEach((size) =>
    convertSvgToPng({
      pathToSvgFile: config.pathToSvgFile,
      pathToOutputDir: config.pathToOutputDir,
      size: size,
    })
  );
}

function getScalableFitConfigs(
  mode: ScalableFitModeType,
  values: number[]
): FitConfig[] {
  return values.map((fitValue) => ({ mode: mode, value: fitValue }));
}

function convertSvgToPng(config: ConvertSvgFileConfig): void {
  throwIfIsNotPathToSvg(config.pathToSvgFile);

  const outputFilePath = getOutputFileName(config);

  const resvgOpt: ResvgRenderOptions = {
    fitTo: config.size,
  };
  const svg = fs.readFileSync(config.pathToSvgFile);
  const png = convert(svg, resvgOpt);
  fs.writeFileSync(outputFilePath, png, { flag: "w" });
}

function convert(svgFile: Buffer, resvgOpt: ResvgRenderOptions): Buffer {
  const converter = new Resvg(svgFile, resvgOpt);
  const pngData = converter.render();
  const pngBuffer = pngData.asPng();
  return pngBuffer;
}

function getOutputFileName(config: ConvertSvgFileConfig) {
  const outputDirPath = getOutputDirPath(
    config.pathToSvgFile,
    config.pathToOutputDir
  );
  let outputFileName: string =
    config.size.mode === OriginalFitMode.original
      ? config.size.mode
      : config.size.value.toString();
  const outputFileNameWithExtension = outputFileName + ".png";
  const outputFilePath = path.join(outputDirPath, outputFileNameWithExtension);
  return outputFilePath;
}

function getOutputDirPath(pathToSvgFile: string, pathToOutputDir: string) {
  const fileName = path.basename(pathToSvgFile, svgExt);
  const outputFilePath = path.join(pathToOutputDir, fileName);
  return outputFilePath;
}

function throwIfIsNotPathToSvg(pathToSvgFile: string) {
  const isPathToFile = fs.lstatSync(pathToSvgFile).isFile();
  const fileExtension = path.extname(pathToSvgFile);
  const isExtensionEqualSvgFile = fileExtension.toLowerCase() == svgExt;

  if (!isPathToFile || !isExtensionEqualSvgFile) {
    throw `The path is not path to a svg file ${pathToSvgFile}`;
  }
}
