import { isDefined } from 'ts-is-present';
import { Rule } from '~/sanity';
import { AreaSelectInput } from '../../components/portable-text/shared/area-select-input';
import { CodeSelectInput } from '../../components/portable-text/shared/code-select-input';
import { MetricSelectInput } from '../../components/portable-text/shared/metric-select-input';

export const chartConfiguration = {
  title: 'Grafiek configuratie',
  name: 'chartConfiguration',
  type: 'document',
  fieldsets: [
    {
      title: 'Configuratie',
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
      fieldset: 'configuration',
    },
    {
      title: 'Accessibility Key',
      name: 'accessibilityKey',
      type: 'string',
      validation: (rule: Rule) => rule.required(),
      fieldset: 'configuration',
    },
    {
      title: 'Source Key',
      name: 'sourceKey',
      type: 'string',
      validation: (rule: Rule) => rule.required(),
      fieldset: 'configuration',
    },
    {
      title: 'Timeframe',
      name: 'timeframe',
      type: 'string',
      validation: (rule: Rule) => rule.required(),
      fieldset: 'configuration',
      initialValue: 'all',
      options: {
        list: [
          { title: 'Toon alles', value: 'all' },
          { title: 'Toon laatste 5 weken', value: '5weeks' },
        ],
        layout: 'radio',
      },
    },
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
              return parent?.area === 'gm'
                ? 'Gemeente is verplicht'
                : 'Veiligheidsregio is verplicht';
            }
          }
          return true;
        }),
      hidden: ({ parent }: { parent: any }) =>
        parent?.area !== 'gm' && parent?.area !== 'vr',
      fieldset: 'configuration',
    },
    {
      title: 'Metriek Naam',
      name: 'metricName',
      type: 'string',
      inputComponent: MetricSelectInput,
      validation: (rule: Rule) => rule.required(),
      fieldset: 'configuration',
      hidden: ({ parent }: { parent: any }) => !isDefined(parent?.area),
    },
    {
      title: 'Metriek waarde',
      name: 'metricProperties',
      type: 'array',
      of: [{ type: 'metricPropertyConfig' }],
      validation: (rule: Rule) => rule.min(1),
      fieldset: 'configuration',
      hidden: ({ parent }: { parent: any }) => !isDefined(parent?.metricName),
    },
    {
      title: 'Value annotation key',
      name: 'valueAnnotionKey',
      type: 'string',
      fieldset: 'options',
    },
    {
      title: 'Forced maximum value',
      name: 'forcedMaximumValue',
      type: 'number',
      fieldset: 'options',
      validation: (rule: Rule) => rule.min(0),
    },
    {
      title: 'Waarde is percentage',
      name: 'isPercentage',
      type: 'boolean',
      fieldset: 'options',
    },
    {
      title: 'Render null as nul (0)',
      name: 'renderNullAsZero',
      type: 'boolean',
      fieldset: 'options',
    },
    {
      title: 'Timespan annotaties',
      name: 'timespanAnnotations',
      type: 'array',
      of: [{ type: 'timespanAnnotationConfig' }],
      fieldset: 'options',
    },
  ],
  preview: {
    select: {
      title: 'title',
      area: 'area',
      metricName: 'metricName',
    },
    prepare({
      title,
      area,
      metricName,
    }: {
      title: string;
      area: string;
      metricName: string;
    }) {
      return {
        title,
        subtitle: `${area} -> ${metricName}`,
      };
    },
  },
};
