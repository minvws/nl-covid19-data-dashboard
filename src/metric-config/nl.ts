import { MetricConfig } from './types';
import { colors } from '~/style/theme';
import { National } from '~/types/data';
import { MetricKeys } from '~/components/choropleth/shared';

const GREEN = colors.data.gradient.green;
const YELLOW = colors.data.gradient.yellow;
const RED = colors.data.gradient.red;

type NlMetricKey = MetricKeys<National>;
export type NlConfig = Partial<
  Record<NlMetricKey, Record<string, MetricConfig>>
>;

export const nl: NlConfig = {
  intake_hospital_ma: {
    moving_average_hospital: {
      barScale: {
        min: 0,
        max: 100,
        signaalwaarde: 40,
        rangesKey: 'moving_average_hospital',
        gradient: [
          {
            color: GREEN,
            value: 0,
          },
          {
            color: YELLOW,
            value: 40,
          },
          {
            color: RED,
            value: 90,
          },
        ],
      },
    },
  },
  intake_intensivecare_ma: {
    moving_average_ic: {
      isDecimal: true,
      barScale: {
        min: 0,
        max: 30,
        rangesKey: 'moving_average_ic',
        signaalwaarde: 10,
        gradient: [
          {
            color: GREEN,
            value: 0,
          },
          {
            color: YELLOW,
            value: 10,
          },
          {
            color: RED,
            value: 20,
          },
        ],
      },
    },
  },
  infected_people_delta_normalized: {
    infected_daily_increase: {
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
