/* eslint no-console: 0 */
const fs = require('fs');
const path = require('path');
const SchemaValidator = require('./schemaValidator');

const jsonBasePath = path.join(__dirname, '../../public/json/');
const allJsonFiles = fs.readdirSync(jsonBasePath);

const schemas = {
  national: ['NL.json'],
  ranges: ['RANGES.json'],
  regional: filterFilenames(allJsonFiles, new RegExp('^VR[0-9]+\\.json$')),
  municipal: filterFilenames(allJsonFiles, new RegExp('^GM[0-9]+\\.json$')),
};

const results = Object.keys(schemas).reduce((aggr, schemaName) => {
  const promises = validate(schemaName, schemas[schemaName]);
  aggr.push(...promises);
  return aggr;
}, []);

Promise.all(results)
  .then((validationResults) => {
    if (validationResults.indexOf(false) > -1) {
      throw new Error('Validation errors occured...');
    }
    console.info('Validation finished...');
  })
  .catch((error) => {
    console.error(error);
  });

function validate(schemaName, fileNames) {
  const validatorInstance = new SchemaValidator(
    path.join(__dirname, `../${schemaName}/${schemaName}.json`)
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

function filterFilenames(fileList, pattern) {
  return fileList.filter((filename) => filename.match(pattern));
}
