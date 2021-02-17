import { bisectLeft } from 'd3-array';
import { ScaleTime } from 'd3-scale';
import { useCallback } from 'react';
import { ChartPadding } from '~/components-styled/line-chart/components';
import { TimestampedTrendValue } from '../logic';

export type BisectFunction = ReturnType<typeof useBisect>;

export function useBisect(padding: ChartPadding) {
  return useCallback(
    (
      trendValue: TimestampedTrendValue[],
      xPosition: number,
      xScale: ScaleTime<number, number>
    ) => {
      if (!trendValue.length) return;
      if (trendValue.length === 1) return trendValue[0];

      const date = xScale.invert(xPosition - padding.left);

      const index = bisectLeft(
        trendValue.map((x) => x.__date),
        date,
        1
      );

      const d0 = trendValue[index - 1];
      const d1 = trendValue[index];

      if (!d1) return d0;

      return +date - +d0.__date > +d1.__date - +date ? d1 : d0;
    },
    [padding]
  );
}
