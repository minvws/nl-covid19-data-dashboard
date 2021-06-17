import css from '@styled-system/css';
import styled from 'styled-components';
import Varianten from '~/assets/varianten.svg';
import { ArticleStripItem } from '~/components/article-strip';
import { ArticleSummary } from '~/components/article-teaser';
import { Box } from '~/components/base';
import { ContentHeader } from '~/components/content-header';
import { CompactDecoratedLink } from '~/components/decorated-link';
import { Tile } from '~/components/tile';
import { TileList } from '~/components/tile-list';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Heading } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { NationalLayout } from '~/domain/layout/national-layout';
import { mockVariantsData } from '~/domain/variants/logic/mock-data';
import { useIntl } from '~/intl';
import { withFeatureNotFoundPage } from '~/lib/features';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import { getVaccinePageQuery } from '~/queries/variants-page-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  selectNlPageMetricData,
} from '~/static-props/get-data';
import { VariantsPageQuery } from '~/types/cms';
import { assert } from '~/utils/assert';

export const getStaticProps = withFeatureNotFoundPage(
  'variantsPage',
  createGetStaticProps(
    getLastGeneratedDate,
    () => {
      const data = selectNlPageMetricData('variants')();
      data.selectedNlData.variants =
        data.selectedNlData.variants || mockVariantsData();

      return data;
    },
    createGetContent<{
      page: VariantsPageQuery;
      highlight: {
        articles?: ArticleSummary[];
      };
    }>(() => {
      const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
      return `{
        "page": ${getVaccinePageQuery()},
        "highlight": ${createPageArticlesQuery('variantsPage', locale)}
      }`;
    })
  )
);

export default function CovidVariantenPage(
  props: StaticProps<typeof getStaticProps>
) {
  const { selectedNlData: data, lastGenerated, content } = props;

  const { siteText } = useIntl();

  const text = siteText.covid_varianten;

  const metadata = {
    ...siteText.nationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  assert(data.variants, 'no variants data found');

  const lastValue = data.variants.last_value;

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NationalLayout data={data} lastGenerated={lastGenerated}>
        <TileList>
          <ContentHeader
            category={siteText.nationaal_layout.headings.besmettingen}
            screenReaderCategory={text.titel_sidebar}
            title={text.titel}
            icon={<Varianten />}
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

          <TwoKpiSection>
            {content.highlight.articles && (
              <Box>
                <Heading level={3}>
                  {text.informatie_blok.artikelen_titel}
                </Heading>
                <Tile>
                  <Box spacing={3}>
                    {content.highlight.articles.map((article, index) => (
                      <ArticleStripItem
                        key={index}
                        title={article.title}
                        cover={article.cover}
                        slug={article.slug.current}
                      />
                    ))}
                  </Box>
                </Tile>
              </Box>
            )}

            {content.page.pageLinks.length > 0 && (
              <Box>
                <Heading level={3}>
                  {text.informatie_blok.nuttige_links_titel}
                </Heading>
                <DecoratedLinksTile>
                  {content.page.pageLinks.map((x, index) => (
                    <CompactDecoratedLink
                      key={index}
                      title={x.title}
                      href={x.href}
                      isFirst={index === 0}
                    />
                  ))}
                </DecoratedLinksTile>
              </Box>
            )}
          </TwoKpiSection>
        </TileList>
      </NationalLayout>
    </Layout>
  );
}

const DecoratedLinksTile = styled.article(
  css({
    display: 'flex',
    flexDirection: 'column',
    bg: 'white',
    p: 0,
    borderRadius: 1,
    boxShadow: 'tile',
  })
);
