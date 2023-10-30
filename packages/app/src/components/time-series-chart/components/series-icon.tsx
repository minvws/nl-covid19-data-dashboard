import { TimestampedValue } from '@corona-dashboard/common';
import { isPresent } from 'ts-is-present';
import { findSplitPointForValue, SeriesConfig } from '../logic';
import { AreaTrendIcon } from './area-trend';
import { BarTrendIcon } from './bar-trend';
import { LineTrendIcon } from './line-trend';
import { ScatterPlotIcon } from './scatter-plot';
import { RangeTrendIcon } from './range-trend';
import { SplitAreaTrendIcon } from './split-area-trend';
import { StackedAreaTrendIcon } from './stacked-area-trend';
import { StackedBarTrendIcon } from '~/components/time-series-chart/components/stacked-bar-trend';

interface SeriesIconProps<T extends TimestampedValue> {
  config: SeriesConfig<T>[number];
  /**
   * Value here is passed in from looking up the metricProperty in the original
   * values array that was passed to the chart. These values can be number or
   * null, but we also want the value to be optional because other than
   * 'split-area' types we do not need to use this value.
   */
  value?: number | null;
}

export function SeriesIcon<T extends TimestampedValue>({ config, value }: SeriesIconProps<T>) {
  switch (config.type) {
    case 'line':
    case 'gapped-line':
      return <LineTrendIcon color={config.color} strokeWidth={config.strokeWidth} style={config.style} />;
    case 'scatter-plot':
      return <ScatterPlotIcon color={config.color} />;
    case 'range':
      return <RangeTrendIcon color={config.color} fillOpacity={config.fillOpacity} />;
    case 'area':
    case 'gapped-area':
      return <AreaTrendIcon color={config.color} fillOpacity={config.fillOpacity} strokeWidth={config.strokeWidth} />;
    case 'stacked-area':
    case 'gapped-stacked-area':
      return <StackedAreaTrendIcon color={config.color} fillOpacity={config.fillOpacity} />;
    case 'bar':
      return <BarTrendIcon color={config.color} fillOpacity={config.fillOpacity} />;
    case 'stacked-bar':
      return <StackedBarTrendIcon color={config.color} fillOpacity={config.fillOpacity}></StackedBarTrendIcon>;
    case 'split-area':
      /**
       * Here we return the icon even if there is no value, because it
       * makes the tooltip rendering more stable for the sewer chart when a
       * location is selected. The color of the rendered icon will not match
       * whatever the other hoverstate is intersecting with, but I don't think
       * it matters much as the value is shown as non-existing.
       *
       * @TODO Possibly we want this behavior for split-bar as well...
       */
      return <SplitAreaTrendIcon color={findSplitPointForValue(config.splitPoints, value).color} fillOpacity={config.fillOpacity} strokeWidth={config.strokeWidth} />;
    case 'split-bar':
      return isPresent(value) ? <BarTrendIcon color={findSplitPointForValue(config.splitPoints, value).color} fillOpacity={config.fillOpacity} /> : null;
    default:
      return null;
  }
}
