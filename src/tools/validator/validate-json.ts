/* eslint no-console: 0 */
import fs from 'fs';
import path from 'path';
import { createValidateFunction } from './create-validate-function';
import { jsonBasePath, localeBasePath } from './base-paths';
import { schemaDirectory } from './get-schema-names';
import chalk from 'chalk';
import { validPlaceholders } from './custom-validations/valid-placeholders';

type CustomValidationFunction = (input: any) => string[] | undefined;
type SchemaInfo = {
  files: string[];
  basePath: string;
  customValidations?: CustomValidationFunction[];
};

const localeJsons = fs.readdirSync(localeBasePath);
const allJsonFiles = fs.readdirSync(jsonBasePath).concat(localeJsons);

// This struct defines which JSON files should be validated with which schema.
const schemaToJsonLookup: Record<string, SchemaInfo> = {
  national: { files: ['NL.json'], basePath: jsonBasePath },
  ranges: { files: ['RANGES.json'], basePath: jsonBasePath },
  regional: {
    files: filterFilenames(allJsonFiles, new RegExp('^VR[0-9]+\\.json$')),
    basePath: jsonBasePath,
  },
  municipal: {
    files: filterFilenames(allJsonFiles, new RegExp('^GM[0-9]+\\.json$')),
    basePath: jsonBasePath,
  },
  municipalities: { files: ['MUNICIPALITIES.json'], basePath: jsonBasePath },
  regions: { files: ['REGIONS.json'], basePath: jsonBasePath },
  locale: {
    files: filterFilenames(localeJsons, new RegExp('[^\\.]+\\.json$')),
    basePath: localeBasePath,
    customValidations: [validPlaceholders],
  },
};

if (schemaToJsonLookup.regional.files.length !== 25) {
  console.error(
    chalk.bgRed.bold(
      `\n Expected 25 region files, actually found ${schemaToJsonLookup.regional.files.length} \n`
    )
  );
  process.exit(1);
}

if (schemaToJsonLookup.municipal.files.length !== 355) {
  console.error(
    chalk.bgRed.bold(
      `\n Expected 355 municipal files, actually found ${schemaToJsonLookup.municipal.files.length} \n`
    )
  );
  process.exit(1);
}

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
    const flatResult = validationResults.flatMap(
      (booleanResults) => booleanResults
    );

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

    const data = JSON.parse(contentAsString);

    let isValid = validateFunction(data);
    let schemaErrors: any[] = validateFunction.errors ?? [];
    if (schemaInfo.customValidations) {
      const errors = schemaInfo.customValidations
        .flatMap((validationFunc) => validationFunc(data))
        .filter(Boolean);

      if (errors !== undefined) {
        schemaErrors = schemaErrors.concat(errors);
      }

      if (isValid) {
        isValid = !errors?.length;
      }
    }
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

/**
 * Filters the given list of file names according to the given regular expression
 *
 * @param fileList The given list of file names
 * @param pattern The given regular expression
 */
function filterFilenames(fileList: string[], pattern: RegExp) {
  return fileList.filter((filename) => filename.match(pattern));
}
