import { colors, TimeframeOption } from '@corona-dashboard/common';
import { Arts } from '@corona-dashboard/icons';
import { ChartTile } from '~/components/chart-tile';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { WarningTile } from '~/components/warning-tile';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { getLastGeneratedDate, getLokalizeTexts, selectArchivedNlData } from '~/static-props/get-data';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';

const selectLokalizeTexts = (siteText: SiteText) => ({
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectArchivedNlData('doctor_archived_20210903')
);

const SuspectedPatients = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, selectedArchivedNlData: archivedData, lastGenerated } = props;
  const lastValue = archivedData.doctor_archived_20210903.last_value;
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

          <ChartTile title={text.linechart_titel} metadata={{ source: text.bronnen.nivel }} description={text.linechart_description}>
            <TimeSeriesChart
              accessibility={{
                key: 'doctor_covid_symptoms_over_time_chart',
              }}
              timeframe={TimeframeOption.ALL}
              values={archivedData.doctor_archived_20210903.values}
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
