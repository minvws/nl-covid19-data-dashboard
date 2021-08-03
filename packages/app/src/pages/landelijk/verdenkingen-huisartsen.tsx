import Arts from '~/assets/arts.svg';
import { ChartTile } from '~/components/chart-tile';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Text } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  getLastGeneratedDate,
  selectNlPageMetricData,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectNlPageMetricData()
);

const SuspectedPatients = (props: StaticProps<typeof getStaticProps>) => {
  const { selectedNlData: data, lastGenerated } = props;
  const lastValue = data.doctor.last_value;

  const { siteText } = useIntl();
  const text = siteText.verdenkingen_huisartsen;

  const metadata = {
    ...siteText.nationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout data={data} lastGenerated={lastGenerated}>
        <TileList>
          <PageInformationBlock
            category={siteText.nationaal_layout.headings.vroege_signalen}
            screenReaderCategory={
              siteText.verdenkingen_huisartsen.titel_sidebar
            }
            title={text.titel}
            icon={<Arts />}
            description={text.pagina_toelichting}
            metadata={{
              datumsText: text.datums,
              dateOrRange: lastValue.date_end_unix,
              dateOfInsertionUnix: lastValue.date_of_insertion_unix,
              dataSources: [text.bronnen.nivel],
            }}
            referenceLink={text.reference.href}
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

          <ChartTile
            timeframeOptions={['all', '5weeks']}
            title={text.linechart_titel}
            metadata={{ source: text.bronnen.nivel }}
            description={text.linechart_description}
          >
            {(timeframe) => (
              <TimeSeriesChart
                accessibility={{
                  key: 'doctor_covid_symptoms_over_time_chart',
                }}
                timeframe={timeframe}
                values={data.doctor.values}
                seriesConfig={[
                  {
                    type: 'area',
                    metricProperty: 'covid_symptoms_per_100k',
                    label: text.tooltip_labels.covid_klachten,
                    color: colors.data.primary,
                  },
                ]}
              />
            )}
          </ChartTile>
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default SuspectedPatients;
