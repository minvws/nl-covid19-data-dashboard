import { TimestampedValue } from '@corona-dashboard/common';
import { ScaleLinear } from 'd3-scale';
import { memo } from 'react';
import { colors } from '~/style/theme';
import { AreaTrend, LineTrend, RangeTrend } from '.';
import {
  Bounds,
  GetX,
  GetY,
  GetY0,
  GetY1,
  HoverHandler,
  SeriesConfig,
  SeriesDoubleValue,
  SeriesList,
  SeriesSingleValue,
} from '../logic';

interface SeriesProps<T extends TimestampedValue> {
  onHover: HoverHandler;
  seriesConfig: SeriesConfig<T>;
  seriesList: SeriesList;
  getX: GetX;
  /**
   * @TODO it's maybe not worth it creating the getY functions in the hook and
   * passing them along. Since we also need the yScale here anyway, we might as
   * well let each component make its own y getters based on yScale. GetX is
   * used in more places and is more universal so that might still be worth
   * passing along instead of xScale.
   */
  getY: GetY;
  getY0: GetY0;
  getY1: GetY1;
  yScale: ScaleLinear<number, number>;
  bounds: Bounds;
}

export const Series = memo(SeriesUnmemoized) as typeof SeriesUnmemoized;

function SeriesUnmemoized<T extends TimestampedValue>({
  onHover,
  seriesConfig,
  seriesList,
  getX,
  getY,
  getY0,
  getY1,
  yScale,
  bounds,
}: SeriesProps<T>) {
  return (
    <>
      {seriesList.map((series, index) => {
        const config = seriesConfig[index];

        const filteredSeries = (series as any[]).filter((x) => {
          return x.__value !== null && x.__value_a !== null;
        });

        switch (config.type) {
          case 'line':
            return (
              <LineTrend
                key={config.metricProperty as string}
                series={filteredSeries as SeriesSingleValue[]}
                color={config.isFaded ? colors.data.faded : config.color}
                style={config.style}
                strokeWidth={config.strokeWidth}
                getX={getX}
                getY={getY}
                onHover={(evt) => onHover(evt, index)}
              />
            );
          case 'area':
            return (
              <AreaTrend
                key={index}
                series={filteredSeries as SeriesSingleValue[]}
                color={config.color}
                style={config.style}
                fillOpacity={config.fillOpacity}
                strokeWidth={config.strokeWidth}
                getX={getX}
                getY={getY}
                yScale={yScale}
                onHover={(evt) => onHover(evt, index)}
              />
            );

          case 'range':
            return (
              <RangeTrend
                key={config.metricPropertyLow as string}
                series={filteredSeries as SeriesDoubleValue[]}
                color={config.color}
                fillOpacity={config.fillOpacity}
                strokeWidth={config.strokeWidth}
                getX={getX}
                getY0={getY0}
                getY1={getY1}
                bounds={bounds}
              />
            );
        }
      })}
    </>
  );
}
