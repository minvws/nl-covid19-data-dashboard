const fs = require('fs');
const { compile } = require('json-schema-to-typescript');

const SchemaValidator = require('./schemaValidator');

const schemaNames = ['national', 'ranges'];

const generatedTypescript = [];
schemaNames.forEach(generateTypeScriptFromSchema);

function generateTypeScriptFromSchema(schemaName) {
  const validator = new SchemaValidator(`../${schemaName}/${schemaName}.json`);

  const generateOptions = {
    cwd: `../${schemaName}/`,
  };

  validator.init().then((validate) => {
    compile(validate.schema, schemaName, generateOptions).then((ts) => {
      generatedTypescript.push(ts);
      console.info(`Generated typescript for schema '${schemaName}'`);
      if (generatedTypescript.length === schemaNames.length) {
        saveFile(generatedTypescript.join('\n'));
      }
    });
  });
}

function saveFile(ts) {
  fs.writeFileSync('data.d.ts', ts, { encoding: 'utf8' });
}
