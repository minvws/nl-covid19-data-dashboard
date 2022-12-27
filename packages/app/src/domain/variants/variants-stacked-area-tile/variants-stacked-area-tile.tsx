import { colors, TimeframeOption, TimeframeOptionsList } from '@corona-dashboard/common';
import { useMemo, useState } from 'react';
import { isDefined, isPresent } from 'ts-is-present';
import { Spacer } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { InteractiveLegend } from '~/components/interactive-legend';
import { Legend, LegendItem } from '~/components/legend';
import { MetadataProps } from '~/components/metadata';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TooltipSeriesList } from '~/components/time-series-chart/components/tooltip/tooltip-series-list';
import { GappedAreaSeriesDefinition } from '~/components/time-series-chart/logic';
import { VariantChartValue } from '~/domain/variants/static-props';
import { SiteText } from '~/locale';
import { useList } from '~/utils/use-list';
import { ColorMatch, VariantCode } from '~/domain/variants/static-props';
import { useUnreliableDataAnnotations } from './logic/use-unreliable-data-annotations';
import { space } from '~/style/theme';

type VariantsStackedAreaTileText = {
  variantCodes: SiteText['common']['variant_codes'];
} & SiteText['pages']['variants_page']['nl']['varianten_over_tijd_grafiek'];

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

  const [seriesConfig, otherConfig, selectOptions] = useSeriesConfig(text, values, variantColors);

  const filteredConfig = useFilteredSeriesConfig(seriesConfig, otherConfig, list);

  /* Static legend contains only the inaccurate item */
  const staticLegendItems: LegendItem[] = [];

  const timespanAnnotations = useUnreliableDataAnnotations(values, text.lagere_betrouwbaarheid);

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
        formatTooltip={(context) => {
          /**
           * Filter out zero values in value object, so it will be invisible in the tooltip.
           * When a selection has been made, the zero values will be shown in the tooltip.
           */
          const metricAmount = context.config.length;
          const totalMetricAmount = seriesConfig.length;
          const hasSelectedMetrics = metricAmount !== totalMetricAmount;

          const filteredValues = Object.fromEntries(
            Object.entries(context.value).filter(([key, value]) => (key.includes('percentage') ? value !== 0 && isPresent(value) && !isNaN(Number(value)) : value))
          ) as VariantChartValue;

          const reorderContext = {
            ...context,
            config: [
              ...context.config.filter((value) => !hasMetricProperty(value) || filteredValues[value.metricProperty] || hasSelectedMetrics),
              context.config.find((value) => hasMetricProperty(value) && value.metricProperty === 'other_graph_percentage'),
            ].filter(isDefined),
            value: !hasSelectedMetrics ? filteredValues : context.value,
          };

          const percentageValuesAmount = Object.keys(reorderContext.value).filter((key) => key.includes('percentage')).length;

          const hasTwoColumns = !hasSelectedMetrics ? percentageValuesAmount > 4 : metricAmount > 4;

          return <TooltipSeriesList data={reorderContext} hasTwoColumns={hasTwoColumns} />;
        }}
        numGridLines={0}
        tickValues={[0, 25, 50, 75, 100]}
      />
      <Legend items={staticLegendItems} />
    </ChartTile>
  );
};

const hasMetricProperty = (config: any): config is { metricProperty: string } => {
  return 'metricProperty' in config;
};

const useFilteredSeriesConfig = (
  seriesConfig: GappedAreaSeriesDefinition<VariantChartValue>[],
  otherConfig: GappedAreaSeriesDefinition<VariantChartValue>,
  compareList: (keyof VariantChartValue)[]
) => {
  return useMemo(() => {
    return [otherConfig, ...seriesConfig].filter(
      (item) => item.metricProperty !== 'other_graph_percentage' && (compareList.includes(item.metricProperty) || compareList.length === alwaysEnabled.length)
    );
  }, [seriesConfig, otherConfig, compareList]);
};

const useSeriesConfig = (text: VariantsStackedAreaTileText, values: VariantChartValue[], variantColors: ColorMatch[]) => {
  return useMemo(() => {
    const baseVariantsFiltered = values
      .flatMap((x) => Object.keys(x))
      .filter((x, index, array) => array.indexOf(x) === index) // de-dupe
      .filter((x) => x.endsWith('_percentage') && x !== 'other_graph_percentage')
      .reverse(); // Reverse to be in an alphabetical order

    /* Enrich config with dynamic data / locale */
    const seriesConfig: GappedAreaSeriesDefinition<VariantChartValue>[] = baseVariantsFiltered.map((variantKey) => {
      const variantCodeFragments = variantKey.split('_');
      variantCodeFragments.pop();
      const variantCode = variantCodeFragments.join('_') as VariantCode;

      const color = variantColors.find((variantColors) => variantColors.variant === variantCode)?.color || colors.gray5;

      return {
        type: 'gapped-area',
        metricProperty: variantKey as keyof VariantChartValue,
        color,
        label: text.variantCodes[variantCode],
        shape: 'gapped-area',
        strokeWidth: 2,
        fillOpacity: 0.2,
        mixBlendMode: 'multiply',
      };
    });

    const otherConfig = {
      type: 'gapped-area',
      metricProperty: 'other_graph_percentage',
      label: text.tooltip_labels.other_percentage,
      fillOpacity: 0.2,
      shape: 'square',
      color: colors.gray5,
      strokeWidth: 2,
      mixBlendMode: 'multiply',
    } as GappedAreaSeriesDefinition<VariantChartValue>;

    const selectOptions = [...seriesConfig];

    return [seriesConfig, otherConfig, selectOptions] as const;
  }, [values, text.tooltip_labels.other_percentage, text.variantCodes, variantColors]);
};
