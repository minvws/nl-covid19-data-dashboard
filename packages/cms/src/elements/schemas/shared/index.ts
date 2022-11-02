import { DataScopeKey, MetricKeys, MetricName, ScopedData } from '@corona-dashboard/common';
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
  prepare<K extends DataScopeKey>(x: { scope: K; type: string; metricName: MetricKeys<ScopedData[K]>; metricProperty?: string }) {
    return {
      title: [getTitleForMetricName(x.metricName as MetricName), getTitleForElementType(x.type), x.metricProperty].filter(isDefined).join(' - '),
      subtitle: [x.scope, x.metricName, snakeCase(x.type), x.metricProperty].filter(isDefined).join('.'),
    };
  },
};

/**
 * By mapping the metric name to a title we can make the UI a little more
 * user-friendly. We could take this further by also mapping type names like
 * choropleth and maybe even introducing a specific icon for each element type.
 */
const titleByMetricName: Partial<Record<MetricName, string>> = {
  tested_overall: 'Positief geteste mensen',
  sewer: 'Rioolwater metingen',
  hospital_nice: 'Ziekenhuisopnames',
  intensive_care_nice: 'IC-opnames',
  situations: 'Besmettingssituaties',
  reproduction: 'Reproduciegetal',
  vaccine_coverage_per_age_group: 'Vaccinatiegraad (per leeftijd)',
  vaccine_administered: 'Gezette prikken',
  vaccine_coverage: 'Vaccinatiegraad',
  vaccine_coverage_per_age_group_estimated_fully_vaccinated: 'Vaccinatiegraad basisserie berekend (per leeftijd)',
  vaccine_coverage_per_age_group_estimated_autumn_2022: 'Vaccinatiegraad herfst 2022 booster berekend (per leeftijd)',
  vaccine_administered_total: 'Totaal gezette prikken',
  nursing_home: 'Verpleeghuizen',
  disability_care: 'Gehandicaptenzorg',
  deceased_rivm: 'Sterfte (RIVM)',
  intensive_care_nice_per_age_group: 'IC-opnames (per leeftijd)',
  hospital_nice_per_age_group: 'Ziekenhuisopnames (per leeftijd)',
  tested_per_age_group: 'Positief getest (per leeftijd)',
  elderly_at_home: '70-plussers',
};

function getTitleForMetricName(metricName: MetricName) {
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
