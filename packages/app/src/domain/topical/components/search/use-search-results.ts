import matchSorter from 'match-sorter';
import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import safetyRegions from '~/data/index';
import municipalities from '~/data/municipalSearchData';

export interface Option {
  type: 'gm' | 'vr';
  code: string;
  name: string;
  link: string;
  searchTerms: string[];
}

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

export function useSearchResults(term: string) {
  const termTrimmed = term.trim();

  const { hits, vrHits, gmHits } = useMemo(() => {
    const hits = search(termTrimmed);
    const gmHits = hits.filter((x) => x.data.type === 'gm');
    const vrHits = hits.filter((x) => x.data.type === 'vr');

    return { hits, gmHits, vrHits };
  }, [termTrimmed]);

  return { hits, gmHits, vrHits };
}

function search(term: string, limit = 10) {
  let options = [...ALL_HITS];

  if (term !== '') {
    options = matchSorter(options, term, {
      keys: ['searchTerms'],
    });
  }

  const hits = [
    ...options.filter((x) => x.type === 'gm').slice(0, limit),
    ...options.filter((x) => x.type === 'vr').slice(0, limit),
  ].map(
    (data, index) =>
      ({
        id: data.code,
        data,
        index,
        /**
         * Set score based on the order of the initial hits
         */
        score: 1 - options.indexOf(data) / options.length,
      } as Hit<Option>)
  );

  return hits;
}

const ALL_HITS: Option[] = [
  ...municipalities.map((x) => ({
    type: 'gm' as const,
    code: x.gemcode,
    name: x.displayName || x.name,
    searchTerms: [x.name, x.displayName].filter(isPresent),
    link: `/actueel/gemeente/${x.gemcode}`,
  })),
  ...safetyRegions.map((x) => ({
    type: 'vr' as const,
    code: x.code,
    name: x.name,
    searchTerms: [x.name, ...(x.searchTerms || [])].filter(isPresent),
    link: `/actueel/veiligheidsregio/${x.code}`,
  })),
].sort((a, b) => a.name.localeCompare(b.name));
