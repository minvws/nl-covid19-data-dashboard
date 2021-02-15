import { Municipal, Regionaal } from '@corona-dashboard/common';
import { scaleLinear, scaleTime } from '@visx/scale';
import { voronoi } from '@visx/voronoi';
import { useCallback, useMemo, useState } from 'react';
import { SelectProps } from '~/components-styled/select';
import { getFilteredValues, TimeframeOption } from '~/utils/timeframe';

export interface Dimensions {
  bounds: Record<'width' | 'height', number>;
  padding: Record<'top' | 'right' | 'bottom' | 'left', number>;
}

export interface SewerChartValue {
  id: string;
  name: string;
  value: number;
  dateMs: number;
}

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
              dateMs: x.date_end_unix * 1000,
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

export function useSewerChartScales(
  values: SewerChartValue[],
  bounds: { width: number; height: number }
) {
  const xScale = useMemo(() => {
    const valuesX = values.map((x) => x.dateMs);

    return scaleTime<number>({
      domain: [Math.min(...valuesX), Math.max(...valuesX)],
    }).range([0, bounds.width]);
  }, [values, bounds.width]);

  const yScale = useMemo(() => {
    const valuesY = values.map((x) => x.value);

    return scaleLinear<number>({
      domain: [Math.min(...valuesY), Math.max(...valuesY)],
      nice: true,
    }).range([bounds.height, 0]);
  }, [values, bounds.height]);

  const getX = useCallback((x: SewerChartValue) => xScale(x.dateMs), [xScale]);
  const getY = useCallback((x: SewerChartValue) => yScale(x.value), [yScale]);

  return useMemo(
    () => ({
      xScale,
      yScale,
      getX,
      getY,
    }),
    [getX, getY, xScale, yScale]
  );
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
   * multiply it by 1.1 in order to display station values which are close to
   * the highest value.
   */
  const outlierLimit =
    Math.max(
      getMax(averageValues, (x) => x.value),
      getMax(selectedStationValues, (x) => x.value)
    ) * 1.0;

  /**
   * If there's a station value GTE than the max line, it means we have outliers
   * we might not want to display, based on the incoming boolean
   */
  const hasOutliers = getMax(stationValues, (x) => x.value) >= outlierLimit;

  /**
   * Here' we'll filter the final list of station values based on that boolean
   * and the
   */
  const stationValuesFiltered = useMemo(() => {
    return hasOutliers && !displayOutliers
      ? stationValues.filter((x) => x.value <= outlierLimit)
      : stationValues;
  }, [displayOutliers, hasOutliers, outlierLimit, stationValues]);

  return { stationValuesFiltered, hasOutliers, selectedStationValues };
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
  const [datum, setDatum] = useState<SewerChartValue>();

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

  const findClosest = useCallback(
    (point: { x: number; y: number }) => {
      // max search radius distance in px
      const distance = 25;

      const closest = voronoiLayout.find(point.x, point.y, distance);

      setDatum(closest?.data);
    },
    [voronoiLayout]
  );

  return { datum, findClosest } as const;
}

function dedupe<T>(key: keyof T) {
  return (x: T, index: number, list: T[]) =>
    list.findIndex((x2) => x[key] === x2[key]) === index;
}

function getMax<T>(items: T[], getValue: (item: T) => number | undefined) {
  return Math.max(...items.map((x) => getValue(x) || 0));
}
