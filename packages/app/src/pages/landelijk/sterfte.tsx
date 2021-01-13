import CoronaVirusIcon from '~/assets/coronavirus.svg';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { SEOHead } from '~/components/seoHead';
import { DeceasedMonitorSection } from '~/domain/deceased/deceased-monitor-section';
import { FCWithLayout } from '~/domain/layout/layout';
import { getNationalLayout } from '~/domain/layout/national-layout';
import siteText from '~/locale/index';
import { getNlData, getLastGeneratedDate } from '~/static-props/get-data';
import { createGetStaticProps } from '~/static-props/create-get-static-props';

const text = siteText.sterfte;

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getNlData
);

const DeceasedNationalPage: FCWithLayout<typeof getStaticProps> = (props) => {
  const dataCbs = props.data.deceased_cbs;
  const dataRivm = props.data.deceased_rivm;

  return (
    <>
      {' '}
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <TileList>
        <ContentHeader
          category={siteText.nationaal_layout.headings.besmettingen}
          title={text.section_deceased_rivm.title}
          icon={<CoronaVirusIcon />}
          subtitle={text.section_deceased_rivm.description}
          reference={text.section_deceased_rivm.reference}
          metadata={{
            datumsText: text.section_deceased_rivm.datums,
            dateOrRange: dataRivm.last_value.date_unix,
            dateOfInsertionUnix: dataRivm.last_value.date_of_insertion_unix,
            dataSources: [text.section_deceased_rivm.bronnen.rivm],
          }}
        />

        <TwoKpiSection>
          <KpiTile
            title={text.section_deceased_rivm.kpi_covid_daily_title}
            metadata={{
              date: dataRivm.last_value.date_unix,
              source: text.section_deceased_rivm.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="covid_daily"
              absolute={dataRivm.last_value.covid_daily}
            />
            <Text>
              {text.section_deceased_rivm.kpi_covid_daily_description}
            </Text>
          </KpiTile>
          <KpiTile
            title={text.section_deceased_rivm.kpi_covid_total_title}
            metadata={{
              date: dataRivm.last_value.date_unix,
              source: text.section_deceased_rivm.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="covid_total"
              absolute={dataRivm.last_value.covid_total}
            />
            <Text>
              {text.section_deceased_rivm.kpi_covid_total_description}
            </Text>
          </KpiTile>
        </TwoKpiSection>

        <LineChartTile
          timeframeOptions={['all', '5weeks']}
          timeframeInitialValue="all"
          title={text.section_deceased_rivm.line_chart_covid_daily_title}
          description={
            text.section_deceased_rivm.line_chart_covid_daily_description
          }
          values={dataRivm.values}
          linesConfig={[
            {
              metricProperty: 'covid_daily',
            },
          ]}
          metadata={{ source: text.section_deceased_rivm.bronnen.rivm }}
        />

        <DeceasedMonitorSection data={dataCbs} />
      </TileList>
    </>
  );
};

DeceasedNationalPage.getLayout = getNationalLayout;

export default DeceasedNationalPage;
