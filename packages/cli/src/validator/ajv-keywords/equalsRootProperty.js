"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.equalsRootProperty = void 0;
/**
 * This keyword checks whether a property of a sub property equals
 * that of the value of the root object.
 *
 * This is mainly used to check if 'vrcode' properties are equal to
 * their root object. Preventing regional data from one region to be
 * added to a different one.
 *
 */
exports.equalsRootProperty = {
    type: 'string',
    validate: function validateRootPropertyEquality(schema, data, _parentSchema, _dataPath, _parentData, _parentDataProperty, rootData) {
        if (rootData) {
            const rootValue = rootData[schema];
            const validated = data === rootValue;
            if (!validated) {
                validateRootPropertyEquality.errors = [
                    {
                        keyword: 'equalsRootProperty',
                        message: `the property '${_dataPath}' value '${data}' must be equal to the root property '${schema}' value '${rootValue}'`,
                        params: {
                            keyword: 'equalsRootProperty',
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
