import { TimestampedValue } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { LegendItem } from '~/components/legend';
import { SeriesIcon, TimespanAnnotationIcon } from '../components';
import { DataOptions } from './common';
import { SeriesConfig, isVisible } from './series';
import { first, last } from 'lodash';

export function useLegendItems<T extends TimestampedValue>(
  domain: number[],
  config: SeriesConfig<T>,
  dataOptions?: DataOptions
) {
  const legendItems = useMemo(() => {
    const items = config.filter(isVisible).map<LegendItem>((x) => ({
      color: x.color,
      label: x.label,
      shape: 'custom',
      shapeComponent: <SeriesIcon config={x} />,
    }));

    /**
     * Add annotations to the legend
     */
    if (dataOptions?.timespanAnnotations) {
      for (const annotation of dataOptions.timespanAnnotations) {
        const annotationVisible =
          (first(domain) as number) <= annotation.end &&
          annotation.start <= (last(domain) as number);

        items.push({
          label: annotation.label,
          shape: 'custom',
          shapeComponent: <TimespanAnnotationIcon />,
          hidden: !annotationVisible,
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
  }, [config, dataOptions, domain]);

  return legendItems;
}
