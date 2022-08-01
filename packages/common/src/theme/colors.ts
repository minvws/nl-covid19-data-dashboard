import { O } from 'ts-toolbelt';
/**
 * See: https://stackoverflow.com/a/47058976
 *
 * First we can use recursive conditional types as implemented in microsoft/TypeScript#40002
 * and variadic tuple types as implemented in microsoft/TypeScript#39094 to turn an object type
 * into a union of tuples of keys corresponding to its string-valued properties:
 */
type PathsToStringProps<T> = T extends string
  ? []
  : {
      [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
    }[Extract<keyof T, string>];

/**
 * And then we can use template string types to join a tuple of string literals into a dotted path
 * (or any delimiter)
 */
type Join<T extends string[], D extends string> = T extends []
  ? never
  : T extends [infer F]
  ? F
  : T extends [infer F, ...infer R]
  ? F extends string
    ? `${F}${D}${Join<Extract<R, string[]>, D>}`
    : never
  : string;

type ColorsWithoutRanges = O.Omit<typeof colors, 'data.scale'>;
export type Color = Join<PathsToStringProps<ColorsWithoutRanges>, '.'>;
export type DataColor = keyof Omit<typeof colors['data'], 'scale'>;

const multiseries = {
  cyan: '#219BE5',
  cyan_dark: '#005082',
  yellow: '#FFC000',
  yellow_dark: '#CF9C00',
  turquoise: '#00BB95',
  turquoise_dark: '#008372',
  orange: '#E37321',
  orange_dark: '#A14E00',
  magenta: '#D360E5',
  magenta_dark: '#9515AA',
};

export const colors = {
  white: '#fff',
  body: '#000000',
  bodyLight: '#555555',
  offWhite: '#f3f3f3',
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
  sidebarLinkBorder: '#01689b',
  category: '#6b6b6b',
  border: '#c4c4c4',
  lightBlue: '#E0EEF6',
  restrictions: '#CD0059',
  contextualContent: '#e5eff8',
  cerulean: '#0390D6',
  tooltipIndicator: '#000000',
  buttonLightBlue: '#C2E4F4',
  choroplethFeatureStroke: '#fff',
  choroplethOutlineStroke: '#c4c4c4',
  choroplethHighlightStroke: '#000000',
  choroplethNoData: '#fff',
  warningYellow: '#fee670',

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
    partial_vaccination: '#8FCAE7',
    negative: '#F35065',
    cyan: '#219BE6',
    yellow: '#FFC000',
    darkBlue: '#003580',
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
      colorList: [
        '#FFC000',
        '#219BE5',
        '#00BB95',
        '#E37321',
        '#D360E5',
        '#CF9C00',
        '#005082',
        '#008372',
        '#A14E00',
        '#9515AA',
        '#0053FD',
        '#FFE500',
        '#02C238',
        '#F65234',
        '#D7019B',
      ],
      other_table: '#808080',
      other_graph: '#808080',
      fallbackColor: '#808080',
    },

    vaccines: {
      bio_n_tech_pfizer: multiseries.cyan,
      moderna: multiseries.yellow,
      astra_zeneca: multiseries.turquoise,
      cure_vac: multiseries.magenta,
      janssen: multiseries.orange,
      sanofi: multiseries.cyan_dark,
      novavax: multiseries.magenta_dark,

      // @TODO remove when data is updated to new name
      pfizer: multiseries.cyan,

      /**
       * The below list are duplicates of the above entries, because BE is
       * unabled to deliver specific IDs that match with previously delivered
       * data entry IDs. This has been introduced as part of COR-938.
       * @TODO - remove duplicates when/if BE is able to provide IDs.
       */
      'BioNTech/Pfizer': multiseries.cyan,
      Moderna: multiseries.yellow,
      AstraZeneca: multiseries.turquoise,
      Janssen: multiseries.orange,
      Novavax: multiseries.magenta_dark,
    },
  },
} as const;
