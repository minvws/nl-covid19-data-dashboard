import { TimestampedValue } from '@corona-dashboard/common';
import { first, last } from 'lodash';
import { useMemo } from 'react';
import { LegendItem } from '~/components/legend';
import { SeriesIcon, TimespanAnnotationIcon } from '../components';
import { DataOptions } from './common';
import { isVisible, SeriesConfig } from './series';

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
          switch (annotation.type) {
            case 'solid':
              items.push({
                label: annotation.label,
                shape: 'custom',
                shapeComponent: <TimespanAnnotationIcon />,
              } as LegendItem);
              break;
            case 'hatched':
              items.push({
                label: annotation.label,
                shape: 'custom',
                shapeComponent: <HatchedSquare />,
              } as LegendItem);
              break;
          }
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

function HatchedSquare() {
  return (
    <svg height="15" width="15">
      <defs>
        <pattern
          id="hatch"
          width="4"
          height="4"
          patternTransform="rotate(-45 0 0)"
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="5"
            style={{ stroke: 'grey', strokeWidth: 3 }}
          />
        </pattern>
      </defs>
      <rect height="15" width="15" fill="white" />
      <rect height="15" width="15" fill="url(#hatch)" />
    </svg>
  );
}
