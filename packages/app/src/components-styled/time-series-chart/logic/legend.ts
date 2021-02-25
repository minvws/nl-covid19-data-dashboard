import { TimestampedValue } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { LegendItem } from '~/components-styled/legend';
import { SeriesConfig } from './series';

export function useLegendItems<T extends TimestampedValue>(
  config: SeriesConfig<T>[]
) {
  const legendItems = useMemo<LegendItem[]>(() => {
    return config.map((x) => {
      return {
        color: x.color,
        label: x.label,
        shape: x.type,
      };
    });
  }, [config]);

  return legendItems;
}

function getShapeForSeriesType() {}
