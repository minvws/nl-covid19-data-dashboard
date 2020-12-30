import { AreaClosed, LinePath } from '@visx/shape';
import { MouseEvent, TouchEvent, useState } from 'react';
import { TrendValue } from '../helpers';

export type TrendType = 'line' | 'area';

export type TrendProps = {
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
  color: string;
};

export function Trend({
  trend,
  type = 'line',
  color,
  xScale,
  yScale,
}: TrendProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouse = (
    event: TouchEvent<SVGElement> | MouseEvent<SVGElement>
  ) => {
    console.log(event.type);
  };

  return (
    <>
      {type === 'area' && (
        <AreaClosed
          data={trend}
          x={(d) => xScale(d.__date)}
          y={(d) => yScale(d.__value)}
          fill={color}
          fillOpacity={0.05}
          yScale={yScale}
        />
      )}
      <LinePath
        style={{ pointerEvents: 'all' }}
        data={trend}
        x={(d) => xScale(d.__date)}
        y={(d) => yScale(d.__value)}
        stroke={color}
        strokeWidth={isHovered ? 3 : 2}
        onTouchStart={handleMouse}
        onMouseLeave={handleMouse}
        onMouseOver={handleMouse}
      />
    </>
  );
}
