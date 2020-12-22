import { localPoint } from '@visx/event';
import { AreaClosed, Bar, LinePath } from '@visx/shape';
// import { ScaleLinear, ScaleTime } from 'd3-scale';
import { useCallback } from 'react';
import { TrendValue } from './helpers';

export type TrendType = 'line' | 'area';

export type TrendProps = {
  isHovered: boolean;
  trend: TrendValue[];
  type: TrendType;
  // x: ScaleTime<number, number>;
  // y: ScaleLinear<number, number>;
  x: any;
  y: any;
  onHover: (
    event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>,
    data?: TrendValue,
    xPosition?: number,
    yPosition?: number
  ) => void;
  height: number;
  width: number;
  bisect: (trend: TrendValue[], mx: number) => TrendValue;
  color: string;
};

export function Trend({
  trend,
  type = 'line',
  color,
  x,
  y,
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

      const { x: xPosition } = localPoint(event) || { x: 0 };
      const pointData = bisect(trend, xPosition);

      onHover(event, pointData, x(pointData.date_unix), y(pointData.value));
    },
    [onHover, y, x, trend, bisect]
  );

  return (
    <>
      {type === 'line' && (
        <LinePath
          data={trend}
          x={(d) => x(d.date_unix)}
          y={(d) => y(d.value)}
          stroke={color}
          strokeWidth={isHovered ? 3 : 2}
        />
      )}

      {type === 'area' && (
        <>
          <AreaClosed
            data={trend}
            x={(d) => x(d.date_unix)}
            y={(d) => y(d.value)}
            fill={color}
            fillOpacity={0.05}
            yScale={y}
          />
          <LinePath
            data={trend}
            x={(d) => x(d.date_unix)}
            y={(d) => y(d.value)}
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
