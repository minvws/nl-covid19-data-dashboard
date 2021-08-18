import { MetricKeys, Gm } from '@corona-dashboard/common';
import { colors } from '~/style/theme';
import { MetricConfig } from './common';
import {
  positiveTestedThresholds,
  hospitalAdmissionsThresholds,
  sewerThresholds,
} from './choropleth-thresholds';

const GREEN = colors.data.gradient.green;
const YELLOW = colors.data.gradient.yellow;
const RED = colors.data.gradient.red;

type GmMetricKey = MetricKeys<Gm>;
type GmConfig = Partial<Record<GmMetricKey, Record<string, MetricConfig>>>;

export const gm: GmConfig = {
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
