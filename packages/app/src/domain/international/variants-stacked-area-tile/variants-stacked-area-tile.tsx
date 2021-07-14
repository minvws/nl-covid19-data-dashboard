import { Dictionary } from '@corona-dashboard/common';
import { ReactNode } from 'react';
import { isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { ErrorBoundary } from '~/components/error-boundary';
import { FullscreenChartTile } from '~/components/fullscreen-chart-tile';
import { InteractiveLegend } from '~/components/interactive-legend';
import { Legend, LegendItem } from '~/components/legend';
import { Markdown } from '~/components/markdown';
import { MetadataProps } from '~/components/metadata';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TooltipSeriesList } from '~/components/time-series-chart/components/tooltip/tooltip-series-list';
import { GappedStackedAreaSeriesDefinition } from '~/components/time-series-chart/logic';
import { Heading } from '~/components/typography';
import { useIntl } from '~/intl';
import { VariantChartValue } from '~/static-props/variants/get-variant-chart-data';
import { colors } from '~/style/theme';
import { assert } from '~/utils/assert';
import { useList } from '~/utils/use-list';

interface VariantsStackedAreaTile {
  values?: VariantChartValue[] | null;
  metadata: MetadataProps;
  children?: ReactNode;
}

export function VariantsStackedAreaTile({
  values,
  metadata,
  children = null,
}: VariantsStackedAreaTile) {
  const { siteText } = useIntl();
  const { list, toggle, clear } = useList<string>();

  if (!isPresent(values)) {
    return null;
  }

  const text = siteText.internationaal_varianten.varianten_over_tijd_grafiek;

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

  /* Filter for each config group */

  /**
   * Chart:
   * - when nothing selected: all items
   * - otherwise: selected items
   */
  const alwayEnabled: keyof VariantChartValue | [] = [];
  const compareList = list.concat(alwayEnabled);

  const chartConfig = [otherConfig, ...seriesConfig].filter(
    (item) =>
      compareList.includes(item.metricProperty) ||
      compareList.length === alwayEnabled.length
  );

  const underReportedLegendItem: LegendItem = {
    shape: 'square',
    color: colors.data.underReported,
    label: text.legend_niet_compleet_label,
  };

  /* Static legend contains only the inaccurate item */
  const staticLegendItems: LegendItem[] = [underReportedLegendItem];

  return (
    <FullscreenChartTile metadata={metadata}>
      <Heading level={3}>{text.titel}</Heading>
      <Box maxWidth="maxWidthText">
        <Markdown content={text.toelichting} />
      </Box>
      {children}
      <InteractiveLegend
        helpText={text.legend_help_tekst}
        selectOptions={[...seriesConfig, otherConfig]}
        selection={list}
        onToggleItem={toggle}
        onReset={clear}
      />
      <ErrorBoundary>
        <TimeSeriesChart
          accessibility={{
            key: 'variants_stacked_area_over_time_chart',
          }}
          values={values}
          timeframe={'all'}
          seriesConfig={chartConfig}
          disableLegend
          dataOptions={{
            isPercentage: true,
            forcedMaximumValue: 100,
          }}
          formatTooltip={(context) => {
            /**
             * With the current context the other_percentage is the first in to be displayed.
             * we put the other_percentage as last item in the array to display it correctly in the tooltip.
             */
            const reorderContext = {
              ...context,
              config: [...context.config, context.config[0]].slice(1),
            };

            return <TooltipSeriesList data={reorderContext} />;
          }}
          numGridLines={0}
          tickValues={[0, 25, 50, 75, 100]}
        />
      </ErrorBoundary>
      <Legend items={staticLegendItems} />
    </FullscreenChartTile>
  );
}
