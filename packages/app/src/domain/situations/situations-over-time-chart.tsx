import { TimeframeOption, VrSituationsValue } from '@corona-dashboard/common';
import { Spacer } from '~/components/base';
import { ErrorBoundary } from '~/components/error-boundary';
import { InteractiveLegend } from '~/components/interactive-legend';
import { Legend, LegendItem } from '~/components/legend';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { GappedLineSeriesDefinition } from '~/components/time-series-chart/logic';
import { useGappedLineAnnotations } from '~/components/time-series-chart/logic/use-gapped-line-annotations';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
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

  const chartConfig = seriesConfig.filter(
    (item) => list.includes(item.metricProperty) || list.length === 0
  );

  return (
    <ErrorBoundary extraComponentInfoReport={{ timeframe }}>
      <InteractiveLegend
        helpText={text.legenda.help_text}
        selectOptions={seriesConfig}
        selection={list}
        onToggleItem={toggle}
        onReset={clear}
      />
      <Spacer mb={2} />
      <TimeSeriesChart
        accessibility={{ key: 'situations_over_time_chart' }}
        values={values}
        timeframe={timeframe}
        dataOptions={{ timespanAnnotations, isPercentage: true }}
        seriesConfig={chartConfig}
        disableLegend
      />
      <Legend items={staticLegendItems} />
    </ErrorBoundary>
  );
}

const {
  cyan,
  turquoise,
  turquoise_dark,
  yellow,
  yellow_dark,
  orange,
  orange_dark,
  magenta,
} = colors.data.multiseries;

const seriesColors: Record<SituationKey, string> = {
  home_and_visits: cyan,
  work: turquoise,
  school_and_day_care: turquoise_dark,
  health_care: yellow,
  gathering: yellow_dark,
  travel: orange,
  hospitality: orange_dark,
  other: magenta,
};
