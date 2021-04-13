import fs from 'fs';
import { jsonDirectory, localeDirectory } from '../config';
import { validatePlaceholders } from './validate-placeholders';
import { assert, MetricScope } from '@corona-dashboard/common';
import { getFileNames } from '../utils';

type CustomValidationFunction = (
  input: Record<string, unknown>
) => string[] | undefined;

export type SchemaInfo = Record<MetricScope | 'locale', SchemaInfoItem>;

export type SchemaInfoItem = {
  files: string[];
  basePath: string;
  customValidations?: CustomValidationFunction[];
  optional?: boolean;
};

export function getSchemaInfo(path: string = jsonDirectory): SchemaInfo {
  assert(fs.existsSync(path), `Path ${path} does not exist`);

  const fileList = fs.readdirSync(path);

  return {
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
}
