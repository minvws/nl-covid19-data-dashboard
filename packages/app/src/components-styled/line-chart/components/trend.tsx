import { localPoint } from '@visx/event';
import { AreaClosed, Bar, LinePath } from '@visx/shape';
import { useCallback } from 'react';
import { TrendValue } from '../helpers';

export type TrendType = 'line' | 'area';

export type TrendProps = {
  isHovered: boolean;
  trend: TrendValue[];
  type: TrendType;
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
  onHover: (
    event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>,
    data?: TrendValue,
    xPosition?: number,
    yPosition?: number
  ) => void;
  height: number;
  width: number;
  bisect: (trend: TrendValue[], xPosition: number) => TrendValue;
  color: string;
};

export function Trend({
  trend,
  type = 'line',
  color,
  xScale,
  yScale,
  onHover,
  height,
  width,
  isHovered,
  bisect,
}: TrendProps) {
  const handlePointerMove = useCallback(
    (
      event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>
    ) => {
      if (trend.length < 1) return null;

      const { x } = localPoint(event) || { x: 0 };
      const pointData = bisect(trend, x);

      onHover(
        event,
        pointData,
        xScale(pointData.__date),
        yScale(pointData.__value)
      );
    },
    [onHover, yScale, xScale, trend, bisect]
  );

  return (
    <>
      {type === 'line' && (
        <LinePath
          data={trend}
          x={(d) => xScale(d.__date)}
          y={(d) => yScale(d.__value)}
          stroke={color}
          strokeWidth={isHovered ? 3 : 2}
        />
      )}

      {type === 'area' && (
        <>
          <AreaClosed
            data={trend}
            x={(d) => xScale(d.__date)}
            y={(d) => yScale(d.__value)}
            fill={color}
            fillOpacity={0.05}
            yScale={yScale}
          />
          <LinePath
            data={trend}
            x={(d) => xScale(d.__date)}
            y={(d) => yScale(d.__value)}
            stroke={color}
            strokeWidth={isHovered ? 3 : 2}
          />
        </>
      )}

      <Bar
        x={0}
        y={0}
        width={width}
        height={height}
        fill="transparent"
        rx={14}
        onTouchStart={handlePointerMove}
        onTouchMove={handlePointerMove}
        onMouseMove={handlePointerMove}
        onMouseLeave={(event) => onHover(event)}
      />
    </>
  );
}
