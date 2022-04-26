import { gmData, vrData } from '@corona-dashboard/common';
import { matchSorter } from 'match-sorter';
import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import { useReverseRouter } from '~/utils/use-reverse-router';

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
  const reverseRouter = useReverseRouter();
  const termTrimmed = term.trim();

  const { hits, vrHits, gmHits } = useMemo(() => {
    const hits: Hit<Option>[] = search(termTrimmed).map((x) => {
      const link =
        x.data.type === 'gm'
          ? reverseRouter.actueel.gm(x.data.code)
          : reverseRouter.actueel.vr(x.data.code);

      return {
        ...x,
        data: {
          ...x.data,
          link,
        },
      };
    });

    const gmHits = hits.filter((x) => x.data.type === 'gm');
    const vrHits = hits.filter((x) => x.data.type === 'vr');

    return { hits, gmHits, vrHits };
  }, [termTrimmed, reverseRouter]);

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
      } as Hit<Omit<Option, 'link'>>)
  );

  return hits;
}

const expStr = new RegExp(["'s-"].join(' | '), 'g');

const ALL_HITS: Omit<Option, 'link'>[] = [
  ...gmData.map((x) => ({
    type: 'gm' as const,
    code: x.gemcode,
    name: x.displayName || x.name,
    searchTerms: [x.name, x.displayName]
      .concat(x.searchTerms)
      .filter(isPresent),
  })),
  ...vrData.map((x) => ({
    type: 'vr' as const,
    code: x.code,
    name: x.name,
    searchTerms: [x.name, ...(x.searchTerms || [])].filter(isPresent),
  })),
].sort((a, b) =>
  a.name.replace(expStr, '').localeCompare(b.name.replace(expStr, ''))
);
