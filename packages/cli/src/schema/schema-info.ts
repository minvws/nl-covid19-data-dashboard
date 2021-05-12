import { assert, MetricScope } from '@corona-dashboard/common';
import fs from 'fs';
import path from 'path';
import { defaultJsonDirectory, localeDirectory } from '../config';
import { getFileNames } from '../utils';
import {
  createChoroplethValidation,
  CustomValidationFunction,
  // validateMovingAverages,
  validatePlaceholders,
} from './custom-validations';

export type SchemaInfo = Record<MetricScope | 'locale', SchemaInfoItem>;

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
    nl: { files: ['NL.json'], basePath: jsonDirectory },
    vr: {
      files: getFileNames(fileList, /^VR[0-9]+.json$/),
      basePath: jsonDirectory,
      customValidations: [
        createChoroplethValidation(
          path.join(defaultJsonDirectory, 'VR_COLLECTION.json'),
          'vrcode'
        ),
        // validateMovingAverages,
      ],
    },
    gm: {
      files: getFileNames(fileList, /^GM[0-9]+.json$/),
      basePath: jsonDirectory,
      customValidations: [
        createChoroplethValidation(
          path.join(defaultJsonDirectory, 'GM_COLLECTION.json'),
          'gmcode'
        ),
        // validateMovingAverages,
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
}
