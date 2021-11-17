import { isDefined } from 'ts-is-present';
import { Rule } from '~/sanity';
import { KpiIconInput } from '../../components/portable-text/kpi-configuration/kpi-icon-input';
import { METRIC_DATA_FIELDS } from '../fields/metric-data-fields';

export const donutChartConfiguration = {
  title: 'Donut Grafiek configuratie',
  name: 'donutChartConfiguration',
  type: 'document',
  fieldsets: [
    {
      title: 'Metriek configuratie',
      name: 'configuration',
      options: {
        collapsible: true,
        collapsed: false,
      },
    },
  ],
  fields: [
    {
      title: 'Titel',
      name: 'title',
      type: 'string',
      validation: (rule: Rule) => rule.required(),
    },
    {
      title: 'Icoon',
      name: 'icon',
      type: 'string',
      inputComponent: KpiIconInput,
      validation: (rule: Rule) => rule.required(),
    },
    ...METRIC_DATA_FIELDS,
    {
      title: 'Metriek waardes',
      name: 'metricProperties',
      type: 'array',
      of: [{ type: 'donutMetricPropertyConfig' }],
      validation: (rule: Rule) => rule.min(1),
      fieldset: 'configuration',
      hidden: ({ parent }: { parent: any }) => !isDefined(parent?.metricName),
    },
  ],
};
