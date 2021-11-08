import { Varianten } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import {
  getVariantChartData,
  getVariantSidebarValue,
  getVariantTableData,
} from '~/domain/variants/static-props';
import { VariantsStackedAreaTile } from '~/domain/variants/variants-stacked-area-tile';
import { VariantsTableTile } from '~/domain/variants/variants-table-tile';
import { useIntl } from '~/intl';
import { withFeatureNotFoundPage } from '~/lib/features';
import {
  getArticleParts,
  getLinkParts,
  getPagePartsQuery,
} from '~/queries/get-page-parts-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  selectNlData,
} from '~/static-props/get-data';
import { ArticleParts, LinkParts, PagePartQueryResult } from '~/types/cms';

export const getStaticProps = withFeatureNotFoundPage(
  'nlVariantsPage',
  createGetStaticProps(
    getLastGeneratedDate,
    () => {
      const data = selectNlData('variants', 'named_difference')();

      const {
        selectedNlData: { variants },
      } = data;

      return {
        variantSidebarValue: getVariantSidebarValue(variants) ?? null,
        ...getVariantTableData(variants, data.selectedNlData.named_difference),
        ...getVariantChartData(variants),
      };
    },
    async (context: GetStaticPropsContext) => {
      const { content } = await createGetContent<
        PagePartQueryResult<ArticleParts | LinkParts>
      >(() => getPagePartsQuery('variantsPage'))(context);

      return {
        content: {
          articles: getArticleParts(content.pageParts, 'variantsPageArticles'),
          links: getLinkParts(content.pageParts, 'variantsPageLinks'),
        },
      };
    }
  )
);

export default function CovidVariantenPage(
  props: StaticProps<typeof getStaticProps>
) {
  const {
    variantSidebarValue,
    lastGenerated,
    content,
    variantTable,
    variantChart,
    dates,
  } = props;

  const { siteText } = useIntl();

  const text = siteText.covid_varianten;
  const tableText = text.varianten_tabel;

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
            category={siteText.nationaal_layout.headings.besmettingen}
            screenReaderCategory={siteText.sidebar.metrics.variants.title}
            title={text.titel}
            icon={<Varianten />}
            description={text.pagina_toelichting}
            metadata={{
              datumsText: text.datums,
              dateOrRange: {
                start: dates.date_start_unix,
                end: dates.date_end_unix,
              },
              dateOfInsertionUnix: dates.date_of_insertion_unix,
              dataSources: [text.bronnen.rivm],
            }}
            referenceLink={text.reference.href}
            pageLinks={content.links}
            articles={content.articles}
          />

          {variantSidebarValue?.sample_size && (
            <VariantsTableTile
              data={variantTable}
              sampleSize={variantSidebarValue.sample_size}
              text={tableText}
              source={text.bronnen.rivm}
              dates={{
                date_end_unix: dates.date_end_unix,
                date_of_insertion_unix: dates.date_of_insertion_unix,
                date_start_unix: dates.date_start_unix,
              }}
            />
          )}

          <VariantsStackedAreaTile
            text={text.varianten_over_tijd_grafiek}
            values={variantChart}
            metadata={{
              dataSources: [text.bronnen.rivm],
            }}
          />
        </TileList>
      </NlLayout>
    </Layout>
  );
}
