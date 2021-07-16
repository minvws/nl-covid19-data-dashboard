// prettier-ignore
const space = [
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
const fontSizes = [
  '0.6875rem',  // 11px, used in chart dates labels
  '0.875rem',   // 14px, made up to fill the gap.
  '1rem',       // 16px
  '1.42383rem', // 22.78128px
  '2rem',       // 32px
  '2.02729rem', // 32.43664px
] as const;

const fontWeights = {
  normal: 400,
  bold: 600,
  heavy: 700,
} as const;

const lineHeights = [1.2, 1.4, 1.5] as const;

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

const multiseries = {
  cyan: '#219BE5',
  cyan_dark: '#005082',
  yellow: '#FFC000',
  yellow_dark: '#CF9C00',
  turquoise: '#00BBB5',
  turquoise_dark: '#089792',
  orange: '#E37321',
  orange_dark: '#A14E00',
  magenta: '#D360E5',
  magenta_dark: '#9515AA',
};

export const colors = {
  body: '#000000',
  bodyLight: '#555555',
  page: '#f3f3f3',
  blue: '#01689b',
  icon: '#01689b',
  button: '#01689b',
  link: '#01689b',
  shadow: '#e5e5e5',
  gray: '#808080',
  silver: '#c4c4c4',
  lightGray: '#dfdfdf',
  tileGray: '#f8f8f8',
  labelGray: '#666666',
  annotation: '#595959',
  header: '#cd005a',
  notification: '#cd005a',
  red: '#F35065',
  sidebarLinkBorder: '#cd005a',
  category: '#6b6b6b',
  border: '#c4c4c4',
  lightBlue: '#E0EEF6',
  restrictions: '#CD0059',
  contextualContent: '#e5eff8',
  cerulean: '#0390D6',

  data: {
    primary: '#007BC7',
    secondary: '#154273',
    neutral: '#C6C8CA',
    underReported: '#E6E6E6',
    axis: '#C4C4C4',
    axisLabels: '#666666',
    benchmark: '#4f5458',
    emphasis: '#F8E435',
    fill: 'rgba(0, 123, 199, .05)',
    margin: '#D0EDFF',
    positive: '#5BADDB',
    negative: '#F35065',
    cyan: '#219BE6',
    yellow: '#FFC000',
    scale: {
      blue: [
        '#8FCAE7',
        '#5BADDB',
        '#248FCF',
        '#0070BB',
        '#00529D',
        '#003580',
        '#001D45',
      ],
      blueDetailed: [
        '#aeddf3',
        '#8bc7e8',
        '#67b1dc',
        '#449ad1',
        '#1f83c5',
        '#006cb5',
        '#005797',
        '#00437b',
        '#002f5f',
        '#001d45',
      ],
      magenta: ['#F291BC', '#D95790', '#A11050', '#68032F', '#000000'],
      yellow: [
        '#FFF2CC',
        '#FFE699',
        '#FFD34D',
        '#FABC00',
        '#E5A400',
        '#C98600',
        '#9E6900',
      ],
    },
    gradient: {
      green: '#69c253',
      yellow: '#D3A500',
      red: '#f35065',
    },

    multiseries,

    variants: {
      alpha: multiseries.cyan,
      beta: multiseries.yellow,
      gamma: multiseries.turquoise,
      delta: multiseries.orange,
      eta: multiseries.cyan_dark,
      epsilon: multiseries.yellow_dark,
      theta: multiseries.turquoise_dark,
      kappa: multiseries.magenta,
      lambda: multiseries.magenta_dark,
      iota: multiseries.magenta_dark,
      zeta: multiseries.magenta_dark,
      other: '#808080',
    },

    vaccines: {
      bio_n_tech_pfizer: multiseries.cyan,
      moderna: multiseries.yellow,
      astra_zeneca: multiseries.turquoise,
      cure_vac: multiseries.magenta,
      janssen: multiseries.orange,
      sanofi: multiseries.cyan_dark,

      // @TODO remove when data is updated to new name
      pfizer: multiseries.cyan,
    },
  },
} as const;

const radii = [0, 5, 10];

const shadows = {
  tile: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  tooltip: '0px 2px 12px rgba(0, 0, 0, 0.1)',
} as const;

const sizes = {
  maxWidth: 1400,
  infoWidth: 1000,
  contentWidth: 700,
  maxWidthText: 600,
};

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
