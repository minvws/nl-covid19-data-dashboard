import { scaleLinear } from '@vx/scale';
import useExtent from './useExtent';
import { useMemo } from 'react';

export default function useMapColorScale<T>(
  data: Record<string, T>,
  dataPredicate: (item: T) => number,
  gradient: [minColor: string, maxColor: string]
) {
  const list = Object.values(data);
  const domain = useExtent(list, dataPredicate);

  return useMemo(() => {
    const color = scaleLinear({
      domain: domain,
      range: [gradient[0], gradient[1]],
    });

    return color;
  }, [domain, gradient]);
}
