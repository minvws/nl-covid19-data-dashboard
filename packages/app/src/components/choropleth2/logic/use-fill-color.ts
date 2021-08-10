import { assert, KeysOfType } from '@corona-dashboard/common';
import { scaleThreshold } from 'd3-scale';
import { useCallback, useMemo } from 'react';
import { isDefined, isPresent } from 'ts-is-present';
import { DataConfig } from '~/components/choropleth2';
import { thresholds } from './thresholds';
import { ChoroplethDataItem, mapToCodeType, MapType } from './types';
import { isCodedValueType } from './utils';

export function useFillColor<T extends ChoroplethDataItem>(
  data: T[],
  map: MapType,
  metricProperty: KeysOfType<T, number | null | boolean | undefined, true>,
  dataConfig: DataConfig<T>
) {
  const codeType = mapToCodeType[map];

  const getValueByCode = useMemo(() => {
    return (code: string) => {
      const item = data
        .filter(isCodedValueType(codeType))
        .find((x) => (x as any)[codeType] === code);
      return isDefined(item) && isPresent(item[metricProperty])
        ? Number(item[metricProperty])
        : undefined;
    };
  }, [metricProperty, codeType, data]);

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
      const value = getValueByCode(code);
      const result = isPresent(value)
        ? colorScale(value)
        : dataConfig.noDataFillColor;
      return result;
    },
    [getValueByCode, colorScale, dataConfig.noDataFillColor]
  );
}
