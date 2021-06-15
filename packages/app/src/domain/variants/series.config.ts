import { colors } from '~/style/theme';

export const BASE_SERIES_CONFIG = [
  {
    metricProperty: 'alpha_percentage',
    color: colors.data.multiseries.cyan,
  },
  {
    metricProperty: 'beta_percentage',
    color: colors.data.multiseries.cyan_dark,
  },
  {
    metricProperty: 'gamma_percentage',
    color: colors.data.multiseries.turquoise,
  },
  {
    metricProperty: 'delta_percentage',
    color: colors.data.multiseries.turquoise_dark,
  },
  {
    metricProperty: 'eta_percentage',
    color: colors.data.multiseries.yellow,
  },
  {
    metricProperty: 'epsilon_percentage',
    color: colors.data.multiseries.yellow_dark,
  },
  {
    metricProperty: 'theta_percentage',
    color: colors.data.multiseries.orange,
  },
  {
    metricProperty: 'kappa_percentage',
    color: colors.data.multiseries.orange_dark,
  },
  {
    metricProperty: 'other_percentage',
    color: colors.data.multiseries.magenta,
  },
] as const;
