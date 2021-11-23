import { Rule } from '~/sanity';
import { ChartColorInput } from '../../components/portable-text/chart-configuration/chart-color-input';
import { MetricPropertySelectInput } from '../../components/portable-text/shared/metric-property-select-input';

export const donutMetricPropertyConfig = {
  title: 'Dashboard Donut Metriek Waarde',
  name: 'donutMetricPropertyConfig',
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
      name: 'color',
      type: 'string',
      title: 'Kleur',
      inputComponent: ChartColorInput,
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'labelKey',
      type: 'string',
      title: 'Label key',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'tooltipLabelKey',
      type: 'string',
      title: 'Tooltip Label key',
      validation: (rule: Rule) => rule.required(),
    },
  ],
};
