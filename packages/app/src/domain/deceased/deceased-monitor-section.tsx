import { colors, NlDeceasedCbs, VrDeceasedCbs } from '@corona-dashboard/common';
import { AnchorTile } from '~/components/anchor-tile';
import { ChartTile } from '~/components/chart-tile';
import { Markdown } from '~/components/markdown';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { SiteText } from '~/locale';

export function DeceasedMonitorSection({
  data,
  text,
  showCauseMessage,
}: {
  data: NlDeceasedCbs | VrDeceasedCbs;
  text: SiteText['pages']['deceased_page']['nl']['section_sterftemonitor'];
  showCauseMessage?: boolean;
}) {
  return (
    <>
      <ChartTile metadata={{ source: text.bronnen.cbs }} title={text.deceased_monitor_chart_title} description={text.deceased_monitor_chart_description}>
        <TimeSeriesChart
          accessibility={{
            key: 'deceased_monitor',
          }}
          tooltipTitle={text.deceased_monitor_chart_title}
          values={data.values}
          seriesConfig={[
            {
              type: 'line',
              metricProperty: 'expected',
              label: text.deceased_monitor_chart_legenda_expected,
              shortLabel: text.deceased_monitor_chart_legenda_expected_short,
              color: colors.primary,
            },
            {
              type: 'line',
              metricProperty: 'registered',
              label: text.deceased_monitor_chart_legenda_registered,
              shortLabel: text.deceased_monitor_chart_legenda_registered_short,
              color: colors.orange1,
            },
            {
              type: 'range',
              metricPropertyLow: 'expected_min',
              metricPropertyHigh: 'expected_max',
              label: text.deceased_monitor_chart_legenda_expected_margin,
              shortLabel: text.deceased_monitor_chart_legenda_expected_margin_short,
              color: colors.blue2,
            },
          ]}
        />
      </ChartTile>
      {showCauseMessage && (
        <AnchorTile title={text.cause_message.title} label={text.cause_message.link.text} href={text.cause_message.link.url} external>
          <Markdown content={text.cause_message.message}></Markdown>
        </AnchorTile>
      )}
    </>
  );
}
