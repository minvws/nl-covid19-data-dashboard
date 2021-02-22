import { useMemo } from 'react';
import { ChartPadding } from '~/components-styled/line-chart/components';

export function useChartPadding(
  leftPos: number,
  defaultPadding: ChartPadding,
  overridePadding?: Partial<ChartPadding>
) {
  return useMemo(() => {
    return {
      ...defaultPadding,
      // Increase space for larger labels
      left: Math.max(leftPos, defaultPadding.left),
      ...overridePadding,
    } as ChartPadding;
  }, [defaultPadding, overridePadding, leftPos]);
}
