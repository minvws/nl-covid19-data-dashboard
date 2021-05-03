import Ajv, { ValidateFunction } from 'ajv';
import fs from 'fs';
import path from 'path';
import { equalsRootProperty } from './keywords';

export function createValidateFunctionFromSchemaObject(
  schema: any,
  basePath: string
) {
  return compileValidator(schema, loadSchema.bind(null, basePath));
}

export function loadRootSchema(schemaPath: string) {
  try {
    return JSON.parse(
      fs.readFileSync(schemaPath, {
        encoding: 'utf8',
      })
    );
  } catch (e) {
    throw new Error(`Error while parsing file ${schemaPath}:\n${e.message}`);
  }
}

/**
 * Creates an Ajv ValidateFunction for the given schema
 *
 * @returns A Promise object that will resolve to a ValidateFunction.
 */
export function createValidateFunctionFromSchemaPath(schemaPath: string) {
  const basePath = path.dirname(schemaPath);

  const schema = loadRootSchema(schemaPath);

  return compileValidator(schema, loadSchema.bind(null, basePath));
}

function compileValidator(
  rootSchema: any,
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
    .then((data: string) => JSON.parse(data));
}
