import { Bar } from '@visx/shape';
import { BarProps } from '@visx/shape/lib/shapes/Bar';
import { AddSVGProps } from '@visx/shape/lib/types';
import { ScaleLinear, ScaleTime } from 'd3-scale';
import { ReactNode } from 'react';
import {
  ChartBounds,
  ComponentCallbackFunction,
  ComponentCallbackInfo,
} from '~/components-styled/line-chart/components';
import { DateRange } from '~/utils/get-trailing-date-range';

type CustomBarProps = AddSVGProps<BarProps, SVGRectElement>;

export function addBackgroundRectangleCallback(
  dateRange: DateRange,
  barProps?: CustomBarProps
): ComponentCallbackFunction {
  return (callbackInfo: ComponentCallbackInfo) => {
    switch (callbackInfo.type) {
      case 'CustomBackground': {
        const { xScale, yScale, bounds } = callbackInfo.props;
        /**
         * Get displayed range
         */
        const [displayedStartMs, displayedEndMs] = xScale
          .domain()
          .map((x) => x.getTime());

        /**
         * Get background rectangle range
         */
        const [rectangleStartMs, rectangleEndMs] = dateRange.map((x) =>
          x.getTime()
        );

        /**
         * Create clipped backround rectangle range to fit within displayed range
         */
        const dateRangeClipped = [
          new Date(Math.max(rectangleStartMs, displayedStartMs)),
          new Date(Math.min(rectangleEndMs, displayedEndMs)),
        ] as DateRange;

        return createBackgroundRectangle(
          dateRangeClipped,
          xScale,
          yScale,
          bounds,
          barProps
        );
      }
    }
  };
}

export function createBackgroundRectangle(
  dateRange: DateRange,
  xScale: ScaleTime<number, number>,
  yScale: ScaleLinear<number, number>,
  bounds: ChartBounds,
  barProps?: CustomBarProps
): ReactNode {
  const startX = xScale(dateRange[0]) ?? 0;
  const endX = xScale(dateRange[1]) ?? 0;
  const width = endX - startX;

  return width > 0 ? (
    <Bar height={bounds.height} x={startX} width={width} {...barProps} />
  ) : undefined;
}
