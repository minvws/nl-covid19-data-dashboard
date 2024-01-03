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

  /* Filter out any variants that have an occcurrence value of 0 */
  const valuesFromContext = Object.fromEntries(
    Object.entries(context.value).filter(([key, value]) => (key.includes('occurrence') ? value !== 0 && isPresent(value) && !isNaN(Number(value)) : value))
  ) as VariantChartValue;

  const sortedValuesFromContext = Object.fromEntries(
    Object.entries(valuesFromContext).sort((a, b) => {
      if (a[0].includes('occurrence') && typeof a[1] === 'number') {
        if (a[0] === b[0]) {
          return 0;
        } else {
          return a[0] < b[0] ? -1 : 1;
        }
      } else {
        return 0;
      }
    })
  ) as VariantChartValue;

  /**
   * Generate filtered tooltip context.
   * If user has selected any variants to filter:
   *  - return all properties from context config
   * If user has not selected any variants to filter:
   *  return only properties from context config that are either:
   *    - Do NOT contain key 'metricProperty'
   *    - Do contain key 'metricProperty' and it's value matches with keyname in valuesFromContext object
   */
  const reorderContext = {
    ...context,
    config: [...context.config.filter((value) => !hasMetricProperty(value) || sortedValuesFromContext[value.metricProperty] || filterSelectionActive)].filter(isDefined),
    value: !filterSelectionActive ? valuesFromContext : context.value,
  };

  return reorderContext as TooltipData<VariantChartValue & T>;
};
