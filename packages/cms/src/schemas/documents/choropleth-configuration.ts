import { isDefined } from 'ts-is-present';
import { Rule } from '~/sanity';
import { ChartColorInput } from '../../components/portable-text/chart-configuration/chart-color-input';
import { ReverseRouterInput } from '../../components/portable-text/choropleth-configuration/reverse-router-input';
import { CollectionMetricPropertySelectInput } from '../../components/portable-text/shared/collection-metric-property-select-input';
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
      name: 'area',
      type: 'string',
      initialValue: 'vr',
      options: {
        list: [
          { title: 'Veiligheidsregio', value: 'vr' },
          { title: 'Gemeente', value: 'gm' },
        ],
        layout: 'dropdown',
      },
    },
    {
      title: 'Metriek naam',
      name: 'metricName',
      type: 'string',
      inputComponent: CollectionMetricSelectInput,
      validation: (rule: Rule) => rule.required(),
      hidden: ({ parent }: { parent: any }) => !isDefined(parent?.area),
    },
    {
      title: 'Metriek property',
      name: 'metricProperty',
      type: 'string',
      inputComponent: CollectionMetricPropertySelectInput,
      validation: (rule: Rule) => rule.required(),
      hidden: ({ parent }: { parent: any }) => !isDefined(parent?.metricName),
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
      title: 'Highlight stroke',
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
      title: 'Area stroke',
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
    {
      title: 'Link function',
      name: 'link',
      type: 'string',
      fieldset: 'dataOptions',
      inputComponent: ReverseRouterInput,
    },
    {
      title: 'Tooltip Variables',
      name: 'tooltipVariables',
      type: 'text',
      fieldset: 'dataOptions',
      validation: (rule: Rule) =>
        rule.custom((value?: string) => {
          if (!isDefined(value) || !value.length) {
            return true;
          }
          try {
            JSON.parse(value);
            return true;
          } catch (e) {
            return 'tooltipVariables must be either empty or a valid JSON object';
          }
        }),
    },
  ],
};
