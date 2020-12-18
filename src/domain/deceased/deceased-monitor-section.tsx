import { useTheme } from 'styled-components';
import CoronaVirusIcon from '~/assets/coronavirus.svg';
import { AnchorTile } from '~/components-styled/anchor-tile';
import { ChartTile } from '~/components-styled/chart-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { Legenda } from '~/components-styled/legenda';
import DeceasedMonitor from '~/domain/deceased/components/deceased-monitor-chart';
import siteText from '~/locale/index';
import { NationalDeceasedCbs, RegionalDeceasedCbs } from '~/types/data';

const text = siteText.section_sterftemonitor;

export function DeceasedMonitorSection({
  data,
}: {
  data: NationalDeceasedCbs | RegionalDeceasedCbs;
}) {
  const theme = useTheme();

  return (
    <>
      <ContentHeader
        title={text.title}
        icon={<CoronaVirusIcon />}
        subtitle={text.description}
        reference={text.reference}
        metadata={{
          datumsText: text.datums,
          dateInfo: {
            weekStartUnix: data.last_value.week_start_unix,
            weekEndUnix: data.last_value.week_end_unix,
          },
          dateOfInsertionUnix: data.last_value.date_of_insertion_unix,
          dataSources: [text.bronnen.cbs],
        }}
      />

      <AnchorTile
        title={text.cbs_message.title}
        label={text.cbs_message.link.text}
        href={text.cbs_message.link.href}
        external
      >
        {text.cbs_message.message}
      </AnchorTile>

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
              color: theme.colors.data.primary,
            },
            expected: {
              label: text.deceased_monitor_chart_legenda_expected,
              color: '#5BADDB',
            },
            margin: {
              label: text.deceased_monitor_chart_legenda_expected_margin,
              color: '#D0EDFF',
            },
          }}
        />
        <Legenda
          items={[
            {
              label: text.deceased_monitor_chart_legenda_registered,
              color: theme.colors.data.primary,
              shape: 'line',
            },
            {
              label: text.deceased_monitor_chart_legenda_expected,
              color: '#5BADDB',
              shape: 'line',
            },
            {
              label: text.deceased_monitor_chart_legenda_expected_margin,
              color: '#D0EDFF',
              shape: 'square',
            },
          ]}
        />
      </ChartTile>
    </>
  );
}
