import { scaleLinear } from '@vx/scale';
import { useCallback, useMemo } from 'react';

export type TGetFillColor = (id: string) => string;

/**
 * This hook return a color scale for the given domain and gradient.
 * If either domain or gradient is undefined, it will return the given
 * default color.
 *
 * When the received value is undefined the given noDataCOlor is returned.
 *
 * If the gradient consists of an array of 2 color values, a linear color scale
 * will be created using the given domain. If the array is bigger it is
 * assumed that the indexes map directly to the data value.
 *
 * @param getData
 * @param domain
 * @param gradient
 * @param defaultColor
 * @param noDataColor
 */
export default function useChloroplethColorScale(
  getData: (id: string) => any,
  domain: [min: number, max: number] | undefined,
  gradient: string[] | undefined,
  defaultColor = 'white',
  noDataColor = 'grey'
): TGetFillColor {
  const colorScale = useMemo(() => {
    if (!domain || !gradient) {
      return undefined;
    }

    const color =
      gradient.length === 2
        ? scaleLinear({
            domain: domain,
            range: gradient,
          })
        : (value: number) => gradient[value - 1];

    return color;
  }, [domain, gradient]);

  return useCallback(
    (id: string) => {
      if (colorScale) {
        const data = getData(id);
        return data.value ? colorScale(data.value) : noDataColor;
      }
      return defaultColor;
    },
    [colorScale, getData, defaultColor]
  );
}
