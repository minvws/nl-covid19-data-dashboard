import {
  assert,
  JsonDataScope,
  VerboseFeature,
} from '@corona-dashboard/common';
import path from 'path';
import { isDefined } from 'ts-is-present';
import {
  disabledMetrics,
  schemaRootPath,
} from '~/static-props/feature-flags/feature-flag-constants';
import { loadJsonFromFile } from '~/static-props/utils/load-json-from-file';

type AjvPropertyDef = { type?: MetricType; $ref: string };

type AjvSchema = {
  $schema: string;
  type: string;
  title: string;
  additionalProperties: boolean;
  required: string[];
  properties: Record<string, AjvPropertyDef>;
  definitions?: Record<string, AjvSchema>;
};

export function initializeFeatureFlaggedData<T>(
  jsonData: T,
  scope: JsonDataScope
) {
  const featuresFlags = getFeatureFlagsByScope(scope);

  featuresFlags.forEach((x) =>
    initializeFeatureFlagDataItem(x, scope, jsonData)
  );

  return jsonData;
}

export function initializeFeatureFlagDataItem(
  feature: VerboseFeature,
  scope: JsonDataScope,
  jsonData: any
) {
  const [rootSchema, metricSchema] = getSchema(feature, scope);
  const metricType = getMetricType(rootSchema, feature.metricName);
  if (metricType === 'array') {
    if (!isDefined(jsonData[feature.metricName])) {
      jsonData[feature.metricName] = [];
    }
  }
  if (metricType === 'object') {
    if (!isDefined(jsonData[feature.metricName])) {
      jsonData[feature.metricName] = {};
    }
  }
  if (metricType === 'ref') {
    if (!isDefined(jsonData[feature.metricName])) {
      jsonData[feature.metricName] = initializeRef(metricSchema);
    }
  }
  if (isDefined(feature.metricProperties)) {
    initializeMetricProperties(
      jsonData[feature.metricName],
      feature.metricProperties,
      metricSchema
    );
  }
}

function initializeMetricProperties(
  metric: any,
  propertyNames: string[],
  metricSchema: AjvSchema
) {
  const metrics = Array.isArray(metric) ? metric : [metric];
  metrics.forEach((m) => {
    propertyNames.forEach((x) => {
      if (!isDefined(m[x])) {
        m[x] = initializeProperty(metricSchema.properties[x], metricSchema);
      }
    });
  });
}

function initializeRef(schema: AjvSchema): any {
  if (schema.type === 'array') {
    return [];
  }

  if (!isDefined(schema.required)) {
    return null;
  }

  return Object.fromEntries(
    schema.required.map((x) => [
      x,
      initializeProperty(schema.properties[x], schema),
    ])
  );
}

function initializeSimpleProp(type: string) {
  switch (true) {
    case type === 'boolean':
      return true;
    case type === 'array':
      return [];
    case type === 'string':
      return '';
    case type === 'number' || type === 'integer':
      return 0;
    case type === 'object':
      return {};
  }
}

function isStringPropType(value: any): value is string {
  return typeof value === 'string';
}

function initializeProperty(prop: AjvPropertyDef, schema: AjvSchema) {
  if (isStringPropType(prop.type)) {
    return initializeSimpleProp(prop.type);
  }
  if (Array.isArray(prop.type)) {
    return initializeSimpleProp(prop.type[0] as string);
  }
  if (isDefined(prop.$ref) && prop.$ref.startsWith('#')) {
    const key = prop.$ref.split('/').pop();
    if (
      isDefined(key) &&
      isDefined(schema.definitions) &&
      isDefined(schema.definitions[key])
    ) {
      const propDef = schema.definitions[key];
      return initializeRef(propDef);
    }
  }
  return null;
}

function getSchema(feature: VerboseFeature, scope: JsonDataScope) {
  const rootSchemaPath = path.join(schemaRootPath, scope, '__index.json');
  const rootSchema = loadJsonFromFile<AjvSchema>(rootSchemaPath);
  const metricSchemaPath = path.join(
    schemaRootPath,
    `${scope}`,
    feature.metricName
  );
  const metricSchema = loadJsonFromFile<AjvSchema>(metricSchemaPath);
  return [rootSchema, metricSchema] as const;
}

function getFeatureFlagsByScope(scope: JsonDataScope) {
  return disabledMetrics.filter((x) => x.dataScopes.includes(scope));
}

function getMetricType(schema: AjvSchema, metricName: string) {
  const propertyDef = schema.properties[metricName];
  assert(
    isDefined(propertyDef),
    `property ${metricName} not found on schema ${schema.title}`
  );
  return propertyDef.type ?? 'ref';
}

type MetricType =
  | 'array'
  | 'object'
  | 'string'
  | 'integer'
  | 'number'
  | 'ref'
  | 'null'
  | MetricType[];
