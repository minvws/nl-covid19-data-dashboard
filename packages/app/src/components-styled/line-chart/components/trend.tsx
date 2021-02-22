import { AreaClosed, LinePath } from '@visx/shape';
import { MouseEvent, TouchEvent, useState } from 'react';
import { ChartScales } from '~/components-styled/line-chart/components';
import { colors } from '~/style/theme';
import { TrendValue } from '../logic';

export type TrendType = 'line' | 'area';
export type LineStyle = 'solid' | 'dashed';

export type TrendProps = {
  trend: TrendValue[];
  type?: TrendType;
  areaFillOpacity?: number;
  strokeWidth?: number;
  style?: LineStyle;
  /**
   * I would like to type these as follows:
   *
   * xScale: ScaleTime<number, number>;
   * yScale: ScaleLinear<number, number>;
   *
   * ... using the types from 'd3-scale' but the visx components used here do not
   * allow it.
   */
  xScale: any;
  yScale: any;
  color?: string;
  smallscreen?: boolean;
  onHover?: (
    event: TouchEvent<SVGElement> | MouseEvent<SVGElement>,
    scales: ChartScales
  ) => void;
};

export function Trend({
  trend,
  type = 'line',
  areaFillOpacity = 0.05,
  strokeWidth = 2,
  style = 'solid',
  color = colors.data.primary,
  xScale,
  yScale,
  onHover,
  smallscreen,
}: TrendProps) {
  const [isHovered, setIsHovered] = useState(false);

  const scales = { xScale, yScale };

  const handleHover = (
    event: TouchEvent<SVGElement> | MouseEvent<SVGElement>
  ) => {
    const isLeave = event.type === 'mouseleave';
    setIsHovered(!isLeave);
    if (onHover) {
      onHover(event, scales);
    }
  };

  const dashes = style === 'dashed' ? (smallscreen ? 4 : 10.4) : undefined;

  return (
    <>
      {type === 'area' && (
        <AreaClosed
          style={{ pointerEvents: 'all' }}
          data={trend}
          x={(d) => xScale(d.__date)}
          y={(d) => yScale(d.__value)}
          fill={color}
          fillOpacity={areaFillOpacity}
          yScale={yScale}
          onTouchStart={handleHover}
          onMouseLeave={handleHover}
          onMouseOver={handleHover}
          onMouseMove={handleHover}
        />
      )}
      <LinePath
        style={{ pointerEvents: 'all' }}
        data={trend}
        x={(d) => xScale(d.__date)}
        y={(d) => yScale(d.__value)}
        stroke={color}
        strokeWidth={isHovered ? strokeWidth + 1 : strokeWidth}
        strokeDasharray={dashes}
        onTouchStart={handleHover}
        onMouseLeave={handleHover}
        onMouseOver={handleHover}
        onMouseMove={handleHover}
      />
    </>
  );
}
