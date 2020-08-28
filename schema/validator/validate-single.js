const fs = require('fs');
const path = require('path');
const SchemaValidator = require('./schemaValidator');

const jsonBasePath = path.join(__dirname, '../../public/json/');
const validSchemaNames = getSchemaNames();

var myArgs = process.argv.slice(2);

if (myArgs.length !== 2) {
  console.error(
    `
Expected two commandline arguments: schema name and json filename.

Where schema name must be one of these values: ${validSchemaNames.join(', ')}

and json filename must a file present in the '${jsonBasePath}' directory.`
  );
  return;
}

const schemaName = myArgs[0];
const jsonFileName = myArgs[1];

if (!validSchemaNames.includes(schemaName)) {
  console.error(
    `Invalid schema name argument '${schemaName}', must be one of the following values: ${validSchemaNames.join(
      ', '
    )}`
  );
  return;
}

if (!fs.existsSync(path.join(jsonBasePath, jsonFileName))) {
  console.error(
    `Invalid json filename argument '${jsonFileName}', file does not exist in directory ${jsonBasePath}`
  );
  return;
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
      // eslint-disable-next-line
      console.log('');
      // eslint-disable-next-line
      console.error(validate.errors);
      throw new Error(`${jsonFileName} is invalid`);
    }
    // eslint-disable-next-line
    console.log(`${jsonFileName} is valid`);
    return true;
  })
  .catch((e) => {
    // eslint-disable-next-line
    console.error(e.message);
    // eslint-disable-next-line
    console.log('');
    return false;
  });

function getSchemaNames() {
  const directoryPath = path.join(__dirname, '../');
  const contents = fs.readdirSync(directoryPath);
  return contents.filter((item) => item !== 'validator');
}
