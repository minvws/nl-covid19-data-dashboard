import { colors, TimeframeOption } from '@corona-dashboard/common';
import { Arts } from '@corona-dashboard/icons';
import { isPresent } from 'ts-is-present';
import { ChartTile } from '~/components/chart-tile';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Text } from '~/components/typography';
import { WarningTile } from '~/components/warning-tile';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import { getLastGeneratedDate, selectNlData } from '~/static-props/get-data';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectNlData(
    'difference.doctor__covid_symptoms_per_100k',
    'difference.doctor__covid_symptoms',
    'doctor'
  )
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
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={siteText.nationaal_layout.headings.archief}
            screenReaderCategory={
              siteText.sidebar.metrics.general_practitioner_suspicions.title
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

          {text.belangrijk_bericht && isPresent(text.belangrijk_bericht) && (
            <WarningTile
              isFullWidth
              message={text.belangrijk_bericht}
              variant="emphasis"
            />
          )}

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
                isAmount
              />
              <Markdown content={text.barscale_toelichting} />
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
                isAmount
              />
              <Text>{text.normalized_kpi_toelichting}</Text>
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            timeframeOptions={[TimeframeOption.ALL, TimeframeOption.FIVE_WEEKS]}
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
