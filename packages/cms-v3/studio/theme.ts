import { colors } from '@corona-dashboard/common';
import { buildLegacyTheme } from 'sanity';

export const theme = buildLegacyTheme({
  //  '--font-family-monospace': string
  // '--font-family-base': string
  // '--black': string
  // '--white': string
  '--brand-primary': colors.magenta4,
  // '--component-bg': string,
  // '--component-text-color': string
  // '--default-button-color': string
  '--default-button-primary-color': colors.primary,
  // '--default-button-success-color': string
  // '--default-button-warning-color': string
  // '--default-button-danger-color': string
  '--focus-color': colors.primary,
  // '--gray-base': string
  // '--gray': string
  '--main-navigation-color': colors.secondary,
  // '--main-navigation-color--inverted': string
  // '--state-info-color': string
  // '--state-success-color': string
  // '--state-warning-color': string
  // '--state-danger-color': string
  // '--screen-medium-break': string
  // '--screen-default-break': string
  // '--screen-large-break': string
  // '--screen-xlarge-break': string
});
