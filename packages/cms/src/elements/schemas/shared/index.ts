import {
  DataScopeKey,
  Gm,
  In,
  MetricKeys,
  Nl,
  ScopedData,
  Vr,
} from '@corona-dashboard/common';
import { snakeCase } from 'change-case';
import { isDefined } from 'ts-is-present';
import { Rule } from '~/sanity';

const REQUIRED = (x: Rule) => x.required();

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
  prepare<K extends DataScopeKey>(x: {
    scope: K;
    type: string;
    metricName: MetricKeys<ScopedData[K]>;
    metricProperty?: string;
  }) {
    return {
      title: [
        getTitleForMetricName(x.metricName as MetricKeys<In & Nl & Vr & Gm>),
        getTitleForElementType(x.type),
        x.metricProperty,
      ]
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
const titleByMetricName: Partial<
  Record<MetricKeys<In & Nl & Vr & Gm>, string>
> = {
  tested_overall: 'Positief geteste mensen',
  sewer: 'Rioolwater metingen',
  hospital_nice: 'Ziekenhuisopnames',
  intensive_care_nice: 'Intensive care-opnames',
};

function getTitleForMetricName(metricName: MetricKeys<In & Nl & Vr & Gm>) {
  return titleByMetricName[metricName] || metricName;
}

const titleByElementType: Record<string, string | undefined> = {
  timeSeries: 'Grafiek',
  choropleth: 'Kaart',
  kpi: 'KPI',
  warning: 'Waarschuwing',
};

function getTitleForElementType(elementType: string) {
  return titleByElementType[elementType] || elementType;
}
