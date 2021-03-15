import { TimestampedValue } from '@corona-dashboard/common';
import { SeriesConfig } from '../logic';
import { AreaTrendIcon } from './area-trend';
import { LineTrendIcon } from './line-trend';
import { RangeTrendIcon } from './range-trend';

interface TrendIconProps<T extends TimestampedValue> {
  config: SeriesConfig<T>[number];
}

export function TrendIcon<T extends TimestampedValue>({
  config,
}: TrendIconProps<T>) {
  switch (config.type) {
    case 'line':
      return <LineTrendIcon config={config} />;
    case 'range':
      return <RangeTrendIcon config={config} />;
    case 'area':
      return <AreaTrendIcon config={config} />;
    default:
      return null;
  }
}
