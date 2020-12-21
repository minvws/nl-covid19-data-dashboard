"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint no-console: 0 */
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const meow_1 = __importDefault(require("meow"));
const path_1 = __importDefault(require("path"));
const create_validate_function_1 = require("./create-validate-function");
const execute_validations_1 = require("./execute-validations");
const config_1 = require("./config");
const schema_information_1 = require("./schema-information");
const schemaInformation = schema_information_1.getSchemaInformation();
const validSchemaNames = Object.keys(schemaInformation);
const cli = meow_1.default(`
    Usage
      $ validate-single <schema-name> <json-path>

    Examples
      $ validate-single national nl.json
`);
const cliArgs = cli.input;
if (cliArgs.length !== 2) {
    console.error(`
Expected two commandline arguments: schema-name and json-filename.

Where schema-name must be one of these values: ${validSchemaNames.join(', ')}
and json-filename must be a file associated with that schema.

`);
    process.exit(1);
}
const schemaName = cliArgs[0];
const jsonFileName = cliArgs[1];
if (!validSchemaNames.includes(schemaName)) {
    console.error(`Invalid schema name argument '${schemaName}', must be one of the following values: ${validSchemaNames.join(', ')}.`);
    process.exit(1);
}
const basePath = schemaInformation[schemaName].basePath;
if (!schemaInformation[schemaName].files.includes(jsonFileName)) {
    console.error(`Invalid json filename argument '${jsonFileName}', this file is not associated with the '${schemaName}' schema.`);
    process.exit(1);
}
if (!fs_1.default.existsSync(path_1.default.join(basePath, jsonFileName))) {
    console.error(`Invalid json filename argument '${jsonFileName}', file does not exist in directory ${basePath}.`);
    process.exit(1);
}
create_validate_function_1.createValidateFunction(path_1.default.join(config_1.schemaDirectory, schemaName, `__index.json`)).then((validateFunction) => {
    const fileName = path_1.default.join(basePath, jsonFileName);
    const schemaInfo = schemaInformation[schemaName];
    const contentAsString = fs_1.default.readFileSync(fileName, {
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
        process.exit(1);
    }
    const { isValid, schemaErrors } = execute_validations_1.executeValidations(validateFunction, data, schemaInfo);
    if (!isValid) {
        console.error(schemaErrors);
        console.error(chalk_1.default.bgRed.bold(`  ${jsonFileName} is invalid  \n`));
        process.exit(1);
    }
    console.log(chalk_1.default.green.bold(`  ${jsonFileName} is valid  \n`));
});
