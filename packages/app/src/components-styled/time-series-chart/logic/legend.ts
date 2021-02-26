import { TimestampedValue } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { LegendItem } from '~/components-styled/legend';
import { SeriesConfig } from './series';

export function useLegendItems<T extends TimestampedValue>(
  config: SeriesConfig<T>[]
  /**
   * @TODO pass date span annotations so we can include them in the legenda
   */
  //dateSpanAnnotations: DateSpanAnnotation[]
) {
  const legendItems = useMemo<LegendItem[]>(() => {
    return config
      .map((x) => {
        switch (x.type) {
          case 'line':
          case 'area':
            return {
              color: x.color,
              label: x.label,
              shape: x.type,
            };
        }
      })
      .filter(isDefined);
  }, [config]);

  return legendItems;
}

// function getShapeForSeriesType() {}
