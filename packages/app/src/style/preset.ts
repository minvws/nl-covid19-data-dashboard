import { colors } from '@corona-dashboard/common';
import { spacingStyle } from './functions/spacing';
import { fontSizes, fontWeights, lineHeights, space } from './theme';
import { asResponsiveArray } from './utils';

export type Preset = typeof preset;

export const preset = {
  typography: {
    h1: {
      fontSize: asResponsiveArray({ _: fontSizes[8], md: fontSizes[9] }),
      lineHeight: lineHeights[0],
      fontWeight: fontWeights.bold,
    },
    h2: {
      fontSize: asResponsiveArray({ _: fontSizes[6], md: fontSizes[7] }),
      lineHeight: lineHeights[1],
      fontWeight: fontWeights.bold,
    },
    h3: {
      fontSize: asResponsiveArray({ _: fontSizes[5], md: fontSizes[6] }),
      lineHeight: lineHeights[1],
      fontWeight: fontWeights.bold,
    },
    h4: {
      fontSize: asResponsiveArray({ _: fontSizes[3], md: fontSizes[4] }),
      lineHeight: lineHeights[1],
      fontWeight: fontWeights.bold,
    },
    h5: {
      fontSize: fontSizes[2],
      lineHeight: lineHeights[1],
      fontWeight: fontWeights.bold,
    },
    subtitle1: {
      fontSize: fontSizes[2],
      lineHeight: lineHeights[2],
      fontWeight: fontWeights.bold,
    },
    subtitle2: {
      fontSize: fontSizes[2],
      lineHeight: lineHeights[2],
      fontWeight: fontWeights.bold,
      color: colors.gray6,
    },
    body1: {
      fontSize: fontSizes[3],
    },
    body2: {
      /** body2 is the default body styling */
      fontSize: fontSizes[2],
      lineHeight: lineHeights[2],
    },
    button1: {
      fontSize: fontSizes[3],
    },
    button2: {
      fontSize: fontSizes[2],
    },
    button3: {
      fontSize: fontSizes[1],
    },
    overline1: {
      fontSize: asResponsiveArray({ _: fontSizes[3], md: fontSizes[6] }),
    },
    overline2: {
      fontSize: fontSizes[0],
      fontWeight: fontWeights.bold,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    label1: {
      fontSize: fontSizes[1],
      lineHeight: lineHeights[1],
    },
    label2: {
      fontSize: fontSizes[0],
      lineHeight: lineHeights[1],
    },
    datadriven: {
      fontSize: asResponsiveArray({ _: fontSizes[3], md: fontSizes[5] }),
    },
    choroplethTooltipHeader: {
      flex: 1,
      fontSize: asResponsiveArray({ _: fontSizes[5], md: fontSizes[6] }),
      lineHeight: lineHeights[1],
      fontWeight: fontWeights.bold,
      marginInline: space[2],
      overflow: 'hidden',
    },
    loaderText: {
      lineHeight: lineHeights[1],
    },
  },
} as const;

export const nestedHtml = {
  ...spacingStyle(3),
  /** p: inherit p-styles from the container */

  h1: preset.typography.h1,
  h2: preset.typography.h2,
  h3: preset.typography.h3,
  h4: preset.typography.h4,
  h5: preset.typography.h5,

  strong: { fontWeight: fontWeights.bold },
  em: { fontStyle: 'italic' },
  ul: { marginLeft: space[4] },
  ol: { marginLeft: space[4] },
  a: { textDecoration: 'underline' },

  /**
   * Apply some special margin styles to "stick" headings to their content.
   */
  'h1, h2, h3, h4, h5, h6': {
    margin: `${space[4]} 0 ${-space[2]}`,
  },
};

if (process.env.NODE_ENV !== 'production') {
  /**
   * Add debug content keys to the presets during development
   */
  Object.entries(preset.typography).forEach(([key, value]) => {
    // @ts-expect-error
    value.content = `"preset.typography.${key}"`;
  });
}
