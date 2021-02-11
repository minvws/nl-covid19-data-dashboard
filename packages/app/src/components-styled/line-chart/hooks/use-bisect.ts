import { TimestampedValue } from '@corona-dashboard/common';
import { bisectLeft } from 'd3-array';
import { ScaleTime } from 'd3-scale';
import { useCallback } from 'react';
import { ChartPadding } from '../components';
import { TrendValue } from '../logic';

export type BisectFunction = ReturnType<typeof useBisect>;

export function useBisect(padding: ChartPadding) {
  return useCallback(
    (
      trend: (TrendValue & TimestampedValue)[],
      xPosition: number,
      xScale: ScaleTime<number, number>
    ) => {
      if (!trend.length) return;
      if (trend.length === 1) return trend[0];

      const date = xScale.invert(xPosition - padding.left);

      const index = bisectLeft(
        trend.map((x) => x.__date),
        date,
        1
      );

      const d0 = trend[index - 1];
      const d1 = trend[index];

      if (!d1) return d0;

      return +date - +d0.__date > +d1.__date - +date ? d1 : d0;
    },
    [padding]
  );
}
