import {
  NlIntensiveCareNicePerAgeGroupValue,
  NlHospitalNicePerAgeGroupValue,
} from '@corona-dashboard/common';
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
import { useList } from '~/utils/use-list';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { BASE_SERIES_CONFIG } from './series-config';

type NLHospitalAdmissionPerAgeGroupValue =
  | NlIntensiveCareNicePerAgeGroupValue
  | NlHospitalNicePerAgeGroupValue;

interface AdmissionsPerAgeGroup {
  // TODO: Remove undefined when data is available
  values: NLHospitalAdmissionPerAgeGroupValue[] | undefined;
  timeframe: 'all' | '5weeks' | 'week';
}

function generateDummyData() {
  const data = [];
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const adjustSemiRandomly = (x: number = Math.random() * 10) => {
    const directionalFactor = Math.sin(x / Math.random()) * 2;
    const newVal = x + Math.random() * directionalFactor;
    return newVal < 0 ? newVal * -1 : newVal;
  };
  let dataPoint;

  for (let i = 0; i < 5 * 7; ++i) {
    dataPoint = {
      admissions_age_0_19_per_million: adjustSemiRandomly(
        dataPoint ? dataPoint.admissions_age_0_19_per_million : undefined
      ),
      admissions_age_20_29_per_million: adjustSemiRandomly(
        dataPoint ? dataPoint.admissions_age_20_29_per_million : undefined
      ),
      admissions_age_30_39_per_million: adjustSemiRandomly(
        dataPoint ? dataPoint.admissions_age_30_39_per_million : undefined
      ),
      admissions_age_40_49_per_million: adjustSemiRandomly(
        dataPoint ? dataPoint.admissions_age_40_49_per_million : undefined
      ),
      admissions_age_50_59_per_million: adjustSemiRandomly(
        dataPoint ? dataPoint.admissions_age_50_59_per_million : undefined
      ),
      admissions_age_60_69_per_million: adjustSemiRandomly(
        dataPoint ? dataPoint.admissions_age_60_69_per_million : undefined
      ),
      admissions_age_70_79_per_million: adjustSemiRandomly(
        dataPoint ? dataPoint.admissions_age_70_79_per_million : undefined
      ),
      admissions_age_80_89_per_million: adjustSemiRandomly(
        dataPoint ? dataPoint.admissions_age_80_89_per_million : undefined
      ),
      admissions_age_90_plus_per_million: adjustSemiRandomly(
        dataPoint ? dataPoint.admissions_age_90_plus_per_million : undefined
      ),
      admissions_overall_per_million: adjustSemiRandomly(
        dataPoint ? dataPoint.admissions_overall_per_million : undefined
      ),
      date_of_insertion_unix: 0,
      date_unix: currentDate.getTime() / 1000,
    };
    data.push(dataPoint);

    currentDate.setDate(currentDate.getDate() - 1);
  }

  return data.reverse();
}

export function AdmissionsPerAgeGroup({
  values = generateDummyData() as NLHospitalAdmissionPerAgeGroupValue[],
  timeframe,
}: AdmissionsPerAgeGroup) {
  const { siteText } = useIntl();
  const { list, toggle, clear } = useList<string>();
  const breakpoints = useBreakpoints(true);

  const text = siteText.hospital_admissions_per_age_group;

  const underReportedDateStart = getBoundaryDateStartUnix(values, 7);
  const alwayEnabled = ['admissions_overall_per_million'];

  /* Enrich config with dynamic data / locale */
  const seriesConfig: LineSeriesDefinition<NLHospitalAdmissionPerAgeGroupValue>[] = BASE_SERIES_CONFIG.map(
    (baseAgeGroup) => {
      return {
        ...baseAgeGroup,
        type: 'line',
        shape: 'line',
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
    <>
      <TimeSeriesChart
        values={values}
        timeframe={timeframe}
        seriesConfig={chartConfig}
        height={breakpoints.md ? 300 : 250}
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
      <InteractiveLegend
        helpText={text.legend_help_text}
        selectOptions={interactiveLegendOptions}
        selection={list}
        onToggleItem={toggle}
        onReset={clear}
      />
      <Legend items={staticLegendItems} />
    </>
  );
}
