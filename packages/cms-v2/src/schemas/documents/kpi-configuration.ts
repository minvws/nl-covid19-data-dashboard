import { isDefined } from 'ts-is-present';
import { Rule } from '~/sanity';
import { KpiIconInput } from '../../components/portable-text/kpi-configuration/kpi-icon-input';
import { MetricPropertySelectInput } from '../../components/portable-text/shared/metric-property-select-input';
import { METRIC_DATA_FIELDS } from '../fields/metric-data-fields';

export const kpiConfigurationTest = {
  title: 'KPI configuratie',
  name: 'kpiConfiguration',
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
    ...METRIC_DATA_FIELDS,
    {
      title: 'Metriek Waarde',
      name: 'metricProperty',
      type: 'string',
      inputComponent: MetricPropertySelectInput,
      validation: (rule: Rule) => rule.required(),
      hidden: ({ parent }: { parent: any }) => !isDefined(parent?.metricName),
      fieldset: 'configuration',
    },
    {
      title: 'Source key',
      name: 'sourceKey',
      type: 'string',
      validation: (rule: Rule) => rule.required(),
    },
    {
      title: 'Title key',
      name: 'titleKey',
      type: 'string',
      validation: (rule: Rule) => rule.required(),
    },
    {
      title: 'Difference key',
      name: 'differenceKey',
      type: 'string',
    },
    {
      title: 'Dit is een moving average difference',
      name: 'isMovingAverageDifference',
      type: 'boolean',
    },

    {
      title: 'Dit is een hoeveelheid (amount)',
      name: 'isAmount',
      type: 'boolean',
    },
    {
      title: 'Icoon',
      name: 'icon',
      type: 'string',
      inputComponent: KpiIconInput,
      validation: (rule: Rule) => rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }: { title: string }) {
      return {
        title,
      };
    },
  },
};
