import { assert } from '@corona-dashboard/common';
import { scaleThreshold } from 'd3-scale';
import { useCallback, useMemo } from 'react';
import { isDefined, isPresent } from 'ts-is-present';
import { DataConfig } from '~/components/choropleth';
import { thresholds } from './thresholds';
import { ChoroplethDataItem, mapToCodeType, MapType } from './types';
import { isCodedValueType } from './utils';

export function useFillColor<T extends ChoroplethDataItem>(
  data: T[],
  map: MapType,
  dataConfig: DataConfig<T>
) {
  const codeType = mapToCodeType[map];
  const { metricProperty, noDataFillColor, getCustomFillColor } = dataConfig;

  const getValueByCode = useMemo(() => {
    return (code: string) => {
      const item = data
        .filter(isCodedValueType(codeType))
        .find(
          (x) => (x as unknown as Record<string, string>)[codeType] === code
        );
      return isDefined(item) && isPresent(item[metricProperty])
        ? Number(item[metricProperty])
        : undefined;
    };
  }, [metricProperty, codeType, data]);

  const getItemByCode = useCallback(
    (code) => {
      const item = data
        .filter(isCodedValueType(codeType))
        .find(
          (x) => (x as unknown as Record<string, string>)[codeType] === code
        );
      return isDefined(item) ? item : undefined;
    },
    [codeType, data]
  );

  const threshold = thresholds[map][metricProperty as string];
  assert(
    isDefined(threshold),
    `No threshold configured for map type ${map} and metric property ${metricProperty}`
  );

  const colorScale = useMemo(() => {
    const domain = threshold.map((t) => t.threshold);
    domain.shift();
    const color = scaleThreshold<number, string>()
      .domain(domain)
      .range(threshold.map((t) => t.color));

    return color;
  }, [threshold]);

  return useCallback(
    (code: string) => {
      if (isPresent(getCustomFillColor)) {
        const item = getItemByCode(code);
        return isPresent(item)
          ? getCustomFillColor(item, colorScale)
          : noDataFillColor;
      } else {
        const value = getValueByCode(code);
        return isPresent(value) ? colorScale(value) : noDataFillColor;
      }
    },
    [
      getValueByCode,
      getCustomFillColor,
      noDataFillColor,
      colorScale,
      getItemByCode,
    ]
  );
}
