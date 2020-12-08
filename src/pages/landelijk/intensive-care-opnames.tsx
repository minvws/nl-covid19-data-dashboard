import Arts from '~/assets/arts.svg';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { IntakeIntensiveCareBarscale } from '~/components/landelijk/intake-intensive-care-barscale';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
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
          <IntakeIntensiveCareBarscale data={data} showAxis showValue />
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
          />
          <Text>{text.kpi_bedbezetting.description}</Text>
        </KpiTile>
      </TwoKpiSection>

      <LineChartTile
        title={text.linechart_titel}
        values={dataIntake.values.map((value) => ({
          value: value.moving_average_ic,
          date: value.date_of_report_unix,
        }))}
        signaalwaarde={10}
        metadata={{ source: text.bronnen.nice }}
      />

      <LineChartTile
        title={text.chart_bedbezetting.title}
        description={text.chart_bedbezetting.description}
        values={dataBeds.values.map((value) => ({
          value: value.covid_occupied,
          date: value.date_of_report_unix,
        }))}
        metadata={{ source: text.bronnen.lnaz }}
      />
    </>
  );
};

IntakeIntensiveCare.getLayout = getNationalLayout;

export const getStaticProps = getNationalStaticProps;

export default IntakeIntensiveCare;
