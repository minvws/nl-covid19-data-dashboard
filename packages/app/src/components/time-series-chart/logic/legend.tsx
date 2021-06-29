import { TimestampedValue } from '@corona-dashboard/common';
import { first, last } from 'lodash';
import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { LegendItem } from '~/components/legend';
import { useIntl } from '~/intl';
import {
  HatchedTimespanAnnotationIcon,
  SeriesIcon,
  SolidTimespanAnnotationIcon,
} from '../components';
import { TimelineMarker } from '../components/timeline';
import { isVisibleEvent } from '../components/timeline/logic';
import { DataOptions } from './common';
import { isVisible, SeriesConfig } from './series';

export function useLegendItems<T extends TimestampedValue>(
  domain: number[],
  config: SeriesConfig<T>,
  dataOptions?: DataOptions
) {
  const { timelineEvents, timespanAnnotations } = dataOptions || {};
  const intl = useIntl();

  return useMemo(() => {
    const items = config
      .filter(isVisible)
      .map<LegendItem | undefined>((x) => {
        switch (x.type) {
          case 'split-area':
          case 'split-bar':
            /**
             * Split type items are omitted from the normal legend, so that we can
             * render them in a separate per split labelled legend. Not using a
             * filter on type for TS type narrowing reasons.
             */
            return;
          default:
            return {
              color: x.color,
              label: x.label,
              shape: 'custom',
              shapeComponent: <SeriesIcon config={x} />,
            };
        }
      })
      .filter(isDefined);

    /**
     * Add annotations to the legend
     */
    if (timespanAnnotations) {
      for (const annotation of timespanAnnotations) {
        const isAnnotationVisible =
          (first(domain) as number) <= annotation.end &&
          annotation.start <= (last(domain) as number);

        if (isAnnotationVisible) {
          items.push({
            label: annotation.label,
            shape: 'custom',
            shapeComponent:
              annotation.fill === 'solid' || !isDefined(annotation.fill) ? (
                <SolidTimespanAnnotationIcon />
              ) : (
                <HatchedTimespanAnnotationIcon />
              ),
          } as LegendItem);
        }
      }
    }

    /**
     * Add timeline events to the legend
     */
    if (timelineEvents) {
      const hasVisibleEvents = timelineEvents.some((x) =>
        isVisibleEvent(x, domain)
      );

      if (hasVisibleEvents) {
        items.push({
          label: intl.siteText.charts.timeline.legend_label,
          shape: 'custom',
          shapeComponent: <TimelineMarker size={10} />,
        } as LegendItem);
      }
    }

    /**
     * Define how many legend "items" there will be (counting split series as
     * one) to determine if a legend is required. We only have to render a
     * legend when there's at least two items.
     */
    const isLegendRequired =
      config.filter(isVisible).length + (timespanAnnotations?.length ?? 0) > 1;

    return isLegendRequired ? items : undefined;
  }, [config, domain, intl, timelineEvents, timespanAnnotations]);
}

type SplitLegendGroup = { label: string; items: LegendItem[] };

export function useSplitLegendGroups<T extends TimestampedValue>(
  config: SeriesConfig<T>
) {
  return useMemo(() => {
    const items = config
      .map<SplitLegendGroup | undefined>((x) => {
        switch (x.type) {
          case 'split-area':
          case 'split-bar':
            return {
              label: x.label,
              items: x.splitPoints.map((v) => ({
                color: v.color,
                label: v.label,
                shape: 'custom',
                shapeComponent: <SeriesIcon config={x} value={v.value} />,
              })),
            };
        }
      })
      .filter(isDefined);

    return items.length > 0 ? items : undefined;
  }, [config]);
}
