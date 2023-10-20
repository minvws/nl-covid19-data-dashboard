import { ChartTile, MetadataProps } from '~/components';
import { Spacer } from '~/components/base';
import { TimeframeOption, TimeframeOptionsList } from '@corona-dashboard/common';
import { useState } from 'react';
import { ColorMatch, StackedBarConfig, VariantChartValue, VariantDynamicLabels, VariantsOverTimeGraphText } from '~/domain/variants/data-selection/types';
import { StackedBarTooltipData, StackedChart } from '~/components/stacked-chart';
import { useBarConfig } from '~/domain/variants/logic/use-bar-config';
import { InteractiveLegend } from '~/components/interactive-legend';
import { useList } from '~/utils/use-list';
import { TooltipData } from '~/components/time-series-chart/components';
import { isDefined, isPresent } from 'ts-is-present';
import { TooltipSeriesList } from '~/components/time-series-chart/components/tooltip/tooltip-series-list';
import { space } from '~/style/theme';
import { useCurrentDate } from '~/utils/current-date-context';

interface VariantsStackedBarChartTileProps {
  title: string;
  description: string;
  helpText: string;
  values: VariantChartValue[];
  tooltipLabels: VariantsOverTimeGraphText;
  variantLabels: VariantDynamicLabels;
  variantColors: ColorMatch[];
  metadata: MetadataProps;
}

const alwaysEnabled: (keyof VariantChartValue)[] = [];

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
const reorderAndFilter = (context: TooltipData<VariantChartValue & StackedBarTooltipData>, selectionOptions: StackedBarConfig<VariantChartValue>[]) => {
  const metricAmount = context.config.length;
  const totalMetricAmount = selectionOptions.length;
  const hasSelectedMetrics = metricAmount !== totalMetricAmount; // Check whether the user has selected any variants from the interactive legend.

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

  return reorderContext as TooltipData<VariantChartValue & StackedBarTooltipData>;
};

/**
 * Variant bar chart component
 * @param title - Graph title
 * @param description - Graph description text
 * @param helpText - Explainer text above the interactive legend
 * @param values - Data
 * @param variantLabels - Mnemonic names for variants
 * @param variantColors - Colors for variants
 * @param metadata - Metadata block
 * @constructor
 */
export const VariantsStackedBarChartTile = ({ title, description, helpText, tooltipLabels, values, variantLabels, variantColors, metadata }: VariantsStackedBarChartTileProps) => {
  const today = useCurrentDate();

  const { list, toggle, clear } = useList<keyof VariantChartValue>(alwaysEnabled);

  const [variantTimeFrame, setVariantTimeFrame] = useState<TimeframeOption>(TimeframeOption.THREE_MONTHS);

  const [barChartConfig, selectionOptions] = useBarConfig(values, list, variantLabels, tooltipLabels, variantColors, variantTimeFrame, today);

  const hasTwoColumns = list.length === 0 || list.length > 4;

  return (
    <ChartTile
      title={title}
      description={description}
      metadata={metadata}
      timeframeOptions={TimeframeOptionsList}
      timeframeInitialValue={TimeframeOption.THREE_MONTHS}
      onSelectTimeframe={setVariantTimeFrame}
    >
      <InteractiveLegend helpText={helpText} selectOptions={selectionOptions} selection={list} onToggleItem={toggle} onReset={clear} />
      <Spacer marginBottom={space[2]} />
      <StackedChart
        accessibility={{
          key: 'variants_stacked_area_over_time_chart',
        }}
        values={values}
        config={barChartConfig}
        disableLegend
        timeframe={variantTimeFrame}
        formatTooltip={(data) => <TooltipSeriesList data={reorderAndFilter(data, selectionOptions)} hasTwoColumns={hasTwoColumns} />}
      />
    </ChartTile>
  );
};
