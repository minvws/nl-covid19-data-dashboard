const path = require('path');
const fs = require('fs');

function getSchemaNames() {
  const directoryPath = path.join(__dirname, '../');
  const contents = fs.readdirSync(directoryPath);
  return contents.filter((item) => item !== 'validator');
}

module.exports = getSchemaNames;
