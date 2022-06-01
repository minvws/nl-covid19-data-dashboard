import { SeriesItem, SeriesSingleValue } from '../logic';
import { useGappedSeries } from '../logic/use-gapped-series';
import { LineTrend } from './line-trend';

type GappedLinedTrendProps = {
  series: SeriesSingleValue[];
  color: string;
  style?: 'solid' | 'dashed';
  strokeWidth?: number;
  getX: (v: SeriesItem) => number;
  getY: (v: SeriesSingleValue) => number;
  curve?: 'linear' | 'step';
  id: string;
};

export function GappedLinedTrend(props: GappedLinedTrendProps) {
  const { series, color, style, strokeWidth, getX, getY, curve, id } = props;

  /**
   * Here we loop through the series and each time a null value is encountered a
   * new SeriesSingleValue array is created. Effectively creating separate lines
   * for each consecutive list of defined values.
   */
  const gappedSeries = useGappedSeries(series);

  return (
    <>
      {gappedSeries.map((series, index) => (
        <LineTrend
          key={index}
          series={series}
          color={color}
          style={style}
          strokeWidth={strokeWidth}
          curve={curve}
          getX={getX}
          getY={getY}
          id={`${id}_${index}`}
        />
      ))}
    </>
  );
}
