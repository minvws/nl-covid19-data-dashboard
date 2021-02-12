import { Municipal, Regionaal } from '@corona-dashboard/common';
import { useCallback, useMemo, useState } from 'react';
import { SelectProps } from '~/components-styled/select';
import { getFilteredValues, TimeframeOption } from '~/utils/timeframe';

export interface SewerChartValue {
  name: string;
  value: number;
  date: Date;
}

export function useSewerChartValues(
  data: Regionaal | Municipal,
  timeframe: TimeframeOption,
  averageName: string
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
          ).map((x) => ({
            name: averageName,
            value: x.average,
            date: new Date(x.date_end_unix * 1000),
          }))
        : [],
    [data.sewer, timeframe, averageName]
  );

  /**
   * Create per-station sewer data, used for the scatter plot
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
              ).map((x) => ({
                name: value.rwzi_awzi_name,
                value: x.rna_normalized,
                date: new Date(x.date_unix * 1000),
              }))
            )
            .sort((a, b) => a.date.getTime() - b.date.getTime())
        : [],

    [data.sewer_per_installation, timeframe]
  );

  return { averageValues, stationValues };
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

function dedupe<T>(key: keyof T) {
  return (x: T, index: number, list: T[]) =>
    list.findIndex((x2) => x[key] === x2[key]) === index;
}

export function getMax<T>(
  items: T[],
  getValue: (item: T) => number | undefined
) {
  return Math.max(...items.map((x) => getValue(x) || 0));
}
