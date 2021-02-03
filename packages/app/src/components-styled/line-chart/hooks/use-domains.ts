import { extent } from 'd3-array';
import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { calculateYMax, TrendData } from '../helpers';

export function useDomains(
  trendsList: TrendData,
  signaalwaarde?: number
): [[Date, Date] | undefined, number[], number] {
  const xDomain = useMemo(() => {
    const allData = trendsList.flat();
    const domain = extent(allData.map((d) => d.__date));

    return isDefined(domain[0]) ? (domain as [Date, Date]) : undefined;
  }, [trendsList]);

  const seriesMax = useMemo(() => calculateYMax(trendsList, signaalwaarde), [
    trendsList,
    signaalwaarde,
  ]);

  const yDomain = useMemo(() => [0, seriesMax], [seriesMax]);

  return [xDomain, yDomain, seriesMax];
}
