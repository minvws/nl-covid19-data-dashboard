import { ColorMatch, VariantChartValue, VariantsStackedAreaTileText } from '~/domain/variants/data-selection/types';
import { useMemo } from 'react';
import { GappedAreaSeriesDefinition } from '~/components/time-series-chart/logic';

/**
 * Create a configuration with appropriate mnemonic label (e.g. "Alpha", "Delta", "Omikron", etc.) and colour for all variants
 * present in data.
 * @param text
 * @param values
 * @param colors
 */
export const useSeriesConfig = (
  text: VariantsStackedAreaTileText,
  values: VariantChartValue[],
  colors: ColorMatch[]
): readonly [GappedAreaSeriesDefinition<VariantChartValue>[], GappedAreaSeriesDefinition<VariantChartValue>[]] => {
  return useMemo(() => {
    const baseVariantsFiltered = values
      .flatMap((x) => Object.keys(x)) // Get all key names
      .filter((x, index, array) => array.indexOf(x) === index) // De-dupe keys
      .filter((x) => x.endsWith('_percentage')) // Filter out any keys that don't end in '_percentage'
      .reverse(); // Reverse to be in alphabetical order

    /* Enrich config with dynamic data / locale */
    const seriesConfig: GappedAreaSeriesDefinition<VariantChartValue>[] = [];

    baseVariantsFiltered.forEach((variantKey) => {
      // Remove _percentage from variant key name
      const variantCodeFragments = variantKey.split('_');
      variantCodeFragments.pop();
      const variantCode = variantCodeFragments.join('_');

      // Match mnenonic variant name in lokalize to code-based variant name
      const variantDynamicLabel = text.variantCodes[variantCode];

      // Match appropriate variant color
      const color = colors.find((variantColors) => variantColors.variant === variantCode)?.color;

      // Create a variant label configuration and push into array
      if (variantDynamicLabel) {
        const variantConfig = {
          type: 'gapped-area',
          metricProperty: variantKey as keyof VariantChartValue,
          color,
          label: variantDynamicLabel,
          strokeWidth: 2,
          fillOpacity: 0.2,
          shape: 'gapped-area',
          mixBlendMode: 'multiply',
        };

        seriesConfig.push(variantConfig as GappedAreaSeriesDefinition<VariantChartValue>);
      }
    });

    const selectOptions: GappedAreaSeriesDefinition<VariantChartValue>[] = [...seriesConfig];

    return [seriesConfig, selectOptions] as const;
  }, [values, text.tooltip_labels.other_percentage, text.variantCodes, colors]);
};
