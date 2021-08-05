import { GetStaticPropsContext } from 'next';
import { loadJsonFromDataFile } from './load-json-from-data-file';

export function getCountryNames(context: GetStaticPropsContext) {
  const { locale = 'nl' } = context;

  const names = loadJsonFromDataFile<Record<string, string>>(
    `${locale}-country-names.json`,
    'static-json'
  );

  return { countryNames: names };
}
