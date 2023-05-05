import { ArrayRule, NumberRule, StringRule, defineField, defineType } from 'sanity';
import { isDefined } from 'ts-is-present';
import { metricDataFields } from '../fields/metric-data-fields';

export const chartConfiguration = defineType({
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
    defineField({
      title: 'Titel',
      name: 'title',
      type: 'string',
      fieldset: 'configuration',
      validation: (rule: StringRule) => rule.required(),
    }),
    defineField({
      title: 'Accessibility Key',
      name: 'accessibilityKey',
      type: 'string',
      fieldset: 'configuration',
      validation: (rule: StringRule) => rule.required(),
    }),
    defineField({
      title: 'Source Key',
      name: 'sourceKey',
      type: 'string',
      fieldset: 'configuration',
      validation: (rule: StringRule) => rule.required(),
    }),
    defineField({
      title: 'Timeframe',
      name: 'timeframe',
      type: 'string',
      fieldset: 'configuration',
      validation: (rule: StringRule) => rule.required(),
      initialValue: 'all',
      options: {
        list: [
          { title: 'Toon alles', value: 'all' },
          { title: 'Toon laatste 5 weken', value: '5weeks' },
        ],
        layout: 'radio',
      },
    }),

    ...metricDataFields,

    defineField({
      title: 'Metriek waarde',
      name: 'metricProperties',
      type: 'array',
      of: [{ type: 'metricPropertyConfig' }],
      fieldset: 'configuration',
      validation: (rule: ArrayRule<object>) => rule.min(1),
      hidden: ({ parent }: { parent: any }) => !isDefined(parent?.metricName),
    }),
    defineField({
      title: 'Value annotation key',
      name: 'valueAnnotionKey',
      type: 'string',
      fieldset: 'options',
    }),
    defineField({
      title: 'Forced maximum value',
      name: 'forcedMaximumValue',
      type: 'number',
      fieldset: 'options',
      validation: (rule: NumberRule) => rule.min(0),
    }),
    defineField({
      title: 'Waarde is percentage',
      name: 'isPercentage',
      type: 'boolean',
      fieldset: 'options',
    }),
    defineField({
      title: 'Render null as nul (0)',
      name: 'renderNullAsZero',
      type: 'boolean',
      fieldset: 'options',
    }),
    defineField({
      title: 'Timespan annotaties',
      name: 'timespanAnnotations',
      type: 'array',
      of: [{ type: 'timespanAnnotationConfig' }],
      fieldset: 'options',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      area: 'area',
      metricName: 'metricName',
    },
    prepare({ title, area, metricName }: { title: string; area: string; metricName: string }) {
      return {
        title,
        subtitle: `${area} -> ${metricName}`,
      };
    },
  },
});
