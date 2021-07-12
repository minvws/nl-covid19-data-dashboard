// import { colors } from '~/style/theme';
import { Gm, MetricKeys } from '@corona-dashboard/common';
import { MetricConfig } from './common';

// const GREEN = colors.data.gradient.green;
// const YELLOW = colors.data.gradient.yellow;
// const RED = colors.data.gradient.red;

type GmMetricKey = MetricKeys<Gm>;
type GmConfig = Partial<Record<GmMetricKey, Record<string, MetricConfig>>>;

export const gm: GmConfig = {
  sewer: {
    average: {
      isWeeklyData: true,
    },
  },
};
