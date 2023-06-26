import { assert, JsonDataScope } from '@corona-dashboard/common';
import fs from 'fs';
import path from 'path';
import { defaultJsonDirectory } from '../config';
import { getFileNames } from '../utils';
import { createChoroplethValidation, CustomValidationFunction, validateMovingAverages } from './custom-validations';

export type SchemaInfo = Record<JsonDataScope, SchemaInfoItem>;

export type SchemaInfoItem = {
  files: string[];
  basePath: string;
  customValidations?: CustomValidationFunction[];
  optional?: boolean;
};

export function getSchemaInfo(jsonDirectory: string = defaultJsonDirectory): SchemaInfo {
  assert(fs.existsSync(jsonDirectory), `Path ${jsonDirectory} does not exist`);

  const fileList = fs.readdirSync(jsonDirectory);
  const archivedFileList = fs.readdirSync(path.join(jsonDirectory, 'archived'));

  return {
    nl: {
      files: ['NL.json'],
      basePath: jsonDirectory,
    },
    vr_collection: { files: ['VR_COLLECTION.json'], basePath: jsonDirectory },
    gm: {
      files: getFileNames(fileList, /^GM[0-9]+.json$/),
      basePath: jsonDirectory,
      customValidations: [createChoroplethValidation(path.join(defaultJsonDirectory, 'GM_COLLECTION.json'), 'gmcode', ['vaccine_coverage_per_age_group']), validateMovingAverages],
    },
    gm_collection: { files: ['GM_COLLECTION.json'], basePath: jsonDirectory },
    archived_nl: {
      files: ['NL.json'],
      basePath: path.join(jsonDirectory, 'archived'),
    },
    archived_gm: {
      files: getFileNames(archivedFileList, /^GM[0-9]+.json$/),
      basePath: path.join(jsonDirectory, 'archived'),
      customValidations: [
        createChoroplethValidation(path.join(defaultJsonDirectory, 'archived', 'GM_COLLECTION.json'), 'gmcode', ['vaccine_coverage_per_age_group']),
        validateMovingAverages,
      ],
    },
    archived_gm_collection: {
      files: ['GM_COLLECTION.json'],
      basePath: path.join(jsonDirectory, 'archived'),
    },
  };
}
