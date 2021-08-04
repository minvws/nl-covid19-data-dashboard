import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { SituationIcon } from '~/domain/situations/components/situation-icon';
import { SituationsDataCoverageChoroplethTile } from '~/domain/situations/situations-data-coverage-choropleth-tile';
import { SituationsOverviewChoroplethTile } from '~/domain/situations/situations-overview-choropleth-tile';
import { useIntl } from '~/intl';
import { withFeatureNotFoundPage } from '~/lib/features';
import {
  createPageArticlesQuery,
  PageArticlesQueryResult,
} from '~/queries/create-page-articles-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  selectNlPageMetricData,
} from '~/static-props/get-data';
export const getStaticProps = withFeatureNotFoundPage(
  'situationsPage',
  createGetStaticProps(
    getLastGeneratedDate,
    selectNlPageMetricData(),
    createGetChoroplethData({
      vr: ({ situations }) => ({
        situations,
      }),
    }),
    createGetContent<PageArticlesQueryResult>(() => {
      const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
      return createPageArticlesQuery('situationsPage', locale);
    })
  )
);

export default function BrononderzoekPage(
  props: StaticProps<typeof getStaticProps>
) {
  const { choropleth, selectedNlData: data, lastGenerated, content } = props;

  const intl = useIntl();

  const text = intl.siteText.brononderzoek;

  const metadata = {
    ...intl.siteText.nationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  const singleValue = choropleth.vr.situations[0];

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout data={data} lastGenerated={lastGenerated}>
        <TileList>
          <PageInformationBlock
            category={intl.siteText.nationaal_layout.headings.besmettingen}
            screenReaderCategory={
              intl.siteText.positief_geteste_personen.titel_sidebar
            }
            title={text.titel}
            icon={<SituationIcon id="gathering" />}
            description={text.pagina_toelichting}
            metadata={{
              datumsText: text.datums,
              dateOrRange: {
                start: singleValue.date_start_unix,
                end: singleValue.date_end_unix,
              },
              dateOfInsertionUnix: singleValue.date_of_insertion_unix,
              dataSources: [text.bronnen.rivm],
            }}
            referenceLink={text.reference.href}
            articles={content.articles}
          />

          <SituationsDataCoverageChoroplethTile data={choropleth.vr} />

          <SituationsOverviewChoroplethTile data={choropleth.vr.situations} />
        </TileList>
      </NlLayout>
    </Layout>
  );
}
