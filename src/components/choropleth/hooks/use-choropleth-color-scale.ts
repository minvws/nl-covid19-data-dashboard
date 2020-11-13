import { scaleThreshold } from 'd3-scale';
import { useCallback, useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import { ChoroplethThresholdsValue } from '../shared';

/**
 * This hook return a color scale for the given domain and gradient.
 * If either domain or gradient is undefined, it will return a method
 * that only returns the given default color.
 *
 * If the gradient consists of an array of 2 color values, a linear color scale
 * will be created using the given domain. If the array is bigger it is
 * assumed that the indexes map directly to the data value.
 *
 * @param getData
 * @param domain
 * @param gradient
 * @param defaultColor
 */
export function useChoroplethColorScale(
  getData: (id: string) => any,
  thresholds?: ChoroplethThresholdsValue[],
  defaultColor = 'white'
) {
  const colorScale = useMemo(() => {
    if (!thresholds) {
      return undefined;
    }

    const domain = thresholds.map((t) => t.threshold);
    domain.shift();
    const color = scaleThreshold<number, string>()
      .domain(domain)
      .range(thresholds.map((t) => t.color));

    return color;
  }, [thresholds]);

  return useCallback(
    (id: string) => {
      const data = getData(id);
      if (colorScale && isPresent(data?.value)) {
        return colorScale(data.value);
      }
      return defaultColor;
    },
    [colorScale, getData, defaultColor]
  );
}
