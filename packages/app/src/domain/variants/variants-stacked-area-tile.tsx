import { TimeframeOption, TimeframeOptionsList } from '@corona-dashboard/common';
import { useMemo, useState } from 'react';
import { Spacer } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { InteractiveLegend } from '~/components/interactive-legend';
import { Legend, LegendItem } from '~/components/legend';
import { MetadataProps } from '~/components/metadata';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TooltipSeriesList } from '~/components/time-series-chart/components/tooltip/tooltip-series-list';
import { GappedAreaSeriesDefinition } from '~/components/time-series-chart/logic';
import { useList } from '~/utils/use-list';
import { space } from '~/style/theme';
import { useUnreliableDataAnnotations } from './logic/use-unreliable-data-annotations';
import { ColorMatch, VariantChartValue, VariantsStackedAreaTileText } from '~/domain/variants/data-selection/types';
import { useSeriesConfig } from '~/domain/variants/logic/use-series-config';
import { reorderAndFilter } from '~/domain/variants/logic/reorder-and-filter';

const alwaysEnabled: (keyof VariantChartValue)[] = [];

interface VariantsStackedAreaTileProps {
  text: VariantsStackedAreaTileText;
  values: VariantChartValue[];
  metadata: MetadataProps;
  variantColors: ColorMatch[];
}

export const VariantsStackedAreaTile = ({ text, values, variantColors, metadata }: VariantsStackedAreaTileProps) => {
  const [variantTimeframe, setVariantTimeframe] = useState<TimeframeOption>(TimeframeOption.THREE_MONTHS);

  const { list, toggle, clear } = useList<keyof VariantChartValue>(alwaysEnabled);

  const [seriesConfig, selectOptions] = useSeriesConfig(text, values, variantColors);

  const filteredConfig = useFilteredSeriesConfig(seriesConfig, list);

  /* Static legend contains only the inaccurate item */
  const staticLegendItems: LegendItem[] = [];

  const timespanAnnotations = useUnreliableDataAnnotations(values, text.lagere_betrouwbaarheid);

  const hasTwoColumns = list.length === 0 || list.length > 4;

  if (timespanAnnotations.length) {
    staticLegendItems.push({
      shape: 'dotted-square',
      color: 'black',
      label: text.lagere_betrouwbaarheid,
    });
  }

  return (
    <ChartTile
      title={text.titel}
      description={text.toelichting}
      metadata={metadata}
      timeframeOptions={TimeframeOptionsList}
      timeframeInitialValue={TimeframeOption.THREE_MONTHS}
      onSelectTimeframe={setVariantTimeframe}
    >
      <InteractiveLegend helpText={text.legend_help_tekst} selectOptions={selectOptions} selection={list} onToggleItem={toggle} onReset={clear} />
      <Spacer marginBottom={space[2]} />
      <TimeSeriesChart
        accessibility={{
          key: 'variants_stacked_area_over_time_chart',
        }}
        values={values}
        timeframe={variantTimeframe}
        seriesConfig={filteredConfig}
        disableLegend
        dataOptions={{
          isPercentage: true,
          forcedMaximumValue: 100,
          timespanAnnotations,
          renderNullAsZero: true,
        }}
        formatTooltip={(data) => (
          <TooltipSeriesList data={reorderAndFilter<VariantChartValue, GappedAreaSeriesDefinition<VariantChartValue>>(data, selectOptions)} hasTwoColumns={hasTwoColumns} />
        )}
        numGridLines={0}
        tickValues={[0, 25, 50, 75, 100]}
      />
      <Legend items={staticLegendItems} />
    </ChartTile>
  );
};

const useFilteredSeriesConfig = (seriesConfig: GappedAreaSeriesDefinition<VariantChartValue>[], compareList: (keyof VariantChartValue)[]) => {
  return useMemo(() => {
    return seriesConfig.filter((item) => compareList.includes(item.metricProperty) || compareList.length === alwaysEnabled.length);
  }, [seriesConfig, compareList]);
};
