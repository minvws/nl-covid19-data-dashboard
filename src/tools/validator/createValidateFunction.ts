import Ajv, { ValidateFunction } from 'ajv';
import fs from 'fs';
import path from 'path';

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
  validator.addKeyword('equalsRootProperty', {
    type: 'string',
    validate: function equalsRootProperty(
      schema: any,
      data: any,
      _parentSchema?: any,
      _dataPath?: string,
      _parentData?: any | any[],
      _parentDataProperty?: string | number,
      rootData?: any | any[]
    ): boolean {
      if (rootData) {
        const rootValue = (rootData as any)[schema as string];
        const validated = data === rootValue;
        if (!validated) {
          (equalsRootProperty as any).errors = [
            {
              keyword: 'equalsRootProperty',
              message: `the property '${_dataPath}' value '${data}' must be equal to the root property '${schema}' value '${rootValue}'`,
              params: {
                keyword: 'equalsRootProperty',
                value: schema,
              },
            },
          ];
        }
        return validated;
      }
      return true;
    },
    errors: true,
  });
  return validator.compileAsync(schema).then((validate) => {
    return validate;
  }) as Promise<ValidateFunction>;
}
