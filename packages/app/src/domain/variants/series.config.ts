import { colors } from '~/style/theme';

export const BASE_SERIES_CONFIG = [
  {
    metricProperty: 'alpha_percentage',
    color: colors.data.variants.alpha,
  },
  {
    metricProperty: 'beta_percentage',
    color: colors.data.variants.beta,
  },
  {
    metricProperty: 'gamma_percentage',
    color: colors.data.variants.gamma,
  },
  {
    metricProperty: 'delta_percentage',
    color: colors.data.variants.delta,
  },
  {
    metricProperty: 'eta_percentage',
    color: colors.data.variants.eta,
  },
  {
    metricProperty: 'epsilon_percentage',
    color: colors.data.variants.epsilon,
  },
  {
    metricProperty: 'theta_percentage',
    color: colors.data.variants.theta,
  },
  {
    metricProperty: 'kappa_percentage',
    color: colors.data.variants.kappa,
  },
  {
    metricProperty: 'other_percentage',
    color: colors.data.variants.other,
  },
] as const;
