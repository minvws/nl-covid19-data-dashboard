import { extent } from 'd3-array';
import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { calculateYMax, TrendValue } from '../logic';

export function useDomains(
  trendsList: TrendValue[][],
  signaalwaarde?: number,
  overrideSeriesMax?: number
): [[Date, Date] | undefined, number[], number] {
  const xDomain = useMemo(() => {
    const allData = trendsList.flat();
    const domain = extent(allData.map((d) => d.__date));

    return isDefined(domain[0]) ? (domain as [Date, Date]) : undefined;
  }, [trendsList]);

  const calculatedSeriesMax = useMemo(
    () => calculateYMax(trendsList, signaalwaarde),
    [trendsList, signaalwaarde]
  );

  const seriesMax = isDefined(overrideSeriesMax)
    ? overrideSeriesMax
    : calculatedSeriesMax;

  const yDomain = useMemo(() => [0, seriesMax], [seriesMax]);

  return [xDomain, yDomain, seriesMax];
}
