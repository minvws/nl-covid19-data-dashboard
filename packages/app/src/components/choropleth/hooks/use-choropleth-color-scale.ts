import { scaleThreshold } from 'd3-scale';
import { useCallback, useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { assert } from '~/utils/assert';
import { ChoroplethThresholdsValue } from '@corona-dashboard/common';
import { GetRegionDataFunctionType } from './use-safety-region-data';
import { GetMunicipalityDataFunctionType } from './use-municipality-data';

/**
 * This hook return a color scale for the given domain and gradient.
 * If either domain or gradient is undefined, it will return a method
 * that only returns the given default color.
 *
 * If the gradient consists of an array of 2 color values, a linear color scale
 * will be created using the given domain. If the array is bigger it is
 * assumed that the indexes map directly to the data value.
 *
 * @param getChoroplethValue
 * @param domain
 * @param gradient
 * @param defaultColor
 */
export function useChoroplethColorScale(
  getChoroplethValue:
    | GetRegionDataFunctionType
    | GetMunicipalityDataFunctionType,
  thresholds: ChoroplethThresholdsValue[],
  defaultColor = 'white'
) {
  const colorScale = useMemo(() => {
    assert(
      Array.isArray(thresholds),
      `thresholds is not of type Array: ${JSON.stringify(thresholds)}`
    );

    const domain = thresholds.map((t) => t.threshold);
    domain.shift();
    const color = scaleThreshold<number, string>()
      .domain(domain)
      .range(thresholds.map((t) => t.color));

    return color;
  }, [thresholds]);

  return useCallback(
    (id: string) => {
      const data = getChoroplethValue(id);

      return isDefined(data) ? colorScale(data.__color_value) : defaultColor;
    },
    [colorScale, getChoroplethValue, defaultColor]
  );
}
