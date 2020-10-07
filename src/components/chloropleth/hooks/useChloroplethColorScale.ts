import { scaleThreshold } from 'd3-scale';
import { useCallback, useMemo } from 'react';
import { ChoroplethThresholdsValue } from '../shared';

export type TGetFillColor = (id: string) => string;

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
export function useChloroplethColorScale(
  getData: (id: string) => any,
  thresholds?: ChoroplethThresholdsValue[],
  defaultColor = 'white'
): TGetFillColor {
  const colorScale = useMemo<any>(() => {
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
      if (colorScale && data?.value !== undefined) {
        return colorScale(data.value);
      }
      return defaultColor;
    },
    [colorScale, getData, defaultColor]
  );
}
