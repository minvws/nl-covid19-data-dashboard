import {
  assert,
  JsonDataScope,
  VerboseFeature,
} from '@corona-dashboard/common';
import path from 'path';
import { isDefined } from 'ts-is-present';
import { loadJsonFromFile } from '~/static-props/utils/load-json-from-file';
import { disabledMetrics, schemaRootPath } from './feature-flag-constants';

type AjvPropertyDef = { type?: MetricType; $ref: string; enum?: any[] };

type AjvSchema = {
  $schema: string;
  type: string;
  title: string;
  additionalProperties: boolean;
  required: string[];
  properties: Record<string, AjvPropertyDef>;
  definitions?: Record<string, AjvSchema>;
};

/**
 * This method receives a dashboard data file (one from the public/json folder),
 * it then searches for **disabled** feature flags that are associated with the
 * specified data file and generates default data where it doesn't exist yet.
 *
 * For example, if a feature flag is exists for data scope GM_COLLECTION with the
 * metric name 'infections'. This method will check if the property already exists
 * and if not, it will assign an empty array to this property.
 * Specifying metric properties is also supported, so if the array data already
 * exists, but a new number property called, for example, 'number_of_people' is defined
 * by the feature flag, this property will be assigned a zero if it doesn't exist yet.
 *
 * This way, in the `getStaticProps` logic there won't be a need to add any
 * kind of `if featureFlag.foo === true` logic, since the data is initialized with
 * empty values any kind of data shaping won't fail, it will just result in more
 * empty data.
 *
 * Note: The available schema's are used to initialize the property values with
 * correct data types.
 *
 */
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

function initializeFeatureFlagDataItem(
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
      let propertyDefinition: AjvPropertyDef | undefined =
        metricSchema.properties[x];
      if (!isDefined(propertyDefinition)) {
        propertyDefinition = metricSchema.definitions?.value.properties[x];
      }
      if (!isDefined(propertyDefinition)) {
        throw new Error(
          `metric property ${x} not defined in ${metricSchema.title}`
        );
      }
      if (!isDefined(m[x])) {
        m[x] = initializeProperty(propertyDefinition, metricSchema);
      } else if (isDefined(m.values)) {
        m.values.forEach((o: any) => {
          if (!isDefined(o[x])) {
            o[x] = initializeProperty(
              propertyDefinition as AjvPropertyDef,
              metricSchema
            );
          }
        });
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
    schema.required.map((x) => {
      if (!isDefined(schema.properties[x])) {
        throw new Error(
          `metric property '${x}' not defined in ${schema.title}`
        );
      }
      return [x, initializeProperty(schema.properties[x], schema)];
    })
  );
}

function initializeSimpleProp(type: SimpleMetricType) {
  switch (type) {
    case 'boolean':
      return true;
    case 'array':
      return [];
    case 'string':
      return '';
    case 'number':
    case 'integer':
      return 0;
    case 'object':
      return {};
  }
}

function isStringPropType(value: any): value is SimpleMetricType {
  return typeof value === 'string' && value !== 'ref' && value !== 'null';
}

function initializeProperty(prop: AjvPropertyDef, schema: AjvSchema) {
  if (isDefined(prop.enum) && prop.enum.length) {
    return prop.enum[0];
  }

  if (isStringPropType(prop.type)) {
    return initializeSimpleProp(prop.type);
  }

  if (Array.isArray(prop.type)) {
    return initializeSimpleProp(prop.type[0] as SimpleMetricType);
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
    scope,
    `${feature.metricName}.json`
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
    `[${getMetricType.name}] property ${metricName} not found on schema ${schema.title}`
  );
  return propertyDef.type ?? 'ref';
}

type SimpleMetricType =
  | 'array'
  | 'object'
  | 'string'
  | 'integer'
  | 'number'
  | 'boolean';

type MetricType = SimpleMetricType | 'ref' | 'null' | MetricType[];
