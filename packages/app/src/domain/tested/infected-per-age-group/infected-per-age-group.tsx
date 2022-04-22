import {
  NlTestedPerAgeGroupValue,
  TimeframeOption,
} from '@corona-dashboard/common';
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
import { SiteText } from '~/locale';
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
  timeframe: TimeframeOption;
  timelineEvents?: TimelineEventConfig[];
  text: SiteText['pages']['positiveTestsPage']['shared'];
}

export function InfectedPerAgeGroup({
  values,
  timeframe,
  accessibility,
  timelineEvents,
  text,
}: InfectedPerAgeGroup) {
  const { commonTexts } = useIntl();
  const { list, toggle, clear } = useList<string>();
  const breakpoints = useBreakpoints(true);

  const underReportedDateStart = getBoundaryDateStartUnix(values, 7);
  const alwaysEnabled = ['infected_overall_per_100k'];

  /* Enrich config with dynamic data / locale */
  const seriesConfig: LineSeriesDefinition<NlTestedPerAgeGroupValue>[] =
    BASE_SERIES_CONFIG.map((baseAgeGroup) => {
      const label =
        baseAgeGroup.metricProperty in text.infected_per_age_group.legend
          ? text.infected_per_age_group.legend[baseAgeGroup.metricProperty]
          : baseAgeGroup.metricProperty;

      const ariaLabel = replaceVariablesInText(
        commonTexts.aria_labels.age_old,
        {
          age: label,
        }
      );

      return {
        ...baseAgeGroup,
        type: 'line',
        shape: 'line',
        label,
        ariaLabel,
        legendAriaLabel: ariaLabel,
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
        helpText={text.infected_per_age_group.legend_help_text}
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
          valueAnnotation: text.infected_per_age_group.value_annotation,
          timespanAnnotations: [
            {
              start: underReportedDateStart,
              end: Infinity,
              label:
                text.infected_per_age_group.line_chart_legend_inaccurate_label,
              shortLabel: text.infected_per_age_group.tooltip_labels.inaccurate,
            },
          ],
          timelineEvents,
        }}
      />
    </ErrorBoundary>
  );
}
