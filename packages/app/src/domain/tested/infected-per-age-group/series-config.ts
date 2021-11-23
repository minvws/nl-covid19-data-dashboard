import { colors } from '@corona-dashboard/common';

export const BASE_SERIES_CONFIG = [
  {
    metricProperty: 'infected_age_0_9_per_100k',
    color: colors.data.multiseries.cyan,
    hideInLegend: true,
  },
  {
    metricProperty: 'infected_age_10_19_per_100k',
    color: colors.data.multiseries.cyan_dark,
    hideInLegend: true,
  },
  {
    metricProperty: 'infected_age_20_29_per_100k',
    color: colors.data.multiseries.turquoise,
    hideInLegend: true,
  },
  {
    metricProperty: 'infected_age_30_39_per_100k',
    color: colors.data.multiseries.turquoise_dark,
    hideInLegend: true,
  },
  {
    metricProperty: 'infected_age_40_49_per_100k',
    color: colors.data.multiseries.yellow,
    hideInLegend: true,
  },
  {
    metricProperty: 'infected_age_50_59_per_100k',
    color: colors.data.multiseries.yellow_dark,
    hideInLegend: true,
  },
  {
    metricProperty: 'infected_age_60_69_per_100k',
    color: colors.data.multiseries.orange,
    hideInLegend: true,
  },
  {
    metricProperty: 'infected_age_70_79_per_100k',
    color: colors.data.multiseries.orange_dark,
    hideInLegend: true,
  },
  {
    metricProperty: 'infected_age_80_89_per_100k',
    color: colors.data.multiseries.magenta,
    hideInLegend: true,
  },
  {
    metricProperty: 'infected_age_90_plus_per_100k',
    color: colors.data.multiseries.magenta_dark,
    hideInLegend: true,
  },
  {
    metricProperty: 'infected_overall_per_100k',
    color: colors.gray,
    style: 'dashed',
  },
] as const;
