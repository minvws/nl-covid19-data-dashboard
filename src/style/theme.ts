const fontSizes = [12, 14, 16, 20, 24, 32];

const breakpoints = ['40em', '52em', '64em', '80em'];

const mediaQueries = {
  sm: `@media screen and (min-width: ${breakpoints[0]})`,
  md: `@media screen and (min-width: ${breakpoints[1]})`,
  lg: `@media screen and (min-width: ${breakpoints[2]})`,
  xl: `@media screen and (min-width: ${breakpoints[3]})`,
};

const space = [0, 4, 8, 16, 32, 64, 128, 256, 512];

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
