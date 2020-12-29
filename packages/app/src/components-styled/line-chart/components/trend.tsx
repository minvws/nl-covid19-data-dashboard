import { AreaClosed, LinePath } from '@visx/shape';
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
  color: string;
};

export function Trend({
  trend,
  type = 'line',
  color,
  xScale,
  yScale,
  isHovered,
}: TrendProps) {
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
    </>
  );
}
