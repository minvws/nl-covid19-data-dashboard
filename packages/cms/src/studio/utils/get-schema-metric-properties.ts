import { DataScopeKey } from '@corona-dashboard/common';
import path from 'path';
import { RELATIVE_SCHEMA_PATH } from '../constants';
import { getDirectoryName } from './get-directory-name';
import { loadJsonFromFile } from './load-json-from-file';

const schemaPath = path.join(getDirectoryName(import.meta.url), RELATIVE_SCHEMA_PATH);

const pickMetricProperties = (key: string) => !key.startsWith('date_');

export const getSchemaMetricProperties = (scope: DataScopeKey, metricName: string) => {
  const schema = loadJsonFromFile(path.join(schemaPath, scope, `${metricName}.json`));

  return Object.keys(schema.definitions.value.properties).filter(pickMetricProperties);
};
