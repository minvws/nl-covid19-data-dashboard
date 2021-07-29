import fs from 'fs';
import path from 'path';

export type Scope = 'nl' | 'gm' | 'vr' | 'in';

const schemaPath = path.join(__dirname, '..\\..\\..\\..\\app\\schema');

export function getSchemaMetrics(scope: Scope) {
  const schema = loadJsonFromFile(path.join(schemaPath, scope, '__index.json'));

  return Object.entries<{ type: string } | { $ref: string }>(schema.properties)
    .filter(pickMetricNames)
    .map(([key]) => key);
}

export function getSchemaMetricProperties(scope: Scope, metricName: string) {
  const schema = loadJsonFromFile(
    path.join(schemaPath, scope, `${metricName}.json`)
  );

  return Object.keys(schema.definitions.value.properties).filter(
    pickMetricProperties
  );
}

function pickMetricProperties(key: string) {
  return !key.startsWith('date_');
}

function pickMetricNames([, value]: [
  string,
  { type: string } | { $ref: string }
]) {
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
