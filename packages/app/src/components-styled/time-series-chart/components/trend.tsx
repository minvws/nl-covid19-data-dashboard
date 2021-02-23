import { AreaClosed, LinePath } from '@visx/shape';
import { MouseEvent, TouchEvent, useState } from 'react';
import { colors } from '~/style/theme';
import { TrendValue } from '~/components-styled/line-chart/logic';
import { PositionScale } from '@visx/shape/lib/types';

export type TrendType = 'line' | 'area';
export type LineStyle = 'solid' | 'dashed';

export type TrendProps = {
  trend: TrendValue[];
  type?: TrendType;
  areaFillOpacity?: number;
  strokeWidth?: number;
  style?: LineStyle;
  getX: (v: TrendValue) => number;
  getY: (v: TrendValue) => number;
  yScale: PositionScale;
  color?: string;
  onHover: (event: TouchEvent<SVGElement> | MouseEvent<SVGElement>) => void;
};

export function Trend({
  trend,
  type = 'line',
  areaFillOpacity = 0.05,
  strokeWidth = 2,
  style = 'solid',
  color = colors.data.primary,
  getX,
  getY,
  yScale,
  onHover,
}: TrendProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = (
    event: TouchEvent<SVGElement> | MouseEvent<SVGElement>
  ) => {
    const isLeave = event.type === 'mouseleave';
    setIsHovered(!isLeave);
    onHover(event);
  };

  const dashes = style === 'dashed' ? 4 : undefined;

  return (
    <>
      {type === 'area' && (
        <AreaClosed
          style={{ pointerEvents: 'all' }}
          data={trend}
          x={getX}
          y={getY}
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
        x={getX}
        y={getY}
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
