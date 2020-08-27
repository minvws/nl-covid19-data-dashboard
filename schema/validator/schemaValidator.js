const Ajv = require('ajv');
const fs = require('fs');
const path = require('path');

function loadSchema(basePath, uri) {
  return fs.promises
    .readFile(path.join(basePath, uri), {
      encoding: 'utf8',
    })
    .then((data) => JSON.parse(data));
}

class SchemaValidator {
  constructor(schemaPath) {
    this.basePath = path.dirname(schemaPath);
    this.schemaPath = schemaPath;
  }

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
