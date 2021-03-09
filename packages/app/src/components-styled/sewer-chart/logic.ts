import { Municipal, Regionaal } from '@corona-dashboard/common';
import { Point } from '@visx/point';
import { scaleLinear, scaleTime } from '@visx/scale';
import { voronoi } from '@visx/voronoi';
import { bisector } from 'd3-array';
import { lineLength } from 'geometric';
import { useCallback, useMemo, useRef, useState } from 'react';
import { SelectProps } from '~/components-styled/select';
import { getFilteredValues, TimeframeOption } from '~/utils/timeframe';

export interface Dimensions {
  bounds: Record<'width' | 'height', number>;
  padding: Record<'top' | 'right' | 'bottom' | 'left', number>;
}

export type SewerChartValue = {
  id: string;
  name: string;
  value: number;
  dateMs: number;
} & (
  | { dateStartMs: number; dateEndMs: number }
  | { dateStartMs?: never; dateEndMs?: never }
);

export function useSewerChartValues(
  data: Regionaal | Municipal,
  timeframe: TimeframeOption
) {
  /**
   * Create average sewer data, used for the line chart
   */
  const averageValues = useMemo<SewerChartValue[]>(
    () =>
      data.sewer
        ? getFilteredValues(
            data.sewer.values,
            timeframe,
            (x) => x.date_start_unix * 1000
          )
            .map((x) => ({
              name: '__average',
              value: x.average,
              dateMs:
                (x.date_start_unix +
                  (x.date_end_unix - x.date_start_unix) / 2) *
                1000,
              dateStartMs: x.date_start_unix * 1000,
              dateEndMs: x.date_end_unix * 1000,
            }))
            .map((x) => ({
              ...x,
              id: [x.name, x.value, x.dateMs].join('-'),
            }))
        : [],
    [data.sewer, timeframe]
  );

  /**
   * Create station sewer data, used for the scatter plot
   */
  const stationValues = useMemo<SewerChartValue[]>(
    () =>
      data.sewer_per_installation
        ? data.sewer_per_installation.values
            .flatMap((value) =>
              getFilteredValues(
                value.values,
                timeframe,
                (x) => x.date_unix * 1000
              )
                .map((x) => ({
                  name: value.rwzi_awzi_name,
                  value: x.rna_normalized,
                  dateMs: x.date_unix * 1000,
                }))
                .map((x) => ({
                  ...x,
                  id: [x.name, x.value, x.dateMs].join('-'),
                }))
            )
            .sort((a, b) => a.dateMs - b.dateMs)

            // @TODO remove this when duplicate values has been fixed
            .filter(dedupe('id'))
        : [],

    [data.sewer_per_installation, timeframe]
  );

  return { averageValues, stationValues };
}

/**
 * Create scales and datum=>coordinate-mappers (getX, getY)
 */
export function useSewerChartScales(
  values: SewerChartValue[],
  bounds: { width: number; height: number }
) {
  return useMemo(() => {
    const valuesX = values.map((x) => x.dateMs);
    const valuesY = values.map((x) => x.value);

    const xScale = scaleTime<number>({
      domain: [Math.min(...valuesX), Math.max(...valuesX)],
    }).range([0, bounds.width]);

    const yScale = scaleLinear<number>({
      domain: [Math.min(...valuesY), Math.max(...valuesY)],
      nice: true,
    }).range([bounds.height, 0]);

    const getX = (x: SewerChartValue) => xScale(x.dateMs);
    const getY = (x: SewerChartValue) => yScale(x.value);

    return { xScale, yScale, getX, getY };
  }, [values, bounds.width, bounds.height]);
}

export function useSewerStationSelectProps(values: SewerChartValue[]) {
  const [value, setValue] = useState<string>();
  const options = useMemo(
    () =>
      values
        .filter(dedupe('name'))
        .map((x) => ({ label: x.name, value: x.name }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [values]
  );

  const onClear = useCallback(() => setValue(undefined), []);

  const props: SelectProps<string> = {
    options,
    value,
    onChange: setValue,
    onClear,
  };

  return props;
}

export function useSelectedStationValues(
  value: string | undefined,
  stationValues: SewerChartValue[],
  averageValues: SewerChartValue[],
  displayOutliers: boolean
) {
  /**
   * filter stationValues to only include values of a single station
   */
  const selectedStationValues = useMemo(() => {
    return value ? stationValues.filter((x) => x.name === value) : [];
  }, [stationValues, value]);

  /**
   * Here we determine the outlier limit: find the highest line-value and
   * multiply it by 1.5 in order to display station values which are close to
   * the highest value.
   */
  const outlierLimit =
    Math.max(
      getMax(averageValues, (x) => x.value),
      getMax(selectedStationValues, (x) => x.value)
    ) * 1.5;

  /**
   * If there's a station value GTE than the max line, it means we have outliers
   * we might not want to display, based on the incoming boolean
   */
  const hasOutliers = getMax(stationValues, (x) => x.value) >= outlierLimit;

  /**
   * Here' we'll filter the final list of station values based on that boolean
   * and the
   */
  const [stationValuesFiltered, outlierValues] = useMemo(() => {
    const values =
      hasOutliers && !displayOutliers
        ? stationValues.filter((x) => x.value <= outlierLimit)
        : stationValues;
    const outliers = stationValues.filter((x) => x.value > outlierLimit);
    return [values, outliers];
  }, [displayOutliers, hasOutliers, outlierLimit, stationValues]);

  return {
    stationValuesFiltered,
    hasOutliers,
    selectedStationValues,
    outlierValues,
  };
}

export function useScatterTooltip({
  values,
  scales,
  dimensions,
}: {
  values: SewerChartValue[];
  scales: ReturnType<typeof useSewerChartScales>;
  dimensions: Dimensions;
}) {
  const [inputPoint, setInputPoint] = useState<Point>();
  const clear = useCallback(() => setInputPoint(undefined), []);

  const voronoiLayout = useMemo(
    () =>
      voronoi<SewerChartValue>({
        x: scales.getX,
        y: scales.getY,
        width: dimensions.bounds.width,
        height: dimensions.bounds.height,
      })(values),
    [
      scales.getX,
      scales.getY,
      dimensions.bounds.width,
      dimensions.bounds.height,
      values,
    ]
  );

  let datum: SewerChartValue | undefined;
  let point: Point | undefined;

  if (inputPoint) {
    // max search radius distance in px
    const distance = 25;

    const closest =
      voronoiLayout.find(
        inputPoint.x - dimensions.padding.left,
        inputPoint.y - dimensions.padding.top,
        distance
      ) || undefined;

    datum = closest?.data;
    point = closest && new Point({ x: closest[0], y: closest[1] });
  }

  return { datum, point, findClosest: setInputPoint, clear } as const;
}

const bisectDate = bisector<SewerChartValue, Date>((d) => new Date(d.dateMs))
  .left;

export function useLineTooltip({
  values,
  scales,
  dimensions,
}: {
  values: SewerChartValue[];
  scales: ReturnType<typeof useSewerChartScales>;
  dimensions: Dimensions;
}) {
  const [inputPoint, setInputPoint] = useState<Point>();
  const clear = useCallback(() => setInputPoint(undefined), []);

  let datum: SewerChartValue | undefined;
  let point: Point | undefined;

  if (inputPoint) {
    const x0 = scales.xScale.invert(inputPoint.x - dimensions.padding.left);
    const index = bisectDate(values, x0, 1);
    const d0 = values[index - 1];
    const d1 = values[index];
    datum = d0;

    if (d1) {
      datum = x0.valueOf() - d0.dateMs > d1.dateMs - x0.valueOf() ? d1 : d0;
    }

    point = new Point({
      x: scales.getX(datum),
      y: scales.getY(datum),
    });
  }

  return { datum, point, findClosest: setInputPoint, clear } as {
    findClosest: typeof setInputPoint;
    clear: typeof clear;
  } & (
    | { datum: undefined; point: undefined }
    | { datum: SewerChartValue; point: Point }
  );
}

/**
 * create dedupe-filter to be used within an Array.filter().
 * It will deduplicate items based on the comparison of the object's keys.
 *
 * example:
 *
 *     const values: Array<{ foo: string }>
 *     values.filter(dedupe('foo'))
 */
function dedupe<T>(key: keyof T) {
  return (x: T, index: number, list: T[]) =>
    list.findIndex((x2) => x[key] === x2[key]) === index;
}

/**
 * get max value of items mapped by a getter
 */
function getMax<T>(items: T[], getValue: (item: T) => number | undefined) {
  return Math.max(...items.map((x) => getValue(x) ?? -Infinity));
}

/**
 * usePointDistance can be used to measure the distance between multiple points.
 * This can be useful when you would like to track how far a user has moved its
 * pointer (finger/mouse).
 *
 * An example usecase is listening to the `onPointerUp` event and distinguising
 * clicks vs. drags. You'd feed points to this hook during the `onPointerMove`-
 * event.
 */
export function usePointDistance() {
  const pointRef = useRef<Point>();
  const distanceRef = useRef<number>(0);

  const add = useCallback((point: Point) => {
    const panDistance = pointRef.current
      ? lineLength([
          [pointRef.current.x, pointRef.current.y],
          [point.x, point.y],
        ])
      : 0;

    pointRef.current = point;
    distanceRef.current += panDistance;
  }, []);

  const start = useCallback((point: Point) => {
    pointRef.current = point;
    distanceRef.current = 0;
  }, []);

  return useMemo(
    () => ({
      distanceRef,
      add,
      start,
    }),
    [add, start]
  );
}
