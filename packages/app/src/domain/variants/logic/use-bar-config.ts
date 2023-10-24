import { ColorMatch, VariantChartValue, VariantDynamicLabels, VariantsOverTimeGraphText } from '~/domain/variants/data-selection/types';
import { useMemo } from 'react';
import { getValuesInTimeframe, TimeframeOption } from '@corona-dashboard/common';
import { isPresent } from 'ts-is-present';
import { BarSeriesDefinition } from '~/components/time-series-chart/logic';

const extractVariantNamesFromValues = (values: VariantChartValue[]) => {
  return values
    .flatMap((variantChartValue) => Object.keys(variantChartValue))
    .filter((keyName, index, array) => array.indexOf(keyName) === index)
    .filter((keyName) => keyName.endsWith('_occurrence'));
};

/**
 * Create configuration labels for interactive legend
 * @param values - Chart data
 * @param variantLabels - Mnemonic labels for variants
 * @param tooltipLabels - SiteText for other variants
 * @param colors - Colors for variants
 * @param timeframe - Selected timeframe
 * @param today - Date of today
 */
export const useBarConfig = (
  values: VariantChartValue[],
  variantLabels: VariantDynamicLabels,
  tooltipLabels: VariantsOverTimeGraphText,
  colors: ColorMatch[],
  timeframe: TimeframeOption,
  today: Date
) => {
  return useMemo(() => {
    const valuesInTimeframe: VariantChartValue[] = getValuesInTimeframe(values, timeframe, today);

    const activeVariantsInTimeframeValues: VariantChartValue[] = valuesInTimeframe.map((val) => {
      return Object.fromEntries(
        Object.entries(val).filter(([key, value]) => (key.includes('occurrence') ? value !== 0 && isPresent(value) && !isNaN(Number(value)) : value))
      ) as VariantChartValue;
    });

    const activeVariantsInTimeframeNames: string[] = extractVariantNamesFromValues(activeVariantsInTimeframeValues);

    const listOfVariantCodes: string[] = extractVariantNamesFromValues(valuesInTimeframe)
      .filter((keyName) => activeVariantsInTimeframeNames.includes(keyName))
      .reverse();

    const barChartConfig: BarSeriesDefinition<VariantChartValue>[] = [];

    listOfVariantCodes.forEach((variantKey) => {
      const variantCodeName = variantKey.split('_').slice(0, -1).join('_');

      const variantMetricPropertyName = variantCodeName.concat('_occurrence');

      const variantDynamicLabel = variantLabels[variantCodeName];

      const color = colors.find((variantColors) => variantColors.variant === variantCodeName)?.color;

      if (variantDynamicLabel) {
        const barChartConfigEntry = {
          type: 'bar',
          metricProperty: variantMetricPropertyName,
          color: color,
          label: variantDynamicLabel,
          fillOpacity: 1,
          shape: 'gapped-area',
          hideInLegend: true,
        };

        barChartConfig.push(barChartConfigEntry as BarSeriesDefinition<VariantChartValue>);
      }
    });

    return barChartConfig;
  }, [values, tooltipLabels.tooltip_labels.other_percentage, variantLabels, colors, timeframe, today]);
};
