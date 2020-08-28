/* eslint no-console: 0 */
const fs = require('fs');
const path = require('path');
const { compile } = require('json-schema-to-typescript');

const outputPath = path.join(__dirname, '../../src/types');

const SchemaValidator = require('./schemaValidator');
const getSchemaNames = require('./getSchemaNames');

const schemaNames = getSchemaNames();

const promises = schemaNames.map(generateTypeScriptFromSchema);

Promise.all(promises).then((result) => {
  saveFile(result.join('\n'));
});

/**
 * Loads the given schema by name and generates typescript interfaces from it.
 *
 * @param {string} schemaName the given schema name
 * @returns {Promise} A Promise that will resolve to the generated typescript
 */
function generateTypeScriptFromSchema(schemaName) {
  const validator = new SchemaValidator(
    path.join(__dirname, `../${schemaName}/${schemaName}.json`)
  );

  const generateOptions = {
    cwd: path.join(__dirname, `../${schemaName}/`),
  };

  return validator.init().then((validate) => {
    return compile(validate.schema, schemaName, generateOptions).then((ts) => {
      console.info(`Generated typescript for schema '${schemaName}'`);
      return ts;
    });
  });
}

function saveFile(ts) {
  fs.writeFileSync(path.join(outputPath, 'data.d.ts'), ts, {
    encoding: 'utf8',
  });
}
