import fs from 'fs';
import { jsonDirectory, localeDirectory } from './config';
import { validatePlaceholders } from './validate-schema/custom-validations/validate-placeholders';
import { assert } from '@corona-dashboard/common';

type CustomValidationFunction = (
  input: Record<string, unknown>
) => string[] | undefined;

export type SchemaItemInfo = {
  files: string[];
  basePath: string;
  customValidations?: CustomValidationFunction[];
  optional?: boolean;
};

export function getSchemaInfo(path: string = jsonDirectory) {
  assert(fs.existsSync(path), `Path ${path} does not exist`);

  const fileList = fs.readdirSync(path);

  const info: Record<string, SchemaItemInfo> = {
    nl: { files: ['NL.json'], basePath: path },
    vr: {
      files: getFileNames(fileList, /^VR[0-9]+.json$/),
      basePath: path,
    },
    gm: {
      files: getFileNames(fileList, /^GM[0-9]+.json$/),
      basePath: path,
    },
    gm_collection: { files: ['GM_COLLECTION.json'], basePath: path },
    vr_collection: { files: ['VR_COLLECTION.json'], basePath: path },
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

  const fileList = fs.readdirSync(jsonDirectory);

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
