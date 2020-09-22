import { scaleLinear, ScaleLinear } from 'd3-scale';
import useSWR from 'swr';

interface IDynamicScale {
  isValidating: boolean;
  error?: Error;
  scale: ScaleLinear<number, number>;
}

/**
 * Use this hook to get an x-scale for your barcharts
 * You use this by providing an imperative, desired min and max for your domains
 *
 * We compare the extent of your domain with your data value and max value returned by the
 * backend, and use the data value or the max value from the backend as the scale max for your
 * scale when it's higher than the imperative max value. This guarantee the scale won't break
 * if suddenly the value is higher than your desired min/max extent.
 */

export function useDynamicScale(
  min: number,
  max: number,
  dataKey: string,
  value?: number | null
): IDynamicScale {
  const { data, isValidating } = useSWR('/json/RANGES.json');

  let dataMax;

  if (dataKey) {
    dataMax = data?.min_max_values?.last_value?.[`max_${dataKey}`];
  }

  let scaleMax = max;

  const isValueHigherThanMax = value && value !== null && value > max;
  const isDataMaxHigherThanMax = dataMax && dataMax !== null && dataMax > max;

  if (value) {
    // The first and most important check, did we find an absolute max value across
    // the complete dataset for this metric? Then we want to use that as the
    // new max.
    // Disabled for now because the max reported in the dataset reports the max over
    // full history of a metric, and we need the latest value.
    // eslint-disable-next-line no-constant-condition
    if (false) {
      if (isDataMaxHigherThanMax) {
        scaleMax = dataMax;
        // This second check, which theoretically shouldn't happen anymore but we leave it in for good
        // measure, would ensure even if the back-end reports a wrong max value, the scale
        // never breaks.
      }
    } else if (isValueHigherThanMax) {
      scaleMax = value;
    }
  }

  const scale: ScaleLinear<number, number> = scaleLinear()
    .domain([min, scaleMax])
    .range([0, 100]);

  if (isValueHigherThanMax || isDataMaxHigherThanMax) {
    scale.nice(2);
  }
  return { scale, isValidating };
}
