import { NlTestedPerAgeGroupValue } from '@corona-dashboard/common';
import { colors } from '~/style/theme';

export const SERIES_CONFIG: {
  metricProperty: keyof Omit<
    NlTestedPerAgeGroupValue,
    'date_unix' | 'date_of_insertion_unix'
  >;
  color: string;
  style?: 'dashed' | 'solid';
}[] = [
  {
    metricProperty: 'infected_age_0_9_per_100k',
    color: colors.data.multiseries.cyan,
  },
  {
    metricProperty: 'infected_age_10_19_per_100k',
    color: colors.data.multiseries.cyan_dark,
  },
  {
    metricProperty: 'infected_age_20_29_per_100k',
    color: colors.data.multiseries.turquoise,
  },
  {
    metricProperty: 'infected_age_30_39_per_100k',
    color: colors.data.multiseries.turquoise_dark,
  },
  {
    metricProperty: 'infected_age_40_49_per_100k',
    color: colors.data.multiseries.yellow,
  },
  {
    metricProperty: 'infected_age_50_59_per_100k',
    color: colors.data.multiseries.yellow_dark,
  },
  {
    metricProperty: 'infected_age_60_69_per_100k',
    color: colors.data.multiseries.orange,
  },
  {
    metricProperty: 'infected_age_70_79_per_100k',
    color: colors.data.multiseries.orange_dark,
  },
  {
    metricProperty: 'infected_age_80_89_per_100k',
    color: colors.data.multiseries.magenta,
  },
  {
    metricProperty: 'infected_age_90_plus_per_100k',
    color: colors.data.multiseries.magenta_dark,
  },
  {
    metricProperty: 'infected_overall_per_100k',
    color: colors.gray,
    style: 'dashed',
  },
];
