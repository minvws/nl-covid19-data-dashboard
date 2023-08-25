import { colors } from '@corona-dashboard/common';

export const BASE_SERIES_CONFIG = [
  {
    metricProperty: 'percentage_0_24',
    color: colors.magenta1,
  },
  {
    metricProperty: 'percentage_25_39',
    color: colors.green3,
  },
  {
    metricProperty: 'percentage_40_49',
    color: colors.yellow3,
  },
  {
    metricProperty: 'percentage_50_59',
    color: colors.blue6,
  },
  {
    metricProperty: 'percentage_60_69',
    color: colors.orange1,
  },
  {
    metricProperty: 'percentage_70_plus',
    color: colors.magenta5,
  },
  {
    metricProperty: 'percentage_average',
    color: colors.gray5,
    style: 'dashed',
  },
] as const;
