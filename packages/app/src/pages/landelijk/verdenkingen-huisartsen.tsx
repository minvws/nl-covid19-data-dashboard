import Arts from '~/assets/arts.svg';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { SEOHead } from '~/components-styled/seo-head';
import { FCWithLayout } from '~/domain/layout/layout';
import { getNationalLayout } from '~/domain/layout/national-layout';
import siteText from '~/locale/index';
import { getNlData, getLastGeneratedDate } from '~/static-props/get-data';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import { LineChartTile } from '~/components-styled/line-chart-tile';

const text = siteText.verdenkingen_huisartsen;
const graphDescriptions = siteText.accessibility.grafieken;

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getNlData
);

const SuspectedPatients: FCWithLayout<typeof getStaticProps> = (props) => {
  const { data } = props;
  const lastValue = data.doctor.last_value;

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <TileList>
        <ContentHeader
          category={siteText.nationaal_layout.headings.vroege_signalen}
          screenReaderCategory={siteText.verdenkingen_huisartsen.titel_sidebar}
          title={text.titel}
          icon={<Arts />}
          subtitle={text.pagina_toelichting}
          metadata={{
            datumsText: text.datums,
            dateOrRange: lastValue.date_end_unix,
            dateOfInsertionUnix: lastValue.date_of_insertion_unix,
            dataSources: [text.bronnen.nivel],
          }}
          reference={text.reference}
        />

        <TwoKpiSection>
          <KpiTile
            title={text.kpi_titel}
            metadata={{
              date: [lastValue.date_start_unix, lastValue.date_end_unix],
              source: text.bronnen.nivel,
            }}
          >
            <KpiValue
              absolute={lastValue.covid_symptoms}
              data-cy="covid_symptoms"
              difference={data.difference.doctor__covid_symptoms}
            />
            <Text>{text.barscale_toelichting}</Text>
          </KpiTile>
          <KpiTile
            title={text.normalized_kpi_titel}
            metadata={{
              date: [lastValue.date_start_unix, lastValue.date_end_unix],
              source: text.bronnen.nivel,
            }}
          >
            <KpiValue
              absolute={lastValue.covid_symptoms_per_100k}
              data-cy="covid_symptoms_per_100k"
              difference={data.difference.doctor__covid_symptoms_per_100k}
            />
            <Text>{text.normalized_kpi_toelichting}</Text>
          </KpiTile>
        </TwoKpiSection>

        <LineChartTile
          timeframeOptions={['all', '5weeks']}
          title={text.linechart_titel}
          values={data.doctor.values}
          ariaDescription={graphDescriptions.verdenkingen_huisartsen}
          linesConfig={[
            {
              metricProperty: 'covid_symptoms_per_100k',
            },
          ]}
          metadata={{ source: text.bronnen.nivel }}
        />
      </TileList>
    </>
  );
};

SuspectedPatients.getLayout = getNationalLayout;

export default SuspectedPatients;
