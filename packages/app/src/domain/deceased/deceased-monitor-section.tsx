import { useTheme } from 'styled-components';
import { AnchorTile } from '~/components-styled/anchor-tile';
import { Box } from '~/components-styled/base';
import { ChartTile } from '~/components-styled/chart-tile';
import { Legenda } from '~/components-styled/legenda';
import DeceasedMonitor from '~/domain/deceased/components/deceased-monitor-chart';
import siteText from '~/locale/index';
import {
  NationalDeceasedCbs,
  RegionalDeceasedCbs,
} from '@corona-dashboard/common';

const text = siteText.section_sterftemonitor;

export function DeceasedMonitorSection({
  data,
  showDataMessage,
}: {
  data: NationalDeceasedCbs | RegionalDeceasedCbs;
  showDataMessage?: boolean;
}) {
  const theme = useTheme();

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
        <DeceasedMonitor
          values={data.values}
          config={{
            registered: {
              label: text.deceased_monitor_chart_legenda_registered,
              color: theme.colors.data.secondary,
            },
            expected: {
              label: text.deceased_monitor_chart_legenda_expected,
              color: theme.colors.data.primary,
            },
            margin: {
              label: text.deceased_monitor_chart_legenda_expected_margin,
              color: theme.colors.data.margin,
            },
          }}
        />

        <Box pl="56px">
          <Legenda
            items={[
              {
                label: text.deceased_monitor_chart_legenda_registered,
                color: theme.colors.data.secondary,
                shape: 'line',
              },
              {
                label: text.deceased_monitor_chart_legenda_expected,
                color: theme.colors.data.primary,
                shape: 'line',
              },
              {
                label: text.deceased_monitor_chart_legenda_expected_margin,
                color: theme.colors.data.margin,
                shape: 'square',
              },
            ]}
          />
        </Box>
      </ChartTile>
    </>
  );
}
