/* eslint no-console: 0 */
const fs = require('fs');
const path = require('path');
const SchemaValidator = require('./schemaValidator');
const getSchemaNames = require('./getSchemaNames');
const jsonBasePath = require('./jsonBasePath');

const validSchemaNames = getSchemaNames();

var myArgs = process.argv.slice(2);

if (myArgs.length !== 2) {
  console.error(
    `
Expected two commandline arguments: schema name and json filename.

Where schema name must be one of these values: ${validSchemaNames.join(', ')}

and json filename must a file present in the '${jsonBasePath}' directory.`
  );
  process.exit();
}

const schemaName = myArgs[0];
const jsonFileName = myArgs[1];

if (!validSchemaNames.includes(schemaName)) {
  console.error(
    `Invalid schema name argument '${schemaName}', must be one of the following values: ${validSchemaNames.join(
      ', '
    )}`
  );
  process.exit();
}

if (!fs.existsSync(path.join(jsonBasePath, jsonFileName))) {
  console.error(
    `Invalid json filename argument '${jsonFileName}', file does not exist in directory ${jsonBasePath}`
  );
  process.exit();
}

const validatorInstance = new SchemaValidator(
  path.join(__dirname, `../${schemaName}/${schemaName}.json`)
);
const contentAsString = fs.readFileSync(path.join(jsonBasePath, jsonFileName), {
  encoding: 'utf8',
});
const data = JSON.parse(contentAsString);

validatorInstance
  .init()
  .then((validate) => {
    const valid = validate(data);
    if (!valid) {
      console.log('');
      console.error(validate.errors);
      throw new Error(`${jsonFileName} is invalid`);
    }
    console.log(`${jsonFileName} is valid`);
    return true;
  })
  .catch((e) => {
    console.error(e.message);
    console.log('');
    return false;
  });
