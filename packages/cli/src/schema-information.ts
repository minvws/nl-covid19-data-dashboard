import { assert } from '@corona-dashboard/common';
import fs from 'fs';
import path from 'path';
import { defaultJsonDirectory, localeDirectory } from './config';
import {
  createChoroplethValidation,
  validatePlaceholders,
} from './validate-schema/custom-validations';

export type CustomValidationFunction = (
  input: Record<string, unknown>
) => string[] | undefined;

export type SchemaItemInfo = {
  files: string[];
  basePath: string;
  customValidations?: CustomValidationFunction[];
  optional?: boolean;
};

export function getSchemaInfo(jsonDirectory: string = defaultJsonDirectory) {
  assert(fs.existsSync(jsonDirectory), `Path ${jsonDirectory} does not exist`);

  const fileList = fs.readdirSync(jsonDirectory);

  const info: Record<string, SchemaItemInfo> = {
    nl: { files: ['NL.json'], basePath: jsonDirectory },
    vr: {
      files: getFileNames(fileList, /^VR[0-9]+.json$/),
      basePath: jsonDirectory,
      customValidations: [
        createChoroplethValidation(
          path.join(jsonDirectory, 'VR_COLLECTION.json'),
          'vrcode'
        ),
      ],
    },
    gm: {
      files: getFileNames(fileList, /^GM[0-9]+.json$/),
      basePath: jsonDirectory,
      customValidations: [
        createChoroplethValidation(
          path.join(jsonDirectory, 'GM_COLLECTION.json'),
          'gmcode'
        ),
      ],
    },
    gm_collection: { files: ['GM_COLLECTION.json'], basePath: jsonDirectory },
    vr_collection: { files: ['VR_COLLECTION.json'], basePath: jsonDirectory },
    locale: {
      files: ['en.json', 'nl.json'],
      basePath: localeDirectory,
      customValidations: [validatePlaceholders],
    },
  };

  return info;
}

export function getFilesWithTimeSeries(directory: string) {
  assert(fs.existsSync(directory), `Directory ${directory} does not exist`);

  const fileList = fs.readdirSync(defaultJsonDirectory);

  const timeSeriesFiles = [
    ...getFileNames(fileList, /^NL.json$/),
    ...getFileNames(fileList, /^VR[0-9]+.json$/),
    ...getFileNames(fileList, /^GM[0-9]+.json$/),
  ];

  return timeSeriesFiles;
}

/**
 * Filters the given list of file names according to the given regular expression
 *
 * @param fileList The given list of file names
 * @param pattern The given regular expression
 */
function getFileNames(fileList: string[], pattern: RegExp) {
  return fileList.filter((filename) => filename.match(pattern));
}
