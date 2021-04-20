import { MetricConfig } from './common';
// import { colors } from '~/style/theme';
import { Municipal } from '@corona-dashboard/common';
import { MetricKeys } from '@corona-dashboard/common';

// const GREEN = colors.data.gradient.green;
// const YELLOW = colors.data.gradient.yellow;
// const RED = colors.data.gradient.red;

type GmMetricKey = MetricKeys<Municipal>;
export type GmConfig = Partial<
  Record<GmMetricKey, Record<string, MetricConfig>>
>;

export const gm: GmConfig = {
  sewer: {
    average: {
      isWeeklyData: true,
    },
  },
};
