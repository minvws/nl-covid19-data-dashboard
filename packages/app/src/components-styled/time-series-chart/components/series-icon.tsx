import { TimestampedValue } from '@corona-dashboard/common';
import { SeriesConfig } from '../logic';
import { AreaTrendIcon } from './area-trend';
import { LineTrendIcon } from './line-trend';
import { RangeTrendIcon } from './range-trend';
import { StackedAreaTrendIcon } from './stacked-area-trend';

interface SeriesIconProps<T extends TimestampedValue> {
  config: SeriesConfig<T>[number];
}

export function SeriesIcon<T extends TimestampedValue>({
  config,
}: SeriesIconProps<T>) {
  switch (config.type) {
    case 'line':
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
    default:
      return null;
  }
}
