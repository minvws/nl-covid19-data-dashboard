import Ajv, { ValidateFunction } from 'ajv';
import fs from 'fs';
import path from 'path';

/**
 * Loads the given uri and parses its conts to JSON
 * @param {string} basePath The given base directory name
 * @param {string} uri The given filename
 */
function loadSchema(basePath: string, uri: string): Promise<any> {
  return fs.promises
    .readFile(path.join(basePath, uri), {
      encoding: 'utf8',
    })
    .then((data: string) => JSON.parse(data));
}

/**
 * This class creates an instance with the given schema path.
 * The instance returns a validator function that is able to validate a JSON object
 * according to the given schema.
 */
export class SchemaValidator {
  private readonly basePath: string;

  constructor(private readonly schemaPath: string) {
    this.basePath = path.dirname(schemaPath);
  }

  /**
   * @returns A Promise object that will resolve to a validator function.
   */
  init(): PromiseLike<ValidateFunction> {
    const schema = JSON.parse(
      fs.readFileSync(this.schemaPath, {
        encoding: 'utf8',
      })
    );

    const validator = new Ajv({
      loadSchema: loadSchema.bind(null, this.basePath),
      $data: true,
    });
    return validator.compileAsync(schema).then((validate) => {
      return validate;
    });
  }
}
