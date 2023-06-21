import { DataScopeKey } from '@corona-dashboard/common';
import fs from 'fs';
import path from 'path';

const schemaPath = path.join(__dirname, '..//..//..//..//app//schema');

export function getSchemaMetrics(scope: DataScopeKey) {
  const schema = loadJsonFromFile(path.join(schemaPath, scope, '__index.json'));

  return Object.entries<{ type: string } | { $ref: string }>(schema.properties)
    .filter(pickMetricNames)
    .map(([key]) => key);
}

export function getSchemaMetricProperties(scope: DataScopeKey, metricName: string) {
  const schema = loadJsonFromFile(path.join(schemaPath, scope, `${metricName}.json`));

  return Object.keys(schema.definitions.value.properties).filter(pickMetricProperties);
}

function pickMetricProperties(key: string) {
  return !key.startsWith('date_');
}

function pickMetricNames([, value]: [string, { type: string } | { $ref: string }]) {
  if ('type' in value) {
    return false;
  } else {
    return !value.$ref.startsWith('__');
  }
}

function loadJsonFromFile(filePath: string) {
  const content = fs.readFileSync(filePath, { encoding: 'utf-8' });
  return JSON.parse(content);
}
