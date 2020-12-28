import Arts from '~/assets/arts.svg';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { PageBarScale } from '~/components-styled/page-barscale';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { FCWithLayout } from '~/domain/layout/layout';
import { getNationalLayout } from '~/domain/layout/national-layout';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import {
  getNationalStaticProps,
  NationalPageProps,
} from '~/static-props/nl-data';

const text = siteText.ic_opnames_per_dag;

const IntakeIntensiveCare: FCWithLayout<NationalPageProps> = (props) => {
  const { data } = props;

  const dataIntake = data.intake_intensivecare_ma;

  const dataBeds = data.intensive_care_beds_occupied;

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
            dateInfo: dataIntake.last_value.date_of_report_unix,
            dateOfInsertionUnix: dataIntake.last_value.date_of_insertion_unix,
            dataSources: [text.bronnen.nice, text.bronnen.lnaz],
          }}
          reference={text.reference}
        />

        <TwoKpiSection>
          <KpiTile
            title={text.barscale_titel}
            metadata={{
              date: dataIntake.last_value.date_of_report_unix,
              source: text.bronnen.nice,
            }}
          >
            <PageBarScale
              data={data}
              scope="nl"
              metricName="intake_intensivecare_ma"
              metricProperty="moving_average_ic"
              localeTextKey="ic_opnames_per_dag"
              differenceKey="intake_intensivecare_ma__moving_average_ic"
            />
            <Text>{text.extra_uitleg}</Text>
          </KpiTile>

          <KpiTile
            title={text.kpi_bedbezetting.title}
            metadata={{
              date: dataBeds.last_value.date_of_report_unix,
              source: text.bronnen.lnaz,
            }}
          >
            <KpiValue
              data-cy="covid_occupied"
              absolute={dataBeds.last_value.covid_occupied}
              percentage={dataBeds.last_value.covid_percentage_of_all_occupied}
              difference={
                data.difference.intensive_care_beds_occupied__covid_occupied
              }
            />
            <Text>{text.kpi_bedbezetting.description}</Text>
          </KpiTile>
        </TwoKpiSection>

        <LineChartTile
          title={text.linechart_titel}
          values={dataIntake.values}
          linesConfig={[
            {
              metricProperty: 'moving_average_ic',
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
              metricProperty: 'covid_occupied',
            },
          ]}
          metadata={{ source: text.bronnen.lnaz }}
        />
      </TileList>
    </>
  );
};

IntakeIntensiveCare.getLayout = getNationalLayout;

export const getStaticProps = getNationalStaticProps;

export default IntakeIntensiveCare;
