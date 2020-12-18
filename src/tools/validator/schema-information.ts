import fs from 'fs';
import { jsonBasePath, localeBasePath } from './base-paths';
import { validatePlaceholders } from './custom-validations/validate-placeholders';

type CustomValidationFunction = (
  input: Record<string, unknown>
) => string[] | undefined;

export type SchemaInfo = {
  files: string[];
  basePath: string;
  customValidations?: CustomValidationFunction[];
  optional?: boolean;
};

export function getSchemaInformation(
  customJsonPath?: string
): Record<string, SchemaInfo> {
  const jsonPath = customJsonPath ?? jsonBasePath;

  const localeJsons = fs.readdirSync(localeBasePath);

  const dataJsons = fs.existsSync(jsonPath)
    ? fs.readdirSync(jsonPath).concat(localeJsons)
    : localeJsons;

  // This struct defines which JSON files should be validated with which schema.
  const schemaInformation: Record<string, SchemaInfo> = {
    national: { files: ['NL.json'], basePath: jsonPath },
    ranges: { files: ['RANGES.json'], basePath: jsonPath },
    regional: {
      files: filterFilenames(dataJsons, /^VR[0-9]+.json$/),
      basePath: jsonPath,
    },
    municipal: {
      files: filterFilenames(dataJsons, /^GM[0-9]+.json$/),
      basePath: jsonPath,
    },
    municipalities: { files: ['MUNICIPALITIES.json'], basePath: jsonPath },
    regions: { files: ['REGIONS.json'], basePath: jsonPath },
    locale: {
      files: filterFilenames(localeJsons, /[^.]+.json$/),
      basePath: localeBasePath,
      customValidations: [validatePlaceholders],
    },
  };

  return schemaInformation;
}

/**
 * Filters the given list of file names according to the given regular expression
 *
 * @param fileList The given list of file names
 * @param pattern The given regular expression
 */
function filterFilenames(fileList: string[], pattern: RegExp) {
  return fileList.filter((filename) => filename.match(pattern));
}
