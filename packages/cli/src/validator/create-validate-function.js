"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createValidateFunction = void 0;
const ajv_1 = __importDefault(require("ajv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const equalsRootProperty_1 = require("./ajv-keywords/equalsRootProperty");
const validRestrictionId_1 = require("./ajv-keywords/validRestrictionId");
/**
 * Loads the given uri and parses its contents to JSON
 * @param basePath The given base directory name
 * @param uri The given filename
 */
function loadSchema(basePath, uri) {
    return fs_1.default.promises
        .readFile(path_1.default.join(basePath, uri), {
        encoding: 'utf8',
    })
        .then((data) => JSON.parse(data));
}
/**
 * Creates an Ajv ValidateFunction for the given schema
 *
 * @returns A Promise object that will resolve to a ValidateFunction.
 */
function createValidateFunction(schemaPath) {
    const basePath = path_1.default.dirname(schemaPath);
    const schema = JSON.parse(fs_1.default.readFileSync(schemaPath, {
        encoding: 'utf8',
    }));
    const validator = new ajv_1.default({
        loadSchema: loadSchema.bind(null, basePath),
        $data: true,
        allErrors: true,
    });
    validator
        .addKeyword('equalsRootProperty', equalsRootProperty_1.equalsRootProperty)
        .addKeyword('validRestrictionId', validRestrictionId_1.validRestrictionId);
    return validator.compileAsync(schema).then((validate) => {
        return validate;
    });
}
exports.createValidateFunction = createValidateFunction;
