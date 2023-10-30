import { TimestampedValue } from '@corona-dashboard/common';
import { ScaleLinear } from 'd3-scale';
import { memo } from 'react';
import { AreaTrend, BarTrend, LineTrend, ScatterPlot, RangeTrend } from '.';
import { Bounds, GetX, GetY, GetY0, GetY1, SeriesConfig, SeriesDoubleValue, SeriesList, SeriesSingleValue } from '../logic';
import { GappedAreaTrend } from './gapped-area-trend';
import { GappedLinedTrend } from './gapped-line-trend';
import { GappedStackedAreaTrend } from './gapped-stacked-area-trend';
import { SplitAreaTrend } from './split-area-trend';
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
  chartId: string;
  seriesMax?: number;
}

export const Series = memo(SeriesUnmemoized) as typeof SeriesUnmemoized;

function SeriesUnmemoized<T extends TimestampedValue>({ seriesConfig, seriesList, getX, getY, getY0, getY1, yScale, bounds, chartId, seriesMax }: SeriesProps<T>) {
  return (
    <>
      {seriesList
        .map((series, index) => {
          const config = seriesConfig[index];
          const id =
            config.type === 'range'
              ? `${chartId}_${String(config.metricPropertyLow)}_${String(config.metricPropertyHigh)}_${config.type}`
              : `${chartId}_${String(config.metricProperty)}_${config.type}`;

          switch (config.type) {
            case 'gapped-line':
              return (
                <GappedLinedTrend
                  key={index}
                  series={series as SeriesSingleValue[]}
                  color={config.color}
                  style={config.style}
                  strokeWidth={config.strokeWidth}
                  curve={config.curve}
                  getX={getX}
                  getY={getY}
                  id={id}
                />
              );
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
                  id={id}
                />
              );
            case 'scatter-plot':
              return <ScatterPlot key={index} series={series as SeriesSingleValue[]} color={config.color} getX={getX} getY={getY} id={id} />;
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
                  id={id}
                />
              );
            case 'gapped-area':
              return (
                <GappedAreaTrend
                  key={index}
                  series={series as SeriesSingleValue[]}
                  color={config.color}
                  fillOpacity={config.fillOpacity}
                  strokeWidth={config.strokeWidth}
                  curve={config.curve}
                  getX={getX}
                  getY={getY}
                  yScale={yScale}
                  id={id}
                  isMissing={config.metricProperty === 'beds_occupied_covid'}
                />
              );
            case 'bar':
              return (
                <BarTrend
                  key={index}
                  series={series as SeriesDoubleValue[]}
                  color={config.color}
                  fillOpacity={config.fillOpacity}
                  getX={getX}
                  getY0={getY0}
                  getY1={getY1}
                  bounds={bounds}
                  yScale={yScale}
                  id={id}
                  seriesMax={seriesMax}
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
                  id={id}
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
                  id={id}
                />
              );
            case 'gapped-stacked-area':
              return (
                <GappedStackedAreaTrend
                  key={index}
                  series={series as SeriesDoubleValue[]}
                  color={config.color}
                  fillOpacity={config.fillOpacity}
                  strokeWidth={config.strokeWidth}
                  mixBlendMode={config.mixBlendMode}
                  getX={getX}
                  getY0={getY0}
                  getY1={getY1}
                  bounds={bounds}
                  id={id}
                />
              );
            case 'stacked-area':
              return (
                <StackedAreaTrend
                  key={index}
                  series={series as SeriesDoubleValue[]}
                  color={config.color}
                  fillOpacity={config.fillOpacity}
                  strokeWidth={config.strokeWidth}
                  mixBlendMode={config.mixBlendMode}
                  getX={getX}
                  getY0={getY0}
                  getY1={getY1}
                  bounds={bounds}
                  id={id}
                />
              );
            case 'split-area':
              return (
                <SplitAreaTrend
                  key={index}
                  series={series as SeriesSingleValue[]}
                  splitPoints={config.splitPoints}
                  strokeWidth={config.strokeWidth}
                  fillOpacity={config.fillOpacity}
                  getX={getX}
                  getY={getY}
                  yScale={yScale}
                  id={id}
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
