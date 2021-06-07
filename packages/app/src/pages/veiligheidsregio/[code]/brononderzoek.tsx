import { ArticleStrip } from '~/components/article-strip';
import { ArticleSummary } from '~/components/article-teaser';
import { ChartTile } from '~/components/chart-tile';
import { ContentHeader } from '~/components/content-header';
import { TileList } from '~/components/tile-list';
import { Layout } from '~/domain/layout/layout';
import { SafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import { SituationIcon } from '~/domain/situations/components/situation-icon';
import { SituationsOverTimeChart } from '~/domain/situations/situations-over-time-chart';
import { useIntl } from '~/intl';
import { withFeatureNotFoundPage } from '~/lib/features';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  selectVrPageMetricData,
} from '~/static-props/get-data';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { SituationsTableTile } from '~/domain/situations/situations-table-tile';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = withFeatureNotFoundPage(
  'situationsPage',
  createGetStaticProps(
    getLastGeneratedDate,
    selectVrPageMetricData('situations'),
    createGetContent<{
      articles?: ArticleSummary[];
    }>((_context) => {
      const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
      return createPageArticlesQuery('situationsPage', locale);
    })
  )
);

export default function BrononderzoekPage(
  props: StaticProps<typeof getStaticProps>
) {
  const {
    selectedVrData: data,
    lastGenerated,
    content,
    safetyRegionName,
  } = props;

  const intl = useIntl();

  const text = intl.siteText.brononderzoek;

  const metadata = {
    ...intl.siteText.nationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  const values = data.situations.values;
  const lastValue = data.situations.last_value;

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <SafetyRegionLayout
        data={data}
        safetyRegionName={safetyRegionName}
        lastGenerated={lastGenerated}
      >
        <TileList>
          <ContentHeader
            category={intl.siteText.nationaal_layout.headings.besmettingen}
            screenReaderCategory={
              intl.siteText.positief_geteste_personen.titel_sidebar
            }
            title={replaceVariablesInText(
              intl.siteText.common.subject_in_location,
              {
                subject: text.titel,
                location: safetyRegionName,
              }
            )}
            icon={<SituationIcon id="gathering" />}
            subtitle={text.pagina_toelichting}
            metadata={{
              datumsText: text.datums,
              dateOrRange: {
                start: lastValue.date_start_unix,
                end: lastValue.date_end_unix,
              },
              dateOfInsertionUnix: lastValue.date_of_insertion_unix,
              dataSources: [text.bronnen.rivm],
            }}
          />

          <ArticleStrip articles={content.articles} />

          <SituationsTableTile
            data={lastValue}
            metadata={{
              date: [lastValue.date_start_unix, lastValue.date_end_unix],
              source: text.bronnen.rivm,
            }}
          />

          {values && (
            <ChartTile
              title={text.situaties_over_tijd_grafiek.titel}
              description={text.situaties_over_tijd_grafiek.omschrijving}
              timeframeOptions={['all', '5weeks']}
              metadata={{ source: text.bronnen.rivm }}
            >
              {(timeframe) => (
                <SituationsOverTimeChart
                  timeframe={timeframe}
                  values={values}
                />
              )}
            </ChartTile>
          )}
        </TileList>
      </SafetyRegionLayout>
    </Layout>
  );
}
