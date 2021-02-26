import { TimestampedValue } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { LegendItem } from '~/components-styled/legend';
import { SeriesConfig } from './series';

export function useLegendItems<T extends TimestampedValue>(
  config: SeriesConfig<T>
  /**
   * @TODO pass date span annotations so we can include them in the legenda
   */
  //dateSpanAnnotations: DateSpanAnnotation[]
) {
  const legendItems = useMemo(() => {
    return config
      .map((x) => {
        switch (x.type) {
          case 'line':
            return {
              color: x.color,
              label: x.label,
              shape: 'line',
            } as LegendItem;
          case 'area':
            return {
              color: x.color,
              label: x.label,
              shape: 'square',
            } as LegendItem;
          case 'range':
            return {
              color: x.color,
              label: x.label,
              shape: 'square',
            } as LegendItem;
        }
      })
      .filter(isDefined);
  }, [config]);

  /**
   * @TODO add the other legend items that come from annotations
   */

  /**
   * In current charts we only show a legend if there are more then 1 items. So
   * for example a line plus an date span annotation. If it's just one line
   * then no legend is displayed, so in that case we return an empty array.
   *
   * This prevents is from having to manually set (and possibly forget to set)
   * a boolean on the chart props.
   */
  return legendItems.length > 1 ? legendItems : [];
}
