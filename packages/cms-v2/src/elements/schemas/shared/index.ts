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
  tested_overall_archived_20230331: 'Positief geteste mensen',
  sewer: 'Rioolwater metingen',
  hospital_nice: 'Ziekenhuisopnames',
  intensive_care_nice: 'IC-opnames',
  reproduction_archived_20230711: 'Reproductiegetal',
  vaccine_coverage_per_age_group_archived_202310xx: 'Vaccinatiegraad (per leeftijd)',
  vaccine_administered_archived_20220914: 'Gezette prikken',
  vaccine_coverage_archived_20220518: 'Vaccinatiegraad',
  vaccine_coverage_per_age_group_estimated_fully_vaccinated_archived_202310xx: 'Vaccinatiegraad basisserie berekend (per leeftijd)',
  vaccine_coverage_per_age_group_estimated_autumn_2022_archived_202310xx: 'Vaccinatiegraad herfst 2022 booster berekend (per leeftijd)',
  vaccine_administered_total_archived_20220324: 'Totaal gezette prikken',
  nursing_home_archived_20230126: 'Verpleeghuizen',
  disability_care_archived_20230126: 'Gehandicaptenzorg',
  deceased_rivm_archived_20221231: 'Sterfte (RIVM)',
  intensive_care_nice_per_age_group: 'IC-opnames (per leeftijd)',
  hospital_nice_per_age_group: 'Ziekenhuisopnames (per leeftijd)',
  tested_per_age_group_archived_20230331: 'Positief getest (per leeftijd)',
  elderly_at_home_archived_20230126: '70-plussers',
  self_test_overall: 'Zelfgerapporteerde positieve coronatestuitslagen',
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
