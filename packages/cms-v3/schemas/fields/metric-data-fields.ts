import { isDefined } from 'ts-is-present';
// TODO: fix these imports, see corresponding inputComponents in fields below
// import { AreaSelectInput } from '../../components/portable-text/shared/area-select-input';
// import { CodeSelectInput } from '../../components/portable-text/shared/code-select-input';
// import { MetricSelectInput } from '../../components/portable-text/shared/metric-select-input';
import { StringRule, defineField } from 'sanity';

export const metricDataFields = [
  defineField({
    title: 'Gebied',
    name: 'area',
    type: 'string',
    // inputComponent: AreaSelectInput,
    validation: (rule: StringRule) => rule.required(),
    fieldset: 'configuration',
  }),
  defineField({
    title: 'Gemeente / regio',
    name: 'code',
    type: 'string',
    // inputComponent: CodeSelectInput,
    validation: (rule: StringRule) =>
      rule.custom((value: string | undefined, context: any) => {
        const { parent } = context;
        if (parent?.area === 'gm' || parent?.area === 'vr') {
          if (!value?.length) {
            return parent?.area === 'gm' ? 'Gemeente is verplicht' : 'Veiligheidsregio is verplicht';
          }
        }
        return true;
      }),
    hidden: ({ parent }: { parent: any }) => parent?.area !== 'gm' && parent?.area !== 'vr',
    fieldset: 'configuration',
  }),
  defineField({
    title: 'Metriek Naam',
    name: 'metricName',
    type: 'string',
    // inputComponent: MetricSelectInput,
    validation: (rule: StringRule) => rule.required(),
    hidden: ({ parent }: { parent: any }) => !isDefined(parent?.area),
    fieldset: 'configuration',
  }),
];
