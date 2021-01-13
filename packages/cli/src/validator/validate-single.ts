import chalk from 'chalk';
import fs from 'fs';
import meow from 'meow';
import path from 'path';
import { createValidateFunction } from './create-validate-function';
import { executeValidations } from './execute-validations';
import { schemaDirectory } from './config';
import { getSchemaInfo } from './schema-information';

const schemaInformation = getSchemaInfo();

const validSchemaNames = Object.keys(schemaInformation);

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
Expected two command line arguments: schema-name and json-filename.

Where schema-name must be one of these values: ${validSchemaNames.join(', ')}
and json-filename must be a file associated with that schema.

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
    )}.`
  );
  process.exit(1);
}

const basePath = schemaInformation[schemaName].basePath;

if (!schemaInformation[schemaName].files.includes(jsonFileName)) {
  console.error(
    `Invalid json filename argument '${jsonFileName}', this file is not associated with the '${schemaName}' schema.`
  );
  process.exit(1);
}

if (!fs.existsSync(path.join(basePath, jsonFileName))) {
  console.error(
    `Invalid json filename argument '${jsonFileName}', file does not exist in directory ${basePath}.`
  );
  process.exit(1);
}

createValidateFunction(
  path.join(schemaDirectory, schemaName, `__index.json`)
).then((validateFunction) => {
  const fileName = path.join(basePath, jsonFileName);
  const schemaInfo = schemaInformation[schemaName];
  const contentAsString = fs.readFileSync(fileName, {
    encoding: 'utf8',
  });

  let data: any = null;
  try {
    data = JSON.parse(contentAsString);
  } catch (e) {
    console.group();
    console.error(chalk.bgRed.bold(`  ${fileName} cannot be parsed  \n`));
    console.groupEnd();
    process.exit(1);
  }

  const { isValid, schemaErrors } = executeValidations(
    validateFunction,
    data,
    schemaInfo
  );

  if (!isValid) {
    console.error(schemaErrors);
    console.error(chalk.bgRed.bold(`  ${jsonFileName} is invalid  \n`));
    process.exit(1);
  }

  console.log(chalk.green.bold(`  ${jsonFileName} is valid  \n`));
});
