import {
  assert,
  endOfDayInSeconds,
  isDateSpanValue,
  isDateValue,
  startOfDayInSeconds,
  TimestampedValue,
} from '@corona-dashboard/common';
import { localPoint } from '@visx/event';
import { Point } from '@visx/point';
import { bisectCenter } from 'd3-array';
import { ScaleLinear } from 'd3-scale';
import { isEmpty, pick, throttle } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isDefined, isPresent } from 'ts-is-present';
import { TimelineEventConfig } from '../components/timeline';
import { Padding, TimespanAnnotationConfig } from './common';
import {
  isVisible,
  SeriesConfig,
  SeriesDoubleValue,
  SeriesList,
  SeriesSingleValue,
} from './series';
import { findSplitPointForValue } from './split';
import { useKeyboardNavigation } from './use-keyboard-navigation';

export type HoveredPoint<T> = {
  seriesValue: SeriesSingleValue | SeriesDoubleValue;
  metricProperty: keyof T;
  seriesConfigIndex: number;
  color: string;
  x: number;
  y: number;
};

interface UseHoverStateArgs<T extends TimestampedValue> {
  values: T[];
  seriesList: SeriesList;
  seriesConfig: SeriesConfig<T>;
  padding: Padding;
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  timespanAnnotations?: TimespanAnnotationConfig[];
  timelineEvents?: TimelineEventConfig[];
  markNearestPointOnly?: boolean;
}

interface HoverState<T> {
  valuesIndex: number;
  barPoints: HoveredPoint<T>[];
  linePoints: HoveredPoint<T>[];
  rangePoints: HoveredPoint<T>[];
  nearestPoint: HoveredPoint<T>;
  timespanAnnotationIndex?: number;
  timelineEventIndex?: number;
}

type Event = React.TouchEvent<SVGElement> | React.MouseEvent<SVGElement>;

export function useHoverState<T extends TimestampedValue>({
  values,
  seriesList,
  seriesConfig,
  padding,
  xScale,
  yScale,
  timespanAnnotations,
  timelineEvents,
  markNearestPointOnly,
}: UseHoverStateArgs<T>) {
  const [point, setPoint] = useState<Point>();
  const [hasFocus, setHasFocus] = useState(false);
  const [valuesIndex, setValuesIndex] = useState<number>(0);
  const keyboard = useKeyboardNavigation(setValuesIndex, values.length);

  useEffect(() => {
    hasFocus ? keyboard.enable() : keyboard.disable();
  }, [hasFocus, keyboard]);

  const interactiveMetricProperties = useMemo(
    () =>
      seriesConfig
        .filter((x) => !x.isNonInteractive)
        .filter(isVisible)
        .flatMap((x) => {
          switch (x.type) {
            case 'range':
              return [x.metricPropertyLow, x.metricPropertyHigh];
            default:
              return x.metricProperty;
          }
        }),
    [seriesConfig]
  );

  const valuesWithInteractiveProperties = useMemo(() => {
    return values.filter((x) =>
      hasSomeFilledProperties(pick(x, interactiveMetricProperties))
    );
  }, [values, interactiveMetricProperties]);

  const interactiveValuesDateUnix = useMemo(
    () =>
      valuesWithInteractiveProperties.map((x) =>
        isDateValue(x)
          ? x.date_unix
          : isDateSpanValue(x)
          ? /**
             * @TODO share logic with trend code
             */
            x.date_start_unix + (x.date_end_unix - x.date_start_unix) / 2
          : 0
      ),
    [valuesWithInteractiveProperties]
  );

  const allValuesDateUnix = useMemo(
    () =>
      values.map((x) =>
        isDateValue(x)
          ? x.date_unix
          : isDateSpanValue(x)
          ? /**
             * @TODO share logic with trend code
             */
            x.date_start_unix + (x.date_end_unix - x.date_start_unix) / 2
          : 0
      ),
    [values]
  );

  /**
   * We only really have to do bisect once on original values object, because
   * all points of all trends are always coming from those values and are thus
   * aligned vertically.
   *
   * In this chart TrendValue __date was replaced with __date_unix, so that we
   * can use the original data timestamps directly for the xDomain without
   * conversion to/from Date objects.
   *
   * The points are always rendered in the middle of the date-span, and therefor
   * we use bisectCenter otherwise the calculated index jumps to the next as
   * soon as you cross the marker line to the right.
   *
   * Since the introduction of "non-interactive mode" for series, we need to do
   * a little more work. The values that are interactive can be more sparse than
   * the values array as a whole. The bisect needs to look only at the relevant
   * values, but the final index for the hover state needs to be based on the
   * original values array, otherwise the tooltip will not show up in the right
   * place. Without this logic, the tooltip would disappear for all the values
   * that have not filled properties for the interactive trends.
   */
  const bisect = useCallback(
    (xPosition: number) => {
      if (interactiveValuesDateUnix.length === 1) return 0;

      const date_unix = xScale.invert(xPosition);

      const index = bisectCenter(
        interactiveValuesDateUnix,
        date_unix,
        0,
        interactiveValuesDateUnix.length
      );

      const timestamp = interactiveValuesDateUnix[index];

      const indexInAllValues = allValuesDateUnix.findIndex(
        (x) => x === timestamp
      );

      assert(
        indexInAllValues !== -1,
        `Failed to find the values index for interactive value timestamp ${timestamp}`
      );

      return indexInAllValues;
    },
    [xScale, interactiveValuesDateUnix, allValuesDateUnix]
  );

  const setPointThrottled = useMemo(
    () =>
      throttle((point: Point | undefined) => {
        if (!point) {
          return setPoint(undefined);
        }

        /**
         * Align point coordinates with actual data points by subtracting
         * padding
         */
        point.x -= padding.left;
        point.y -= padding.top;

        setPoint(point);
        setValuesIndex(bisect(point.x));
      }, 1000 / 60),
    [bisect, padding.left, padding.top]
  );

  const handleFocus = useCallback(() => setHasFocus(true), []);
  const handleBlur = useCallback(() => setHasFocus(false), []);

  const timeoutRef = useRef<any>();
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleHover = useCallback(
    (event: Event) => {
      if (isEmpty(values)) {
        return;
      }

      if (event.type === 'mouseleave') {
        !hasFocus && keyboard.disable();
        /**
         * Here a timeout is used on the clear hover state to prevent the
         * tooltip from getting jittery. Individual elements in the chart can
         * send mouseleave events. This logic is maybe best moved to the the
         * tooltip itself. Or maybe it can be simplified without a ref.
         */
        timeoutRef.current = setTimeout(() => {
          setPoint(undefined);
          timeoutRef.current = undefined;
        }, 200);
        return;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const mousePoint = localPoint(event) || undefined;
      setPointThrottled(mousePoint);
      keyboard.enable();
    },
    [values, setPointThrottled, keyboard, hasFocus]
  );

  const hoverState = useMemo(() => {
    if (!point && !hasFocus) return;

    const pointY = point?.y ?? 0;

    const barPoints: HoveredPoint<T>[] = seriesConfig
      .filter(isVisible)
      .filter((x) => !x.isNonInteractive)
      .map((config, index) => {
        const seriesValue = seriesList[index][valuesIndex] as
          | SeriesSingleValue
          | undefined;

        if (!isPresent(seriesValue)) {
          return;
        }

        const xValue = seriesValue.__date_unix;
        const yValue = seriesValue.__value;

        /**
         * Filter series without Y value on the current valuesIndex
         */
        if (!isPresent(yValue)) {
          return;
        }

        switch (config.type) {
          case 'split-bar':
            return {
              seriesValue,
              x: xScale(xValue),
              y: yScale(yValue),
              color: findSplitPointForValue(config.splitPoints, yValue).color,
              metricProperty: config.metricProperty,
              seriesConfigIndex: index,
            };
          case 'bar':
            return {
              seriesValue,
              x: xScale(xValue),
              y: yScale(yValue),
              color: config.color,
              metricProperty: config.metricProperty,
              seriesConfigIndex: index,
            };
        }
      })
      .filter(isDefined);

    const linePoints: HoveredPoint<T>[] = seriesConfig
      .filter(isVisible)
      .filter((x) => !x.isNonInteractive)
      .map((config, index) => {
        const seriesValue = seriesList[index][valuesIndex] as
          | SeriesSingleValue
          | undefined;

        if (!isPresent(seriesValue)) {
          return;
        }

        const xValue = seriesValue.__date_unix;
        const yValue = seriesValue.__value;

        /**
         * Filter series without Y value on the current valuesIndex, except when
         * a gapped line is shown. In that case the tooltip still needs to be
         * shown to indicate why the gap is there.
         */
        if (!isPresent(yValue) && config.type !== 'gapped-line') {
          return;
        }

        switch (config.type) {
          case 'line':
          case 'gapped-line':
          case 'area':
            return {
              seriesValue,
              x: xScale(xValue),
              y: yValue ? yScale(yValue) : 0,
              color: yValue ? config.color : 'transparent',
              metricProperty: config.metricProperty,
              seriesConfigIndex: index,
            };
          case 'split-area':
            return {
              seriesValue,
              x: xScale(xValue),
              y: yValue ? yScale(yValue) : 0,
              color: findSplitPointForValue(config.splitPoints, yValue).color,
              metricProperty: config.metricProperty,
              seriesConfigIndex: index,
            };
        }
      })
      .filter(isDefined);

    /**
     * Point markers on range data are rendered differently, so we split them
     * out here, so we avoid having to create a union type and complicate
     * things.
     */
    const rangePoints: HoveredPoint<T>[] = seriesConfig
      .filter(isVisible)
      .filter((x) => !x.isNonInteractive)
      .flatMap((config, index) => {
        const seriesValue = seriesList[index][valuesIndex] as
          | SeriesDoubleValue
          | undefined;

        if (!isPresent(seriesValue)) {
          return;
        }

        const xValue = seriesValue.__date_unix;
        const yValueA = seriesValue.__value_a;
        const yValueB = seriesValue.__value_b;

        /**
         * Filter series without Y value on the current valuesIndex
         */
        if (
          (!isPresent(yValueA) || !isPresent(yValueB)) &&
          config.type !== 'gapped-stacked-area'
        ) {
          return;
        }

        switch (config.type) {
          case 'stacked-area':
          case 'gapped-stacked-area':
            return [
              {
                seriesValue,
                x: xScale(xValue),
                y: yValueB ? yScale(yValueB) : 0,
                color: config.color,
                metricProperty: config.metricProperty,
                seriesConfigIndex: index,
              },
            ];
          case 'range':
            return [
              {
                seriesValue,
                x: xScale(xValue),
                y: yValueA ? yScale(yValueA) : 0,
                color: config.color,
                metricProperty: config.metricPropertyLow,
                seriesConfigIndex: index,
              },
              {
                seriesValue,
                x: xScale(xValue),
                y: yValueB ? yScale(yValueB) : 0,
                color: config.color,
                metricProperty: config.metricPropertyHigh,
                seriesConfigIndex: index,
              },
            ];
        }
      })
      .filter(isDefined);

    /**
     * For nearest point calculation we only need to look at the y component of
     * the mouse, since all series originate from the same original value and
     * are thus aligned with the same timestamp.
     */
    const nearestPoint = [...linePoints, ...rangePoints, ...barPoints].sort(
      (a, b) => Math.abs(a.y - pointY) - Math.abs(b.y - pointY)
    )[0] as HoveredPoint<T> | undefined;

    /**
     * Empty hoverstate when there's no nearest point detected
     */
    if (!nearestPoint) {
      return;
    }

    const timespanAnnotationIndex = timespanAnnotations
      ? findActiveTimespanAnnotationIndex(
          values[valuesIndex],
          timespanAnnotations
        )
      : undefined;

    const timelineEventIndex = timelineEvents
      ? findActiveTimelineEventIndex(values[valuesIndex], timelineEvents)
      : undefined;

    const hoverState: HoverState<T> = {
      valuesIndex,
      barPoints,
      linePoints: markNearestPointOnly
        ? linePoints.filter((x) => x === nearestPoint)
        : linePoints,
      rangePoints: markNearestPointOnly
        ? rangePoints.filter((x) => x === nearestPoint)
        : rangePoints,
      nearestPoint,
      timespanAnnotationIndex,
      timelineEventIndex,
    };

    return hoverState;
  }, [
    point,
    hasFocus,
    seriesConfig,
    timespanAnnotations,
    timelineEvents,
    values,
    valuesIndex,
    markNearestPointOnly,
    seriesList,
    xScale,
    yScale,
  ]);

  return [hoverState, { handleHover, handleFocus, handleBlur }] as const;
}

function findActiveTimespanAnnotationIndex(
  hoveredValue: TimestampedValue,
  timespanAnnotations: TimespanAnnotationConfig[]
) {
  const valueSpanStart = isDateValue(hoveredValue)
    ? hoveredValue.date_unix
    : hoveredValue.date_start_unix;

  const valueSpanEnd = isDateValue(hoveredValue)
    ? hoveredValue.date_unix
    : hoveredValue.date_end_unix;

  /**
   * Loop over the annotations and see if the hovered value falls within its
   * timespan. By assuming these timespans never overlap, we can exit on the
   * first match and return a single index.
   */
  for (const [index, annotation] of timespanAnnotations.entries()) {
    /**
     * Tesing overlap of two ranges x1 <= y2 && y1 <= x2
     */
    if (valueSpanStart <= annotation.end && annotation.start <= valueSpanEnd) {
      return index;
    }
  }
}

function findActiveTimelineEventIndex(
  hoveredValue: TimestampedValue,
  timelineEvents: TimelineEventConfig[]
) {
  const valueSpanStartOfDay = startOfDayInSeconds(
    isDateValue(hoveredValue)
      ? hoveredValue.date_unix
      : hoveredValue.date_start_unix
  );

  const valueSpanEndOfDay = endOfDayInSeconds(
    isDateValue(hoveredValue)
      ? hoveredValue.date_unix
      : hoveredValue.date_end_unix
  );

  /**
   * Loop over the timeline events and see if the hovered value falls within its
   * timespan. By assuming these timespans never overlap, we can exist on the
   * first match and return a single index.
   *
   * Timeline events could overlap each other, therefore reverse the lookup to
   * match later events first.
   */
  for (const [index, event] of [...timelineEvents].reverse().entries()) {
    const start = startOfDayInSeconds(event.start);
    const end = endOfDayInSeconds(event.end || event.start);

    if (valueSpanStartOfDay < end && start < valueSpanEndOfDay) {
      return timelineEvents.length - 1 - index;
    }
  }
}

function hasSomeFilledProperties(value: Record<string, unknown>) {
  return Object.values(value).some(isPresent);
}
