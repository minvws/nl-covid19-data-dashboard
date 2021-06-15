import { NlVariantsValue } from '@corona-dashboard/common';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { LineSeriesDefinition } from '~/components/time-series-chart/logic';
import { BASE_SERIES_CONFIG } from '~/domain/variants/series.config';
import { useList } from '~/utils/use-list';
// "alpha_percentage",
// "alpha_is_variant_of_concern",
// "beta_percentage",
// "beta_occurrence",
// "beta_is_variant_of_concern",
// "gamma_percentage",
// "gamma_occurrence",
// "gamma_is_variant_of_concern",
// "delta_percentage",
// "delta_occurrence",
// "delta_is_variant_of_concern",
// "eta_percentage",
// "eta_occurrence",
// "eta_is_variant_of_concern",
// "epsilon_percentage",
// "epsilon_occurrence",
// "epsilon_is_variant_of_concern",
// "theta_percentage",
// "theta_occurrence",
// "theta_is_variant_of_concern",
// "kappa_percentage",
// "kappa_occurrence",
// "kappa_is_variant_of_concern",
// "other_percentage",
// "other_occurrence",
// "other_is_variant_of_concern",
// "sample_size",
// "date_of_insertion_unix",
// "date_start_unix",
// "date_end_unix"

interface VariantsOverTimeProps {
  values: NlVariantsValue[];
  timeframe: 'all';
}

export function VariantsOverTime({ values, timeframe }: VariantsOverTimeProps) {
  console.log(values);
  const { list, toggle, clear } = useList<string>();

  const keys = Object.keys(values[0]);
  const avaliableKeys = keys.filter((item, index) =>
    item.includes('percentage')
  );

  /* Enrich config with dynamic data / locale */
  const seriesConfig: LineSeriesDefinition<NlVariantsValue>[] =
    BASE_SERIES_CONFIG.map((baseAgeGroup) => {
      return {
        ...baseAgeGroup,
        type: 'line',
        shape: 'line',
        label: 'test',
      };
    });

  // const seriesConfig = avaliableKeys.map((item, index) => ({
  //   type: 'line',
  //   metricProperty: item,
  //   color: 'red',
  //   label: 'hoi',
  // }));

  return (
    <>
      <p>chart</p>
      <TimeSeriesChart
        values={values}
        timeframe={timeframe}
        seriesConfig={seriesConfig}
        // minHeight={breakpoints.md ? 300 : 250}
        disableLegend
        // formatTooltip={(data) => (
        //   <TooltipSeriesList data={data} hasTwoColumns={hasTwoColumns} />
        // )}
        // dataOptions={{
        //   timespanAnnotations: [
        //     {
        //       start: underReportedDateStart,
        //       end: Infinity,
        //       label: text.line_chart_legend_inaccurate_label,
        //       shortLabel: text.tooltip_labels.inaccurate,
        //     },
        //   ],
        // }}
      />
    </>
  );
}
