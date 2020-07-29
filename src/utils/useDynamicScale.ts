import { scaleLinear, ScaleLinear } from 'd3-scale';
import useSWR from 'swr';

/**
 * Use this hook to get an x-scale for your barcharts
 * You use this by providing a desired min and max for your domains
 * We compare the extent of your domain with your data value, and use the data value as the max value
 * for your scale when it's higher than the imperative max value. This ensures you can set your min/max values
 * imperatively with the guarantee the scale won't break if suddenly the value is higher than your
 * desires min/max extent.
 */
function useDynamicScale(
  min: number,
  max: number,
  value?: number | null
): { loading: boolean; error: any; scale: ScaleLinear<number, number> } {
  const { data, error } = useSWR('/json/MIN_MAX.json');

  let scaleMax = max;

  const isValueHigherThanMax = value && value !== null && value > max;
  if (value) {
    if (isValueHigherThanMax) {
      scaleMax = value;
    }
  }

  const scale: ScaleLinear<number, number> = scaleLinear()
    .domain([min, scaleMax])
    .range([0, 100]);

  if (isValueHigherThanMax) {
    scale.nice(2);
  }

  return { scale, error, loading: !data && !error };
}

export default useDynamicScale;
