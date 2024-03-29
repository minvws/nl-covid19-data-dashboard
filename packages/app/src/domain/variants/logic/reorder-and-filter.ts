import { isDefined, isPresent } from 'ts-is-present';
import { VariantChartValue } from '~/domain/variants/data-selection/types';
import { TooltipData } from '~/components/time-series-chart/components';

/**
 * Check if the key metricProperty exists
 * @param config
 */
const hasMetricProperty = (config: any): config is { metricProperty: string } => {
  return 'metricProperty' in config;
};

/**
 * Only variants that have a greater occurrence than 0 must be shown in the tooltip, except when the user narrows down
 * the total amount of visible variants by selecting one or more from the legend
 * @param context - Tooltip data context
 * @param selectionOptions - Currently selected variants
 */
export const reorderAndFilter = <T, P>(context: TooltipData<VariantChartValue & T>, selectionOptions: P[]) => {
  const filterSelectionActive = context.config.length !== selectionOptions.length; // Check whether the user has selected any variants from the interactive legend.

  // If the user has no filter selected -> Filter out any variants that have an occurrence value of 0
  const valuesFromContext = Object.fromEntries(
    Object.entries(context.value).filter(([key, value]) => (key.includes('occurrence') ? value !== 0 && isPresent(value) && !isNaN(Number(value)) : value))
  ) as VariantChartValue;

  // If the user has no filter selected -> Filter out configs that do not contain a 'metricProperty' key OR have an occurrence value of 0
  const filteredConfigs = context.config
    .filter((value) => {
      return !hasMetricProperty(value) || valuesFromContext[value.metricProperty] || filterSelectionActive;
    })
    .filter(isDefined);

  // Sort variants by occurrence, always put 'other variants' at the end
  const sortedConfigs = filteredConfigs.sort((a: any, b: any) => {
    if (a.metricProperty.includes('other_variants')) return 1;
    if (b.metricProperty.includes('other_variants')) return -1;
    if (context.value[a.metricProperty] === context.value[b.metricProperty]) return b.order - a.order;
    return context.value[b.metricProperty] - context.value[a.metricProperty];
  });

  // Generate filtered tooltip context
  const reorderContext = {
    ...context,
    config: sortedConfigs,
    value: !filterSelectionActive ? valuesFromContext : context.value,
  };

  return reorderContext as TooltipData<VariantChartValue & T>;
};
