import { colors, TimeframeOption, VrSituationsValue } from '@corona-dashboard/common';
import { Spacer } from '~/components/base';
import { ErrorBoundary } from '~/components/error-boundary';
import { InteractiveLegend } from '~/components/interactive-legend';
import { Legend, LegendItem } from '~/components/legend';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TimelineEventConfig, TimelineMarker } from '~/components/time-series-chart/components/timeline';
import { GappedLineSeriesDefinition } from '~/components/time-series-chart/logic';
import { useGappedLineAnnotations } from '~/components/time-series-chart/logic/use-gapped-line-annotations';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';
import { space } from '~/style/theme';
import { useList } from '~/utils/use-list';
import { SituationKey, useSituations } from './logic/situations';

interface SituationsTimeSeriesChartProps {
  timeframe: TimeframeOption;
  values: VrSituationsValue[];
  timelineEvents?: TimelineEventConfig[];
  text: SiteText['pages']['situations_page']['shared'];
}

export function SituationsOverTimeChart({ values, timeframe, timelineEvents, text }: SituationsTimeSeriesChartProps) {
  const { commonTexts } = useIntl();
  const situations = useSituations(text.situaties);
  const { list, toggle, clear } = useList<string>();

  const staticLegendItems: LegendItem[] = [
    {
      shape: 'square',
      color: colors.gray2,
      label: text.situaties_over_tijd_grafiek.legenda.onvoldoende_gegevens,
    },
  ];

  if (timelineEvents && timelineEvents.length > 0) {
    staticLegendItems.push({
      label: commonTexts.charts.timeline.legend_label,
      shape: 'custom',
      shapeComponent: <TimelineMarker size={10} />,
    });
  }

  const timespanAnnotations = useGappedLineAnnotations(values, 'has_sufficient_data', text.situaties_over_tijd_grafiek.tooltip.onvoldoende_gegevens);

  const seriesConfig = situations.map<GappedLineSeriesDefinition<VrSituationsValue>>((situation) => ({
    type: 'gapped-line',
    metricProperty: situation.id,
    color: seriesColors[situation.id],
    label: situation.title,
    shape: 'line',
  }));

  const chartConfig = seriesConfig.filter((item) => list.includes(item.metricProperty) || list.length === 0);

  return (
    <ErrorBoundary extraComponentInfoReport={{ timeframe }}>
      <InteractiveLegend helpText={text.situaties_over_tijd_grafiek.legenda.help_text} selectOptions={seriesConfig} selection={list} onToggleItem={toggle} onReset={clear} />
      <Spacer marginBottom={space[2]} />
      <TimeSeriesChart
        accessibility={{ key: 'situations_over_time_chart' }}
        values={values}
        timeframe={timeframe}
        dataOptions={{
          timespanAnnotations,
          isPercentage: true,
          timelineEvents,
        }}
        seriesConfig={chartConfig}
        disableLegend
      />
      <Legend items={staticLegendItems} />
    </ErrorBoundary>
  );
}

const { blue6, green2, green3, yellow3, yellow5, orange1, orange2, magenta1 } = colors;

const seriesColors: Record<SituationKey, string> = {
  home_and_visits: blue6,
  work: green2,
  school_and_day_care: green3,
  health_care: yellow3,
  gathering: yellow5,
  travel: orange1,
  hospitality: orange2,
  other: magenta1,
};
