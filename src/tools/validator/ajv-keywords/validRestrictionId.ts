import { RestrictionsValue } from '../../../types/data';

/**
 * This keyword checks whether a restriction id follows the formatting of <escalation-level>_<category-id>_<unique-number>
 */
export const validRestrictionId = {
  type: 'string',
  validate: function validateRestrictionId(
    schema: any,
    data: string,
    _parentSchema?: any,
    _dataPath?: string,
    _parentData?: any | any[],
    _parentDataProperty?: string | number,
    rootData?: any | any[]
  ): boolean {
    if (rootData) {
      const restriction = _parentData as RestrictionsValue;
      const identifierParts = data.split('_');

      let validated = identifierParts.length === 3;
      if (validated) {
        const suffix = identifierParts.pop() as string;

        const isPrefixValid =
          identifierParts.join('_') ===
          `${restriction.escalation_level}_${restriction.category_id}`;
        const isSuffixValid = !isNaN(+suffix);

        validated = isPrefixValid && isSuffixValid;
      }

      if (!validated) {
        (validateRestrictionId as any).errors = [
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
