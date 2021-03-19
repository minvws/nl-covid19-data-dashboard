import { TimestampedValue } from '@corona-dashboard/common';
import { scaleLinear, scaleBand } from '@visx/scale';
import { ScaleLinear, ScaleBand } from 'd3-scale';
import { first, isEmpty, last } from 'lodash';
import { useMemo } from 'react';
import { Bounds } from '~/components-styled/time-series-chart/logic/common';
import {
  SeriesItem,
  SeriesSingleValue,
} from '~/components-styled/time-series-chart/logic/series';
import {
  GetX,
  GetY,
  ONE_DAY_IN_SECONDS,
} from '~/components-styled/time-series-chart/logic/scales';

interface UseScalesResult {
  xScale: ScaleBand<number>;
  yScale: ScaleLinear<number, number>;
  getX: GetX;
  getY: GetY;
}

export function useScales<T extends TimestampedValue>(args: {
  values: T[];
  maximumValue: number;
  tickValues?: number[];
  bounds: Bounds;
  numTicks: number;
}) {
  const { maximumValue, tickValues, bounds, numTicks, values } = args;

  return useMemo(() => {
    if (isEmpty(values)) {
      const today = Date.now() / 1000;
      return {
        xScale: scaleBand({
          domain: [today, today + ONE_DAY_IN_SECONDS],
          range: [0, bounds.width],
        }),
        yScale: scaleLinear({
          domain: [0, maximumValue],
          range: [bounds.height, 0],
        }),
        getX: (_x: SeriesItem) => 0,
        getY: (_x: SeriesSingleValue) => 0,
      };
    }

    const xScale = scaleBand({
      domain: values.map((x) => x.date_unix),
      range: [0, bounds.width],
      padding: 0.1,
    });

    const yDomain = tickValues
      ? [
          Math.min(first(tickValues) as number, 0),
          Math.max(last(tickValues) as number, maximumValue),
        ]
      : [0, maximumValue];
    const yScale = scaleLinear({
      domain: yDomain,
      range: [bounds.height, 0],
      nice: numTicks,
    });

    const result: UseScalesResult = {
      xScale,
      yScale,
      getX: (x: SeriesItem) => xScale(x.__date_unix) as number,
      getY: (x: SeriesSingleValue) => yScale(x.__value),
    };

    return result;
  }, [values, maximumValue, bounds, numTicks, tickValues]);
}
