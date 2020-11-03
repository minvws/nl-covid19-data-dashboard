import Ajv, { ValidateFunction } from 'ajv';
import fs from 'fs';
import path from 'path';
import { equalsRootProperty } from './ajv-keywords/equalsRootProperty';
import { validRestrictionId } from './ajv-keywords/validRestrictionId';

/**
 * Loads the given uri and parses its conts to JSON
 * @param basePath The given base directory name
 * @param uri The given filename
 */
function loadSchema(basePath: string, uri: string): Promise<any> {
  return fs.promises
    .readFile(path.join(basePath, uri), {
      encoding: 'utf8',
    })
    .then((data: string) => JSON.parse(data));
}

/**
 * Creates an Ajv ValidateFunction for the given schema
 *
 * @returns A Promise object that will resolve to a ValidateFunction.
 */
export function createValidateFunction(schemaPath: string) {
  const basePath = path.dirname(schemaPath);
  const schema = JSON.parse(
    fs.readFileSync(schemaPath, {
      encoding: 'utf8',
    })
  );

  const validator = new Ajv({
    loadSchema: loadSchema.bind(null, basePath),
    $data: true,
    allErrors: true,
  });
  validator
    .addKeyword('equalsRootProperty', equalsRootProperty)
    .addKeyword('validRestrictionId', validRestrictionId);
  return validator.compileAsync(schema).then((validate) => {
    return validate;
  }) as Promise<ValidateFunction>;
}
