import { europeGeo } from '~/components/choropleth/topology';

const nonEurope = [
  'MAR',
  'DZA',
  'TUN',
  'LBY',
  'EGY',
  'SAU',
  'IRN',
  'IRQ',
  'JOR',
  'ISR',
  'PSE',
  'LBN',
  'RUS',
  'GEO',
  'AZE',
  'ARM',
  'TUR',
  'SYR',
];

const countryCodes = europeGeo.features
  .map((x) => x.properties.ISO_A3)
  .filter((x) => !nonEurope.includes(x));

export function choroplethMockData() {
  return countryCodes.map((code) => ({
    country_code: code,
    infected_average: random(),
    infected_per_100k_average: random(),
    date_start_unix: 0,
    date_end_unix: 0,
    date_of_insertion_unix: 0,
  }));
}

function random() {
  const value = Math.random() * 50;
  return +value.toFixed(2);
}
