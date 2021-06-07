import { SewerPerInstallationData } from '@corona-dashboard/common';
import { Point } from '@visx/point';
import { scaleLinear, scaleTime } from '@visx/scale';
import { voronoi } from '@visx/voronoi';
import { bisector } from 'd3-array';
import { lineLength } from 'geometric';
import { useCallback, useMemo, useRef, useState } from 'react';
import { SelectProps } from '~/components/select';
import { useCurrentDate } from '~/utils/current-date-context';
import { getFilteredValues, TimeframeOption } from '~/utils/timeframe';
import { SewerChartData } from './sewer-chart';

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
  data: SewerChartData,
  timeframe: TimeframeOption
) {
  const today = useCurrentDate();
  /**
   * Create average sewer data, used for the line chart
   */
  const averageValues = useMemo<SewerChartValue[]>(
    () =>
      data.sewer
        ? getFilteredValues(
            data.sewer.values,
            timeframe,
            today,
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
    [data.sewer, timeframe, today]
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
                today,
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

    [data.sewer_per_installation, timeframe, today]
  );

  return [averageValues, stationValues] as const;
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
      domain: [0, Math.max(...valuesY)],
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

/**
 * Using the original data as input instead of the specific scatter plot
 * processed format. This is used the by the new sewer water chart based on
 * TimeSeriesChart
 */
export function useSewerStationSelectPropsSimplified(
  data: SewerPerInstallationData
) {
  const [value, setValue] = useState<string>();
  const options = useMemo(
    () =>
      data.values
        .map((x) => ({ label: x.rwzi_awzi_name, value: x.rwzi_awzi_name }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [data.values]
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

const bisectDate = bisector<SewerChartValue, Date>(
  (d) => new Date(d.dateMs)
).left;

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

/**
 * get max value of items mapped by a getter
 */
export function getMax<T>(
  items: T[],
  getValue: (item: T) => number | undefined
) {
  return Math.max(...items.map((x) => getValue(x) ?? -Infinity));
}

/**
 * create dedupe-filter to be used within an Array.filter(). It will deduplicate
 * items based on the comparison of the object's keys.
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
