import { isDefined } from 'ts-is-present';
import { Rule } from '~/sanity';
import { KpiIconInput } from '../../components/portable-text/kpi-configuration/kpi-icon-input';
import { AreaSelectInput } from '../../components/portable-text/shared/area-select-input';
import { CodeSelectInput } from '../../components/portable-text/shared/code-select-input';
import { MetricPropertySelectInput } from '../../components/portable-text/shared/metric-property-select-input';
import { MetricSelectInput } from '../../components/portable-text/shared/metric-select-input';

export const kpiConfigurationTest = {
  title: 'KPI configuratie',
  name: 'kpiConfiguration',
  type: 'document',
  fields: [
    {
      title: 'Titel',
      name: 'title',
      type: 'string',
      validation: (rule: Rule) => rule.required(),
    },
    {
      title: 'Gebied',
      name: 'area',
      type: 'string',
      inputComponent: AreaSelectInput,
      validation: (rule: Rule) => rule.required(),
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
              return parent?.area === 'gm'
                ? 'Gemeente is verplicht'
                : 'Veiligheidsregio is verplicht';
            }
          }
          return true;
        }),
      hidden: ({ parent }: { parent: any }) =>
        parent?.area !== 'gm' && parent?.area !== 'vr',
    },
    {
      title: 'Metriek Naam',
      name: 'metricName',
      type: 'string',
      inputComponent: MetricSelectInput,
      validation: (rule: Rule) => rule.required(),
      hidden: ({ parent }: { parent: any }) => !isDefined(parent?.area),
    },
    {
      title: 'Metriek Waarde',
      name: 'metricProperty',
      type: 'string',
      inputComponent: MetricPropertySelectInput,
      validation: (rule: Rule) => rule.required(),
      hidden: ({ parent }: { parent: any }) => !isDefined(parent?.metricName),
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
