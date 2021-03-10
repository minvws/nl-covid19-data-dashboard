import { TimestampedValue } from '@corona-dashboard/common';
import { transparentize } from 'polished';
import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { LegendItem } from '~/components-styled/legend';
import { colors } from '~/style/theme';
import { DataOptions } from './common';
import { SeriesConfig } from './series';

export function useLegendItems<T extends TimestampedValue>(
  config: SeriesConfig<T>,
  dataOptions?: DataOptions
) {
  const legendItems = useMemo(() => {
    const items = config
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

    /**
     * Add annotations to the legend
     */
    if (dataOptions?.timespanAnnotations) {
      for (const annotation of dataOptions.timespanAnnotations) {
        items.push({
          color: annotation.color
            ? transparentize(0.7, annotation.color)
            : colors.data.emphasis,
          label: annotation.label,
          shape: 'square',
        } as LegendItem);
      }
    }

    /**
     * In current charts we only show a legend if there are more than 1 items. So
     * for example a line plus an date span annotation. If it's just one line
     * then no legend is displayed, so in that case we return an empty array.
     *
     * This prevents us from having to manually set (and possibly forget to set)
     * a boolean on the chart props.
     */
    return items.length > 1 ? items : [];
  }, [config, dataOptions]);

  return legendItems;
}
