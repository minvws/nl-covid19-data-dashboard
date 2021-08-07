import { assert, KeysOfType } from '@corona-dashboard/common';
import { scaleThreshold } from 'd3-scale';
import { useCallback, useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { DataConfig } from '~/components/choropleth2';
import { thresholds } from './thresholds';
import { ChoroplethDataItem, mapToCodeType, MapType } from './types';
import { isCodedValueType } from './utils';

export function useFillColor<T extends ChoroplethDataItem>(
  data: T[],
  map: MapType,
  metricProperty: KeysOfType<T, number, true>,
  dataConfig: DataConfig<T>
) {
  const getValueByCode = useMemo(() => {
    const codeType = mapToCodeType[map];
    return (code: string) => {
      const item = data
        .filter(isCodedValueType(codeType))
        .find((x) => (x as any)[codeType] === code);
      assert(isDefined(item), `No data item for code '${code}' could be found`);
      return item[metricProperty];
    };
  }, [map, metricProperty]);

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
  }, [thresholds]);

  return useCallback(
    (code: string) => {
      const value = getValueByCode(code);
      return isDefined(value) ? colorScale(value) : dataConfig.noDataFillColor;
    },
    [getValueByCode, colorScale]
  );
}
