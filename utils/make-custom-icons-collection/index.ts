import { parse, resolve } from "path";
import { promises as fs } from "fs";
import type { InlineCollection } from "unplugin-icons/types";


interface CustomCollectionConfig {
  pathToAssetsDir: string;
  iconFilePaths: string[];
}

function getCustomCollection(
  customCollectionConfig: CustomCollectionConfig
): InlineCollection {
  return customCollectionConfig.iconFilePaths
    .map((iconFileName) => {
      const parsedName = parse(iconFileName);
      const name = parsedName.name;
      const ext = parsedName.ext;
      if (!ext || ext.length < 1) throw `no extension`;
      return { [name]: () =>
        fs.readFile(
          resolve(customCollectionConfig.pathToAssetsDir, iconFileName),
          "utf-8"
        ) };
    })
    .reduce((prev, current) => ({ ...prev, ...current }));
}

export { getCustomCollection };
export type { CustomCollectionConfig };
