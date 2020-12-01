import Arts from '~/assets/arts.svg';
import { ChartTileWithTimeframe } from '~/components-styled/chart-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { LineChartWithWeekTooltip } from '~/components/lineChart/lineChartWithWeekTooltip';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import {
  getNationalStaticProps,
  NationalPageProps,
} from '~/static-props/nl-data';

const text = siteText.verdenkingen_huisartsen;

const SuspectedPatients: FCWithLayout<NationalPageProps> = (props) => {
  const { data } = props;

  const doctorData = data.verdenkingen_huisartsen;

  const total = doctorData.last_value.geschat_aantal;
  const normalized = doctorData.last_value.incidentie;

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <ContentHeader
        category={siteText.nationaal_layout.headings.vroege_signalen}
        screenreaderCategory={siteText.verdenkingen_huisartsen.titel_sidebar}
        title={text.titel}
        icon={<Arts />}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateInfo: doctorData.last_value.week_unix,
          dateOfInsertionUnix: doctorData.last_value.date_of_insertion_unix,
          dataSources: [text.bronnen.nivel],
        }}
        reference={text.reference}
      />

      <TwoKpiSection>
        <KpiTile
          title={text.kpi_titel}
          metadata={{
            date: doctorData.last_value.week_unix,
            source: text.bronnen.nivel,
          }}
        >
          <KpiValue absolute={total} data-cy="geschat_aantal" />
          <Text>{text.barscale_toelichting}</Text>
        </KpiTile>
        <KpiTile
          title={text.normalized_kpi_titel}
          metadata={{
            date: doctorData.last_value.week_unix,
            source: text.bronnen.nivel,
          }}
        >
          <KpiValue absolute={normalized} data-cy="incidentie" />
          <Text>{text.normalized_kpi_toelichting}</Text>
        </KpiTile>
      </TwoKpiSection>

      {doctorData && (
        <ChartTileWithTimeframe
          title={text.linechart_titel}
          metadata={{ source: text.bronnen.nivel }}
          timeframeOptions={['all', '5weeks']}
        >
          {(timeframe) => (
            <LineChartWithWeekTooltip
              title={text.linechart_titel}
              timeframe={timeframe}
              values={doctorData.values.map((value) => ({
                value: value.incidentie,
                date: value.week_unix,
                week: {
                  start: value.week_start_unix,
                  end: value.week_end_unix,
                },
              }))}
            />
          )}
        </ChartTileWithTimeframe>
      )}
    </>
  );
};

SuspectedPatients.getLayout = getNationalLayout;

export const getStaticProps = getNationalStaticProps;

export default SuspectedPatients;
