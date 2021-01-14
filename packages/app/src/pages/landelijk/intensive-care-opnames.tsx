import Arts from '~/assets/arts.svg';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { PageBarScale } from '~/components-styled/page-barscale';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { SEOHead } from '~/components/seoHead';
import { FCWithLayout } from '~/domain/layout/layout';
import { getNationalLayout } from '~/domain/layout/national-layout';
import siteText from '~/locale/index';
import { getNlData, getLastGeneratedDate } from '~/static-props/get-data';
import { createGetStaticProps } from '~/static-props/create-get-static-props';

const text = siteText.ic_opnames_per_dag;
const graphDescriptions = siteText.accessibility.grafieken;

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getNlData
);

const IntakeIntensiveCare: FCWithLayout<typeof getStaticProps> = (props) => {
  const { data } = props;

  const dataIntake = data.intensive_care_nice;

  const dataBeds = data.intensive_care_lcps;

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <TileList>
        <ContentHeader
          category={siteText.nationaal_layout.headings.ziekenhuizen}
          screenReaderCategory={siteText.ic_opnames_per_dag.titel_sidebar}
          title={text.titel}
          icon={<Arts />}
          subtitle={text.pagina_toelichting}
          metadata={{
            datumsText: text.datums,
            dateOrRange: dataIntake.last_value.date_unix,
            dateOfInsertionUnix: dataIntake.last_value.date_of_insertion_unix,
            dataSources: [text.bronnen.nice, text.bronnen.lnaz],
          }}
          reference={text.reference}
        />

        <TwoKpiSection>
          <KpiTile
            title={text.barscale_titel}
            metadata={{
              date: dataIntake.last_value.date_unix,
              source: text.bronnen.nice,
            }}
          >
            <PageBarScale
              data={data}
              scope="nl"
              metricName="intensive_care_nice"
              metricProperty="admissions_moving_average"
              localeTextKey="ic_opnames_per_dag"
              differenceKey="intensive_care_nice__admissions_moving_average"
            />
            <Text>{text.extra_uitleg}</Text>
          </KpiTile>

          <KpiTile
            title={text.kpi_bedbezetting.title}
            metadata={{
              date: dataBeds.last_value.date_unix,
              source: text.bronnen.lnaz,
            }}
          >
            <KpiValue
              data-cy="beds_occupied_covid"
              absolute={dataBeds.last_value.beds_occupied_covid}
              percentage={dataBeds.last_value.beds_occupied_covid_percentage}
              difference={
                data.difference.intensive_care_lcps__beds_occupied_covid
              }
            />
            <Text>{text.kpi_bedbezetting.description}</Text>
          </KpiTile>
        </TwoKpiSection>

        <LineChartTile
          title={text.linechart_titel}
          values={dataIntake.values}
          ariaDescription={graphDescriptions.intensive_care_opnames}
          linesConfig={[
            {
              metricProperty: 'admissions_moving_average',
            },
          ]}
          signaalwaarde={10}
          metadata={{ source: text.bronnen.nice }}
        />

        <LineChartTile
          title={text.chart_bedbezetting.title}
          description={text.chart_bedbezetting.description}
          values={dataBeds.values}
          linesConfig={[
            {
              metricProperty: 'beds_occupied_covid',
            },
          ]}
          metadata={{ source: text.bronnen.lnaz }}
        />
      </TileList>
    </>
  );
};

IntakeIntensiveCare.getLayout = getNationalLayout;

export default IntakeIntensiveCare;
