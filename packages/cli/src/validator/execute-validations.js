"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeValidations = void 0;
const ts_is_present_1 = require("ts-is-present");
/**
 *
 * This function execute the AJV schema validation along with the optional custom validations
 * described in the given schema info.
 * The validation result along with any possible error messages are returned.
 *
 */
function executeValidations(validateFunction, data, schemaInfo) {
    var _a;
    let isValid = validateFunction(data);
    let schemaErrors = (_a = validateFunction.errors) !== null && _a !== void 0 ? _a : [];
    if (schemaInfo.customValidations) {
        const errors = schemaInfo.customValidations
            .flatMap((validationFunc) => validationFunc(data))
            .filter(ts_is_present_1.isDefined);
        if (errors !== undefined) {
            schemaErrors = schemaErrors.concat(errors);
        }
        if (isValid) {
            isValid = !(errors === null || errors === void 0 ? void 0 : errors.length);
        }
    }
    return { isValid, schemaErrors };
}
exports.executeValidations = executeValidations;
