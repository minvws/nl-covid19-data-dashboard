/**
 * Font sizes are a mess. Mixing em, rem and px. Header font size definitions
 * don't seem to have much logic behind them, with h1 and h2 being almost the
 * same size and h5 being bigger then h4.
 *
 * I've extracted some commonly used ones
 *
 * 1.125 em
 * 1.42383 rem
 * kpi 1.80203rem
 *
 * chart dates 11px
 */

const fontSizes = [12, 14, 16, 20, 24, 32];

// const fontSizes = () => {
//   let sizes = [12, 14, 16, 20, 24, 32]

//   sizes.body =  '1rem',
//   h1: '2.02729rem',
// };

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
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
}

const breakpoints: Partial<Breakpoints> = [
  '26em',
  '48em',
  '60em',
  '75em',
  '100em',
];

breakpoints.xs = breakpoints[0];
breakpoints.sm = breakpoints[1];
breakpoints.md = breakpoints[2];
breakpoints.lg = breakpoints[3];
breakpoints.xl = breakpoints[4];

const mediaQueries = {
  xs: `@media screen and (min-width: ${breakpoints[0]})`,
  sm: `@media screen and (min-width: ${breakpoints[1]})`,
  md: `@media screen and (min-width: ${breakpoints[2]})`,
  lg: `@media screen and (min-width: ${breakpoints[3]})`,
  xl: `@media screen and (min-width: ${breakpoints[4]})`,
};

const space = [
  0,
  '0.25rem', // 4px at default zoom
  '0.5rem',
  '1rem',
  '2rem',
  '4rem',
  '8rem',
  '16rem',
  '32rem',
];

const colors = {
  blue: '#01689b',
  icon: '#01689b',
  button: '#01689b',
  shadow: '#e5e5e5',
};

const radii = [0, 5, 10];

const shadows = {
  tile: `0 -1px 1px 0 ${colors.shadow}, 0 1px 1px 0 ${colors.shadow}, 0 2px 2px 0 ${colors.shadow}, 0 4px 4px 0 ${colors.shadow}, 0 6px 6px 0 ${colors.shadow}`,
};

export default {
  fontSizes,
  breakpoints,
  mediaQueries,
  space,
  colors,
  radii,
  shadows,
};
