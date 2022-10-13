import { colors } from '@corona-dashboard/common';

export const BASE_SERIES_CONFIG = [
  {
    metricProperty: 'infected_age_0_9_per_100k',
    color: colors.blue6,
  },
  {
    metricProperty: 'infected_age_10_19_per_100k',
    color: colors.blue9,
  },
  {
    metricProperty: 'infected_age_20_29_per_100k',
    color: colors.green2,
  },
  {
    metricProperty: 'infected_age_30_39_per_100k',
    color: colors.green3,
  },
  {
    metricProperty: 'infected_age_40_49_per_100k',
    color: colors.yellow3,
  },
  {
    metricProperty: 'infected_age_50_59_per_100k',
    color: colors.yellow5,
  },
  {
    metricProperty: 'infected_age_60_69_per_100k',
    color: colors.orange1,
  },
  {
    metricProperty: 'infected_age_70_79_per_100k',
    color: colors.orange2,
  },
  {
    metricProperty: 'infected_age_80_89_per_100k',
    color: colors.magenta1,
  },
  {
    metricProperty: 'infected_age_90_plus_per_100k',
    color: colors.magenta2,
  },
  {
    metricProperty: 'infected_overall_per_100k',
    color: colors.gray5,
    style: 'dashed',
  },
] as const;
