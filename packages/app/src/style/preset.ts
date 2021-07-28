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
      marginBottom: 2,
    },
    body2: {
      marginBottom: 2,
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
    caption1: {
      fontSize: 1,
      lineHeight: 1,
    },
    caption2: {
      fontSize: 0,
      lineHeight: 1,
    },
  },
} as const;
