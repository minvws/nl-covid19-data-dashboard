/**
 * This keyword checks whether a property of a sub property equals
 * that of the value of the root object.
 *
 * This is mainly used to check if 'vrcode' properties are equal to
 * their root object. Preventing regional data from one region to be
 * added to a different one.
 *
 */
export const equalsRootProperty = {
  type: 'string',
  validate: function validateRootPropertyEquality(
    schema: any,
    data: any,
    _parentSchema?: any,
    _dataPath?: string,
    _parentData?: any | any[],
    _parentDataProperty?: string | number,
    rootData?: any | any[]
  ): boolean {
    if (rootData) {
      const rootValue = (rootData as any)[schema as string];
      const validated = data === rootValue;
      if (!validated) {
        (validateRootPropertyEquality as any).errors = [
          {
            keyword: 'equalsRootProperty',
            message: `The property '${_dataPath}' value '${data}' must be equal to the root property '${schema}' value '${rootValue}'`,
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
