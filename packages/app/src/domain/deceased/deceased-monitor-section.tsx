import { NlDeceasedCbs, VrDeceasedCbs } from '@corona-dashboard/common';
import { AnchorTile } from '~/components/anchor-tile';
import { ChartTile } from '~/components/chart-tile';
import { Markdown } from '~/components/markdown';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';

export function DeceasedMonitorSection({
  data,
  showDataMessage,
  showCauseMessage,
}: {
  data: NlDeceasedCbs | VrDeceasedCbs;
  showDataMessage?: boolean;
  showCauseMessage?: boolean;
}) {
  const { siteText } = useIntl();
  const text = siteText.section_sterftemonitor;

  return (
    <>
      {showDataMessage && (
        <AnchorTile
          title={text.cbs_message.title}
          label={text.cbs_message.link.text}
          href={text.cbs_message.link.href}
          external
        >
          {text.cbs_message.message}
        </AnchorTile>
      )}

      <ChartTile
        metadata={{ source: text.bronnen.cbs }}
        title={text.deceased_monitor_chart_title}
        description={text.deceased_monitor_chart_description}
      >
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
              color: colors.data.primary,
            },
            {
              type: 'line',
              metricProperty: 'registered',
              label: text.deceased_monitor_chart_legenda_registered,
              shortLabel: text.deceased_monitor_chart_legenda_registered_short,
              color: colors.data.secondary,
              strokeWidth: 4,
            },
            {
              type: 'range',
              metricPropertyLow: 'expected_min',
              metricPropertyHigh: 'expected_max',
              label: text.deceased_monitor_chart_legenda_expected_margin,
              shortLabel:
                text.deceased_monitor_chart_legenda_expected_margin_short,
              color: colors.data.margin,
            },
          ]}
        />
      </ChartTile>

      {showCauseMessage && (
        <AnchorTile
          title={text.cause_message.title}
          label={text.cause_message.link.text}
          href={text.cause_message.link.href}
          external
        >
          <Markdown content={text.cause_message.message}></Markdown>
        </AnchorTile>
      )}
    </>
  );
}
