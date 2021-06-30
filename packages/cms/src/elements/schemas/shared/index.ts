import { snakeCase } from 'change-case';
import { isDefined } from 'ts-is-present';

export const scopes = [
  { title: 'Actueel', value: 'ac' },
  { title: 'Landelijk', value: 'nl' },
  { title: 'Veiligheidsregio', value: 'vr' },
  { title: 'Gemeente', value: 'gm' },
  { title: 'Internationaal', value: 'in' },
] as const;

const REQUIRED = (x: any) => x.required();

export const commonFields = [
  {
    title: 'Scope',
    name: 'scope',
    type: 'string',
    readOnly: true,
    hidden: true,
    validation: REQUIRED,
  },
  {
    title: 'Metric Name',
    name: 'metricName',
    type: 'string',
    readOnly: true,
    hidden: true,
    validation: REQUIRED,
  },
  {
    title: 'Metric Property',
    name: 'metricProperty',
    type: 'string',
    readOnly: true,
    hidden: true,
  },
];

export const commonPreview = {
  select: {
    scope: 'scope',
    type: '_type',
    metricName: 'metricName',
    metricProperty: 'metricProperty',
  },
  prepare(x: {
    scope: string;
    type: string;
    metricName: string;
    metricProperty?: string;
  }) {
    return {
      title: [getTitleForMetricName(x.metricName), x.type, x.metricProperty]
        .filter(isDefined)
        .join(' - '),
      subtitle: [x.scope, x.metricName, snakeCase(x.type), x.metricProperty]
        .filter(isDefined)
        .join('.'),
    };
  },
};

/**
 * By mapping the metric name to a title we can make the UI a little more
 * user-friendly. We could take this further by also mapping type names like
 * choropleth and maybe even introducing a specific icon for each element type.
 */
const titleForMetricName: Record<string, string | undefined> = {
  tested_overall: 'Positief geteste mensen',
  sewer: 'Rioolwater metingen',
};

function getTitleForMetricName(metricName: string) {
  return titleForMetricName[metricName] || metricName;
}
