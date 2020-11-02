import fs from 'fs';

import { jsonBasePath, localeBasePath } from './base-paths';
import { validatePlaceholders } from './custom-validations/validate-placeholders';
// import { validRestrictionIds } from './custom-validations/valid-restriction-ds';

export type CustomValidationFunction = (
  input: Record<string, unknown>
) => string[] | undefined;
export type SchemaInfo = {
  files: string[];
  basePath: string;
  customValidations?: CustomValidationFunction[];
  optional?: boolean;
};

const localeJsons = fs.readdirSync(localeBasePath);
const allJsonFiles = fs.existsSync(jsonBasePath)
  ? fs.readdirSync(jsonBasePath).concat(localeJsons)
  : localeJsons;

// This struct defines which JSON files should be validated with which schema.
export const schemaInformation: Record<string, SchemaInfo> = {
  national: { files: ['NL.json'], basePath: jsonBasePath },
  ranges: { files: ['RANGES.json'], basePath: jsonBasePath },
  regional: {
    files: filterFilenames(allJsonFiles, /^VR[0-9]+.json$/),
    basePath: jsonBasePath,
    // COmmenting this out for now until we have actual data:
    // customValidations: [validRestrictionIds],
  },
  municipal: {
    files: filterFilenames(allJsonFiles, /^GM[0-9]+.json$/),
    basePath: jsonBasePath,
  },
  municipalities: { files: ['MUNICIPALITIES.json'], basePath: jsonBasePath },
  regions: { files: ['REGIONS.json'], basePath: jsonBasePath },
  locale: {
    files: filterFilenames(localeJsons, /[^.]+.json$/),
    basePath: localeBasePath,
    customValidations: [validatePlaceholders],
  },
  restrictions: {
    files: ['RESTRICTIONS.json'],
    basePath: jsonBasePath,
    optional: true,
  },
};

/**
 * Filters the given list of file names according to the given regular expression
 *
 * @param fileList The given list of file names
 * @param pattern The given regular expression
 */
function filterFilenames(fileList: string[], pattern: RegExp) {
  return fileList.filter((filename) => filename.match(pattern));
}
