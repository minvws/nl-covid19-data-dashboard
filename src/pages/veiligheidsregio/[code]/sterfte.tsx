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
import { getSafetyRegionLayout } from '~/components/layout/SafetyRegionLayout';
import { SEOHead } from '~/components/seoHead';
import DeceasedMonitor from '~/domain/deceased/deceased-monitor';
import siteText from '~/locale/index';
import {
  getSafetyRegionData,
  getSafetyRegionPaths,
  ISafetyRegionData,
} from '~/static-props/safetyregion-data';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.veiligheidsregio_sterfte;

const DeceasedRegionalPage: FCWithLayout<ISafetyRegionData> = (props) => {
  const theme = useTheme();
  const {
    safetyRegionName: safetyRegion,
    data: { deceased_cbs: dataCbs, deceased_rivm: dataRivm },
  } = props;

  return (
    <>
      <SEOHead
        title={replaceVariablesInText(text.metadata.title, { safetyRegion })}
        description={replaceVariablesInText(text.metadata.description, {
          safetyRegion,
        })}
      />

      <ContentHeader
        category={siteText.veiligheidsregio_layout.headings.besmettingen}
        title={replaceVariablesInText(text.section_deceased_rivm.title, {
          safetyRegion,
        })}
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
        title={text.section_deceased_cbs.title}
        icon={<CoronaVirusIcon />}
        subtitle={text.section_deceased_cbs.description}
        metadata={{
          datumsText: text.section_deceased_cbs.datums,
          dateInfo: {
            weekStartUnix: dataCbs.last_value.week_start_unix,
            weekEndUnix: dataCbs.last_value.week_end_unix,
          },
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
                color: theme.colors.data.primary,
                shape: 'line',
              },
              {
                label:
                  text.section_deceased_cbs
                    .mortality_monitor_chart_legenda_expected,
                color: '#5BADDB',
                shape: 'line',
              },
              {
                label:
                  text.section_deceased_cbs
                    .mortality_monitor_chart_legenda_expected_margin,
                color: '#D0EDFF',
                shape: 'square',
              },
            ]}
          />
        </ChartTile>
      </Box>
    </>
  );
};

DeceasedRegionalPage.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionData;

export const getStaticPaths = getSafetyRegionPaths();

export default DeceasedRegionalPage;
