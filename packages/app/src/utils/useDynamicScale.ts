import { scaleLinear, ScaleLinear } from 'd3-scale';
/**
 * Not sure why this is 1.05. Any value between 1 and 1.5 seems to have the same
 * effect.
 */
const STRETCH_FACTOR = 1.05;

/**
 * Calculate the bar chart scale, based on desired min/max but stretched if
 * value is out of bounds.
 *
 * This function used to incorporate calculated min/max ranges for data but was
 * later disabled because only the last_value is displayed in the
 * bar chart.
 *
 * This is a simplified version which should give us the same results, and can
 * later be enhanced if we choose re-introduce the use of calculated ranges.
 */
export function useDynamicScale(
  value: number,
  min: number,
  max: number
): ScaleLinear<number, number> {
  const scaleMax = value < max ? max : value * STRETCH_FACTOR;
  const scaleMin = value > min ? min : value / STRETCH_FACTOR;

  const scale: ScaleLinear<number, number> = scaleLinear()
    .domain([scaleMin, scaleMax])
    .range([0, 100])
    .nice(10);

  return scale;
}
