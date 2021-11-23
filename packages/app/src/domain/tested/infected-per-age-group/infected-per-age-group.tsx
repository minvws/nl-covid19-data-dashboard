import { NlTestedPerAgeGroupValue } from '@corona-dashboard/common';
import { Spacer } from '~/components/base';
import { ErrorBoundary } from '~/components/error-boundary';
import {
  InteractiveLegend,
  SelectOption,
} from '~/components/interactive-legend';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TimelineEventConfig } from '~/components/time-series-chart/components/timeline';
import { TooltipSeriesList } from '~/components/time-series-chart/components/tooltip/tooltip-series-list';
import { LineSeriesDefinition } from '~/components/time-series-chart/logic';
import { useIntl } from '~/intl';
import { getBoundaryDateStartUnix } from '~/utils/get-boundary-date-start-unix';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
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
  timelineEvents?: TimelineEventConfig[];
}

export function InfectedPerAgeGroup({
  values,
  timeframe,
  accessibility,
  timelineEvents,
}: InfectedPerAgeGroup) {
  const { siteText } = useIntl();
  const { list, toggle, clear } = useList<string>();
  const breakpoints = useBreakpoints(true);

  const text = siteText.infected_per_age_group;

  const underReportedDateStart = getBoundaryDateStartUnix(values, 7);
  const alwaysEnabled = ['infected_overall_per_100k'];

  /* Enrich config with dynamic data / locale */
  const seriesConfig: LineSeriesDefinition<NlTestedPerAgeGroupValue>[] =
    BASE_SERIES_CONFIG.map((baseAgeGroup) => {
      const label =
        baseAgeGroup.metricProperty in text.legend
          ? text.legend[baseAgeGroup.metricProperty]
          : baseAgeGroup.metricProperty;

      return {
        ...baseAgeGroup,
        type: 'line',
        shape: 'line',
        label,
        legendAriaLabel: replaceVariablesInText(siteText.aria_labels.age_old, {
          age: label,
        }),
      };
    });

  /**
   * Chart:
   * - when nothing selected: all items
   * - otherwise: selected items + always enabled items
   */
  const compareList = list.concat(...alwaysEnabled);
  const chartConfig = seriesConfig.filter(
    (item) =>
      compareList.includes(item.metricProperty) ||
      compareList.length === alwaysEnabled.length
  );

  const interactiveLegendOptions: SelectOption[] = seriesConfig.filter(
    (item) => !alwaysEnabled.includes(item.metricProperty)
  );

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
          timelineEvents,
        }}
      />
    </ErrorBoundary>
  );
}
