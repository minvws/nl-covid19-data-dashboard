const fs = require('fs');
const path = require('path');
const SchemaValidator = require('./schemaValidator');

const jsonBasePath = path.join(__dirname, '../../public/json/');

const safetyRegions = [];
for (let i = 1, ii = 26; i < ii; i++) {
  safetyRegions.push(`VR${i.toString().padStart(2, '0')}.json`);
}

const schemas = {
  national: ['NL.json'],
  ranges: ['RANGES.json'],
  regional: safetyRegions,
  municipal: ['GM0014.json'],
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
    // eslint-disable-next-line
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
          // eslint-disable-next-line
          console.log('');
          // eslint-disable-next-line
          console.error(validate.errors);
          throw new Error(`${fileName} is invalid`);
        }
        // eslint-disable-next-line
        console.log(`${fileName} is valid`);
        return true;
      })
      .catch((e) => {
        // eslint-disable-next-line
        console.error(e.message);
        // eslint-disable-next-line
        console.log('');
        return false;
      });
  });
}
