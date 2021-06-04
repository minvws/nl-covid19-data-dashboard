import { VrSituationsValue } from '@corona-dashboard/common';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { GappedLineSeriesDefinition } from '~/components/time-series-chart/logic';
import { useGappedLineAnnotations } from '~/components/time-series-chart/logic/use-gapped-line-annotations';
import { colors } from '~/style/theme';
import { TimeframeOption } from '~/utils/timeframe';
import { SituationKey, useSituations } from './logic/situations';

interface SituationsTimeSeriesChartProps {
  timeframe: TimeframeOption;
  values: VrSituationsValue[];
}

export function SituationsOverTimeChart({
  values,
  timeframe,
}: SituationsTimeSeriesChartProps) {
  const situations = useSituations();

  const timespanAnnotations = useGappedLineAnnotations(
    values,
    'has_sufficient_data',
    'bleehhh'
  );

  console.log(values);
  console.log(timespanAnnotations);

  return (
    <>
      {/* <InteractiveLegend
    helpText={'text.legend_help_text'}
    selectOptions={interactiveLegendOptions}
    selection={list}
    onToggleItem={toggle}
    onReset={clear}
  /> */}
      <TimeSeriesChart
        values={values}
        timeframe={timeframe}
        dataOptions={{ timespanAnnotations }}
        seriesConfig={situations.map<
          GappedLineSeriesDefinition<VrSituationsValue>
        >((situation) => ({
          type: 'gapped-line',
          metricProperty: situation.id,
          color: seriesColors[situation.id],
          label: situation.title,
        }))}
        disableLegend
      />
      {/* <Legend items={staticLegendItems} /> */}
    </>
  );
}

const seriesColors: Record<SituationKey, string> = {
  home_and_visits: colors.data.multiseries.cyan,
  work: colors.data.multiseries.turquoise,
  school_and_day_care: colors.data.multiseries.turquoise_dark,
  health_care: colors.data.multiseries.yellow,
  gathering: colors.data.multiseries.yellow_dark,
  travel: colors.data.multiseries.orange,
  hospitality: colors.data.multiseries.orange_dark,
  other: colors.data.multiseries.magenta,
};
