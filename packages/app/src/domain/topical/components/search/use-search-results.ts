import matchSorter from 'match-sorter';
import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import municipalities from '~/data/gemeente_veiligheidsregio.json';
import safetyRegions from '~/data/index';

export interface Option {
  type: 'gm' | 'vr';
  code: string;
  name: string;
  link: string;
  searchTerms: string[];
}

export interface Hit<T> {
  index: number;
  score: number;
  id: string;
  data: T;
}

export function useSearchResults(term: string) {
  const termTrimmed = term.trim();

  return useMemo(() => {
    const hits =
      termTrimmed === ''
        ? HITS
        : matchSorter(HITS, termTrimmed, {
            keys: ['searchTerms'],
          });

    const gmHitsSliced = hits.filter((x) => x.type === 'gm').slice(0, 10);
    const vrHitsSliced = hits.filter((x) => x.type === 'vr').slice(0, 10);

    const hitsWithIndex = [...gmHitsSliced, ...vrHitsSliced].map(
      (data, index) =>
        ({
          id: data.code,
          data,
          index,
          score: 1 - hits.indexOf(data) / hits.length,
        } as Hit<Option>)
    );

    return {
      hits: hitsWithIndex,
      gmHits: hitsWithIndex.filter((x) => x.data.type === 'gm'),
      vrHits: hitsWithIndex.filter((x) => x.data.type === 'vr'),
    };
  }, [termTrimmed]);
}

const HITS: Option[] = [
  ...[],
  ...municipalities.map((x) => ({
    type: 'gm' as const,
    code: x.gemcode,
    name: x.displayName || x.name,
    searchTerms: [x.name, x.displayName].filter(isPresent),
    link: `/gemeente/${x.gemcode}/actueel`,
  })),
  ...safetyRegions.map((x) => ({
    type: 'vr' as const,
    code: x.code,
    name: x.name,
    searchTerms: [x.name, ...(x.searchTerms || [])].filter(isPresent),
    link: `/veiligheidsregio/${x.code}/actueel`,
  })),
].sort((a, b) => a.name.localeCompare(b.name));
