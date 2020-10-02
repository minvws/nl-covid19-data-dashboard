/* eslint no-console: 0 */
import fs from 'fs';
import path from 'path';
import { SchemaValidator } from './schemaValidator';
import { getSchemaNames, schemaDirectory } from './getSchemaNames';
import { jsonBasePath } from './jsonBasePath';

const validSchemaNames = getSchemaNames();

const cliArgs = process.argv.slice(2);

if (cliArgs.length !== 2) {
  console.error(
    `
Expected two commandline arguments: schema name and json filename.

Where schema name must be one of these values: ${validSchemaNames.join(', ')}

and json filename must a file present in the '${jsonBasePath}' directory.`
  );
  process.exit(1);
}

const schemaName = cliArgs[0];
const jsonFileName = cliArgs[1];

if (!validSchemaNames.includes(schemaName)) {
  console.error(
    `Invalid schema name argument '${schemaName}', must be one of the following values: ${validSchemaNames.join(
      ', '
    )}`
  );
  process.exit(1);
}

if (!fs.existsSync(path.join(jsonBasePath, jsonFileName))) {
  console.error(
    `Invalid json filename argument '${jsonFileName}', file does not exist in directory ${jsonBasePath}`
  );
  process.exit(1);
}

const validatorInstance = new SchemaValidator(
  path.join(schemaDirectory, schemaName, `${schemaName}.json`)
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
  })
  .catch((e) => {
    console.error(e.message);
    console.log('');
    process.exit(1);
  });
