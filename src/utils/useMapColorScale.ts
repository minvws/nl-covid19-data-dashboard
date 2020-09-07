import { scaleQuantize } from '@vx/scale';
import useExtent from './useExtent';

export default function useMapColorScale<T>(
  data: Record<string, T>,
  dataPredicate: (item: T) => number,
  gradient: [minColor: string, maxColor: string]
) {
  const list = Object.values(data);

  const [min, max] = useExtent(list, dataPredicate);

  const color = scaleQuantize({
    domain: [min, max],
    range: [gradient[0], gradient[1]],
  });

  return color;
}
