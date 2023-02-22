import { DAY_IN_SECONDS, NlHospitalNicePerAgeGroupValue, NlIntensiveCareNicePerAgeGroupValue, TimeframeOption } from '@corona-dashboard/common';
import { Spacer } from '~/components/base';
import { ErrorBoundary } from '~/components/error-boundary';
import { InteractiveLegend, SelectOption } from '~/components/interactive-legend';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TimelineEventConfig } from '~/components/time-series-chart/components/timeline';
import { TooltipSeriesList } from '~/components/time-series-chart/components/tooltip/tooltip-series-list';
import { LineSeriesDefinition } from '~/components/time-series-chart/logic';
import { useIntl } from '~/intl';
import { space } from '~/style/theme';
import { getBoundaryDateStartUnix } from '~/utils/get-boundary-date-start-unix';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { AccessibilityDefinition } from '~/utils/use-accessibility-annotations';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useList } from '~/utils/use-list';
import { BASE_SERIES_CONFIG } from './series-config';

type NLHospitalAdmissionPerAgeGroupValue = NlIntensiveCareNicePerAgeGroupValue | NlHospitalNicePerAgeGroupValue;

interface AdmissionsPerAgeGroup {
  values: NLHospitalAdmissionPerAgeGroupValue[];
  timeframe: TimeframeOption;
  /**
   * The mandatory AccessibilityDefinition provides a reference to annotate the
   * graph with a label and description.
   */
  accessibility: AccessibilityDefinition;
  timelineEvents?: TimelineEventConfig[];
}

export function AdmissionsPerAgeGroup({ values, timeframe, accessibility, timelineEvents }: AdmissionsPerAgeGroup) {
  const { commonTexts } = useIntl();
  const { list, toggle, clear } = useList<string>();
  const breakpoints = useBreakpoints(true);

  const text = commonTexts.admissions_per_age_group_chart;

  const underReportedDateStart = getBoundaryDateStartUnix(values, 1);

  /* Enrich config with dynamic data / locale */
  const seriesConfig: LineSeriesDefinition<NLHospitalAdmissionPerAgeGroupValue>[] = BASE_SERIES_CONFIG.map((baseAgeGroup) => {
    const label = baseAgeGroup.metricProperty in text.legend ? text.legend[baseAgeGroup.metricProperty] : baseAgeGroup.metricProperty;

    const ariaLabel = replaceVariablesInText(commonTexts.aria_labels.age_old, {
      age: label,
    });

    return {
      ...baseAgeGroup,
      hideInLegend: true,
      type: 'line',
      shape: 'style' in baseAgeGroup ? baseAgeGroup.style : 'line',
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
  const chartConfig = seriesConfig.filter((item) => list.includes(item.metricProperty) || list.length === 0);

  const interactiveLegendOptions: SelectOption[] = seriesConfig;

  /* Conditionally let tooltip span over multiple columns */
  const hasTwoColumns = list.length === 0 || list.length > 4;

  return (
    <ErrorBoundary>
      <InteractiveLegend helpText={text.legend_help_text} selectOptions={interactiveLegendOptions} selection={list} onToggleItem={toggle} onReset={clear} />
      <Spacer marginBottom={space[2]} />
      <TimeSeriesChart
        forceLegend
        accessibility={accessibility}
        values={values}
        timeframe={timeframe}
        seriesConfig={chartConfig}
        minHeight={breakpoints.md ? 300 : 250}
        formatTooltip={(data) => <TooltipSeriesList data={data} hasTwoColumns={hasTwoColumns} />}
        dataOptions={{
          timespanAnnotations: [
            {
              start: underReportedDateStart + DAY_IN_SECONDS / 2,
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
