/* eslint no-console: 0 */
const fs = require('fs');
const path = require('path');
const SchemaValidator = require('./schemaValidator');
const jsonBasePath = require('./jsonBasePath');

const allJsonFiles = fs.readdirSync(jsonBasePath);

// This struct defines which JSON files should be validated with which schema
const schemaToJsonLookup = {
  national: ['NL.json'],
  ranges: ['RANGES.json'],
  regional: filterFilenames(allJsonFiles, new RegExp('^VR[0-9]+\\.json$')),
  municipal: filterFilenames(allJsonFiles, new RegExp('^GM[0-9]+\\.json$')),
  municipalities: ['municipalities.json'],
  regions: ['regions.json'],
};

// The validations are asynchronous so this reducer gathers all the Promises in one array.
const results = Object.keys(schemaToJsonLookup).reduce((aggr, schemaName) => {
  const promises = validate(schemaName, schemaToJsonLookup[schemaName]);
  aggr.push(...promises);
  return aggr;
}, []);

// Here the script waits for all the validations to finish, the result of each run is simply
// a true or false. So if the result array contains one or more false values, we
// throw an error. That way the script finishes with an error code which can be picked
// up by CI.
Promise.all(results)
  .then((validationResults) => {
    if (validationResults.indexOf(false) > -1) {
      throw new Error('Validation errors occured...');
    }
    console.info('Validation finished...');
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

/** This function creates a SchemaValidator instance for the given schema
 * and loops through the given list of JSON files and validates each.
 * @param {string} schemaName the given schema name
 * @param {array} fileNames An array of json file names
 * @returns An array of promises that will resolve either to true or false dependent on the validation result
 */
function validate(schemaName, fileNames) {
  const validatorInstance = new SchemaValidator(
    path.join(__dirname, '..', schemaName, `${schemaName}.json`)
  );

  return fileNames.map((fileName) => {
    const contentAsString = fs.readFileSync(path.join(jsonBasePath, fileName), {
      encoding: 'utf8',
    });

    const data = JSON.parse(contentAsString);

    return validatorInstance
      .init()
      .then((validate) => {
        const valid = validate(data);
        if (!valid) {
          console.log('');
          console.error(validate.errors);
          throw new Error(`${fileName} is invalid`);
        }
        console.log(`${fileName} is valid`);
        return true;
      })
      .catch((e) => {
        console.error(e.message);
        console.log('');
        return false;
      });
  });
}

/**
 * Filters the given list of file names according to the given regular expression
 * @param {array} fileList The given list of file names
 * @param {RegExp} pattern The given reular expression
 */
function filterFilenames(fileList, pattern) {
  return fileList.filter((filename) => filename.match(pattern));
}
