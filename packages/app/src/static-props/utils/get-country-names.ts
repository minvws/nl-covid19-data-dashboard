import { loadJsonFromDataFile } from './load-json-from-data-file';

export function getCountryNames() {
  const locale = process.env.NEXT_PUBLIC_LOCALE ?? 'nl';

  const names = loadJsonFromDataFile<Record<string, string>>(
    `${locale}-country-names.json`,
    'static-json'
  );

  return { countryNames: names };
}
