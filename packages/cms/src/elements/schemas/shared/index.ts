import { snakeCase } from 'change-case';
import { isDefined } from 'ts-is-present';

export const scopes = [
  { title: 'Actueel', value: 'ac' },
  { title: 'Landelijk', value: 'nl' },
  { title: 'Veiligheidsregio', value: 'vr' },
  { title: 'Gemeente', value: 'gm' },
  { title: 'Europe', value: 'eu' },
] as const;

export const commonFields = [
  {
    title: 'Scope',
    name: 'scope',
    type: 'string',
    readOnly: true,
    hidden: true,
    options: {
      list: scopes, // <-- predefined values
      // layout: 'radio', // <-- defaults to 'dropdown'
    },
  },
  {
    title: 'Metric Name',
    name: 'metricName',
    type: 'string',
    readOnly: true,
    hidden: true,
  },
  {
    title: 'Metric Property', // should be optional
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

const titleForMetricName: Record<string, string | undefined> = {
  tested_overall: 'Positief geteste mensen',
  sewer: 'Rioolwater metingen',
};

/**
 * By maping the metric name to a title, we can make the UI a little more comm-friendly
 */
function getTitleForMetricName(metricName: string) {
  return titleForMetricName[metricName] || metricName;
}
