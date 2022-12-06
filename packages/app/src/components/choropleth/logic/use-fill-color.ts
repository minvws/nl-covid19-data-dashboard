import { assert, ChoroplethThresholdsValue, colors } from '@corona-dashboard/common';
import { scaleThreshold } from 'd3-scale';
import { useMemo } from 'react';
import { isDefined, isPresent } from 'ts-is-present';
import { DataConfig } from '~/components/choropleth';
import { thresholds } from './thresholds';
import { ChoroplethDataItem, CodeProp, mapToCodeType, MapType } from './types';
import { isCodedValueType } from './utils';

/**
 * Returns a memoized fill color function. This function will return
 * a color value based on a given numeric value based on an associated
 * color threshold scale.
 *
 * @param data
 * @param map
 * @param dataConfig
 * @returns
 */
export function useFillColor<T extends ChoroplethDataItem>(data: T[], map: MapType, dataConfig: DataConfig<T>, thresholdMap?: MapType) {
  const codeType = mapToCodeType[map];
  const { metricProperty, noDataFillColor } = dataConfig;

  const getValueByCode = useMemo(() => createGetValueByCode(metricProperty, codeType, data), [metricProperty, codeType, data]);

  const getIsOutdatedByCode = useMemo(() => createIsOutdatedByCode(codeType, data), [codeType, data]);

  const threshold = thresholds[thresholdMap || map][metricProperty as string];
  assert(isDefined(threshold), `[${useFillColor.name}] No threshold configured for map type ${map} and metric property ${metricProperty.toString()}`);

  const colorScale = useMemo(() => createColorScale(threshold), [threshold]);

  return useMemo(() => createGetFillColor(getValueByCode, getIsOutdatedByCode, colorScale, noDataFillColor), [getValueByCode, getIsOutdatedByCode, colorScale, noDataFillColor]);
}

export function getFillColor<T extends ChoroplethDataItem>(data: T[], map: MapType, dataConfig: DataConfig<T>, thresholdMap?: MapType) {
  const codeType = mapToCodeType[map];
  const { metricProperty, noDataFillColor } = dataConfig;

  const getValueByCode = createGetValueByCode(metricProperty, codeType, data);
  const getIsOutdatedByCode = createIsOutdatedByCode(codeType, data);

  const threshold = thresholds[thresholdMap || map][metricProperty as string];
  assert(isDefined(threshold), `[${getFillColor.name}] No threshold configured for map type ${map} and metric property ${metricProperty.toString()}`);
  const colorScale = createColorScale(threshold);

  return createGetFillColor(getValueByCode, getIsOutdatedByCode, colorScale, noDataFillColor);
}

function createGetFillColor(
  getValueByCode: ReturnType<typeof createGetValueByCode>,
  getIsOutdatedByCode: ReturnType<typeof createIsOutdatedByCode>,
  colorScale: ReturnType<typeof createColorScale>,
  noDataFillColor: string
) {
  return (code: string) => {
    const value = getValueByCode(code);
    const shouldOverrideDefaultColor = getIsOutdatedByCode(code);
    let result = noDataFillColor;

    if (isPresent(value)) result = colorScale(value);

    // Override the default color scale when a datapoint contains outdated data.
    if (shouldOverrideDefaultColor) result = colors.yellow1;

    return result;
  };
}

// Returns a function which returns a boolean when the datapoint (matching the code passed in) contains outdated data.
function createIsOutdatedByCode<T extends ChoroplethDataItem>(codeType: CodeProp, data: T[]): (code: string) => boolean {
  return (code: string) => {
    const dataPointByCode = data.find((dataPoint) => {
      if ((dataPoint as unknown as Record<string, string>)[codeType] === code) {
        return dataPoint;
      }
    });

    if (dataPointByCode && 'data_is_outdated' in dataPointByCode) {
      return dataPointByCode.data_is_outdated;
    }

    return false;
  };
}

function createColorScale(threshold: ChoroplethThresholdsValue<number>[]) {
  const domain = threshold.map((t) => t.threshold);
  domain.shift();
  const color = scaleThreshold<number, string>()
    .domain(domain)
    .range(threshold.map((t) => t.color));

  return color;
}

function createGetValueByCode<T extends ChoroplethDataItem>(metricProperty: keyof T, codeType: CodeProp, data: T[]) {
  return (code: string) => {
    const item = data
      .filter((x) => {
        const filterFn = isCodedValueType(codeType);
        return filterFn && filterFn(x);
      })
      .find((x) => (x as unknown as Record<string, string>)[codeType] === code);

    return isDefined(item) && isPresent(item[metricProperty]) ? Number(item[metricProperty]) : undefined;
  };
}
