import { isDefined } from 'ts-is-present';
import { Rule } from '~/sanity';
import { AreaSelectInput } from '../../components/portable-text/shared/area-select-input';
import { CodeSelectInput } from '../../components/portable-text/shared/code-select-input';
import { MetricSelectInput } from '../../components/portable-text/shared/metric-select-input';

export const METRIC_DATA_FIELDS = [
  {
    title: 'Gebied',
    name: 'area',
    type: 'string',
    inputComponent: AreaSelectInput,
    validation: (rule: Rule) => rule.required(),
    fieldset: 'configuration',
  },
  {
    title: 'Gemeente / regio',
    name: 'code',
    type: 'string',
    inputComponent: CodeSelectInput,
    validation: (rule: Rule) =>
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
  },
  {
    title: 'Metriek Naam',
    name: 'metricName',
    type: 'string',
    inputComponent: MetricSelectInput,
    validation: (rule: Rule) => rule.required(),
    hidden: ({ parent }: { parent: any }) => !isDefined(parent?.area),
    fieldset: 'configuration',
  },
];
