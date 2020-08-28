/* eslint no-console: 0 */
const fs = require('fs');
const path = require('path');
const { compile } = require('json-schema-to-typescript');
const SchemaValidator = require('./schemaValidator');
const getSchemaNames = require('./getSchemaNames');

// The directory where the resulting data.d.ts file will be saved
const outputPath = path.join(__dirname, '..', '..', 'src', 'types');

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
    path.join(__dirname, '..', schemaName, `${schemaName}.json`)
  );

  // Sets the current working directory (cwd) to the schema directory, in order
  // for the typescript generator to properly resolve external references
  const generateOptions = {
    cwd: path.join(__dirname, '..', schemaName),
  };

  return validator.init().then((validate) => {
    return compile(validate.schema, schemaName, generateOptions).then((ts) => {
      console.info(`Generated typescript for schema '${schemaName}'`);
      return ts;
    });
  });
}

function saveFile(ts) {
  const outputFile = path.join(outputPath, 'data.d.ts');
  fs.writeFileSync(outputFile, ts, {
    encoding: 'utf8',
  });
  console.info(`Written typescript output to file '${outputFile}'`);
}
