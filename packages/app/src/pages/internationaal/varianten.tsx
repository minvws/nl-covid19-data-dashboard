import Getest from '~/assets/test.svg';
import { ArticleSummary } from '~/components/article-teaser';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { InternationalLayout } from '~/domain/layout/international-layout';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { LinkProps } from '~/types/cms';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<{
    page: {
      usefulLinks?: LinkProps[];
    };
    highlight: {
      articles?: ArticleSummary[];
    };
  }>(() => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return `{
        "page": *[_type=='in_variantsPage']{
          "usefulLinks": [...pageLinks[]{
            "title": title.${locale},
            "href": href,
          }]
        }[0],
        "highlight": ${createPageArticlesQuery('in_variantsPage', locale)}
    }`;
  })
);

export default function VariantenPage(
  props: StaticProps<typeof getStaticProps>
) {
  const { lastGenerated, content } = props;

  const intl = useIntl();
  const text = intl.siteText.internationaal_varianten;

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
              // @TODO use correct dates
              dateOrRange: { start: -999999999999, end: -99999999999 },
              dateOfInsertionUnix: -999999999999,

              datumsText: text.datums,
              dataSources: [text.bronnen.rivm],
            }}
            referenceLink={text.reference.href}
            articles={content.highlight?.articles}
            usefulLinks={content.page?.usefulLinks}
          />
        </TileList>
      </InternationalLayout>
    </Layout>
  );
}
