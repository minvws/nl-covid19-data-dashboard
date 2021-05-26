import { TimestampedValue } from '@corona-dashboard/common';
import { first, last } from 'lodash';
import { useMemo } from 'react';
import { LegendItem } from '~/components/legend';
import {
  HatchedTimespanAnnotationIcon,
  SeriesIcon,
  SolidTimespanAnnotationIcon,
} from '../components';
import { DataOptions } from './common';
import { isVisible, SeriesConfig } from './series';

export function useLegendItems<T extends TimestampedValue>(
  domain: number[],
  config: SeriesConfig<T>,
  dataOptions?: DataOptions
) {
  const legendItems = useMemo(() => {
    const items = config.filter(isVisible).flatMap<LegendItem>((x) => {
      switch (x.type) {
        case 'split-bar':
          return x.splitPoints.map((v) => ({
            color: v.color,
            label: v.label,
            shape: 'custom',
            shapeComponent: <SeriesIcon config={x} value={v.value - 1} />,
          }));
        default:
          return {
            color: x.color,
            label: x.label,
            shape: 'custom',
            shapeComponent: <SeriesIcon config={x} />,
          };
      }
    });

    /**
     * Maximum number of legend items
     *
     * Used to determine if there are enough items to render a legend
     */
    let maxNumItems: number = items.length;

    /**
     * Add annotations to the legend
     */
    if (dataOptions?.timespanAnnotations) {
      maxNumItems += dataOptions?.timespanAnnotations.length;
      for (const annotation of dataOptions.timespanAnnotations) {
        const isAnnotationVisible =
          (first(domain) as number) <= annotation.end &&
          annotation.start <= (last(domain) as number);

        if (isAnnotationVisible) {
          items.push({
            label: annotation.label,
            shape: 'custom',
            shapeComponent:
              annotation.fill === 'solid' ? (
                <SolidTimespanAnnotationIcon />
              ) : (
                <HatchedTimespanAnnotationIcon />
              ),
          } as LegendItem);
        }
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
    return maxNumItems > 1 ? items : [];
  }, [config, dataOptions, domain]);

  return legendItems;
}
