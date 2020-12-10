import { MetricKeys } from '~/components/choropleth/shared';
import { colors } from '~/style/theme';
import { Regionaal } from '~/types/data';
import { MetricConfig } from './types';

const GREEN = colors.data.gradient.green;
const YELLOW = colors.data.gradient.yellow;
const RED = colors.data.gradient.red;

type VrMetricKey = MetricKeys<Regionaal>;
export type VrConfig = Partial<
  Record<VrMetricKey, Record<string, MetricConfig>>
>;

export const vr: VrConfig = {
  sewer: {
    average: {
      isWeeklyData: true,
    },
  },
  results_per_region: {
    infected_increase_per_region: {
      barScale: {
        min: 0,
        max: 10,
        signaalwaarde: 7,
        rangesKey: 'infected_daily_increase',
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
