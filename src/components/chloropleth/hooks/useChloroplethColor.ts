import { scaleLinear } from '@vx/scale';
import { useCallback, useMemo } from 'react';

export type TGetFillColor = (id: string) => string;

export default function useChloroplethColor(
  getData: (id: string) => any,
  domain: [min: number, max: number] | undefined,
  gradient: string[] | undefined,
  defaultColor = 'white'
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
        return colorScale(data.value);
      }
      return defaultColor;
    },
    [colorScale, getData, defaultColor]
  );
}
