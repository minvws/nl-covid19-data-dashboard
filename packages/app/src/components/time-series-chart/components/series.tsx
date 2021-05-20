import { TimestampedValue } from '@corona-dashboard/common';
import { ScaleLinear } from 'd3-scale';
import { memo } from 'react';
import { AreaTrend, BarTrend, LineTrend, RangeTrend } from '.';
import {
  BenchmarkConfig,
  Bounds,
  GetX,
  GetY,
  GetY0,
  GetY1,
  SeriesConfig,
  SeriesDoubleValue,
  SeriesList,
  SeriesSingleValue,
} from '../logic';
import { SplitBarTrend } from './split-bar-trend';
import { StackedAreaTrend } from './stacked-area-trend';

interface SeriesProps<T extends TimestampedValue> {
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
  benchmark?: BenchmarkConfig;
}

export const Series = memo(SeriesUnmemoized) as typeof SeriesUnmemoized;

function SeriesUnmemoized<T extends TimestampedValue>({
  seriesConfig,
  seriesList,
  getX,
  getY,
  getY0,
  getY1,
  yScale,
  bounds,
  benchmark,
}: SeriesProps<T>) {
  return (
    <>
      {seriesList
        .map((series, index) => {
          const config = seriesConfig[index];

          switch (config.type) {
            case 'line':
              return (
                <LineTrend
                  key={index}
                  series={series as SeriesSingleValue[]}
                  color={config.color}
                  style={config.style}
                  strokeWidth={config.strokeWidth}
                  curve={config.curve}
                  getX={getX}
                  getY={getY}
                />
              );
            case 'area':
              return (
                <AreaTrend
                  key={index}
                  series={series as SeriesSingleValue[]}
                  color={config.color}
                  fillOpacity={config.fillOpacity}
                  strokeWidth={config.strokeWidth}
                  curve={config.curve}
                  getX={getX}
                  getY={getY}
                  yScale={yScale}
                />
              );
            case 'bar':
              return (
                <BarTrend
                  key={index}
                  series={series as SeriesSingleValue[]}
                  color={config.color}
                  aboveBenchmarkColor={config.aboveBenchmarkColor}
                  aboveBenchmarkFillOpacity={config.aboveBenchmarkFillOpacity}
                  benchmark={benchmark}
                  fillOpacity={config.fillOpacity}
                  getX={getX}
                  getY={getY}
                  bounds={bounds}
                />
              );
            case 'split-bar':
              return (
                <SplitBarTrend
                  key={index}
                  yScale={yScale}
                  series={series as SeriesSingleValue[]}
                  splitPoints={config.splitPoints}
                  fillOpacity={config.fillOpacity}
                  getX={getX}
                  getY={getY}
                  bounds={bounds}
                />
              );
            case 'range':
              return (
                <RangeTrend
                  key={index}
                  series={series as SeriesDoubleValue[]}
                  color={config.color}
                  fillOpacity={config.fillOpacity}
                  getX={getX}
                  getY0={getY0}
                  getY1={getY1}
                  bounds={bounds}
                />
              );
            case 'stacked-area':
              return (
                <StackedAreaTrend
                  key={index}
                  series={series as SeriesDoubleValue[]}
                  color={config.color}
                  fillOpacity={config.fillOpacity}
                  getX={getX}
                  getY0={getY0}
                  getY1={getY1}
                  bounds={bounds}
                />
              );
          }
        })
        /**
         * We reverse the elements to ensure the first series will be rendered
         * as the last dom/svg-node. This way we make sure that the first (and
         * most-likely most important) series is actually rendered on top of the
         * other series.
         */
        .reverse()}
    </>
  );
}
