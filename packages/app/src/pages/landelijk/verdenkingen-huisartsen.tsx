import { colors, TimeframeOption } from '@corona-dashboard/common';
import { Arts } from '@corona-dashboard/icons';
import { ChartTile } from '~/components/chart-tile';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { WarningTile } from '~/components/warning-tile';
import { Text } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { getLastGeneratedDate, getLokalizeTexts, selectNlData } from '~/static-props/get-data';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';

const selectLokalizeTexts = (siteText: SiteText) => ({
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectNlData('difference.doctor__covid_symptoms_per_100k', 'difference.doctor__covid_symptoms', 'doctor')
);

const SuspectedPatients = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, selectedNlData: data, lastGenerated } = props;
  const lastValue = data.doctor.last_value;
  const { metadataTexts } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);
  const { commonTexts } = useIntl();
  const text = commonTexts.verdenkingen_huisartsen;

  const metadata = {
    ...metadataTexts,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  const hasActiveWarningTile = !!text.belangrijk_bericht;

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.archived_metrics.title}
            screenReaderCategory={commonTexts.sidebar.metrics.general_practitioner_suspicions.title}
            title={text.titel}
            icon={<Arts aria-hidden="true" />}
            description={text.pagina_toelichting}
            metadata={{
              datumsText: text.datums,
              dateOrRange: lastValue.date_end_unix,
              dateOfInsertionUnix: lastValue.date_of_insertion_unix,
              dataSources: [text.bronnen.nivel],
            }}
            referenceLink={text.reference.href}
          />

          {hasActiveWarningTile && <WarningTile isFullWidth message={text.belangrijk_bericht} variant="informational" />}

          <TwoKpiSection>
            <KpiTile
              title={text.kpi_titel}
              metadata={{
                date: [lastValue.date_start_unix, lastValue.date_end_unix],
                source: text.bronnen.nivel,
              }}
            >
              <KpiValue absolute={lastValue.covid_symptoms} data-cy="covid_symptoms" difference={data.difference.doctor__covid_symptoms} isAmount />
              <Markdown content={text.barscale_toelichting} />
            </KpiTile>
            <KpiTile
              title={text.normalized_kpi_titel}
              metadata={{
                date: [lastValue.date_start_unix, lastValue.date_end_unix],
                source: text.bronnen.nivel,
              }}
            >
              <KpiValue absolute={lastValue.covid_symptoms_per_100k} data-cy="covid_symptoms_per_100k" difference={data.difference.doctor__covid_symptoms_per_100k} isAmount />
              <Text>{text.normalized_kpi_toelichting}</Text>
            </KpiTile>
          </TwoKpiSection>

          <ChartTile title={text.linechart_titel} metadata={{ source: text.bronnen.nivel }} description={text.linechart_description}>
            <TimeSeriesChart
              accessibility={{
                key: 'doctor_covid_symptoms_over_time_chart',
              }}
              timeframe={TimeframeOption.ALL}
              values={data.doctor.values}
              seriesConfig={[
                {
                  type: 'area',
                  metricProperty: 'covid_symptoms_per_100k',
                  label: text.labels.covid_klachten,
                  color: colors.primary,
                },
              ]}
            />
          </ChartTile>
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default SuspectedPatients;
