import { NlTestedPerAgeGroupValue } from '@corona-dashboard/common';
import { ErrorBoundary } from '~/components/error-boundary';
import {
  InteractiveLegend,
  SelectOption,
} from '~/components/interactive-legend';
import { Legend, LegendItem } from '~/components/legend';
import { Spacer } from '~/components/base';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { SeriesIcon } from '~/components/time-series-chart/components/series-icon';
import { TooltipSeriesList } from '~/components/time-series-chart/components/tooltip/tooltip-series-list';
import { LineSeriesDefinition } from '~/components/time-series-chart/logic';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { getBoundaryDateStartUnix } from '~/utils/get-trailing-date-range';
import { AccessibilityDefinition } from '~/utils/use-accessibility-annotations';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useList } from '~/utils/use-list';
import { BASE_SERIES_CONFIG } from './series-config';

interface InfectedPerAgeGroup {
  /**
   * The mandatory AccessibilityDefinition provides a reference to annotate the
   * graph with a label and description.
   */
  accessibility: AccessibilityDefinition;
  values: NlTestedPerAgeGroupValue[];
  timeframe: 'all' | '5weeks';
}

export function InfectedPerAgeGroup({
  values,
  timeframe,
  accessibility,
}: InfectedPerAgeGroup) {
  const { siteText } = useIntl();
  const { list, toggle, clear } = useList<string>();
  const breakpoints = useBreakpoints(true);

  const text = siteText.infected_per_age_group;

  const underReportedDateStart = getBoundaryDateStartUnix(values, 7);
  const alwayEnabled = ['infected_overall_per_100k'];

  /* Enrich config with dynamic data / locale */
  const seriesConfig: LineSeriesDefinition<NlTestedPerAgeGroupValue>[] =
    BASE_SERIES_CONFIG.map((baseAgeGroup) => {
      return {
        ...baseAgeGroup,
        type: 'line',
        shape: 'line',
        label:
          baseAgeGroup.metricProperty in text.legend
            ? text.legend[baseAgeGroup.metricProperty]
            : baseAgeGroup.metricProperty,
      };
    });

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

  const interactiveLegendOptions: SelectOption[] = seriesConfig.filter(
    (item) => !alwayEnabled.includes(item.metricProperty)
  );

  /* Static legend contains always enabled items and the under reported item */
  const staticLegendItems = seriesConfig
    .filter((item) => alwayEnabled.includes(item.metricProperty))
    .map<LegendItem>((item) => ({
      label: item.label,
      shape: 'custom' as const,
      shapeComponent: <SeriesIcon config={item} />,
    }))
    .concat([
      {
        shape: 'square' as const,
        color: colors.data.underReported,
        label: text.line_chart_legend_inaccurate_label,
      },
    ]);

  /* Conditionally let tooltip span over multiple columns */
  const hasTwoColumns = list.length === 0 || list.length > 4;

  return (
    <ErrorBoundary>
      <InteractiveLegend
        helpText={text.legend_help_text}
        selectOptions={interactiveLegendOptions}
        selection={list}
        onToggleItem={toggle}
        onReset={clear}
      />
      <Spacer mb={2} />
      <TimeSeriesChart
        accessibility={accessibility}
        values={values}
        timeframe={timeframe}
        seriesConfig={chartConfig}
        minHeight={breakpoints.md ? 300 : 250}
        disableLegend
        formatTooltip={(data) => (
          <TooltipSeriesList data={data} hasTwoColumns={hasTwoColumns} />
        )}
        dataOptions={{
          valueAnnotation: text.value_annotation,
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
      <Legend items={staticLegendItems} />
    </ErrorBoundary>
  );
}
