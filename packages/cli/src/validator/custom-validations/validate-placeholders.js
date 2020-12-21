"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePlaceholders = void 0;
const ts_is_present_1 = require("ts-is-present");
/**
 * This validation function loops recursively through all of the properties in the given input object
 * and for all string values extracts and validates any existing placeholders.
 *
 * A valid placeholder is considered to look like this ``{{placeholderName}}``. So this validator looks
 * for mistakes such as ``{placeHolderName}}`` or ``{{placeHolderName}}}``, for example.
 *
 * When such an occurrence is found an error message is generated indicating in which property
 * the error occurred along with the offending placeholder.
 *
 */
const validatePlaceholders = (input, parentName) => {
    const parentSuffix = parentName ? `${parentName}.` : '';
    const result = Object.entries(input)
        .flatMap(([propertyName, value]) => {
        if (typeof value === 'string') {
            const result = validate(value);
            if (result.length) {
                return result.map((placeholder) => `Invalid placeholder '${placeholder}' found in ${parentSuffix}${propertyName}`);
            }
            return;
        }
        if (typeof value === 'object') {
            return exports.validatePlaceholders(value, `${parentSuffix}${propertyName}`);
        }
    })
        .filter(ts_is_present_1.isDefined);
    return result.length ? result : undefined;
};
exports.validatePlaceholders = validatePlaceholders;
function validate(text) {
    const matches = [...text.matchAll(/{+[^}]+}+/g)];
    return matches
        .map((matchInfo) => {
        const match = matchInfo[0].match(/{{2}[^{}]+}{2}/);
        if (!match || match[0] !== matchInfo[0]) {
            return matchInfo[0];
        }
        return undefined;
    })
        .filter(ts_is_present_1.isDefined);
}
