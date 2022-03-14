import { colors, Dictionary } from '@corona-dashboard/common';
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
import { GappedStackedAreaSeriesDefinition } from '~/components/time-series-chart/logic';
import { VariantChartValue } from '~/domain/variants/static-props';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';
import { assert } from '~/utils/assert';
import { useList } from '~/utils/use-list';
import { useUnreliableDataAnnotations } from './logic/use-unreliable-data-annotations';

type VariantsStackedAreaTileText =
  | SiteText['pages']['variantsPage']['nl']['varianten_over_tijd_grafiek']
  | SiteText['pages']['in_variantsPage']['shared']['varianten_over_tijd_grafiek'];

type VariantsStackedAreaTileProps = {
  text: VariantsStackedAreaTileText;
  values?: VariantChartValue[] | null;
  metadata: MetadataProps;
  children?: ReactNode;
  noDataMessage?: ReactNode;
};

export function VariantsStackedAreaTile({
  values,
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
  children?: ReactNode;
};

function VariantStackedAreaTileWithData({
  text,
  values,
  metadata,
  children = null,
}: VariantStackedAreaTileWithDataProps) {
  const { list, toggle, clear } =
    useList<keyof VariantChartValue>(alwaysEnabled);

  const [seriesConfig, otherConfig, selectOptions] = useSeriesConfig(
    text,
    values
  );

  const filteredConfig = useFilteredSeriesConfig(
    seriesConfig,
    otherConfig,
    list
  );

  /* Static legend contains only the inaccurate item */
  const staticLegendItems: LegendItem[] = [
    {
      shape: 'outlined-square',
      color: colors.white,
      label: text.legend_niet_compleet_label,
    },
  ];

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
      timeframeOptions={['all', '5weeks']}
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

              return <TooltipSeriesList data={reorderContext} />;
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
  seriesConfig: GappedStackedAreaSeriesDefinition<VariantChartValue>[],
  otherConfig: GappedStackedAreaSeriesDefinition<VariantChartValue>,
  compareList: (keyof VariantChartValue)[]
) {
  return useMemo(() => {
    return [otherConfig, ...seriesConfig].filter(
      (item) =>
        compareList.includes(item.metricProperty) ||
        compareList.length === alwaysEnabled.length
    );
  }, [seriesConfig, otherConfig, compareList]);
}

function useSeriesConfig(
  text: VariantsStackedAreaTileText,
  values: VariantChartValue[]
) {
  const { siteText } = useIntl();

  return useMemo(() => {
    const baseVariantsFiltered = values
      .flatMap((x) => Object.keys(x))
      .filter((x, index, array) => array.indexOf(x) === index) // de-dupe
      .filter(
        (x) => x.endsWith('_percentage') && x !== 'other_graph_percentage'
      )
      .reverse(); // Reverse to be in an alphabetical order

    /* Enrich config with dynamic data / locale */
    const seriesConfig: GappedStackedAreaSeriesDefinition<VariantChartValue>[] =
      baseVariantsFiltered.map((variantKey) => {
        const color = (colors.data.variants as Dictionary<string>)[
          variantKey.split('_')[0]
        ];

        assert(
          color,
          `[${useSeriesConfig.name}] No color found found for variant: ${variantKey}`
        );

        const variantName = variantKey.split(
          '_'
        )[0] as keyof typeof siteText.pages.variantsPage.nl.varianten;

        return {
          type: 'gapped-stacked-area',
          metricProperty: variantKey as keyof VariantChartValue,
          color,
          label: siteText.pages.variantsPage.nl.varianten[variantName],
          shape: 'square',
          strokeWidth: 0,
          fillOpacity: 1,
          mixBlendMode: 'multiply',
        };
      });

    const otherConfig = {
      type: 'gapped-stacked-area',
      metricProperty: 'other_graph_percentage',
      label: text.tooltip_labels.other_percentage,
      fillOpacity: 1,
      shape: 'square',
      color: colors.lightGray,
      strokeWidth: 0,
      mixBlendMode: 'multiply',
    } as GappedStackedAreaSeriesDefinition<VariantChartValue>;

    const selectOptions = [...seriesConfig, otherConfig];

    return [seriesConfig, otherConfig, selectOptions] as const;
  }, [values, text, siteText]);
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
