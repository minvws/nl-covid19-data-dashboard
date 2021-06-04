import { VrSituationsValue } from '@corona-dashboard/common';
import { InteractiveLegend } from '~/components/interactive-legend';
import { Legend, LegendItem } from '~/components/legend';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { GappedLineSeriesDefinition } from '~/components/time-series-chart/logic';
import { useGappedLineAnnotations } from '~/components/time-series-chart/logic/use-gapped-line-annotations';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { TimeframeOption } from '~/utils/timeframe';
import { useList } from '~/utils/use-list';
import { SituationKey, useSituations } from './logic/situations';

interface SituationsTimeSeriesChartProps {
  timeframe: TimeframeOption;
  values: VrSituationsValue[];
}

export function SituationsOverTimeChart({
  values,
  timeframe,
}: SituationsTimeSeriesChartProps) {
  const { siteText } = useIntl();
  const situations = useSituations();
  const { list, toggle, clear } = useList<string>();

  const text = siteText.brononderzoek.situaties_over_tijd_grafiek;

  const staticLegendItems: LegendItem[] = [
    {
      shape: 'square',
      color: colors.data.underReported,
      label: text.legenda.onvoldoende_gegevens,
    },
  ];

  const timespanAnnotations = useGappedLineAnnotations(
    values,
    'has_sufficient_data',
    text.tooltip.onvoldoende_gegevens
  );

  const seriesConfig = situations.map<
    GappedLineSeriesDefinition<VrSituationsValue>
  >((situation) => ({
    type: 'gapped-line',
    metricProperty: situation.id,
    color: seriesColors[situation.id],
    label: situation.title,
    shape: 'line',
  }));

  const compareList = list.concat();
  const chartConfig = seriesConfig.filter(
    (item) =>
      compareList.includes(item.metricProperty) || compareList.length === 0
  );

  return (
    <>
      <InteractiveLegend
        helpText={text.legenda.help_text}
        selectOptions={seriesConfig}
        selection={list}
        onToggleItem={toggle}
        onReset={clear}
      />
      <TimeSeriesChart
        values={values}
        timeframe={timeframe}
        dataOptions={{ timespanAnnotations }}
        seriesConfig={chartConfig}
        disableLegend
      />
      {<Legend items={staticLegendItems} />}
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
