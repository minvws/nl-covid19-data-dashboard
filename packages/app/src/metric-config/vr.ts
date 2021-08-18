import { MetricKeys, Vr } from '@corona-dashboard/common';
import { colors } from '~/style/theme';
import { MetricConfig } from './common';
import {
  elderlyAtHomeThresholds,
  escalationThresholds,
  hasSufficientDataThresholds,
  hospitalAdmissionsThresholds,
  infectedLocationsPercentageThresholds,
  positiveTestedThresholds,
  sewerThresholds,
  situationsThreshold,
  vaccineCoverageThresholds,
  behaviorThresholds,
} from './choropleth-thresholds';
import {
  positiveTestedRiskCategoryThresholds,
  hospitalAdmissionsRiskCategoryThresholds,
} from './risk-category-thresholds';

const GREEN = colors.data.gradient.green;
const YELLOW = colors.data.gradient.yellow;
const RED = colors.data.gradient.red;

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
      barScale: {
        min: 0,
        max: 10,
        signaalwaarde: 7,
        gradient: [
          {
            color: GREEN,
            value: 0,
          },
          {
            color: YELLOW,
            value: 7,
          },
          {
            color: RED,
            value: 10,
          },
        ],
      },
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
