import { assert } from '@corona-dashboard/common';
import GatheringsIcon from '~/assets/situations/gatherings.svg';
import { ArticleStrip } from '~/components/article-strip';
import { ArticleSummary } from '~/components/article-teaser';
import { ContentHeader } from '~/components/content-header';
import { TileList } from '~/components/tile-list';
import { Layout } from '~/domain/layout/layout';
import { NationalLayout } from '~/domain/layout/national-layout';
import { useIntl } from '~/intl';
import { withFeatureNotFoundPage } from '~/lib/features';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
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
      vr: ({ situations }) => ({ situations }),
    }),
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
  const { choropleth, selectedNlData: data, lastGenerated, content } = props;

  const intl = useIntl();

  const text = intl.siteText.brononderzoek;

  const metadata = {
    ...intl.siteText.nationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  assert(choropleth.vr.situations, 'no situations data found');

  const singleValue = choropleth.vr.situations[0];

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NationalLayout data={data} lastGenerated={lastGenerated}>
        <TileList>
          <ContentHeader
            category={intl.siteText.nationaal_layout.headings.besmettingen}
            screenReaderCategory={
              intl.siteText.positief_geteste_personen.titel_sidebar
            }
            title={text.titel}
            icon={<GatheringsIcon />}
            subtitle={text.pagina_toelichting}
            metadata={{
              datumsText: text.datums,
              dateOrRange: {
                start: singleValue.date_start_unix,
                end: singleValue.date_end_unix,
              },
              dateOfInsertionUnix: singleValue.date_of_insertion_unix,
              dataSources: [text.bronnen.rivm],
            }}
          />

          <ArticleStrip articles={content.articles} />
        </TileList>
      </NationalLayout>
    </Layout>
  );
}
