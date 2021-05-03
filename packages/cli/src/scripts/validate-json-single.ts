import { ValidateFunction } from 'ajv';
import chalk from 'chalk';
import fs from 'fs';
import meow from 'meow';
import path from 'path';
import { isDefined } from 'ts-is-present';
import { schemaDirectory } from '../config';
import {
  createValidateFunctionFromSchemaObject,
  createValidateFunctionFromSchemaPath,
  executeValidations,
  getSchemaInfo,
  loadRootSchema,
  SchemaInfo,
} from '../schema';

const schemaInformation = getSchemaInfo();

const validSchemaNames = Object.keys(schemaInformation);

const cli = meow(
  `
    Usage
      $ validate-json-single <schema-name> <json-path> <optional-metric-name>

    Examples
      $ validate-json-single national nl.json vaccine_coverage
`
);

const cliArgs = cli.input;

if (cliArgs.length < 2 || cliArgs.length > 3) {
  console.error(
    `
Expected at least two command line arguments: schema-name and json-filename, and optionally a third one: metric-name

Where schema-name must be one of these values: ${validSchemaNames.join(', ')},
json-filename must be a file associated with that schema and metric-name must be a valid
metric in the specified schema.

`
  );
  process.exit(1);
}

const schemaName = cliArgs[0] as keyof SchemaInfo;
const jsonFileName = cliArgs[1];
const metricName = cliArgs[2];

if (!validSchemaNames.includes(schemaName)) {
  console.error(
    `Invalid schema name argument '${schemaName}', must be one of the following values: ${validSchemaNames.join(
      ', '
    )}.`
  );
  process.exit(1);
}

const jsonBasePath = schemaInformation[schemaName].basePath;

if (!schemaInformation[schemaName].files.includes(jsonFileName)) {
  console.error(
    `Invalid json filename argument '${jsonFileName}', this file is not associated with the '${schemaName}' schema.`
  );
  process.exit(1);
}

if (!fs.existsSync(path.join(jsonBasePath, jsonFileName))) {
  console.error(
    `Invalid json filename argument '${jsonFileName}', file does not exist in directory ${jsonBasePath}.`
  );
  process.exit(1);
}

const handleCompilation = (validateFunction: ValidateFunction) => {
  const fileName = path.join(jsonBasePath, jsonFileName);
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
};

if (metricName) {
  const schemaBasePath = path.join(schemaDirectory, schemaName);
  const rootSchema = loadRootSchema(path.join(schemaBasePath, `__index.json`));

  if (!isDefined(rootSchema.properties[metricName])) {
    console.error(
      chalk.bgRed.bold(
        `  ${metricName} is not a metric in the specified schema '${schemaName}'  \n`
      )
    );
    process.exit(1);
  }

  rootSchema.required = [metricName];
  rootSchema.properties = {
    [metricName]: { ...rootSchema.properties[metricName] },
  };
  rootSchema.additionalProperties = true;

  createValidateFunctionFromSchemaObject(rootSchema, schemaBasePath).then(
    handleCompilation
  );
} else {
  createValidateFunctionFromSchemaPath(
    path.join(schemaDirectory, schemaName, `__index.json`)
  ).then(handleCompilation);
}
