import { ChartTile, MetadataProps } from '~/components';
import { Spacer } from '~/components/base';
import { TimeframeOption, TimeframeOptionsList } from '@corona-dashboard/common';
import { useState } from 'react';
import { ColorMatch, StackedBarConfig, VariantChartValue, VariantDynamicLabels, VariantsOverTimeGraphText } from '~/domain/variants/data-selection/types';
import { StackedBarTooltipData, StackedChart } from '~/components/stacked-chart';
import { useBarConfig } from '~/domain/variants/logic/use-bar-config';
import { InteractiveLegend } from '~/components/interactive-legend';
import { useList } from '~/utils/use-list';
import { TooltipSeriesList } from '~/components/time-series-chart/components/tooltip/tooltip-series-list';
import { space } from '~/style/theme';
import { useCurrentDate } from '~/utils/current-date-context';
import { reorderAndFilter } from '~/domain/variants/logic/reorder-and-filter';

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
        formatTooltip={(data) => (
          <TooltipSeriesList data={reorderAndFilter<StackedBarTooltipData, StackedBarConfig<VariantChartValue>>(data, selectionOptions)} hasTwoColumns={hasTwoColumns} />
        )}
      />
    </ChartTile>
  );
};
