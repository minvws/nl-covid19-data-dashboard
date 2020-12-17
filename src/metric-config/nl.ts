import { MetricConfig, NO_METRIC_PROPERTY } from './common';
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
  behavior: {
    [NO_METRIC_PROPERTY]: {
      isWeeklyData: true,
    },
  },
  verdenkingen_huisartsen: {
    geschat_aantal: {
      isWeeklyData: true,
    },
  },
  sewer: {
    average: {
      isWeeklyData: true,
    },
  },
  reproduction_index_last_known_average: {
    reproduction_index_avg: {
      isDecimal: true,
      barScale: {
        min: 0,
        max: 2,
        signaalwaarde: 1,
        rangesKey: 'reproduction_index_avg',
        gradient: [
          {
            color: GREEN,
            value: 0,
          },
          {
            color: GREEN,
            value: 1,
          },
          {
            color: YELLOW,
            value: 1.0104,
          },
          {
            color: RED,
            value: 1.125,
          },
        ],
      },
    },
  },

  intake_hospital_ma: {
    moving_average_hospital: {
      isDecimal: true,
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
