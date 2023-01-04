import { colors } from '@corona-dashboard/common';
// prettier-ignore
export const space = [
  0,          // 0 -   0px
  '0.25rem',  // 1 -   4px at default zoom
  '0.5rem',   // 2 -   8px
  '1rem',     // 3 -  16px
  '2rem',     // 4 -  32px
  '4rem',     // 5 -  64px
  '8rem',     // 6 - 128px
  '16rem',    // 7 - 256px
  '32rem',    // 8 - 512px
] as const;

/**
 * Valid space index values
 */
export type SpaceValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/**
 * Font sizes currently are a mess. Mixing em, rem and px. Header font size definitions
 * don't seem to have much logic behind them, with h1 and h2 being almost the
 * same size and h5 being bigger then h4.
 */
const fonts = {
  body: "'RO Sans', Calibri, sans-serif",
  code: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
} as const;

// prettier-ignore
export const fontSizes = [
  '0.75rem',    // 0 -> 12px
  '0.875rem',   // 1 -> 14px
  '1rem',       // 2 -> 16px
  '1.125rem',   // 3 -> 18px
  '1.1875rem',  // 4 -> 19px
  '1.25rem',    // 5 -> 20px
  '1.375rem',   // 6 -> 22px
  '1.75rem',    // 7 -> 28px
  '2rem',       // 8 -> 32px
  '2.25rem',    // 9 -> 36px
] as const;

export const fontWeights = {
  normal: 400,
  bold: 600,
  heavy: 700,
} as const;

export const lineHeights = [1.2, 1.3, 1.5] as const;

/**
 * Breakpoints used in original code and their em equivalent
 *
 * 1600 = 100em
 * 1400 ~ 88em
 * 1200 = 75em
 * 1000 ~ 64em
 * 960 = 60em
 * 992 = 62em
 * 768 = 48em
 * 700 ~ 44em
 * 420 ~ 26em
 */

interface Breakpoints extends Array<string> {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

// @ts-expect-error ignore error, missing props are assigned after this line
const breakpoints: Breakpoints = ['26em', '48em', '60em', '75em', '100em'];
breakpoints.xs = breakpoints[0]; // ~420px
breakpoints.sm = breakpoints[1]; // ~768px
breakpoints.md = breakpoints[2]; // ~960px
breakpoints.lg = breakpoints[3]; // ~1200px
breakpoints.xl = breakpoints[4]; // ~1600px

const mediaQueries = {
  xs: `screen and (min-width: ${breakpoints[0]})`,
  sm: `screen and (min-width: ${breakpoints[1]})`,
  md: `screen and (min-width: ${breakpoints[2]})`,
  lg: `screen and (min-width: ${breakpoints[3]})`,
  xl: `screen and (min-width: ${breakpoints[4]})`,
} as const;

export const radii = [0, 5, 10];

export const shadows = {
  tile: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  tooltip: '0px 2px 12px rgba(0, 0, 0, 0.1)',
} as const;

const sizes = {
  maxWidth: 1400,
  infoWidth: 1000,
  maxWidthSiteWarning: 930,
  contentWidth: 700,
  maxWidthText: 600,
} as const;

const theme = {
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  breakpoints,
  mediaQueries,
  space,
  colors,
  radii,
  shadows,
  sizes,
} as const;

type Theme = typeof theme;

export default theme;

/**
 * Tell styled-components the shape of our theme
 */
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}
