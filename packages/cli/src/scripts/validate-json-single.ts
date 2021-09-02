import { sortTimeSeriesInDataInPlace } from '@corona-dashboard/common';
import fs from 'fs';
import meow from 'meow';
import path from 'path';
import { isDefined } from 'ts-is-present';
import { schemaDirectory } from '../config';
import {
  createValidateFunction,
  executeValidations,
  getSchemaInfo,
  loadRootSchema,
  SchemaInfo,
} from '../schema';
import { JSONObject } from '../schema/custom-validations';
import { logError, logSuccess } from '../utils';

/**
 * When a single metric name is specified to be validated, we first load the associated schema.
 * Then we set the specified metricName as the sole required property, set additionalProperties to true
 * and remove all of the other property definitions.
 *
 * This way only the specified metric will be processed and all the rest of the data file will be ignored.
 *
 */
function loadStrippedSchema(metricName: string, basePath: string) {
  const strippedSchema = loadRootSchema(
    path.join(basePath, `__index.json`),
    true
  );

  if (!isDefined(strippedSchema.properties[metricName])) {
    logError(
      `  ${metricName} is not a metric in the specified schema '${schemaName}'  \n`
    );
    process.exit(1);
  }

  strippedSchema.required = [metricName];
  strippedSchema.properties = {
    [metricName]: { ...strippedSchema.properties[metricName] },
  };
  strippedSchema.additionalProperties = true;

  return strippedSchema;
}

const schemaInformation = getSchemaInfo();

const validSchemaNames = Object.keys(schemaInformation);

const cli = meow(
  `
    Usage
      $ validate-json-single <schema-name> <json-path> <optional-metric-name>

    Examples
      $ validate-json-single nl NL.json vaccine_coverage
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

${cli.help}
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

const schemaBasePath = path.join(schemaDirectory, schemaName);
let rootSchema = metricName
  ? loadStrippedSchema(metricName, schemaBasePath)
  : '__index.json';

createValidateFunction(rootSchema, schemaBasePath, true).then(
  (validateFunction) => {
    const fileName = path.join(jsonBasePath, jsonFileName);
    const schemaInfo = schemaInformation[schemaName];

    const contentAsString = fs.readFileSync(fileName, {
      encoding: 'utf8',
    });

    try {
      const jsonData: JSONObject = JSON.parse(contentAsString);

      sortTimeSeriesInDataInPlace(jsonData);

      const { isValid, schemaErrors } = executeValidations(
        validateFunction,
        jsonData,
        schemaInfo
      );

      if (!isValid) {
        console.error(schemaErrors);
        logError(`  ${jsonFileName} is invalid  \n`);
        process.exit(1);
      }
    } catch (e) {
      console.group();
      console.error(e);
      logError(`  ${fileName} cannot be parsed  \n`);
      console.groupEnd();
      process.exit(1);
    }

    logSuccess(`  ${jsonFileName} is valid  \n`);
  }
);
