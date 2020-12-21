"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchemaInformation = void 0;
const fs_1 = __importDefault(require("fs"));
const config_1 = require("./config");
const validate_placeholders_1 = require("./custom-validations/validate-placeholders");
function getSchemaInformation(customJsonPath) {
    const jsonPath = customJsonPath !== null && customJsonPath !== void 0 ? customJsonPath : config_1.jsonDirectory;
    const localeJsons = fs_1.default.readdirSync(config_1.localeDirectory);
    const dataJsons = fs_1.default.existsSync(jsonPath)
        ? fs_1.default.readdirSync(jsonPath).concat(localeJsons)
        : localeJsons;
    // This object defines which JSON files should be validated with which schema.
    const schemaInformation = {
        national: { files: ['NL.json'], basePath: jsonPath },
        regional: {
            files: filterFilenames(dataJsons, /^VR[0-9]+.json$/),
            basePath: jsonPath,
        },
        municipal: {
            files: filterFilenames(dataJsons, /^GM[0-9]+.json$/),
            basePath: jsonPath,
        },
        municipalities: { files: ['MUNICIPALITIES.json'], basePath: jsonPath },
        regions: { files: ['REGIONS.json'], basePath: jsonPath },
        locale: {
            files: filterFilenames(localeJsons, /[^.]+.json$/),
            basePath: config_1.localeDirectory,
            customValidations: [validate_placeholders_1.validatePlaceholders],
        },
    };
    return schemaInformation;
}
exports.getSchemaInformation = getSchemaInformation;
/**
 * Filters the given list of file names according to the given regular expression
 *
 * @param fileList The given list of file names
 * @param pattern The given regular expression
 */
function filterFilenames(fileList, pattern) {
    return fileList.filter((filename) => filename.match(pattern));
}
