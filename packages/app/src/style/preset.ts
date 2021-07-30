import { spacingStyle } from './functions/spacing';
import { asResponsiveArray } from './utils';

export type Preset = typeof preset;

export const preset = {
  typography: {
    h1: {
      fontSize: asResponsiveArray({ _: 8, md: 9 }),
      lineHeight: 0,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: asResponsiveArray({ _: 6, md: 7 }),
      lineHeight: 1,
      fontWeight: 'bold',
    },
    h3: {
      fontSize: asResponsiveArray({ _: 5, md: 6 }),
      lineHeight: 1,
      fontWeight: 'bold',
    },
    h4: {
      fontSize: asResponsiveArray({ _: 3, md: 4 }),
      lineHeight: 1,
      fontWeight: 'bold',
    },
    h5: {
      fontSize: 2,
      lineHeight: 1,
      fontWeight: 'bold',
    },
    subtitle1: {
      fontSize: 2,
      lineHeight: 2,
      fontWeight: 'bold',
    },
    body1: {
      fontSize: 3,
    },
    body2: {
      /** body2 is the default body styling */
      fontSize: 2,
      lineHeight: 2,
    },
    button1: {
      fontSize: 3,
    },
    button2: {
      fontSize: 2,
    },
    button3: {
      fontSize: 1,
    },
    overline1: {
      fontSize: asResponsiveArray({ _: 3, md: 6 }),
    },
    overline2: {
      fontSize: 0,
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
    label1: {
      fontSize: 1,
      lineHeight: 1,
    },
    label2: {
      fontSize: 0,
      lineHeight: 1,
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

  strong: { fontWeight: 'bold' },
  em: { fontStyle: 'italic' },
  ul: { ml: 4 },
  ol: { ml: 4 },
  a: { textDecoration: 'underline' },

  /**
   * Apply some special margin styles to "stick" headings to their content.
   */
  'h1, h2, h3, h4, h5, h6': {
    mt: 4,
    mb: -2,
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
