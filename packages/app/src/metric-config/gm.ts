import { Gm, MetricKeys } from '@corona-dashboard/common';
import { positiveTestedBarScale } from './bar-scales';
import {
  hospitalAdmissionsThresholds,
  positiveTestedThresholds,
  sewerThresholds,
} from './choropleth-thresholds';
import { MetricConfig } from './common';

type GmMetricKey = MetricKeys<Gm>;
type GmConfig = Partial<Record<GmMetricKey, Record<string, MetricConfig>>>;

export const gm: GmConfig = {
  tested_overall: {
    infected_per_100k: {
      barScale: positiveTestedBarScale,
      choroplethThresholds: positiveTestedThresholds,
    },
  },
  hospital_nice: {
    admissions_on_date_of_reporting: {
      choroplethThresholds: hospitalAdmissionsThresholds,
    },
  },
  sewer: {
    average: {
      choroplethThresholds: sewerThresholds,
    },
  },
};
