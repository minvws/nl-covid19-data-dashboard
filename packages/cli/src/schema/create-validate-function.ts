import Ajv, { ValidateFunction } from 'ajv';
import fs from 'fs';
import path from 'path';
import { loadSchema } from './load-schema';
import { equalsRootProperty } from './ajv-keywords';

/**
 * Creates an Ajv ValidateFunction for the given schema
 *
 * @returns A Promise object that will resolve to a ValidateFunction.
 */
export function createValidateFunction(schemaPath: string) {
  const basePath = path.dirname(schemaPath);
  let schema = null;
  try {
    schema = JSON.parse(
      fs.readFileSync(schemaPath, {
        encoding: 'utf8',
      })
    );
  } catch (e) {
    throw new Error(`Error while parsing file ${schemaPath}:\n${e.message}`);
  }

  const validator = new Ajv({
    loadSchema: loadSchema.bind(null, basePath),
    $data: true,
    allErrors: true,
  });
  validator.addKeyword('equalsRootProperty', equalsRootProperty);
  return validator.compileAsync(schema).then((validate) => {
    return validate;
  }) as Promise<ValidateFunction>;
}
