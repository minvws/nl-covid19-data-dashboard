import { localPoint } from '@visx/event';
import { AreaClosed, Bar, LinePath } from '@visx/shape';
import { useCallback } from 'react';

export type DataPoint = {
  date: Date;
  value?: number;
};

export type TrendType = 'line' | 'area';

export type TrendsProps = {
  isHovered: boolean;
  trend: DataPoint[];
  type: TrendType;
  x: any;
  y: any;
  onHover: (
    event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>,
    data?: DataPoint,
    xPosition?: number,
    yPosition?: number
  ) => void;
  height: number;
  width: number;
  bisect: (trend: DataPoint[], mx: number) => DataPoint;
  color: string;
};

/**
 * @TODO update to accept series prop which accepts an array of trends to enable plotting of multiple lines
 */
export function Trends({
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
}: TrendsProps) {
  const handlePointerMove = useCallback(
    (
      event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>
    ) => {
      if (trend.length < 1) return null;

      const { x: xPosition } = localPoint(event) || { x: 0 };
      const pointData = bisect(trend, xPosition);

      onHover(event, pointData, x(pointData.date), y(pointData.value));
    },
    [onHover, y, x, trend, bisect]
  );

  return (
    <>
      {type === 'line' && (
        <LinePath
          data={trend}
          x={(d: DataPoint) => x(d.date)}
          y={(d: DataPoint) => y(d.value)}
          stroke={color}
          strokeWidth={isHovered ? 3 : 2}
        />
      )}

      {type === 'area' && (
        <>
          <AreaClosed
            data={trend}
            x={(d: DataPoint) => x(d.date)}
            y={(d: DataPoint) => y(d.value)}
            fill={color}
            fillOpacity={0.05}
            yScale={y}
          />
          <LinePath
            data={trend}
            x={(d: DataPoint) => x(d.date)}
            y={(d: DataPoint) => y(d.value)}
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
