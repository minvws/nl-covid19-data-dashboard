import { MetricKeys, Vr } from '@corona-dashboard/common';
import { positiveTestedBarScale } from './bar-scales';
import {
  behaviorThresholds,
  elderlyAtHomeThresholds,
  escalationThresholds,
  hasSufficientDataThresholds,
  hospitalAdmissionsThresholds,
  infectedLocationsPercentageThresholds,
  positiveTestedThresholds,
  sewerThresholds,
  situationsThreshold,
  vaccineCoverageThresholds,
} from './choropleth-thresholds';
import { MetricConfig } from './common';
import {
  hospitalAdmissionsRiskCategoryThresholds,
  positiveTestedRiskCategoryThresholds,
} from './risk-category-thresholds';

type VrMetricKey = MetricKeys<Vr>;
type VrConfig = Partial<Record<VrMetricKey, Record<string, MetricConfig>>>;

export const vr: VrConfig = {
  behavior: {
    ...Object.fromEntries(
      Object.entries(behaviorThresholds).map(([key, value]) => [
        key,
        { choroplethThresholds: value },
      ])
    ),
  },
  elderly_at_home: {
    positive_tested_daily_per_100k: {
      choroplethThresholds: elderlyAtHomeThresholds,
    },
  },
  escalation_level: {
    level: {
      choroplethThresholds: escalationThresholds,
    },
  },
  hospital_nice: {
    admissions_on_date_of_reporting: {
      choroplethThresholds: hospitalAdmissionsThresholds,
    },
  },
  hospital_nice_sum: {
    admissions_per_1m: {
      riskCategoryThresholds: hospitalAdmissionsRiskCategoryThresholds,
    },
  },
  nursing_home: {
    infected_locations_percentage: {
      choroplethThresholds: infectedLocationsPercentageThresholds,
    },
  },
  disability_care: {
    infected_locations_percentage: {
      choroplethThresholds: infectedLocationsPercentageThresholds,
    },
  },
  sewer: {
    average: {
      choroplethThresholds: sewerThresholds,
    },
  },
  situations: {
    has_sufficient_data: { choroplethThresholds: hasSufficientDataThresholds },
    home_and_visits: { choroplethThresholds: situationsThreshold },
    work: { choroplethThresholds: situationsThreshold },
    school_and_day_care: { choroplethThresholds: situationsThreshold },
    health_care: { choroplethThresholds: situationsThreshold },
    gathering: { choroplethThresholds: situationsThreshold },
    travel: { choroplethThresholds: situationsThreshold },
    hospitality: { choroplethThresholds: situationsThreshold },
    other: { choroplethThresholds: situationsThreshold },
  },
  tested_overall: {
    infected_per_100k: {
      barScale: positiveTestedBarScale,
      riskCategoryThresholds: positiveTestedRiskCategoryThresholds,
      choroplethThresholds: positiveTestedThresholds,
    },
  },
  vaccine_coverage: {
    // NOTE: arbitrarily chose a coverage value
    partially_or_fully_vaccinated: {
      choroplethThresholds: vaccineCoverageThresholds,
    },
  },
};
