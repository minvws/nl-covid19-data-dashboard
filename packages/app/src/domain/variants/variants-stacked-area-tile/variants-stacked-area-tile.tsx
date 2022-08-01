import {
  colors,
  TimeframeOption,
  TimeframeOptionsList,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { ReactNode, useMemo } from 'react';
import styled from 'styled-components';
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

type VariantsStackedAreaTileText = {
  variantCodes: SiteText['common']['variant_codes'];
} & SiteText['pages']['variants_page']['nl']['varianten_over_tijd_grafiek'];

type VariantsStackedAreaTileProps = {
  text: VariantsStackedAreaTileText;
  values?: VariantChartValue[] | null;
  variantColors: ColorMatch[];
  metadata: MetadataProps;
  children?: ReactNode;
  noDataMessage?: ReactNode;
};

export function VariantsStackedAreaTile({
  values,
  variantColors,
  metadata,
  children = null,
  noDataMessage = '',
  text,
}: VariantsStackedAreaTileProps) {
  if (!isPresent(values)) {
    return (
      <ChartTile
        title={text.titel}
        description={text.toelichting}
        metadata={metadata}
      >
        {children}
        <NoDataBox>{noDataMessage}</NoDataBox>
      </ChartTile>
    );
  }
  return (
    <VariantStackedAreaTileWithData
      text={text}
      values={values}
      metadata={metadata}
      variantColors={variantColors}
    >
      {children}
    </VariantStackedAreaTileWithData>
  );
}

const alwaysEnabled: (keyof VariantChartValue)[] = [];

type VariantStackedAreaTileWithDataProps = {
  text: VariantsStackedAreaTileText;
  values: VariantChartValue[];
  metadata: MetadataProps;
  variantColors: ColorMatch[];
  children?: ReactNode;
};

function VariantStackedAreaTileWithData({
  text,
  values,
  variantColors,
  metadata,
  children = null,
}: VariantStackedAreaTileWithDataProps) {
  const { list, toggle, clear } =
    useList<keyof VariantChartValue>(alwaysEnabled);

  const [seriesConfig, otherConfig, selectOptions] = useSeriesConfig(
    text,
    values,
    variantColors
  );

  const filteredConfig = useFilteredSeriesConfig(
    seriesConfig,
    otherConfig,
    list
  );

  /* Static legend contains only the inaccurate item */
  const staticLegendItems: LegendItem[] = [];

  const timespanAnnotations = useUnreliableDataAnnotations(
    values,
    text.lagere_betrouwbaarheid
  );

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
      timeframeInitialValue={TimeframeOption.SIX_MONTHS}
    >
      {(timeframe) => (
        <>
          {children}
          {children && <Spacer mb={3} />}
          <InteractiveLegend
            helpText={text.legend_help_tekst}
            selectOptions={selectOptions}
            selection={list}
            onToggleItem={toggle}
            onReset={clear}
          />
          <Spacer mb={2} />
          <TimeSeriesChart
            accessibility={{
              key: 'variants_stacked_area_over_time_chart',
            }}
            values={values}
            timeframe={timeframe}
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
               * In the chart the 'other_percentage' stack is rendered on top,
               * but in the tooltip it needs to be displayed as the last item.
               * (These are both design decisions)
               */
              const reorderContext = {
                ...context,
                config: [
                  ...context.config.filter(
                    (x) =>
                      !hasMetricProperty(x) ||
                      x.metricProperty !== 'other_graph_percentage'
                  ),
                  context.config.find(
                    (x) =>
                      hasMetricProperty(x) &&
                      x.metricProperty === 'other_graph_percentage'
                  ),
                ].filter(isDefined),
              };

              return <TooltipSeriesList data={reorderContext} hasTwoColumns />;
            }}
            numGridLines={0}
            tickValues={[0, 25, 50, 75, 100]}
          />
          <Legend items={staticLegendItems} />
        </>
      )}
    </ChartTile>
  );
}

function hasMetricProperty(config: any): config is { metricProperty: string } {
  return 'metricProperty' in config;
}

function useFilteredSeriesConfig(
  seriesConfig: GappedAreaSeriesDefinition<VariantChartValue>[],
  otherConfig: GappedAreaSeriesDefinition<VariantChartValue>,
  compareList: (keyof VariantChartValue)[]
) {
  return useMemo(() => {
    return [otherConfig, ...seriesConfig].filter(
      (item) =>
        item.metricProperty !== 'other_graph_percentage' &&
        (compareList.includes(item.metricProperty) ||
          compareList.length === alwaysEnabled.length)
    );
  }, [seriesConfig, otherConfig, compareList]);
}

function useSeriesConfig(
  text: VariantsStackedAreaTileText,
  values: VariantChartValue[],
  variantColors: ColorMatch[]
) {
  return useMemo(() => {
    const baseVariantsFiltered = values
      .flatMap((x) => Object.keys(x))
      .filter((x, index, array) => array.indexOf(x) === index) // de-dupe
      .filter(
        (x) => x.endsWith('_percentage') && x !== 'other_graph_percentage'
      )
      .reverse(); // Reverse to be in an alphabetical order

    /* Enrich config with dynamic data / locale */
    const seriesConfig: GappedAreaSeriesDefinition<VariantChartValue>[] =
      baseVariantsFiltered.map((variantKey) => {
        const variantCodeFragments = variantKey.split('_');
        variantCodeFragments.pop();
        const variantCode = variantCodeFragments.join('_') as VariantCode;

        const color =
          variantColors.find(
            (variantColors) => variantColors.variant === variantCode
          )?.color || colors.data.variants.fallbackColor;

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
      color: colors.data.variants.other_graph,
      strokeWidth: 2,
      mixBlendMode: 'multiply',
    } as GappedAreaSeriesDefinition<VariantChartValue>;

    const selectOptions = [...seriesConfig];

    return [seriesConfig, otherConfig, selectOptions] as const;
  }, [
    values,
    text.tooltip_labels.other_percentage,
    text.variantCodes,
    variantColors,
  ]);
}

const NoDataBox = styled.div(
  css({
    width: '100%',
    display: 'flex',
    height: '8em',
    color: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  })
);
