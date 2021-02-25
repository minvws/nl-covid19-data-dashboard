import CoronaVirusIcon from '~/assets/coronavirus.svg';
import { AnchorTile } from '~/components-styled/anchor-tile';
import { Box } from '~/components-styled/base';
import { ChartTile } from '~/components-styled/chart-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { Legend } from '~/components-styled/legend';
import siteText from '~/locale/index';
import {
  NationalDeceasedCbs,
  RegionalDeceasedCbs,
} from '@corona-dashboard/common';
import { colors } from '~/style/theme';

const text = siteText.section_sterftemonitor;

export function DeceasedMonitorSection({
  data,
}: {
  data: NationalDeceasedCbs | RegionalDeceasedCbs;
}) {
  return (
    <>
      <ContentHeader
        title={text.title}
        icon={<CoronaVirusIcon />}
        subtitle={text.description}
        reference={text.reference}
        metadata={{
          datumsText: text.datums,
          dateOrRange: {
            start: data.last_value.date_start_unix,
            end: data.last_value.date_end_unix,
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
        {/* <DeceasedMonitor
          values={data.values}
          config={{
            registered: {
              label: text.deceased_monitor_chart_legenda_registered,
              color: colors.data.secondary,
            },
            expected: {
              label: text.deceased_monitor_chart_legenda_expected,
              color: colors.data.primary,
            },
            margin: {
              label: text.deceased_monitor_chart_legenda_expected_margin,
              color: colors.data.margin,
            },
          }}
        /> */}

        <Box pl="56px">
          <Legend
            items={[
              {
                label: text.deceased_monitor_chart_legenda_registered,
                color: colors.data.secondary,
                shape: 'line',
              },
              {
                label: text.deceased_monitor_chart_legenda_expected,
                color: colors.data.primary,
                shape: 'line',
              },
              {
                label: text.deceased_monitor_chart_legenda_expected_margin,
                color: colors.data.margin,
                shape: 'square',
              },
            ]}
          />
        </Box>
      </ChartTile>
    </>
  );
}
