"use strict";
/**
 * Copied from data.d.ts because otherwise the type generator depends on the
 * types that it generated earlier. This is a problem if you decide to delete
 * the typing file for example.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validRestrictionId = void 0;
/**
 * This keyword checks whether a restriction id follows the formatting of <escalation-level>_<category-id>_<unique-number>
 */
exports.validRestrictionId = {
    type: 'string',
    validate: function validateRestrictionId(schema, data, _parentSchema, _dataPath, _parentData, _parentDataProperty, rootData) {
        if (rootData) {
            const restriction = _parentData;
            const prefix = data.substr(0, data.lastIndexOf('_'));
            const suffix = data.substr(data.lastIndexOf('_') + 1);
            const isPrefixValid = prefix === `${restriction.escalation_level}_${restriction.category_id}`;
            const isSuffixValid = !isNaN(+suffix);
            const validated = isPrefixValid && isSuffixValid;
            if (!validated) {
                validateRestrictionId.errors = [
                    {
                        keyword: 'validRestrictionId',
                        message: `the property '${_dataPath}' value '${data}' is not a correctly formatted restriction id. The correct format is <escalation-level>_<category-id>_<unique-number>`,
                        params: {
                            keyword: 'validRestrictionId',
                            value: schema,
                        },
                    },
                ];
            }
            return validated;
        }
        return true;
    },
    errors: true,
};
