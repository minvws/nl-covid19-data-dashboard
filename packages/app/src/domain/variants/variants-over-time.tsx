import { TimeframeOption } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { Spacer } from '~/components/base';
import { InteractiveLegend } from '~/components/interactive-legend';
import { Legend, LegendItem } from '~/components/legend';
import { TimeSeriesChart } from '~/components/time-series-chart';
import {
  calculateSeriesMaximum,
  LineSeriesDefinition,
  SeriesConfig,
  useSeriesList,
} from '~/components/time-series-chart/logic';
import { InlineText } from '~/components/typography';
import { VariantChartValue } from '~/domain/variants/static-props';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { getBoundaryDateStartUnix } from '~/utils/get-trailing-date-range';
import { useList } from '~/utils/use-list';

interface VariantsOverTimeProps {
  values: VariantChartValue[];
  seriesConfig: LineSeriesDefinition<VariantChartValue>[];
  timeframe: TimeframeOption;
}

export function VariantsOverTime({
  values,
  seriesConfig,
  timeframe,
}: VariantsOverTimeProps) {
  const { siteText } = useIntl();
  const text = siteText.covid_varianten.varianten_over_tijd;

  const { list, toggle, clear } = useList<string>();

  const underReportedDateStart = getBoundaryDateStartUnix(values, 1);

  const underReportedLegendItem: LegendItem = {
    shape: 'square',
    color: colors.data.underReported,
    label: text.legend_niet_compleet_label,
  };

  const alwayEnabled: keyof VariantChartValue | [] = useMemo(() => [], []);

  /* Filter for each config group */

  /**
   * Chart:
   * - when nothing selected: all items
   * - otherwise: selected items
   */
  const compareList = list.concat(alwayEnabled);
  const chartConfig = useMemo(
    () =>
      [
        ...seriesConfig.filter(
          (item) =>
            compareList.includes(item.metricProperty) ||
            compareList.length === alwayEnabled.length
        ),
        {
          type: 'invisible',
          metricProperty: 'sample_size',
          label: text.tooltip_labels.totaal_monsters,
          isPercentage: false,
        },
      ] as SeriesConfig<VariantChartValue>,
    [
      seriesConfig,
      alwayEnabled,
      compareList,
      text.tooltip_labels.totaal_monsters,
    ]
  );

  /* Static legend contains only the inaccurate item */
  const staticLegendItems: LegendItem[] = [underReportedLegendItem];

  const seriesList = useSeriesList(values, chartConfig);
  const maximum = calculateSeriesMaximum(seriesList, chartConfig);
  const forcedMaximumValue =
    maximum <= 10 ? 10 : maximum >= 80 ? 100 : undefined;

  if (!values.length) {
    return null;
  }

  return (
    <>
      <InteractiveLegend
        helpText={text.legend_help_tekst}
        selectOptions={seriesConfig}
        selection={list}
        onToggleItem={toggle}
        onReset={clear}
      />
      <Spacer mb={2} />
      <InlineText variant="label2" fontWeight="bold" color="data.axisLabels">
        {text.percentage_gevonden_varianten}
      </InlineText>
      <TimeSeriesChart
        accessibility={{ key: 'variants_over_time_chart' }}
        values={values}
        timeframe={timeframe}
        seriesConfig={chartConfig}
        disableLegend
        dataOptions={{
          isPercentage: true,
          forcedMaximumValue,
          timespanAnnotations: [
            {
              start: underReportedDateStart,
              end: Infinity,
              label: text.legend_niet_compleet_label,
              shortLabel: text.tooltip_labels.niet_compleet,
            },
          ],
        }}
      />
      <Legend items={staticLegendItems} />
    </>
  );
}
