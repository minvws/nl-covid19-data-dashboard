import type { FuncKeywordDefinition } from 'ajv';

const loggedProperties = new Set<string>();

export const logAdditionalProperties: FuncKeywordDefinition = {
  keyword: 'logAdditionalProperties',
  errors: false,
  type: ['object'],
  schemaType: 'boolean',
  validate: function validateLogAdditionalProperties(schema: any, data: any, parentSchema?: any, _parentDataProperty?: string | number, _rootData?: any | any[]) {
    if (schema !== true) {
      // This keyword doesn't apply when the schema value is not `true`
      return true;
    }

    // Gather all properties that are defined in the schema
    const definedProperties = new Set(Object.keys(parentSchema.properties || {}));

    // Gather all properties that are present in the data
    const dataProperties = new Set(Object.keys(data));

    // Look for additional properties
    for (const property of dataProperties) {
      if (!definedProperties.has(property) && !loggedProperties.has(property)) {
        loggedProperties.add(property);
        console.log(`Additional property found: "${property}"`);
      }
    }

    // Always return `true` to not invalidate the data
    return true;
  },
};
