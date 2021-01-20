/**
 * The next-transpile-modules cannot handle package.json files with an `exports`
 * field. One of the modules that need transpilation has this field and we'll
 * remove that manually with this script.
 * Removing the field doesn't seem to have any impact on other code.
 */

const fs = require('fs');
const path = require('path')

const packageFile = path.join(require.resolve('dequal'), '..', '..', 'package.json');
const packageJson = require(packageFile);

delete packageJson['exports']

fs.writeFileSync(packageFile, JSON.stringify(packageJson, null, 2))
