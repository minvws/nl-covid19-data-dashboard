import { colors, MetricKeys, Nl } from '@corona-dashboard/common';
import { MetricConfig } from './common';

const GREEN = colors.data.gradient.green;
const YELLOW = colors.data.gradient.yellow;
const RED = colors.data.gradient.red;

type NlMetricKey = MetricKeys<Nl>;
type NlMetricConfig = Partial<
  Record<NlMetricKey, Record<string, MetricConfig>>
>;

export const nl: NlMetricConfig = {
  intensive_care_lcps: {
    beds_occupied_covid: {
      barScale: {
        min: 0,
        max: 200,
        limit: 200,
        gradient: [
          {
            color: GREEN,
            value: 0,
          },
          {
            color: GREEN,
            value: 50,
          },
          {
            color: YELLOW,
            value: 100,
          },
          {
            color: YELLOW,
            value: 150,
          },
          {
            color: RED,
            value: 200,
          },
        ],
      },
    },
  },
};
