const fs = require('fs');
const path = require('path');
const { compile } = require('json-schema-to-typescript');

const outputPath = path.join(__dirname, '../../src/types');

const SchemaValidator = require('./schemaValidator');

const schemaNames = ['national', 'ranges', 'regional', 'municipal'];

const generatedTypescript = [];
schemaNames.forEach(generateTypeScriptFromSchema);

function generateTypeScriptFromSchema(schemaName) {
  const validator = new SchemaValidator(
    path.join(__dirname, `../${schemaName}/${schemaName}.json`)
  );

  const generateOptions = {
    cwd: path.join(__dirname, `../${schemaName}/`),
  };

  validator.init().then((validate) => {
    compile(validate.schema, schemaName, generateOptions).then((ts) => {
      generatedTypescript.push(ts);
      // eslint-disable-next-line
      console.info(`Generated typescript for schema '${schemaName}'`);
      if (generatedTypescript.length === schemaNames.length) {
        saveFile(generatedTypescript.join('\n'));
      }
    });
  });
}

function saveFile(ts) {
  fs.writeFileSync(path.join(outputPath, 'data.d.ts'), ts, {
    encoding: 'utf8',
  });
}
