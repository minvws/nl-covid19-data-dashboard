import { MetricKeys, Gm } from '@corona-dashboard/common';
import { colors } from '~/style/theme';
import { MetricConfig } from './common';

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
      choroplethThresholds: [
        {
          color: colors.data.underReported,
          threshold: 0,
        },
        {
          color: colors.data.scale.blue[0],
          threshold: 0.1,
        },
        {
          color: colors.data.scale.blue[1],
          threshold: 4,
        },
        {
          color: colors.data.scale.blue[2],
          threshold: 7,
        },
        {
          color: colors.data.scale.blue[3],
          threshold: 10,
        },
        {
          color: colors.data.scale.blue[4],
          threshold: 20,
        },
        {
          color: colors.data.scale.blue[5],
          threshold: 30,
        },
      ],
    },
  },
  hospital_nice: {
    admissions_on_date_of_reporting: {
      choroplethThresholds: [
        {
          color: colors.data.underReported,
          threshold: 0,
        },
        {
          color: colors.data.scale.blue[0],
          threshold: 1,
        },
        {
          color: colors.data.scale.blue[1],
          threshold: 2,
        },
        {
          color: colors.data.scale.blue[2],
          threshold: 3,
        },
        {
          color: colors.data.scale.blue[3],
          threshold: 4,
        },
        {
          color: colors.data.scale.blue[4],
          threshold: 5,
        },
      ],
    },
  },
  sewer: {
    average: {
      choroplethThresholds: [
        {
          color: colors.data.underReported,
          threshold: 0,
        },
        {
          color: colors.data.scale.blue[0],
          threshold: 0.01,
        },
        {
          color: colors.data.scale.blue[1],
          threshold: 50,
        },
        {
          color: colors.data.scale.blue[2],
          threshold: 250,
        },
        {
          color: colors.data.scale.blue[3],
          threshold: 500,
        },
        {
          color: colors.data.scale.blue[4],
          threshold: 750,
        },
        {
          color: colors.data.scale.blue[5],
          threshold: 1000,
        },
      ],
    },
  },
};
