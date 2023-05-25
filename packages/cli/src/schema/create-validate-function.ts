import { Feature, features, isVerboseFeature } from '@corona-dashboard/common';
import Ajv, { AnySchemaObject, ValidateFunction } from 'ajv';
import fs from 'fs';
import path from 'path';
import { isDefined } from 'ts-is-present';
import { equalsRootProperty } from './keywords/equals-root-property';
import { logAdditionalProperties } from './keywords/log-additional-properties';

const disabledMetrics = features.filter((x) => !x.isEnabled);

export function loadRootSchema(schemaPath: string, skipFeatureDisable: boolean) {
  try {
    const schema = JSON.parse(
      fs.readFileSync(schemaPath, {
        encoding: 'utf8',
      })
    );
    if (!skipFeatureDisable) {
      disableFeatureFlagMetrics(schema, disabledMetrics);
    }
    return schema;
  } catch (e) {
    if (e instanceof Error) throw new Error(`Error while parsing file ${schemaPath}:\n${e.message}`);
  }
}

function isMetricSchema(schemaTitle: string, metricName: string, scopes: string[]) {
  return scopes.some((scope) => schemaTitle === `${scope}_${metricName}`);
}

function disableFeatureFlagMetrics(schema: any, features: Feature[]) {
  if (isDefined(schema.required)) {
    features.filter(isVerboseFeature).forEach((x) => {
      if (!x.dataScopes.includes(schema.title) && !isMetricSchema(schema.title, x.metricName, x.dataScopes)) {
        return;
      }
      if (isDefined(x.metricName)) {
        const required = schema.required as string[];
        const index = required.indexOf(x.metricName);
        if (index > -1) {
          console.info(`Made ${x.metricName} non-required in schema ${schema.title} because the corresponding feature flag ${x.name} is disabled`);
          required.splice(index, 1);
        }
      }
      if (isDefined(x.metricProperties)) {
        x.metricProperties.forEach((m) => {
          const required = schema.definitions?.value?.required as string[];
          if (isDefined(required)) {
            const index = required.indexOf(m);
            if (index > -1) {
              console.info(`Made ${m} non-required in schema ${schema.title} because the corresponding feature flag ${x.name} is disabled`);
              required.splice(index, 1);
            }
          }
        });
      }
    });
  }
}

/**
 * Creates an Ajv ValidateFunction for the given schema or schema filename
 *
 * @returns A Promise object that will resolve to a ValidateFunction.
 */
export function createValidateFunction(schemaOrFilename: string | object, schemaBasePath: string, skipFeatureDisable = false) {
  const schema = typeof schemaOrFilename === 'string' ? loadRootSchema(path.join(schemaBasePath, schemaOrFilename), skipFeatureDisable) : schemaOrFilename;

  return compileValidator(schema, loadSchema.bind(null, schemaBasePath, skipFeatureDisable));
}

function compileValidator(rootSchema: object, loadSchema: (uri: string) => Promise<AnySchemaObject>) {
  const validator = new Ajv({
    loadSchema: loadSchema,
    $data: true,
    allErrors: true,
  });

  validator.addKeyword(equalsRootProperty);
  validator.addKeyword(logAdditionalProperties); // Add this line

  return validator.compileAsync(rootSchema).then((validate) => {
    return validate;
  }) as Promise<ValidateFunction>;
}

/**
 * Loads the given uri and parses its contents to JSON
 * @param basePath The given base directory name
 * @param uri The given filename
 */
export function loadSchema(basePath: string, skipFeatureDisable: boolean, uri: string): Promise<any> {
  return fs.promises
    .readFile(path.join(basePath, uri), {
      encoding: 'utf8',
    })
    .then((data: string) => {
      const schema = JSON.parse(data);
      if (!skipFeatureDisable) {
        disableFeatureFlagMetrics(schema, disabledMetrics);
      }
      return schema;
    });
}
