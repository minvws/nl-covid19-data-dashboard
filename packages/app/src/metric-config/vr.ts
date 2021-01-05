import { MetricKeys } from '~/components/choropleth/shared';
import { colors } from '~/style/theme';
import { Regionaal } from '~/types/data';
import { MetricConfig, NO_METRIC_PROPERTY } from './common';

const GREEN = colors.data.gradient.green;
const YELLOW = colors.data.gradient.yellow;
const RED = colors.data.gradient.red;

type VrMetricKey = MetricKeys<Regionaal>;
export type VrConfig = Partial<
  Record<VrMetricKey, Record<string, MetricConfig>>
>;

export const vr: VrConfig = {
  behavior: {
    [NO_METRIC_PROPERTY]: {
      isWeeklyData: true,
    },
  },
  sewer: {
    average: {
      isWeeklyData: true,
    },
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
    },
  },
};
