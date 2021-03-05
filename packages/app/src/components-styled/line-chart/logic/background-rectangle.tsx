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
        return createBackgroundRectangle(
          dateRange,
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
