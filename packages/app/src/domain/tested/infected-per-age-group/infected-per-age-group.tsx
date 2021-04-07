import { NlTestedPerAgeGroupValue } from '@corona-dashboard/common';
import { Legend, LegendItem } from '~/components-styled/legend';
import { TimeSeriesChart } from '~/components-styled/time-series-chart';
import { TooltipSeriesList } from '~/components-styled/time-series-chart/components/tooltip/tooltip-series-list';
import { LineSeriesDefinition } from '~/components-styled/time-series-chart/logic';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { getBoundaryDateStartUnix } from '~/utils/get-trailing-date-range';
import { useList } from '~/utils/use-list';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { AgeGroupLegend } from './components/age-group-legend';
import { BASE_SERIES_CONFIG } from './series-config';

interface InfectedPerAgeGroup {
  values: NlTestedPerAgeGroupValue[];
  timeframe: 'all' | '5weeks' | 'week';
}

export function InfectedPerAgeGroup({
  values,
  timeframe,
}: InfectedPerAgeGroup) {
  const { siteText } = useIntl();
  const { list, toggle, clear } = useList<string>();
  const breakpoints = useBreakpoints(true);

  const text = siteText.infected_per_age_group;

  const underReportedDateStart = getBoundaryDateStartUnix(values, 7);
  const alwayEnabled = ['infected_overall_per_100k'];

  /* Enrich config with dynamic data / locale */
  const seriesConfig: LineSeriesDefinition<NlTestedPerAgeGroupValue>[] = BASE_SERIES_CONFIG.map(
    (baseAgeGroup) => {
      return {
        ...baseAgeGroup,
        type: 'line',
        label:
          baseAgeGroup.metricProperty in text.legend
            ? text.legend[baseAgeGroup.metricProperty]
            : baseAgeGroup.metricProperty,
      };
    }
  );

  const underReportedLegendItem: LegendItem = {
    shape: 'square',
    color: colors.data.underReported,
    label: text.line_chart_legend_inaccurate_label,
  };

  /* Filter for each config group */

  /**
   * Chart:
   * - when nothing selected: all items
   * - otherwise: selected items + always enabled items
   */
  const compareList = list.concat(...alwayEnabled);
  const chartConfig = seriesConfig.filter(
    (item) =>
      compareList.includes(item.metricProperty) ||
      compareList.length === alwayEnabled.length
  );

  const dynamicLegendConfig = seriesConfig.filter(
    (item) => !alwayEnabled.includes(item.metricProperty)
  );

  /* Static legend contains always enabled items and the under reported item */
  const staticLegendItems: LegendItem[] = seriesConfig
    .filter((item) => alwayEnabled.includes(item.metricProperty))
    .map(
      (item): LegendItem => ({
        label: item.label,
        shape: item.type,
        color: item.color,
        style: item.style,
      })
    )
    .concat([underReportedLegendItem]);

  /* Conditionally let tooltip span over multiple columns */
  const hasMultipleColumns = list.length === 0 || list.length > 4;

  return (
    <>
      <TimeSeriesChart
        values={values}
        timeframe={timeframe}
        seriesConfig={chartConfig}
        height={breakpoints.md ? 300 : 250}
        disableLegend
        formatTooltip={(data) => (
          <TooltipSeriesList
            data={data}
            hasMultipleColumns={hasMultipleColumns}
          />
        )}
        dataOptions={{
          timespanAnnotations: [
            {
              start: underReportedDateStart,
              end: Infinity,
              label: text.line_chart_legend_inaccurate_label,
              shortLabel: text.tooltip_labels.inaccurate,
            },
          ],
        }}
      />
      <AgeGroupLegend
        seriesConfig={dynamicLegendConfig}
        ageGroupSelection={list}
        onToggleAgeGroup={toggle}
        onReset={clear}
      />
      <Legend items={staticLegendItems} />
    </>
  );
}
