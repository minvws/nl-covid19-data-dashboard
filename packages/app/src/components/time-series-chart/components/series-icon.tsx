import { TimestampedValue } from '@corona-dashboard/common';
import { SeriesConfig, SplitPoint } from '../logic';
import { AreaTrendIcon } from './area-trend';
import { LineTrendIcon } from './line-trend';
import { RangeTrendIcon } from './range-trend';
import { StackedAreaTrendIcon } from './stacked-area-trend';
import { BarTrendIcon } from './bar-trend';
import { isPresent } from 'ts-is-present';
import { first, last } from 'lodash';

interface SeriesIconProps<T extends TimestampedValue> {
  config: SeriesConfig<T>[number];
  value?: number | null;
}

export function SeriesIcon<T extends TimestampedValue>({
  config,
  value,
}: // @TODO we need a value here to pick the right color for the split line
SeriesIconProps<T>) {
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
    case 'bar':
      return (
        <BarTrendIcon color={config.color} fillOpacity={config.fillOpacity} />
      );
    case 'split-line':
      return isPresent(value) ? (
        <AreaTrendIcon
          color={findSplitPointForValue(config.splitPoints, value).color}
          fillOpacity={1}
          strokeWidth={config.strokeWidth}
        />
      ) : null;
    default:
      return null;
  }
}

/**
 * Find the split point belonging to the given value.
 *
 * Each split is defined with a value that is the boundary to the next color. So
 * we can pick the first split where the value is below the split value.
 *
 * Not entirely sure that the logic should be here, since values can also be
 * null and what icon/color do you want to show in something like the tooltip. I
 * went for the first split point.
 */
function findSplitPointForValue(
  splitPoints: SplitPoint[],
  value: number | null
) {
  if (!isPresent(value)) {
    first(splitPoints) as SplitPoint;
  }

  for (const split of splitPoints) {
    if (isPresent(value) && value < split.value) {
      return split;
    }
  }

  return last(splitPoints) as SplitPoint;
}
