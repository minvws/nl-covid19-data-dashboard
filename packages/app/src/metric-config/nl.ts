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
  doctor: {
    covid_symptoms: {
      isWeeklyData: true,
    },
  },
  sewer: {
    average: {
      isWeeklyData: true,
    },
  },
  reproduction: {
    index_average: {
      isDecimal: true,
      barScale: {
        min: 0,
        max: 2,
        signaalwaarde: 1,
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

  hospital_nice: {
    admissions_moving_average: {
      isDecimal: true,
      barScale: {
        min: 0,
        max: 100,
        signaalwaarde: 40,
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
  intensive_care_nice: {
    admissions_moving_average: {
      isDecimal: true,
      barScale: {
        min: 0,
        max: 30,
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
