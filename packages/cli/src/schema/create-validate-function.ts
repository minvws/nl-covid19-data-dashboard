import Ajv, { ValidateFunction } from 'ajv';
import fs from 'fs';
import path from 'path';
import { equalsRootProperty } from './keywords';

export function loadRootSchema(schemaPath: string) {
  try {
    return JSON.parse(
      fs.readFileSync(schemaPath, {
        encoding: 'utf8',
      })
    );
  } catch (e) {
    if (e instanceof Error)
      throw new Error(`Error while parsing file ${schemaPath}:\n${e.message}`);
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
    .then((data: string) => JSON.parse(data));
}
