import { scaleLinear } from '@vx/scale';
import useExtent from './useExtent';
import { useMemo } from 'react';

export default function useMapColorScale<T>(
  data: Record<string, T>,
  dataPredicate: (item: T) => number,
  gradient: string[]
) {
  const list = Object.values(data ?? {});
  const domain = useExtent(list, dataPredicate);

  return useMemo(() => {
    const color =
      gradient.length === 2
        ? scaleLinear({
            domain: domain,
            range: gradient,
          })
        : (value: number) => gradient[value - 1];

    return color;
  }, [domain, gradient]);
}
