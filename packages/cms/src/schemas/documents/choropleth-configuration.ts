import { isDefined } from 'ts-is-present';
import { Rule } from '~/sanity';
import { ChartColorInput } from '../../components/portable-text/chart-configuration/chart-color-input';
import { CollectionMetricSelectInput } from '../../components/portable-text/shared/collection-metric-select-input';

export const choroplethConfiguration = {
  title: 'Choropleth configuratie',
  name: 'choroplethConfiguration',
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
      name: 'dataOptions',
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
      title: 'Accessibility key',
      name: 'accessibilityKey',
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
      title: 'Map type',
      name: 'map',
      type: 'string',
      initialValue: 'vr',
      options: {
        list: [
          { title: 'Veiligheidsregio', value: 'vr' },
          { title: 'Gemeente', value: 'gm' },
          { title: 'Internationaal', value: 'in' },
        ],
        layout: 'radio',
      },
    },
    {
      title: 'Metriek naam',
      name: 'metricName',
      type: 'string',
      inputComponent: CollectionMetricSelectInput,
      validation: (rule: Rule) => rule.required(),
      hidden: ({ parent }: { parent: any }) => isDefined(parent?.map),
    },
    {
      title: 'No Data color',
      name: 'noDataFillColor',
      type: 'string',
      inputComponent: ChartColorInput,
      fieldset: 'configuration',
    },
    {
      title: 'Hover color',
      name: 'hoverFill',
      type: 'string',
      inputComponent: ChartColorInput,
      fieldset: 'configuration',
    },
    {
      title: 'Hover stroke',
      name: 'hoverStroke',
      type: 'string',
      inputComponent: ChartColorInput,
      fieldset: 'configuration',
    },
    {
      title: 'Hover stroke width',
      name: 'hoverStrokeWidth',
      type: 'number',
      fieldset: 'configuration',
    },
    {
      title: 'Highlight stroke width',
      name: 'highlightStroke',
      type: 'string',
      inputComponent: ChartColorInput,
      fieldset: 'configuration',
    },
    {
      title: 'Highlight stroke width',
      name: 'highlightStrokeWidth',
      type: 'number',
      fieldset: 'configuration',
    },
    {
      title: 'Area stroke width',
      name: 'areaStroke',
      type: 'string',
      inputComponent: ChartColorInput,
      fieldset: 'configuration',
    },
    {
      title: 'Area stroke width',
      name: 'areaStrokeWidth',
      type: 'number',
      fieldset: 'configuration',
    },
    {
      title: 'Is percentage',
      name: 'isPercentage',
      type: 'boolean',
      fieldset: 'dataOptions',
    },
    {
      title: 'Highlight selection',
      name: 'highlightSelection',
      type: 'boolean',
      fieldset: 'dataOptions',
    },
    {
      title: 'Selected code',
      name: 'selectedCode',
      type: 'string',
      fieldset: 'dataOptions',
    },
  ],
};
