import Arts from '~/assets/arts.svg';
import { ContentHeader_sourcesHack } from '~/components/contentHeader_sourcesHack';
import { IntakeIntensiveCareBarscale } from '~/components/landelijk/intake-intensive-care-barscale';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import getNlData, { INationalData } from '~/static-props/nl-data';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { Text } from '~/components-styled/typography';
import { LineChartTile } from '~/components-styled/line-chart-tile';

const text = siteText.ic_opnames_per_dag;

const IntakeIntensiveCare: FCWithLayout<INationalData> = (props) => {
  const { data: state } = props;

  const dataIntake = state.intake_intensivecare_ma;

  const dataBeds = state.intensive_care_beds_occupied;

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <ContentHeader_sourcesHack
        category={siteText.nationaal_layout.headings.ziekenhuizen}
        title={text.titel}
        Icon={Arts}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: dataIntake.last_value.date_of_report_unix,
          dateInsertedUnix: dataIntake.last_value.date_of_insertion_unix,
          dataSourceA: text.bronnen.nice,
          dataSourceB: text.bronnen.lnaz,
        }}
      />

      <TwoKpiSection>
        <KpiTile
          title={text.barscale_titel}
          metadata={{
            date: dataIntake.last_value.date_of_report_unix,
            source: text.bronnen.nice,
          }}
        >
          <IntakeIntensiveCareBarscale data={dataIntake} showAxis={true} />
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
        metadata={{
          source: text.bronnen.nice,
        }}
      />

      <LineChartTile
        title={text.chart_bedbezetting.title}
        description={text.chart_bedbezetting.description}
        values={dataBeds.values.map((value) => ({
          value: value.covid_occupied,
          date: value.date_of_report_unix,
        }))}
        metadata={{
          source: text.bronnen.lnaz,
        }}
      />
    </>
  );
};

IntakeIntensiveCare.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default IntakeIntensiveCare;
