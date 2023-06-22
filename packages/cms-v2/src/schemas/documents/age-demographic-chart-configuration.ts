import { isDefined } from 'ts-is-present';
import { Rule } from '~/sanity';
import { ChartColorInput } from '../../components/portable-text/chart-configuration/chart-color-input';
import { MetricPropertySelectInput } from '../../components/portable-text/shared/metric-property-select-input';
import { METRIC_DATA_FIELDS } from '../fields/metric-data-fields';

export const ageDemographicChartConfiguration = {
  title: 'LeeftijdsGrafiek configuratie',
  name: 'ageDemographicChartConfiguration',
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
      title: 'Data opties',
      name: 'options',
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
      title: 'Accessibility Key',
      name: 'accessibilityKey',
      type: 'string',
      validation: (rule: Rule) => rule.required(),
    },
    {
      title: 'Source Key',
      name: 'sourceKey',
      type: 'string',
      validation: (rule: Rule) => rule.required(),
    },
    {
      title: 'Text',
      name: 'text',
      type: 'string',
      validation: (rule: Rule) => rule.required(),
    },
    ...METRIC_DATA_FIELDS,
    {
      title: 'Linker metriek Waarde',
      name: 'leftMetricProperty',
      type: 'string',
      inputComponent: MetricPropertySelectInput,
      validation: (rule: Rule) => rule.required(),
      hidden: ({ parent }: { parent: any }) => !isDefined(parent?.metricName),
    },
    {
      name: 'leftColor',
      type: 'string',
      title: 'Kleur',
      inputComponent: ChartColorInput,
      validation: (rule: Rule) => rule.required(),
    },
    {
      title: 'Rechter metriek Waarde',
      name: 'rightMetricProperty',
      type: 'string',
      inputComponent: MetricPropertySelectInput,
      validation: (rule: Rule) => rule.required(),
      hidden: ({ parent }: { parent: any }) => !isDefined(parent?.metricName),
    },
    {
      name: 'rightColor',
      type: 'string',
      title: 'Kleur',
      inputComponent: ChartColorInput,
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'maxDisplayValue',
      type: 'number',
      title: 'Maximum display value',
    },
  ],
};
