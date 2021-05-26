import { useMemo } from 'react';

export type ChartBreakPoints = ReturnType<typeof useChartBreakpoints>;

/**
 * This hook returns a set of booleans that indicate at which relative size the chart is rendered.
 */
export function useChartBreakpoints(chartWidth: number) {
  return useMemo(
    () => ({
      xs: chartWidth >= 1,
      sm: chartWidth >= 256,
      md: chartWidth >= 640,
      lg: chartWidth >= 840,
      xl: chartWidth >= 1000,
    }),
    [chartWidth]
  );
}
