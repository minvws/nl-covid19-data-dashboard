import { colors } from '~/style/theme';

export const BASE_SERIES_CONFIG = [
  {
    metricProperty: 'admissions_age_0_19_per_million',
    color: colors.data.multiseries.cyan,
  },
  {
    metricProperty: 'admissions_age_20_29_per_million',
    color: colors.data.multiseries.turquoise,
  },
  {
    metricProperty: 'admissions_age_30_39_per_million',
    color: colors.data.multiseries.turquoise_dark,
  },
  {
    metricProperty: 'admissions_age_40_49_per_million',
    color: colors.data.multiseries.yellow,
  },
  {
    metricProperty: 'admissions_age_50_59_per_million',
    color: colors.data.multiseries.yellow_dark,
  },
  {
    metricProperty: 'admissions_age_60_69_per_million',
    color: colors.data.multiseries.orange,
  },
  {
    metricProperty: 'admissions_age_70_79_per_million',
    color: colors.data.multiseries.orange_dark,
  },
  {
    metricProperty: 'admissions_age_80_89_per_million',
    color: colors.data.multiseries.magenta,
  },
  {
    metricProperty: 'admissions_age_90_plus_per_million',
    color: colors.data.multiseries.magenta_dark,
  },
  {
    metricProperty: 'admissions_overall_per_million',
    color: colors.gray,
    style: 'dashed',
  },
] as const;
