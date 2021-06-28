import { assert, KeysOfType } from '@corona-dashboard/common';
import { isFunction } from 'lodash';
import { loadJsonFromDataFile } from './load-json-from-data-file';

type LocaleCode = 'nl' | 'en';

type CountryData = {
  en: string;
  nl: string;
  iso_a3: string;
};

const countryData = loadJsonFromDataFile<CountryData[]>(
  'country-data.json',
  'static-json'
);

function findCountryName(iso: string, locale: LocaleCode) {
  const item = countryData.find(
    (x) => x.iso_a3.toLocaleLowerCase() === iso.toLocaleLowerCase()
  );
  assert(item, `Unable to find country data for ISO code ${iso}`);
  return item[locale];
}

type JoinFunction<T> = (value: T) => string;

export function getLocalisedCountryNames<T extends Record<string, any>>(
  values: T[],
  joinStrategy: KeysOfType<T, string, true> | JoinFunction<T>
) {
  const locale: LocaleCode =
    (process.env.NEXT_PUBLIC_LOCALE as LocaleCode) ?? 'nl';

  return Object.fromEntries(
    values.map((x) => [
      isFunctionParam(joinStrategy) ? joinStrategy(x) : x[joinStrategy],
      findCountryName(
        isFunctionParam(joinStrategy) ? joinStrategy(x) : x[joinStrategy],
        locale
      ),
    ])
  ) as Record<string, string>;
}

function isFunctionParam<T extends Record<string, any>>(
  value: KeysOfType<T, string, true> | JoinFunction<T>
): value is JoinFunction<T> {
  return isFunction(value);
}
