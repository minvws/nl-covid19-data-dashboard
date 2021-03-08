import {
  NationalDeceasedCbs,
  RegionalDeceasedCbs,
} from '@corona-dashboard/common';
import { ParentSize } from '@visx/responsive';
import { AnchorTile } from '~/components-styled/anchor-tile';
import { ChartTile } from '~/components-styled/chart-tile';
import { TimeSeriesChart } from '~/components-styled/time-series-chart';
import siteText from '~/locale/index';
import { colors } from '~/style/theme';

const text = siteText.section_sterftemonitor;

export function DeceasedMonitorSection({
  data,
  showDataMessage,
}: {
  data: NationalDeceasedCbs | RegionalDeceasedCbs;
  showDataMessage?: boolean;
}) {
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
        <ParentSize>
          {({ width }) => (
            <TimeSeriesChart
              title={text.deceased_monitor_chart_title}
              width={width}
              values={data.values}
              ariaLabelledBy=""
              paddingLeft={40}
              seriesConfig={[
                {
                  type: 'range',
                  metricPropertyLow: 'expected_min',
                  metricPropertyHigh: 'expected_max',
                  label: text.deceased_monitor_chart_legenda_expected_margin,
                  color: colors.data.margin,
                },
                {
                  type: 'line',
                  metricProperty: 'expected',
                  label: text.deceased_monitor_chart_legenda_expected,
                  color: colors.data.primary,
                },
                {
                  type: 'line',
                  metricProperty: 'registered',
                  label: text.deceased_monitor_chart_legenda_registered,
                  color: colors.data.secondary,
                },
              ]}
            />
          )}
        </ParentSize>
      </ChartTile>
    </>
  );
}
