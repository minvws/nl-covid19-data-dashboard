/* eslint no-console: 0 */
import fs from 'fs';
import path from 'path';
import { createValidateFunction } from './createValidateFunction';
import { getSchemaNames, schemaDirectory } from './getSchemaNames';
import { jsonBasePath } from './jsonBasePath';
import chalk from 'chalk';
import meow from 'meow';

const validSchemaNames = getSchemaNames();

const cli = meow(
  `
    Usage
      $ validate-single <schema-name> <json-path>
 
    Examples
      $ validate-single national nl.json
`
);

const cliArgs = cli.input;

if (cliArgs.length !== 2) {
  console.error(
    `
Expected two commandline arguments: schema-name and json-filename.

Where schema-name must be one of these values: ${validSchemaNames.join(', ')}
and json-filename must be a file in the '${jsonBasePath}' directory.

`
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

createValidateFunction(
  path.join(schemaDirectory, schemaName, `${schemaName}.json`)
).then((validateFunction) => {
  const contentAsString = fs.readFileSync(
    path.join(jsonBasePath, jsonFileName),
    {
      encoding: 'utf8',
    }
  );

  const data = JSON.parse(contentAsString);

  const valid = validateFunction(data);

  if (!valid) {
    console.error(validateFunction.errors);
    console.error(chalk.bgRed.bold(`  ${jsonFileName} is invalid  \n`));
    process.exit(1);
  }

  console.log(chalk.green.bold(`  ${jsonFileName} is valid  \n`));
});
