import { colors, TimeframeOption } from '@corona-dashboard/common';
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
import { BoldText } from '~/components/typography';
import { VariantChartValue } from '~/domain/variants/static-props';
import { SiteText } from '~/locale';
import { getBoundaryDateStartUnix } from '~/utils/get-boundary-date-start-unix';
import { useList } from '~/utils/use-list';

interface VariantsOverTimeProps {
  values: VariantChartValue[];
  seriesConfig: LineSeriesDefinition<VariantChartValue>[];
  timeframe: TimeframeOption;
  text: SiteText['pages']['variantsPage']['nl']['varianten_over_tijd'];
}

export function VariantsOverTime({
  values,
  seriesConfig,
  timeframe,
  text,
}: VariantsOverTimeProps) {
  const { list, toggle, clear } = useList<string>();

  const underReportedDateStart = getBoundaryDateStartUnix(values, 1);

  const underReportedLegendItem: LegendItem = {
    shape: 'square',
    color: colors.data.underReported,
    label: text.legend_niet_compleet_label,
  };

  const alwaysEnabled: keyof VariantChartValue | [] = useMemo(() => [], []);

  /* Filter for each config group */

  /**
   * Chart:
   * - when nothing selected: all items
   * - otherwise: selected items
   */
  const compareList = list.concat(alwaysEnabled);
  const chartConfig = useMemo(
    () =>
      [
        ...seriesConfig.filter(
          (item) =>
            compareList.includes(item.metricProperty) ||
            compareList.length === alwaysEnabled.length
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
      alwaysEnabled,
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
      <BoldText variant="label2" color="data.axisLabels">
        {text.percentage_gevonden_varianten}
      </BoldText>
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
