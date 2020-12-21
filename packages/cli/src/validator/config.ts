import path from "path";

/**
 * Fully qualified path to the json data files
 */
export const jsonDirectory = path.join(
  __dirname,
  "..", // src
  "..", // cli
  "..", // packages
  "app",
  "public",
  "json"
);

export const localeDirectory = path.join(
  __dirname,
  "..", // src
  "..", // cli
  "..", // packages
  "app",
  "src",
  "locale"
);

export const schemaDirectory = path.join(
  __dirname,
  "..", // src
  "..", // cli
  "..", // packages
  "app",
  "schema"
);
