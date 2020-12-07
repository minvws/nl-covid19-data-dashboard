import { useTheme } from 'styled-components';
import CoronaVirusIcon from '~/assets/coronavirus.svg';
import { AnchorTile } from '~/components-styled/anchor-tile';
import { Box } from '~/components-styled/base';
import { ChartTile } from '~/components-styled/chart-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { Legenda } from '~/components-styled/legenda';
import DeceasedMonitor from '~/domain/deceased/components/deceased-monitor-chart';
import siteText from '~/locale/index';
import { NationalDeceasedCbs, RegionalDeceasedCbs } from '~/types/data';

const sterftemonitorText = siteText.section_sterftemonitor;

export function DeceasedMonitorSection({
  data,
}: {
  data: NationalDeceasedCbs | RegionalDeceasedCbs;
}) {
  const theme = useTheme();

  return (
    <Box>
      <ContentHeader
        title={sterftemonitorText.title}
        icon={<CoronaVirusIcon />}
        subtitle={sterftemonitorText.description}
        metadata={{
          datumsText: sterftemonitorText.datums,
          dateInfo: {
            weekStartUnix: data.last_value.week_start_unix,
            weekEndUnix: data.last_value.week_end_unix,
          },
          dateOfInsertionUnix: data.last_value.date_of_insertion_unix,
          dataSources: [sterftemonitorText.bronnen.cbs],
        }}
      />

      <Box spacing={4}>
        <AnchorTile
          title={sterftemonitorText.cbs_message.title}
          label={sterftemonitorText.cbs_message.link.text}
          href={sterftemonitorText.cbs_message.link.href}
          external
        >
          {sterftemonitorText.cbs_message.message}
        </AnchorTile>

        <ChartTile
          metadata={{ source: sterftemonitorText.bronnen.cbs }}
          title={sterftemonitorText.deceased_monitor_chart_title}
          description={sterftemonitorText.deceased_monitor_chart_description}
        >
          <DeceasedMonitor
            values={data.values}
            config={{
              registered: {
                label:
                  sterftemonitorText.deceased_monitor_chart_legenda_registered,
                color: theme.colors.data.primary,
              },
              expected: {
                label:
                  sterftemonitorText.deceased_monitor_chart_legenda_expected,
                color: '#5BADDB',
              },
              margin: {
                label:
                  sterftemonitorText.deceased_monitor_chart_legenda_expected_margin,
                color: '#D0EDFF',
              },
            }}
          />
          <Legenda
            items={[
              {
                label:
                  sterftemonitorText.deceased_monitor_chart_legenda_registered,
                color: theme.colors.data.primary,
                shape: 'line',
              },
              {
                label:
                  sterftemonitorText.deceased_monitor_chart_legenda_expected,
                color: '#5BADDB',
                shape: 'line',
              },
              {
                label:
                  sterftemonitorText.deceased_monitor_chart_legenda_expected_margin,
                color: '#D0EDFF',
                shape: 'square',
              },
            ]}
          />
        </ChartTile>
      </Box>
    </Box>
  );
}
