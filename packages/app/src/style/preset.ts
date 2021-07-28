import { asResponsiveArray } from './utils';

export type Preset = typeof preset;

export const preset = {
  typography: {
    h1: {
      /** @TODO remove `content` properties (added for debugging) */
      content: '"preset.typography.h1"',
      fontSize: asResponsiveArray({ _: 8, md: 9 }),
      lineHeight: 0,
      fontWeight: 'bold',
    },
    h2: {
      content: '"preset.typography.h2"',
      fontSize: asResponsiveArray({ _: 6, md: 7 }),
      lineHeight: 1,
      fontWeight: 'bold',
    },
    h3: {
      content: '"preset.typography.h3"',
      fontSize: asResponsiveArray({ _: 5, md: 6 }),
      lineHeight: 1,
      fontWeight: 'bold',
    },
    h4: {
      content: '"preset.typography.h4"',
      fontSize: asResponsiveArray({ _: 3, md: 4 }),
      lineHeight: 1,
      fontWeight: 'bold',
    },
    h5: {
      content: '"preset.typography.h5"',
      fontSize: 2,
      lineHeight: 1,
      fontWeight: 'bold',
    },
    subtitle1: {
      content: '"preset.typography.subtitle1"',
      fontSize: 2,
      lineHeight: 2,
      fontWeight: 'bold',
    },
    body1: {
      /** inherit */
    },
    body2: {
      fontSize: 3,
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
