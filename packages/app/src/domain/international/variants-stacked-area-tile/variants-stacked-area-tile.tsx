import { Dictionary } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { ReactNode, useMemo } from 'react';
import styled from 'styled-components';
import { isDefined, isPresent } from 'ts-is-present';
import { ChartTile } from '~/components/chart-tile';
import { InteractiveLegend } from '~/components/interactive-legend';
import { Legend, LegendItem } from '~/components/legend';
import { MetadataProps } from '~/components/metadata';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TooltipSeriesList } from '~/components/time-series-chart/components/tooltip/tooltip-series-list';
import { GappedStackedAreaSeriesDefinition } from '~/components/time-series-chart/logic';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';
import { VariantChartValue } from '~/static-props/variants/get-variant-chart-data';
import { colors } from '~/style/theme';
import { assert } from '~/utils/assert';
import { useList } from '~/utils/use-list';

type VariantsStackedAreaTileProps = {
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
}: VariantsStackedAreaTileProps) {
  const { siteText } = useIntl();
  const text = siteText.internationaal_varianten.varianten_over_tijd_grafiek;

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
    <VariantStackedAreaTileWithData values={values} metadata={metadata}>
      {children}
    </VariantStackedAreaTileWithData>
  );
}

const alwayEnabled: string[] = [];

type VariantStackedAreaTileWithDataProps = {
  values: VariantChartValue[];
  metadata: MetadataProps;
  children?: ReactNode;
};

function VariantStackedAreaTileWithData({
  values,
  metadata,
  children = null,
}: VariantStackedAreaTileWithDataProps) {
  const { siteText } = useIntl();
  const { list, toggle, clear } = useList<string>(alwayEnabled);

  const text = siteText.internationaal_varianten.varianten_over_tijd_grafiek;
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
      shape: 'square',
      color: colors.data.underReported,
      label: text.legend_niet_compleet_label,
    },
  ];

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
          <InteractiveLegend
            helpText={text.legend_help_tekst}
            selectOptions={selectOptions}
            selection={list}
            onToggleItem={toggle}
            onReset={clear}
          />
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
                      x.metricProperty !== 'other_percentage'
                  ),
                  context.config.find(
                    (x) =>
                      hasMetricProperty(x) &&
                      x.metricProperty === 'other_percentage'
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
        compareList.length === alwayEnabled.length
    );
  }, [seriesConfig, otherConfig, compareList]);
}

function useSeriesConfig(
  text: SiteText['internationaal_varianten']['varianten_over_tijd_grafiek'],
  values: VariantChartValue[]
) {
  return useMemo(() => {
    const baseVariantsFiltered = Object.keys(values[0]).filter(
      (x) => x.endsWith('_percentage') && x !== 'other_percentage'
    );

    /* Enrich config with dynamic data / locale */
    const seriesConfig: GappedStackedAreaSeriesDefinition<VariantChartValue>[] =
      baseVariantsFiltered.map((variantKey) => {
        const color = (colors.data.variants as Dictionary<string>)[
          variantKey.split('_')[0]
        ];

        assert(color, `No color found found for variant: ${variantKey}`);

        return {
          type: 'gapped-stacked-area',
          metricProperty: variantKey as keyof VariantChartValue,
          color,
          label: variantKey,
          shape: 'square',
          fillOpacity: 1,
        };
      });

    const otherConfig = {
      type: 'gapped-stacked-area',
      metricProperty: 'other_percentage',
      label: text.tooltip_labels.other_percentage,
      fillOpacity: 1,
      shape: 'square',
      color: colors.lightGray,
    } as GappedStackedAreaSeriesDefinition<VariantChartValue>;

    const selectOptions = [...seriesConfig, otherConfig];

    return [seriesConfig, otherConfig, selectOptions] as const;
  }, [values, text]);
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
