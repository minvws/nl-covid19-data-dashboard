/* eslint no-console: 0 */
import fs from 'fs';
import path from 'path';
import { createValidateFunction } from './createValidateFunction';
import { jsonBasePath } from './jsonBasePath';
import { schemaDirectory } from './getSchemaNames';
import chalk from 'chalk';

const allJsonFiles = fs.readdirSync(jsonBasePath);

// This struct defines which JSON files should be validated with which schema
const schemaToJsonLookup: Record<string, string[]> = {
  national: ['NL.json'],
  ranges: ['RANGES.json'],
  regional: filterFilenames(allJsonFiles, new RegExp('^VR[0-9]+\\.json$')),
  municipal: filterFilenames(allJsonFiles, new RegExp('^GM[0-9]+\\.json$')),
  municipalities: ['MUNICIPALITIES.json'],
  regions: ['REGIONS.json'],
};

// The validations are asynchronous so this reducer gathers all the Promises in one array.
const validationPromises = Object.keys(schemaToJsonLookup).map<
  Promise<boolean[]>
>((schemaName) => validate(schemaName, schemaToJsonLookup[schemaName]));

// Here the script waits for all the validations to finish, the result of each run is simply
// a true or false. So if the result array contains one or more false values, we
// throw an error. That way the script finishes with an error code which can be picked
// up by CI.
Promise.all(validationPromises)
  .then((validationResults) => {
    const flatResult = validationResults.flatMap((bools) => bools);
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

/** This function creates a SchemaValidator instance for the given schema
 * and loops through the given list of JSON files and validates each.
 *
 * @param schemaName the given schema name
 * @param fileNames An array of json file names
 * @returns An array of promises that will resolve either to true or false dependent on the validation result
 */
async function validate(schemaName: string, fileNames: string[]) {
  const validateFunction = await createValidateFunction(
    path.join(schemaDirectory, schemaName, `__index.json`)
  );

  return fileNames.map((fileName) => {
    const contentAsString = fs.readFileSync(path.join(jsonBasePath, fileName), {
      encoding: 'utf8',
    });

    const data = JSON.parse(contentAsString);

    const isValid = validateFunction(data);
    if (!isValid) {
      console.group();
      console.error(validateFunction.errors);
      console.error(chalk.bgRed.bold(`  ${fileName} is invalid  \n`));
      console.groupEnd();
      return false;
    }
    console.log(chalk.green.bold(`${fileName} is valid`));
    return true;
  });
}

/**
 * Filters the given list of file names according to the given regular expression
 *
 * @param fileList The given list of file names
 * @param pattern The given regular expression
 */
function filterFilenames(fileList: string[], pattern: RegExp) {
  return fileList.filter((filename) => filename.match(pattern));
}
