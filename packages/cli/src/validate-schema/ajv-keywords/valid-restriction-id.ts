/**
 * Copied from data.d.ts because otherwise the type generator depends on the
 * types that it generated earlier. This is a problem if you decide to delete
 * the typing file for example.
 */

interface RestrictionsValue {
  restriction_id: string;
  target_region: 'nl' | 'vr';
  escalation_level: number;
  category_id:
    | 'er_op_uit'
    | 'bezoek'
    | 'samenkomst'
    | 'huwelijk'
    | 'verpleeghuis'
    | 'horeca'
    | 'sport'
    | 'reizen_binnenland'
    | 'ov'
    | 'uitvaart'
    | 'onderwijs'
    | 'werk'
    | 'winkels'
    | 'alcohol';
  restriction_order: number;
}

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
      const prefix = data.substr(0, data.lastIndexOf('_'));
      const suffix = data.substr(data.lastIndexOf('_') + 1);

      const isPrefixValid =
        prefix === `${restriction.escalation_level}_${restriction.category_id}`;
      const isSuffixValid = !isNaN(+suffix);

      const validated = isPrefixValid && isSuffixValid;

      if (!validated) {
        (validateRestrictionId as any).errors = [
          {
            keyword: 'validRestrictionId',
            message: `The property '${_dataPath}' value '${data}' is not a correctly formatted restriction id. The correct format is <escalation-level>_<category-id>_<unique-number>`,
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
