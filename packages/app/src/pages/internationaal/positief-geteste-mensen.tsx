import Getest from '~/assets/test.svg';
import { ArticleSummary } from '~/components/article-teaser';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { InternationalLayout } from '~/domain/layout/international-layout';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import { getInPositiveTestsQuery } from '~/queries/in-positive-tests-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { InPositiveTestsQuery } from '~/types/cms';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<{
    page: InPositiveTestsQuery;
    highlight: {
      articles?: ArticleSummary[];
    };
  }>(() => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return `{
    "page": ${getInPositiveTestsQuery()},
    "highlight": ${createPageArticlesQuery('in_positiveTestsPage', locale)}
  }`;
  })
);

export default function PositiefGetesteMensenPage(
  props: StaticProps<typeof getStaticProps>
) {
  const { lastGenerated, content } = props;

  const intl = useIntl();
  const text = intl.siteText.internationaal_positief_geteste_personen;

  const metadata = {
    ...intl.siteText.internationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <InternationalLayout lastGenerated={lastGenerated}>
        <TileList>
          <PageInformationBlock
            title={text.titel}
            icon={<Getest />}
            description={text.pagina_toelichting}
            metadata={{
              datumsText: text.datums,
              dateOrRange: 0, // @TODO date
              dateOfInsertionUnix: 0, // @TODO date
              dataSources: [
                text.bronnen.rivm,
                text.bronnen.our_world_in_data,
                text.bronnen.ecdc,
              ],
            }}
            referenceLink={text.reference.href}
            articles={content.highlight.articles}
            usefulLinks={content.page.usefulLinks}
          />
        </TileList>
      </InternationalLayout>
    </Layout>
  );
}
