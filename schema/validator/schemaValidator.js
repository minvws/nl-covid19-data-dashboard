const Ajv = require('ajv');
const fs = require('fs');
const path = require('path');

/**
 * Loads the given uri and parses its conts to JSON
 * @param {string} basePath The given base directory name
 * @param {string} uri The given filename
 */
function loadSchema(basePath, uri) {
  return fs.promises
    .readFile(path.join(basePath, uri), {
      encoding: 'utf8',
    })
    .then((data) => JSON.parse(data));
}

/**
 * This class creates an instance with the given schema path.
 * The instance returns a validator function that is able to validate a JSON object
 * according to the given schema.
 */
class SchemaValidator {
  constructor(schemaPath) {
    this.basePath = path.dirname(schemaPath);
    this.schemaPath = schemaPath;
  }

  /**
   * @returns {Promise} A Promise object that will resolve to a validator function.
   */
  init() {
    const schema = JSON.parse(
      fs.readFileSync(this.schemaPath, {
        encoding: 'utf8',
      })
    );

    const validator = new Ajv({
      loadSchema: loadSchema.bind(null, this.basePath),
      $data: true,
    }); // options can be passed, e.g. {allErrors: true}
    return validator.compileAsync(schema).then(function (validate) {
      return validate;
    });
  }
}

module.exports = SchemaValidator;
