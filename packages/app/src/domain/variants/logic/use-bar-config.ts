import { ColorMatch, VariantChartValue, StackedBarConfig, VariantDynamicLabels, VariantsOverTimeGraphText } from '~/domain/variants/data-selection/types';
import { useMemo } from 'react';
import { getValuesInTimeframe, TimeframeOption } from '@corona-dashboard/common';
import { isPresent } from 'ts-is-present';

const extractVariantNamesFromValues = (values: VariantChartValue[]) => {
  return values
    .flatMap((variantChartValue) => Object.keys(variantChartValue))
    .filter((keyName, index, array) => array.indexOf(keyName) === index)
    .filter((keyName) => keyName.endsWith('_occurrence'));
};

export const useBarConfig = (
  values: VariantChartValue[],
  selectedOptions: (keyof VariantChartValue)[],
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

    const barChartConfig: StackedBarConfig<VariantChartValue>[] = [];

    listOfVariantCodes.forEach((variantKey) => {
      const variantCodeName = variantKey.split('_').slice(0, -1).join('_');

      const variantMetricPropertyName = variantCodeName.concat('_occurrence');

      const variantDynamicLabel = variantLabels[variantCodeName];

      const color = colors.find((variantColors) => variantColors.variant === variantCodeName)?.color;

      if (variantDynamicLabel) {
        const barChartConfigEntry = {
          metricProperty: variantMetricPropertyName,
          color: color,
          label: variantDynamicLabel,
          shape: 'gapped-area',
        };

        barChartConfig.push(barChartConfigEntry as StackedBarConfig<VariantChartValue>);
      }
    });

    const selectOptions: StackedBarConfig<VariantChartValue>[] = [...barChartConfig];

    if (selectedOptions.length > 0) {
      const selection = barChartConfig.filter((selectedConfig) => selectedOptions.includes(selectedConfig.metricProperty));
      return [selection, selectOptions];
    } else {
      return [barChartConfig, selectOptions];
    }
  }, [values, tooltipLabels.tooltip_labels.other_percentage, variantLabels, colors, selectedOptions, timeframe, today]);
};
