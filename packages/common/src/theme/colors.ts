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

type ColorsWithoutRanges = O.Omit<typeof colors, 'scale'>;
export type Color = Join<PathsToStringProps<ColorsWithoutRanges>, '.'>;

//Based on https://www.rijkshuisstijl.nl/basiselementen/basiselementen-online/online-kleuren
const colorDefinitions = {
  //Gray scales
  white: '#ffffff',
  gray1: '#f3f3f3',
  gray2: '#e6e6e6',
  gray3: '#cccccc',
  gray4: '#b4b4b4',
  gray5: '#999999',
  gray6: '#696969',
  gray7: '#535353',
  gray8: '#4f5458',
  black: '#000000',
  neutral: '#C6C8CA',
  blackOpacity: '#0000000d',
  //Red scales
  red1: '#f7e8e7',
  red2: '#F35065',
  red3: '#9f3430',
  //Orange scales
  orange1: '#E37321',
  orange2: '#A14E00',
  //Yellow scales
  yellow1: '#FFF4C1',
  yellow2: '#fee670',
  yellow3: '#FFC000',
  yellow4: '#D3A500',
  yellow5: '#CF9C00',
  //Green scales
  green1: '#69c253',
  green2: '#69c253',
  green3: '#00BB95',
  green4: '#008372',
  //Blue scales
  primary: '#007BC7',
  secondary: '#154273',
  primaryOpacity: '#007bc70d',
  blue1: '#e5eff8',
  blue2: '#D0EDFF',
  blue3: '#aeddf3',
  blue4: '#8bc7e8',
  blue5: '#67b1dc',
  blue6: '#219BE5',
  blue7: '#0053FD',
  blue8: '#01689b',
  blue9: '#005082',
  blue10: '#003580',
  //Magenta scales
  magenta1: '#D360E5',
  magenta2: '#9515AA',
  magenta3: '#cd005a',
  magenta4: '#aa004b',
  //transparent
  transparent: 'transparent',
};
export const colors = {
  ...colorDefinitions,
  scale: {
    blue: ['#8FCAE7', '#5BADDB', '#248FCF', '#0070BB', '#00529D', '#003580', '#001D45'],
    blueDetailed: ['#aeddf3', '#8bc7e8', '#67b1dc', '#449ad1', '#1f83c5', '#006cb5', '#005797', '#00437b', '#002f5f', '#001d45'],
    magenta: ['#F291BC', '#D95790', '#A11050', '#68032F', '#000000'],
    yellow: ['#FFF2CC', '#FFE699', '#FFD34D', '#FABC00', '#E5A400', '#C98600', '#9E6900'],
  },

  variants: {
    colorList: [
      '#D360E5',
      '#00BB95',
      '#FFC000',
      '#219BE5',
      '#E37321',
      '#6200AF',
      '#008372',
      '#CF9C00',
      '#005082',
      '#A14E00',
      '#D7019B',
      '#00AE31',
      '#FFE500',
      '#0053FD',
      '#F65234',
      '#9515AA',
      '#001100',
      '#FF9900',
      '#0011A9',
      '#C80000',
    ],
  },

  vaccines: {
    bio_n_tech_pfizer: colorDefinitions.blue6,
    moderna: colorDefinitions.yellow3,
    astra_zeneca: colorDefinitions.green2,
    cure_vac: colorDefinitions.magenta1,
    janssen: colorDefinitions.orange1,
    sanofi: colorDefinitions.blue9,
    novavax: colorDefinitions.magenta2,

    // @TODO remove when data is updated to new name
    pfizer: colorDefinitions.blue6,

    /**
     * The below list are duplicates of the above entries, because BE is
     * unabled to deliver specific IDs that match with previously delivered
     * data entry IDs. This has been introduced as part of COR-938.
     * @TODO - remove duplicates when/if BE is able to provide IDs.
     */
    'BioNTech/Pfizer': colorDefinitions.blue6,
    Moderna: colorDefinitions.yellow3,
    AstraZeneca: colorDefinitions.green2,
    Janssen: colorDefinitions.orange1,
    Novavax: colorDefinitions.magenta2,
  },
} as const;
