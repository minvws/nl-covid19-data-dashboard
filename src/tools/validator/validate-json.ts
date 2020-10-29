/* eslint no-console: 0 */
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

import { createValidateFunction } from './create-validate-function';
import { schemaDirectory } from './get-schema-names';
import { SchemaInfo, schemaInformation } from './schema-information';
import { executeValidations } from './execute-validations';

if (schemaInformation.regional.files.length !== 25) {
  console.error(
    chalk.bgRed.bold(
      `\n Expected 25 region files, actually found ${schemaInformation.regional.files.length} \n`
    )
  );
  process.exit(1);
}

if (schemaInformation.municipal.files.length !== 355) {
  console.error(
    chalk.bgRed.bold(
      `\n Expected 355 municipal files, actually found ${schemaInformation.municipal.files.length} \n`
    )
  );
  process.exit(1);
}

// The validations are asynchronous so this reducer gathers all the Promises in one array.
const validationPromises = Object.keys(schemaInformation).map<
  Promise<boolean[]>
>((schemaName) => validate(schemaName, schemaInformation[schemaName]));

// Here the script waits for all the validations to finish, the result of each run is simply
// a true or false. So if the result array contains one or more false values, we
// throw an error. That way the script finishes with an error code which can be picked
// up by CI.
Promise.all(validationPromises)
  .then((validationResults) => {
    const flatResult = validationResults.flat();

    if (flatResult.indexOf(false) > -1) {
      throw new Error('Validation errors occurred...');
    }

    console.info(
      chalk.bold.green('\n  All validations finished without errors!  \n')
    );
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
async function validate(schemaName: string, schemaInfo: SchemaInfo) {
  const validateFunction = await createValidateFunction(
    path.join(schemaDirectory, schemaName, `__index.json`)
  );

  return schemaInfo.files.map((fileName) => {
    const contentAsString = fs.readFileSync(
      path.join(schemaInfo.basePath, fileName),
      {
        encoding: 'utf8',
      }
    );

    let data: any = null;
    try {
      data = JSON.parse(contentAsString);
    } catch (e) {
      console.group();
      console.error(chalk.bgRed.bold(`  ${fileName} cannot be parsed  \n`));
      console.groupEnd();
      return false;
    }

    const { isValid, schemaErrors } = executeValidations(
      validateFunction,
      data,
      schemaInfo
    );

    if (!isValid) {
      console.group();
      console.error(schemaErrors);
      console.error(chalk.bgRed.bold(`  ${fileName} is invalid  \n`));
      console.groupEnd();
      return false;
    }

    console.log(chalk.green.bold(`${fileName} is valid`));
    return true;
  });
}
