import { gmData, sortTimeSeriesInDataInPlace } from '@corona-dashboard/common';
import chalk from 'chalk';
import fs from 'fs';
import meow from 'meow';
import path from 'path';
import { schemaDirectory } from '../config';
import { SchemaInfo, SchemaInfoItem, createValidateFunction, executeValidations, getSchemaInfo } from '../schema';
import { JSONObject } from '../schema/custom-validations';

const cli = meow(
  `
    Usage
      $ validate-json-all <optional-json-path>

    Examples
      $ validate-json-all pages-tests/fixtures
`
);

const cliArgs = cli.input;

const customJsonPathArg = cliArgs[0];

const customJsonPath = customJsonPathArg ? path.join(__dirname, '..', '..', customJsonPathArg) : undefined;

const schemaInfo = getSchemaInfo(customJsonPath);

if (!customJsonPathArg) {
  if (schemaInfo.gm.files.length !== gmData.length) {
    console.error(chalk.bgRed.bold(`\n Expected ${gmData.length} municipal files, actually found ${schemaInfo.gm.files.length} \n`));
    process.exit(1);
  }
}

// The validations are asynchronous so this reducer gathers all the Promises in one array.
const promisedValidations = Object.keys(schemaInfo).map((schemaName) => validate(schemaName, schemaInfo[schemaName as keyof SchemaInfo]));

// Here the script waits for all the validations to finish, the result of each run is simply
// a true or false. So if the result array contains one or more false values, we
// throw an error. That way the script finishes with an error code which can be picked
// up by CI.
Promise.all(promisedValidations)
  .then((validationResults) => {
    const flatResult = validationResults.flat();

    if (flatResult.indexOf(false) > -1) {
      throw new Error('Validation errors occurred...');
    }

    console.info(chalk.bold.green('\n  All validations finished without errors!  \n'));
  })
  .catch((error) => {
    console.error(chalk.bgRed.bold(`\n  ${error}  \n`));
    process.exit(1);
  });

/**
 * This function creates a SchemaValidator instance for the given schema
 * and loops through the given list of JSON files and validates each.
 *
 * @param schemaName the given schema name
 * @param schemaInfo An object describing the files, path and custom validations for the given schema name
 * @returns An array of promises that will resolve either to true or false dependent on the validation result
 */
async function validate(schemaName: string, schemaInfo: SchemaInfoItem) {
  const validateFunction = await createValidateFunction('__index.json', path.join(schemaDirectory, schemaName));

  return schemaInfo.files.map((fileName) => {
    const jsonFilePath = path.join(schemaInfo.basePath, fileName);
    if (!fs.existsSync(jsonFilePath)) {
      if (schemaInfo.optional) {
        console.group();
        console.warn(chalk.bgBlue.bold(`  ${jsonFilePath} does not exist, but is optional, so no problem  \n`));
        console.groupEnd();
        return true;
      } else {
        console.group();
        console.error(chalk.bgRed.bold(`  ${jsonFilePath} does not exist  \n`));
        console.groupEnd();
        return false;
      }
    }
    const contentAsString = fs.readFileSync(jsonFilePath, {
      encoding: 'utf8',
    });

    try {
      const data: JSONObject = JSON.parse(contentAsString);
      sortTimeSeriesInDataInPlace(data);

      const { isValid, schemaErrors } = executeValidations(validateFunction, data, schemaInfo);

      if (!isValid) {
        console.group();
        console.error(schemaErrors);
        console.error(chalk.bgRed.bold(`  ${fileName} is invalid  \n`));
        console.groupEnd();
        return false;
      }
    } catch (e) {
      console.group();
      console.error(e);
      console.error(chalk.bgRed.bold(`  ${fileName} cannot be parsed  \n`));
      console.groupEnd();
      return false;
    }

    console.log(chalk.green.bold(`${fileName} is valid`));
    return true;
  });
}
