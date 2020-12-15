import { useCallback } from 'react';
import { AreaClosed, LinePath, Bar } from '@visx/shape';
import { localPoint } from '@visx/event';

export const trendTypes = {
  line: 'line',
  area: 'area',
};

export type Props = {
  isHovered: boolean;
  trend: any;
  type: string;
  x: any;
  y: any;
  handleHover: any;
  size: any;
  bisect: any;
  color: string;
};

// TODO: update to accept series prop which accepts an array of
// trends to enable plotting of multiple lines
export function Trends({
  trend,
  type = trendTypes.line,
  color,
  x,
  y,
  handleHover,
  size,
  isHovered,
  bisect,
}: Props) {
  const onPointerMove = useCallback(
    (
      event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>
    ) => {
      if (trend.length < 1) return null;

      const { x: xPosition } = localPoint(event) || { x: 0 };
      const pointData = bisect(trend, xPosition);

      handleHover(event, pointData, x(pointData.date), y(pointData.value));
    },
    [handleHover, y, x, trend, bisect]
  );

  return (
    <>
      {type === trendTypes.line && (
        <LinePath
          data={trend}
          x={(d: any) => x(d.date)}
          y={(d: any) => y(d.value)}
          stroke={color}
          strokeWidth={isHovered ? 3 : 2}
        />
      )}

      {type === trendTypes.area && (
        <>
          <AreaClosed
            data={trend}
            x={(d: any) => x(d.date)}
            y={(d: any) => y(d.value)}
            fill={color}
            fillOpacity={0.05}
            yScale={y}
          />
          <LinePath
            data={trend}
            x={(d: any) => x(d.date)}
            y={(d: any) => y(d.value)}
            stroke={color}
            strokeWidth={isHovered ? 3 : 2}
          />
        </>
      )}

      <Bar
        x={0}
        y={0}
        width={size.width}
        height={size.height}
        fill="transparent"
        rx={14}
        onTouchStart={onPointerMove}
        onTouchMove={onPointerMove}
        onMouseMove={onPointerMove}
        onMouseLeave={(event) => handleHover(event)}
      />
    </>
  );
}
