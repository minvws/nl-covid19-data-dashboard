import CoronaVirusIcon from '~/assets/coronavirus.svg';
import { AgeDemographic } from '~/components-styled/age-demographic';
import { ChartTile } from '~/components-styled/chart-tile';
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
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import { getLastGeneratedDate, getNlData } from '~/static-props/get-data';

const text = siteText.sterfte;

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getNlData
);

const DeceasedNationalPage: FCWithLayout<typeof getStaticProps> = (props) => {
  const dataCbs = props.data.deceased_cbs;
  const dataRivm = props.data.deceased_rivm;
  const dataDeceasedPerAgeGroup = props.data.deceased_rivm_per_age_group;

  return (
    <>
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

        <ChartTile
          title={siteText.deceased_age_groups.title}
          description={siteText.deceased_age_groups.description}
          metadata={{
            date: dataRivm.last_value.date_unix,
            source: siteText.deceased_age_groups.bronnen.rivm,
          }}
        >
          <AgeDemographic
            data={dataDeceasedPerAgeGroup}
            metricProperty="covid_percentage"
            displayMaxPercentage={45}
            text={siteText.deceased_age_groups.graph}
          />
        </ChartTile>

        <DeceasedMonitorSection data={dataCbs} />
      </TileList>
    </>
  );
};

DeceasedNationalPage.getLayout = getNationalLayout;

export default DeceasedNationalPage;
