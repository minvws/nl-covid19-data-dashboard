import { MetricKeys, Vr } from '@corona-dashboard/common';
import { colors } from '~/style/theme';
import { MetricConfig } from './common';

const GREEN = colors.data.gradient.green;
const YELLOW = colors.data.gradient.yellow;
const RED = colors.data.gradient.red;

type VrMetricKey = MetricKeys<Vr>;
type VrConfig = Partial<Record<VrMetricKey, Record<string, MetricConfig>>>;

export const vr: VrConfig = {
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
      categoricalBarScale: {
        categories: [
          {
            threshold: 0,
            color: colors.data.scale.magenta[0],
          },
          {
            threshold: 35,
            color: colors.data.scale.magenta[1],
          },
          {
            threshold: 100,
            color: colors.data.scale.magenta[2],
          },
          {
            threshold: 250,
            color: colors.data.scale.magenta[3],
          },
          {
            threshold: 300,
          },
        ],
      },
    },
  },
  hospital_nice_sum: {
    admissions_per_1m: {
      categoricalBarScale: {
        categories: [
          {
            threshold: 0,
            color: colors.data.scale.magenta[0],
          },
          {
            threshold: 4,
            color: colors.data.scale.magenta[1],
          },
          {
            threshold: 16,
            color: colors.data.scale.magenta[2],
          },
          {
            threshold: 27,
            color: colors.data.scale.magenta[3],
          },
          {
            threshold: 30,
          },
        ],
      },
    },
  },
};
