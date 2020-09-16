import { scaleQuantile } from 'd3-scale';
import { useCallback, useMemo } from 'react';

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
export default function useChloroplethColorScale(
  getData: (id: string) => any,
  domain: [min: number, max: number] | undefined,
  gradient: string[] | undefined,
  defaultColor = 'white'
): TGetFillColor {
  const colorScale = useMemo<any>(() => {
    if (!domain || !gradient) {
      return undefined;
    }

    const color = scaleQuantile()
      .domain(domain)
      .range(gradient as any);

    return color;
  }, [domain, gradient]);

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
