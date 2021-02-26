import { PositionScale } from '@visx/shape/lib/types';
import { Threshold } from '@visx/threshold';
// import { MouseEvent, TouchEvent } from 'react';
import { RangeSeriesValue } from '../logic';

export type RangeTrendProps = {
  series: RangeSeriesValue[];
  color: string;
  fillOpacity?: number;
  strokeWidth?: number;
  style?: 'solid' | 'striped';
  xScale: PositionScale;
  yScale: PositionScale;
  // onHover: (event: TouchEvent<SVGElement> | MouseEvent<SVGElement>) => void;
};

export function RangeTrend({
  series,
  // fillOpacity = 0.05,
  // strokeWidth,
  // color,
  xScale,
  yScale,
}: // onHover,
RangeTrendProps) {
  return (
    /**
     * @TODO implement range rendering
     *
     * https://codesandbox.io/s/github/airbnb/visx/tree/master/packages/visx-demo/src/sandboxes/visx-streamgraph?file=/Example.tsx
     */
    <Threshold<RangeSeriesValue>
      id="jajoh"
      data={series}
      x={(value: RangeSeriesValue) => xScale(value.__date_unix) || 0}
      y0={(value: RangeSeriesValue) => yScale(value.__value_low) || 0}
      y1={(value: RangeSeriesValue) => yScale(value.__value_high) || 0}
      clipBelowTo={(value: RangeSeriesValue) => yScale(value.__value_low) || 0}
      clipAboveTo={(value: RangeSeriesValue) => yScale(value.__value_high) || 0}
      // fill={color}
      // fillOpacity={fillOpacity}
      // yScale={yScale}
      // stroke={color}
      // strokeWidth={strokeWidth}
      // onTouchStart={onHover}
      // onMouseLeave={onHover}
      // onMouseOver={onHover}
      // onMouseMove={onHover}
    />
  );
}
