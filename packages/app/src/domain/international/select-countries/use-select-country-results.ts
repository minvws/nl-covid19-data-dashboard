import { matchSorter } from 'match-sorter';
import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import { CountryOption } from './context';

export interface Hit<T> {
  /**
   * The `index` holds the position of a hit.
   */
  index: number;

  /**
   * The score is a float between 0 and 1.
   * A score of 1 equals the best match.
   */
  score: number;
  /**
   * The `id` is unique for every hit.
   */
  id: string;
  data: T;
}

export function useSearchResults(countries: CountryOption[], term: string) {
  const termTrimmed = term.trim();

  const { hits } = useMemo(() => {
    const hits: Hit<CountryOption>[] = search(countries, termTrimmed);

    return { hits };
  }, [countries, termTrimmed]);

  return { hits };
}

function search(countries: CountryOption[], term: string) {
  let options = countries
    .map((x) => ({
      code: x.code,
      name: x.name,
      lastValue: x.lastValue,
      isSelected: x.isSelected,
      searchTerms: [x.name, x.code, ...(x.searchTerms || [])].filter(isPresent),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  if (term !== '') {
    options = matchSorter(options, term, {
      keys: ['searchTerms'],
    });
  }

  const hits = options.map(
    (data, index) =>
      ({
        id: data.code,
        data,
        index,
        /**
         * Set score based on the order of the initial hits
         */
        score: 1 - options.indexOf(data) / options.length,
      } as Hit<CountryOption>)
  );

  return hits;
}
