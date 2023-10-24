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
  const hasSelectedMetrics = context.config.length !== selectionOptions.length; // Check whether the user has selected any variants from the interactive legend.

  /* Filter out any variants that have an occcurrence value of 0 */
  const filteredValues = Object.fromEntries(
    Object.entries(context.value).filter(([key, value]) => (key.includes('occurrence') ? value !== 0 && isPresent(value) && !isNaN(Number(value)) : value))
  ) as VariantChartValue;

  /* Rebuild tooltip data context with filtered values */
  const reorderContext = {
    ...context,
    config: [...context.config.filter((value) => !hasMetricProperty(value) || filteredValues[value.metricProperty] || hasSelectedMetrics)].filter(isDefined),
    value: !hasSelectedMetrics ? filteredValues : context.value,
  };

  return reorderContext as TooltipData<VariantChartValue & T>;
};
