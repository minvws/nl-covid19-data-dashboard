"use strict";
/* eslint no-console: 0 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const meow_1 = __importDefault(require("meow"));
const path_1 = __importDefault(require("path"));
const create_validate_function_1 = require("./create-validate-function");
const execute_validations_1 = require("./execute-validations");
const config_1 = require("./config");
const schema_information_1 = require("./schema-information");
const cli = meow_1.default(`
    Usage
      $ validate-json <optional-json-path>

    Examples
      $ validate-json pages-tests/fixtures
`);
const cliArgs = cli.input;
const customJsonPathArg = cliArgs[0];
const customJsonPath = customJsonPathArg
    ? path_1.default.join(__dirname, '..', '..', customJsonPathArg)
    : undefined;
const schemaInformation = schema_information_1.getSchemaInformation(customJsonPath);
if (!customJsonPathArg) {
    if (schemaInformation.regional.files.length !== 25) {
        console.error(chalk_1.default.bgRed.bold(`\n Expected 25 region files, actually found ${schemaInformation.regional.files.length} \n`));
        process.exit(1);
    }
    if (schemaInformation.municipal.files.length !== 355) {
        console.error(chalk_1.default.bgRed.bold(`\n Expected 355 municipal files, actually found ${schemaInformation.municipal.files.length} \n`));
        process.exit(1);
    }
}
// The validations are asynchronous so this reducer gathers all the Promises in one array.
const validationPromises = Object.keys(schemaInformation).map((schemaName) => validate(schemaName, schemaInformation[schemaName]));
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
    console.info(chalk_1.default.bold.green('\n  All validations finished without errors!  \n'));
})
    .catch((error) => {
    console.error(chalk_1.default.bgRed.bold(`\n  ${error}  \n`));
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
async function validate(schemaName, schemaInfo) {
    const validateFunction = await create_validate_function_1.createValidateFunction(path_1.default.join(config_1.schemaDirectory, schemaName, `__index.json`));
    return schemaInfo.files.map((fileName) => {
        const jsonFilePath = path_1.default.join(schemaInfo.basePath, fileName);
        if (!fs_1.default.existsSync(jsonFilePath)) {
            if (schemaInfo.optional) {
                console.group();
                console.warn(chalk_1.default.bgBlue.bold(`  ${jsonFilePath} does not exist, but is optional, so no problem  \n`));
                console.groupEnd();
                return true;
            }
            else {
                console.group();
                console.error(chalk_1.default.bgRed.bold(`  ${jsonFilePath} does not exist  \n`));
                console.groupEnd();
                return false;
            }
        }
        const contentAsString = fs_1.default.readFileSync(jsonFilePath, {
            encoding: 'utf8',
        });
        let data = null;
        try {
            data = JSON.parse(contentAsString);
        }
        catch (e) {
            console.group();
            console.error(chalk_1.default.bgRed.bold(`  ${fileName} cannot be parsed  \n`));
            console.groupEnd();
            return false;
        }
        const { isValid, schemaErrors } = execute_validations_1.executeValidations(validateFunction, data, schemaInfo);
        if (!isValid) {
            console.group();
            console.error(schemaErrors);
            console.error(chalk_1.default.bgRed.bold(`  ${fileName} is invalid  \n`));
            console.groupEnd();
            return false;
        }
        console.log(chalk_1.default.green.bold(`${fileName} is valid`));
        return true;
    });
}
