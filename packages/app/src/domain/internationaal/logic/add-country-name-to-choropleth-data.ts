import { assert, KeysOfType, PickByType } from '@corona-dashboard/common';
import { International } from '~/pages/internationaal';
import { loadJsonFromDataFile } from '~/static-props/utils/load-json-from-data-file';

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;
export type InternationalLists = PickByType<International, unknown[]>;
export type InternationalListKey = keyof InternationalLists;
export type InternationalListType =
  InternationalLists[InternationalListKey][number];

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
  const item = countryData.find((x) => x.iso_a3 === iso);
  assert(item, `Unable to find country data for ISO code ${iso}`);
  return item[locale];
}

export function addCountryNameToChoroplethData<T extends InternationalListType>(
  values: T[],
  joinProperty: KeysOfType<T, string, true>
): (T & { countryName: string })[] {
  const locale: LocaleCode =
    (process.env.NEXT_PUBLIC_LOCALE as LocaleCode) ?? 'nl';

  return values.map((x) => ({
    ...x,
    countryName: findCountryName(x[joinProperty], locale),
  }));
}
