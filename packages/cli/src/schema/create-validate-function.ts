import { Feature, features } from '@corona-dashboard/common';
import Ajv, { ValidateFunction } from 'ajv';
import fs from 'fs';
import path from 'path';
import { isDefined } from 'ts-is-present';
import { equalsRootProperty } from './keywords';

const disabledMetrics = features.filter((x) => !x.isEnabled);

export function loadRootSchema(schemaPath: string) {
  try {
    const schema = JSON.parse(
      fs.readFileSync(schemaPath, {
        encoding: 'utf8',
      })
    );
    disableFeatureFlagMetrics(schema, disabledMetrics);
    return schema;
  } catch (e) {
    if (e instanceof Error)
      throw new Error(`Error while parsing file ${schemaPath}:\n${e.message}`);
  }
}

function disableFeatureFlagMetrics(schema: any, features: Feature[]) {
  if (isDefined(schema.required)) {
    const required = schema.required as string[];
    features.forEach((x) => {
      if (!isDefined(x.dataScopes)) {
        return;
      }
      if (!x.dataScopes.includes(schema.title)) {
        return;
      }
      if (isDefined(x.metricName)) {
        const index = required.indexOf(x.metricName);
        if (index > -1) {
          required.splice(index, 1);
        }
      }
      if (isDefined(x.metricProperties)) {
        x.metricProperties.forEach((x) => {
          const index = required.indexOf(x);
          if (index > -1) {
            required.splice(index, 1);
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
export function createValidateFunction(
  schemaOrFilename: string | object,
  schemaBasePath: string
) {
  const schema =
    typeof schemaOrFilename === 'string'
      ? loadRootSchema(path.join(schemaBasePath, schemaOrFilename))
      : schemaOrFilename;

  return compileValidator(schema, loadSchema.bind(null, schemaBasePath));
}

function compileValidator(
  rootSchema: object,
  loadSchema: (
    uri: string,
    cb?: (err: Error, schema: object) => void
  ) => PromiseLike<object | boolean>
) {
  const validator = new Ajv({
    loadSchema: loadSchema,
    $data: true,
    allErrors: true,
  });
  validator.addKeyword('equalsRootProperty', equalsRootProperty);
  return validator.compileAsync(rootSchema).then((validate) => {
    return validate;
  }) as Promise<ValidateFunction>;
}

/**
 * Loads the given uri and parses its contents to JSON
 * @param basePath The given base directory name
 * @param uri The given filename
 */
export function loadSchema(basePath: string, uri: string): Promise<any> {
  return fs.promises
    .readFile(path.join(basePath, uri), {
      encoding: 'utf8',
    })
    .then((data: string) => {
      const schema = JSON.parse(data);
      disableFeatureFlagMetrics(schema, disabledMetrics);
      return schema;
    });
}
