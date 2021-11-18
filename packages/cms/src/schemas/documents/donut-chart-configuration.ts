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
    {
      title: 'Layout configuratie',
      name: 'layoutConfiguration',
      options: {
        collapsible: true,
        collapsed: true,
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
      title: 'Label key',
      name: 'labelKey',
      type: 'string',
      validation: (rule: Rule) => rule.required(),
    },
    {
      title: 'Source key',
      name: 'sourceKey',
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
    {
      title: 'Vertical layout',
      name: 'verticalLayout',
      type: 'boolean',
      fieldset: 'layoutConfiguration',
    },
    {
      title: 'Padding left',
      name: 'paddingLeft',
      type: 'number',
      fieldset: 'layoutConfiguration',
    },
    {
      title: 'Inner size',
      name: 'innerSize',
      type: 'number',
      fieldset: 'layoutConfiguration',
    },
    {
      title: 'Donut width',
      name: 'donutWidth',
      type: 'number',
      fieldset: 'layoutConfiguration',
    },
    {
      title: 'Pad angle',
      name: 'padAngle',
      type: 'number',
      fieldset: 'layoutConfiguration',
    },
    {
      title: 'Minimum percentage',
      name: 'minimumPercentage',
      type: 'number',
      fieldset: 'layoutConfiguration',
    },
  ],
};
