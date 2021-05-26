import { useMemo } from 'react';

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
