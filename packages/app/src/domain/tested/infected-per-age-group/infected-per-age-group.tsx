import { NlTestedPerAgeGroupValue } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { Legend, LegendItem } from '~/components-styled/legend';
import { TimeSeriesChart } from '~/components-styled/time-series-chart';
import { TooltipSeriesList } from '~/components-styled/time-series-chart/components/tooltip/tooltip-series-list';
import { LineSeriesDefinition } from '~/components-styled/time-series-chart/logic';
import { useIntl } from '~/intl';
import { getBoundaryDateStartUnix } from '~/utils/get-trailing-date-range';
import { useList } from '~/utils/use-list';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { AgeGroupLegend } from './components/age-group-legend';
import { BASE_SERIES_CONFIG, UNDER_REPORTED_CONFIG } from './series-config';

interface InfectedPerAgeGroup {
  values: NlTestedPerAgeGroupValue[];
  timeframe: 'all' | '5weeks' | 'week';
}

export function InfectedPerAgeGroup({
  values,
  timeframe,
}: InfectedPerAgeGroup) {
  const { list, toggle, clear } = useList<string>();

  const breakpoints = useBreakpoints(true);

  const { siteText } = useIntl();
  const text = siteText.infected_per_age_group;

  const underReportedDateStart = getBoundaryDateStartUnix(values, 7);

  /* @TODO Always enabled is temporary logic pending on new UX */
  const alwayEnabled = useMemo(() => {
    return ['infected_overall_per_100k'];
  }, []);

  /* Enrich config with dynamic data / locale */
  const seriesConfig: LineSeriesDefinition<NlTestedPerAgeGroupValue>[] = useMemo(() => {
    return BASE_SERIES_CONFIG.map((baseAgeGroup) => {
      return {
        ...baseAgeGroup,
        type: 'line',
        label:
          baseAgeGroup.metricProperty in text.legend
            ? text.legend[baseAgeGroup.metricProperty]
            : baseAgeGroup.metricProperty,
      };
    });
  }, [text.legend]);

  const underReported = useMemo(
    () => ({
      ...UNDER_REPORTED_CONFIG,
      label: text.line_chart_legend_inaccurate_label,
    }),
    [text.line_chart_legend_inaccurate_label]
  );

  /* Filter for each config group */

  /**
   * Chart:
   * - when nothing selected: all items
   * - otherwise: selected items + always enabled items
   */
  const chartConfig = useMemo(() => {
    const compareList = list.concat(...alwayEnabled);
    return seriesConfig.filter(
      (item) =>
        compareList.includes(item.metricProperty) ||
        compareList.length === alwayEnabled.length
    );
  }, [seriesConfig, list, alwayEnabled]);

  const dynamicLegendConfig = useMemo(() => {
    return seriesConfig.filter(
      (item) => !alwayEnabled.includes(item.metricProperty)
    );
  }, [seriesConfig, alwayEnabled]);

  /* Static legend contains always enabled items and the under reported item */
  const staticLegendItems: LegendItem[] = useMemo(() => {
    return seriesConfig
      .filter((item) => alwayEnabled.includes(item.metricProperty))
      .map(
        (item): LegendItem => ({
          label: item.label,
          shape: item.type,
          color: item.color,
          style: item.style,
        })
      )
      .concat([underReported]);
  }, [seriesConfig, alwayEnabled, underReported]);

  /* Conditionally wrap tooltip over two columns due to amount of items */
  const tooltipColumns: 1 | 2 = useMemo(
    () => (list.length === 0 || list.length > 4 ? 2 : 1),
    [list.length]
  );

  return (
    <>
      <TimeSeriesChart
        values={values}
        timeframe={timeframe}
        seriesConfig={chartConfig}
        height={breakpoints.md ? 300 : 250}
        disableLegend
        formatTooltip={(data) => (
          <TooltipSeriesList data={data} columns={tooltipColumns} />
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
