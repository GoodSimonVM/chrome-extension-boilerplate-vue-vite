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

enum FitConfigModeShort {
  original = "o",
  width = "w",
  height = "h",
  zoom = "z",
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
  readonly input: {
    readonly svgFilePath: string;
  };
  readonly output: {
    readonly dirPath: string;
    readonly fitOptions: FitConfig[];
  };
  readonly useHash?: boolean;
  readonly force?: boolean;
  readonly addOutputToDirWithInputName?: boolean;
  readonly hashLength?: number
}

interface ParsedEntry {
  filePath: string;
  name: string;
  mode: FitConfigModeShort;
  size: number;
  hash: string | undefined;
}

interface ConversionResult {
  [key: string]: string;
}

export { OriginalFitMode, ScalableFitMode, FitConfigMode, FitConfigModeShort };
export type {
  FitConfigModeType,
  OriginalFitModeType,
  ScalableFitModeType,
  FitConfig,
  ConvertSvgFileConfig,
  ConvertSvgConfig,
  ParsedEntry,
  ConversionResult,
};
