import { assert } from '@corona-dashboard/common';
import { scaleThreshold } from '@visx/scale';
import { useCallback, useMemo } from 'react';
import { isDefined, isPresent } from 'ts-is-present';
import { inThresholds } from './in-thresholds';

export function useInChoroplethColorScale(
  metricProperty: string,
  defaultColor = 'white'
) {
  const thresholds = inThresholds[metricProperty];

  assert(
    isDefined(thresholds),
    `Could not find threshold data for metric property ${metricProperty}`
  );

  const colorScale = useMemo(() => {
    const domain = thresholds.map((t) => t.threshold);
    domain.shift();
    return scaleThreshold<number, string>()
      .domain(domain)
      .range(thresholds.map((t) => t.color));
  }, [thresholds]);

  return useCallback(
    (value: number) => {
      return isPresent(value) ? colorScale(value) : defaultColor;
    },
    [colorScale, defaultColor]
  );
}
