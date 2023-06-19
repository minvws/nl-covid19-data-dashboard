import { DataScopeKey } from '@corona-dashboard/common';
import path from 'path';
import { RELATIVE_SCHEMA_PATH } from '../constants';
import { getDirectoryName } from './get-directory-name';
import { loadJsonFromFile } from './load-json-from-file';

const schemaPath = path.join(getDirectoryName(import.meta.url), RELATIVE_SCHEMA_PATH);

const pickMetricNames = ([, value]: [string, { type: string } | { $ref: string }]) => {
  if ('type' in value) {
    return false;
  } else {
    return !value.$ref.startsWith('__');
  }
};

export const getSchemaMetrics = (scope: DataScopeKey) => {
  const schema = loadJsonFromFile(path.join(schemaPath, scope, '__index.json'));

  return Object.entries<{ type: string } | { $ref: string }>(schema.properties)
    .filter(pickMetricNames)
    .map(([key]) => key);
};
