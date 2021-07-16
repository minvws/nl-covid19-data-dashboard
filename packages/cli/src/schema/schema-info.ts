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
    in: {
      files: getFileNames(fileList, /^IN_[A-Z]{3}.json$/),
      basePath: jsonDirectory,
      customValidations: [
        createChoroplethValidation(
          path.join(defaultJsonDirectory, 'IN_COLLECTION.json'),
          'country_code'
        ),
        validateMovingAverages,
      ],
    },
    in_collection: {
      files: [
        // @TODO enable once the file is available
        /* 'IN_COLLECTION.json' */
      ],
      basePath: jsonDirectory,
    },
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
          'vrcode'
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
          'gmcode'
        ),
        validateMovingAverages,
      ],
    },
    gm_collection: { files: ['GM_COLLECTION.json'], basePath: jsonDirectory },
  };
}
