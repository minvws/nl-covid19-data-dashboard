const fs = require('fs');
const SchemaValidator = require('./schemaValidator');

const validatorInstance = new SchemaValidator('../national/national.json');

const raw = fs.readFileSync('../../public/json/NL.json', { encoding: 'utf8' });
const data = JSON.parse(raw);

validatorInstance
  .init()
  .then((validate) => {
    const valid = validate(data);
    if (!valid) console.log(validate.errors);
  })
  .catch((e) => {
    console.error(e);
  });
