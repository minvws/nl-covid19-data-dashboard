import { extent } from 'd3-array';
import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { calculateYMax, TrendValue } from '../logic';

export function useDomains(
  trendValues: TrendValue[],
  signaalwaarde?: number,
  overrideSeriesMax?: number
): [[Date, Date] | undefined, number[], number] {
  const xDomain = useMemo(() => {
    const allData = trendValues.flat();
    const domain = extent(allData.map((d) => d.__date));

    return isDefined(domain[0]) ? (domain as [Date, Date]) : undefined;
  }, [trendValues]);

  const calculatedSeriesMax = useMemo(
    () => calculateYMax(trendValues, signaalwaarde),
    [trendValues, signaalwaarde]
  );

  const seriesMax = isDefined(overrideSeriesMax)
    ? overrideSeriesMax
    : calculatedSeriesMax;

  const yDomain = useMemo(() => [0, seriesMax], [seriesMax]);

  return [xDomain, yDomain, seriesMax];
}
