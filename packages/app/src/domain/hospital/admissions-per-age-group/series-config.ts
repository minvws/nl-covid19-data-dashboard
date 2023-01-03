import { colors } from '@corona-dashboard/common';

export const BASE_SERIES_CONFIG = [
  {
    metricProperty: 'admissions_age_0_19_per_million',
    color: colors.blue6,
  },
  {
    metricProperty: 'admissions_age_20_29_per_million',
    color: colors.green2,
  },
  {
    metricProperty: 'admissions_age_30_39_per_million',
    color: colors.green3,
  },
  {
    metricProperty: 'admissions_age_40_49_per_million',
    color: colors.yellow3,
  },
  {
    metricProperty: 'admissions_age_50_59_per_million',
    color: colors.yellow5,
  },
  {
    metricProperty: 'admissions_age_60_69_per_million',
    color: colors.orange1,
  },
  {
    metricProperty: 'admissions_age_70_79_per_million',
    color: colors.orange2,
  },
  {
    metricProperty: 'admissions_age_80_89_per_million',
    color: colors.magenta1,
  },
  {
    metricProperty: 'admissions_age_90_plus_per_million',
    color: colors.magenta2,
  },
  {
    metricProperty: 'admissions_overall_per_million',
    color: colors.gray5,
    style: 'dashed',
  },
] as const;
