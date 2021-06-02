import { TimestampedValue } from '@corona-dashboard/common';
import { isPresent } from 'ts-is-present';
import { findSplitPointForValue, SeriesConfig } from '../logic';
import { AreaTrendIcon } from './area-trend';
import { BarTrendIcon } from './bar-trend';
import { LineTrendIcon } from './line-trend';
import { RangeTrendIcon } from './range-trend';
import { StackedAreaTrendIcon } from './stacked-area-trend';

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

export function SeriesIcon<T extends TimestampedValue>({
  config,
  value,
}: SeriesIconProps<T>) {
  switch (config.type) {
    case 'line':
    case 'gapped-line':
      return (
        <LineTrendIcon
          color={config.color}
          strokeWidth={config.strokeWidth}
          style={config.style}
        />
      );
    case 'range':
      return (
        <RangeTrendIcon color={config.color} fillOpacity={config.fillOpacity} />
      );
    case 'area':
      return (
        <AreaTrendIcon
          color={config.color}
          fillOpacity={config.fillOpacity}
          strokeWidth={config.strokeWidth}
        />
      );
    case 'stacked-area':
      return (
        <StackedAreaTrendIcon
          color={config.color}
          fillOpacity={config.fillOpacity}
        />
      );
    case 'bar':
      return (
        <BarTrendIcon color={config.color} fillOpacity={config.fillOpacity} />
      );
    case 'split-bar':
      return isPresent(value) ? (
        <BarTrendIcon
          color={findSplitPointForValue(config.splitPoints, value).color}
          fillOpacity={config.fillOpacity}
        />
      ) : null;
    default:
      return null;
  }
}
