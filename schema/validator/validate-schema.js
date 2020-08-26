const fs = require('fs');
const path = require('path');
const SchemaValidator = require('./schemaValidator');

const jsonBasePath = '../../public/json/';

const safetyRegions = [];
for (let i = 1, ii = 26; i < ii; i++) {
  safetyRegions.push(`VR${i.toString().padStart(2, '0')}.json`);
}

const schemas = {
  national: ['NL.json'],
  ranges: ['RANGES.json'],
  regional: safetyRegions,
};

Object.keys(schemas).forEach((schemaName) => {
  validate(schemaName, schemas[schemaName]);
});

function validate(schemaName, fileNames) {
  const validatorInstance = new SchemaValidator(
    `../${schemaName}/${schemaName}.json`
  );

  fileNames.forEach((fileName) => {
    const contentAsString = fs.readFileSync(path.join(jsonBasePath, fileName), {
      encoding: 'utf8',
    });

    const data = JSON.parse(contentAsString);

    validatorInstance
      .init()
      .then((validate) => {
        const valid = validate(data);
        if (!valid) {
          console.error(validate.errors);
        } else {
          console.log(`${fileName} is valid`);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  });
}
