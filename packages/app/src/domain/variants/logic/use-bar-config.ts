import { ColorMatch, VariantChartValue, VariantsStackedAreaTileText, StackedBarConfig } from '~/domain/variants/data-selection/types';
import { useMemo } from 'react';

export const useBarConfig = (values: VariantChartValue[], selectedOptions: (keyof VariantChartValue)[], text: VariantsStackedAreaTileText, colors: ColorMatch[]) => {
  return useMemo(() => {
    const listOfVariantCodes = values
      .flatMap((variantChartValue) => Object.keys(variantChartValue))
      .filter((keyName, index, array) => array.indexOf(keyName) === index)
      .filter((keyName) => keyName.endsWith('_occurrence'))
      .reverse();

    const barChartConfig: StackedBarConfig<VariantChartValue>[] = [];

    listOfVariantCodes.forEach((variantKey) => {
      const variantCodeName = variantKey.split('_').slice(0, -1).join('_');

      const variantMetricPropertyName = variantCodeName.concat('_occurrence');

      const variantDynamicLabel = text.variantCodes[variantCodeName];

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
  }, [values, text.tooltip_labels.other_percentage, text.variantCodes, colors, selectedOptions]);
};
