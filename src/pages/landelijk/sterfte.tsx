import { useTheme } from 'styled-components';
import CoronaVirusIcon from '~/assets/coronavirus.svg';
import { AnchorTile } from '~/components-styled/anchor-tile';
import { Box } from '~/components-styled/base';
import { ChartTile } from '~/components-styled/chart-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { Legenda } from '~/components-styled/legenda';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { SEOHead } from '~/components/seoHead';
import DeceasedMonitor from '~/domain/deceased/deceased-monitor';
import siteText from '~/locale/index';
import {
  getNationalStaticProps,
  NationalPageProps,
} from '~/static-props/nl-data';

const text = siteText.sterfte;

const ElderlyAtHomeNationalPage: FCWithLayout<NationalPageProps> = (props) => {
  const theme = useTheme();
  const dataCbs = props.data.deceased_cbs;
  const dataRivm = props.data.deceased_rivm;

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />

      <ContentHeader
        category={siteText.nationaal_layout.headings.besmettingen}
        title={text.section_deceased_rivm.title}
        icon={<CoronaVirusIcon />}
        subtitle={text.section_deceased_rivm.description}
        metadata={{
          datumsText: text.section_deceased_rivm.datums,
          dateInfo: dataRivm.last_value.date_of_report_unix,
          dateOfInsertionUnix: dataCbs.last_value.date_of_insertion_unix,
          dataSources: [text.section_deceased_rivm.bronnen.rivm],
        }}
      />

      <TwoKpiSection>
        <KpiTile
          title={text.section_deceased_rivm.kpi_covid_daily_title}
          metadata={{
            date: dataRivm.last_value.date_of_report_unix,
            source: text.section_deceased_rivm.bronnen.rivm,
          }}
        >
          <KpiValue absolute={dataRivm.last_value.covid_daily} />
          <Text>{text.section_deceased_rivm.kpi_covid_daily_description}</Text>
        </KpiTile>
        <KpiTile
          title={text.section_deceased_rivm.kpi_covid_total_title}
          metadata={{
            date: dataRivm.last_value.date_of_report_unix,
            source: text.section_deceased_rivm.bronnen.rivm,
          }}
        >
          <KpiValue absolute={dataRivm.last_value.covid_total} />
          <Text>{text.section_deceased_rivm.kpi_covid_total_description}</Text>
        </KpiTile>
      </TwoKpiSection>

      <LineChartTile
        timeframeOptions={['all', '5weeks']}
        timeframeInitialValue="all"
        title={text.section_deceased_rivm.line_chart_covid_daily_title}
        values={dataRivm.values.map((value) => ({
          value: value.covid_daily,
          date: value.date_of_report_unix,
        }))}
        metadata={{ source: text.section_deceased_rivm.bronnen.rivm }}
      />

      <ContentHeader
        category={siteText.nationaal_layout.headings.besmettingen}
        title={text.section_deceased_cbs.title}
        icon={<CoronaVirusIcon />}
        subtitle={text.section_deceased_cbs.description}
        metadata={{
          datumsText: text.section_deceased_cbs.datums,
          dateInfo: dataCbs.last_value.date_of_report_unix,
          dateOfInsertionUnix: dataCbs.last_value.date_of_insertion_unix,
          dataSources: [text.section_deceased_cbs.bronnen.cbs],
        }}
      />

      <Box spacing={4}>
        <AnchorTile
          title={text.section_deceased_cbs.cbs_message.title}
          label={text.section_deceased_cbs.cbs_message.link.text}
          href={text.section_deceased_cbs.cbs_message.link.href}
          external
        >
          {text.section_deceased_cbs.cbs_message.message}
        </AnchorTile>

        <ChartTile
          metadata={{ source: text.section_deceased_cbs.bronnen.cbs }}
          title={text.section_deceased_cbs.mortality_monitor_chart_title}
          description={
            text.section_deceased_cbs.mortality_monitor_chart_description
          }
        >
          <DeceasedMonitor
            values={dataCbs.values}
            config={{
              registered: {
                label:
                  text.section_deceased_cbs
                    .mortality_monitor_chart_legenda_registered,
                color: theme.colors.data.primary,
              },
              expected: {
                label:
                  text.section_deceased_cbs
                    .mortality_monitor_chart_legenda_expected,
                color: '#5BADDB',
              },
              margin: {
                label:
                  text.section_deceased_cbs
                    .mortality_monitor_chart_legenda_expected_margin,
                color: '#D0EDFF',
              },
            }}
          />
          <Legenda
            items={[
              {
                label:
                  text.section_deceased_cbs
                    .mortality_monitor_chart_legenda_registered,
                color: 'data.primary',
                shape: 'line',
              },
              {
                label:
                  text.section_deceased_cbs
                    .mortality_monitor_chart_legenda_expected_margin,
                color: 'data.fill',
                shape: 'square',
              },
            ]}
          />
        </ChartTile>
      </Box>
    </>
  );
};

ElderlyAtHomeNationalPage.getLayout = getNationalLayout;

export const getStaticProps = getNationalStaticProps;

export default ElderlyAtHomeNationalPage;
