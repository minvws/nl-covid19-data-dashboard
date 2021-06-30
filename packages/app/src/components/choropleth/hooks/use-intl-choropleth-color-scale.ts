import { assert } from '@corona-dashboard/common';
import { scaleThreshold } from '@visx/scale';
import { useCallback, useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import { internationalThresholds } from '../international-thresholds';

export function useIntlChoroplethColorScale(
  metricProperty: string,
  defaultColor = 'white'
) {
  const thresholds = internationalThresholds[metricProperty];

  const colorScale = useMemo(() => {
    assert(
      Array.isArray(thresholds),
      `thresholds is not of type Array: ${JSON.stringify(thresholds)}`
    );

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
