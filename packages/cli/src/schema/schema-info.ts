import { assert, JsonDataScope } from '@corona-dashboard/common';
import fs from 'fs';
import path from 'path';
import { defaultJsonDirectory } from '../config';
import { getFileNames } from '../utils';
import {
  createChoroplethValidation,
  CustomValidationFunction,
  validateMovingAverages,
} from './custom-validations';

export type SchemaInfo = Record<JsonDataScope, SchemaInfoItem>;

export type SchemaInfoItem = {
  files: string[];
  basePath: string;
  customValidations?: CustomValidationFunction[];
  optional?: boolean;
};

export function getSchemaInfo(
  jsonDirectory: string = defaultJsonDirectory
): SchemaInfo {
  assert(fs.existsSync(jsonDirectory), `Path ${jsonDirectory} does not exist`);

  const fileList = fs.readdirSync(jsonDirectory);

  return {
    nl: {
      files: ['NL.json'],
      basePath: jsonDirectory,
    },
    vr: {
      files: getFileNames(fileList, /^VR[0-9]+.json$/),
      basePath: jsonDirectory,
      customValidations: [
        createChoroplethValidation(
          path.join(defaultJsonDirectory, 'VR_COLLECTION.json'),
          'vrcode',
          ['vaccine_coverage_per_age_group']
        ),
        validateMovingAverages,
      ],
    },
    vr_collection: { files: ['VR_COLLECTION.json'], basePath: jsonDirectory },
    gm: {
      files: getFileNames(fileList, /^GM[0-9]+.json$/),
      basePath: jsonDirectory,
      customValidations: [
        createChoroplethValidation(
          path.join(defaultJsonDirectory, 'GM_COLLECTION.json'),
          'gmcode',
          ['vaccine_coverage_per_age_group']
        ),
        validateMovingAverages,
      ],
    },
    gm_collection: { files: ['GM_COLLECTION.json'], basePath: jsonDirectory },
  };
}
