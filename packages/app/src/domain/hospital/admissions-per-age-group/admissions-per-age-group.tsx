import {
  NlHospitalNicePerAgeGroupValue,
  NlIntensiveCareNicePerAgeGroupValue,
} from '@corona-dashboard/common';
import { ErrorBoundary } from '~/components/error-boundary';
import {
  InteractiveLegend,
  SelectOption,
} from '~/components/interactive-legend';
import { Legend, LegendItem } from '~/components/legend';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TooltipSeriesList } from '~/components/time-series-chart/components/tooltip/tooltip-series-list';
import { LineSeriesDefinition } from '~/components/time-series-chart/logic';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { getBoundaryDateStartUnix } from '~/utils/get-trailing-date-range';
import { AccessibilityDefinition } from '~/utils/use-accessibility-annotations';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useList } from '~/utils/use-list';
import { BASE_SERIES_CONFIG } from './series-config';
import { Spacer } from '~/components/base';

type NLHospitalAdmissionPerAgeGroupValue =
  | NlIntensiveCareNicePerAgeGroupValue
  | NlHospitalNicePerAgeGroupValue;

interface AdmissionsPerAgeGroup {
  values: NLHospitalAdmissionPerAgeGroupValue[];
  timeframe: 'all' | '5weeks';
  /**
   * The mandatory AccessibilityDefinition provides a reference to annotate the
   * graph with a label and description.
   */
  accessibility: AccessibilityDefinition;
}

export function AdmissionsPerAgeGroup({
  values,
  timeframe,
  accessibility,
}: AdmissionsPerAgeGroup) {
  const { siteText } = useIntl();
  const { list, toggle, clear } = useList<string>();
  const breakpoints = useBreakpoints(true);

  const text = siteText.admissions_per_age_group_chart;

  const underReportedDateStart = getBoundaryDateStartUnix(values, 1);
  const alwayEnabled = ['admissions_overall_per_million'];

  /* Enrich config with dynamic data / locale */
  const seriesConfig: LineSeriesDefinition<NLHospitalAdmissionPerAgeGroupValue>[] =
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

  const underReportedLegendItem: LegendItem = {
    shape: 'square',
    color: colors.data.underReported,
    label: text.line_chart_legend_inaccurate_label,
  };

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
