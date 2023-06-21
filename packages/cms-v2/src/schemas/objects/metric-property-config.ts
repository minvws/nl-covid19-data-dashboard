import { isDefined } from 'ts-is-present';
import { Rule } from '~/sanity';
import { ChartColorInput } from '../../components/portable-text/chart-configuration/chart-color-input';
import { LineStyleInput } from '../../components/portable-text/chart-configuration/line-style-input';
import { LineTypeSelectInput } from '../../components/portable-text/chart-configuration/line-type-select-input';
import { MetricPropertySelectInput } from '../../components/portable-text/shared/metric-property-select-input';

export const metricPropertyConfig = {
  title: 'Dashboard Grafiek Metriek Waarde',
  name: 'metricPropertyConfig',
  type: 'object',
  fields: [
    {
      name: 'propertyName',
      type: 'string',
      title: 'Metriek waarde',
      inputComponent: MetricPropertySelectInput,
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'labelKey',
      type: 'string',
      title: 'Label key',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'shortLabelKey',
      type: 'string',
      title: 'Short label key',
    },
    {
      name: 'type',
      type: 'string',
      title: 'Lijn type',
      inputComponent: LineTypeSelectInput,
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'color',
      type: 'string',
      title: 'Kleur',
      inputComponent: ChartColorInput,
      validation: (rule: Rule) => rule.required(),
      hidden: ({ parent }: { parent: any }) => !isDefined(parent?.type) || parent?.type === 'invisible',
    },
    {
      name: 'curve',
      type: 'string',
      title: 'Lijn stijl',
      inputComponent: LineStyleInput,
      hidden: ({ parent }: { parent: any }) => parent?.type !== 'line' && parent?.type !== 'gapped-line',
      validation: (rule: Rule) =>
        rule.custom((value: any, context: any) => {
          if (context?.parent?.type === 'line' || context?.parent?.type === 'gapped-line') {
            if (!value?.length) {
              return 'Lijn stijl is required';
            }
          }
          return true;
        }),
    },
    {
      name: 'fillOpacity',
      type: 'number',
      title: 'Fill opacity',
      validation: (rule: Rule) => rule.min(0).max(1),
      hidden: ({ parent }: { parent: any }) => !isDefined(parent?.type) || parent?.type === 'invisible',
    },
    {
      name: 'strokeWidth',
      type: 'number',
      title: 'Stroke width',
      validation: (rule: Rule) => rule.min(0).max(50),
      hidden: ({ parent }: { parent: any }) => !isDefined(parent?.type) || parent?.type === 'invisible',
    },
  ],
};
