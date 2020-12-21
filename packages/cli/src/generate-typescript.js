"use strict";
/* eslint no-console: 0 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchemaNames = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const json_schema_to_typescript_1 = require("json-schema-to-typescript");
const create_validate_function_1 = require("./validator/create-validate-function");
const config_1 = require("./validator/config");
// The directory where the resulting data.d.ts file will be saved
const outputPath = path_1.default.join(__dirname, '..', // tools
'..', // packages
'app', 'src', 'types');
const bannerComment = "/* tslint:disable */\n/**\n* This file was automatically generated by json-schema-to-typescript.\n* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,\n* and run 'yarn generate-typescript' to regenerate this file.\n*/\n\n";
function getSchemaNames() {
    const contents = fs_1.default.readdirSync(config_1.schemaDirectory);
    return contents.filter((item) => fs_1.default.lstatSync(path_1.default.join(config_1.schemaDirectory, item)).isDirectory());
}
exports.getSchemaNames = getSchemaNames;
const schemaNames = getSchemaNames().filter((name) => name !== 'locale');
const promises = schemaNames.map(generateTypeScriptFromSchema);
Promise.all(promises).then((result) => {
    saveDefinitionsFile(result.join('\n'));
});
/**
 * Loads the given schema by name and generates typescript interfaces from it.
 *
 * @param schemaName the given schema name
 * @returns A Promise that will resolve to the generated typescript
 */
function generateTypeScriptFromSchema(schemaName) {
    // Sets the current working directory (cwd) to the schema directory, in order
    // for the typescript generator to properly resolve external references
    const generateOptions = {
        cwd: path_1.default.join(config_1.schemaDirectory, schemaName),
        ignoreMinAndMaxItems: true,
        bannerComment: '',
    };
    return create_validate_function_1.createValidateFunction(path_1.default.join(config_1.schemaDirectory, schemaName, `__index.json`)).then((validate) => {
        return json_schema_to_typescript_1.compile(validate.schema, schemaName, generateOptions).then((typeDefinitions) => {
            console.info(`Generated typescript definitions for schema '${schemaName}'`);
            return typeDefinitions;
        });
    });
}
function saveDefinitionsFile(typeDefinitions) {
    const outputFile = path_1.default.join(outputPath, 'data.d.ts');
    fs_1.default.writeFileSync(outputFile, `${bannerComment}${typeDefinitions}`, {
        encoding: 'utf8',
    });
    console.info(`Written typescript definitions output to file '${outputFile}'`);
}
