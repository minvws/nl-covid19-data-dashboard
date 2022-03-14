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
import { Languages } from '~/locale';
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
  getLokalizeTexts,
} from '~/static-props/get-data';
import { ArticleParts, LinkParts, PagePartQueryResult } from '~/types/cms';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(
      (siteText) => ({
        textNl: siteText.pages.variantsPage.nl,
        textShared: siteText.pages.variantsPage.shared,
      }),
      locale
    ),
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
);

export default function CovidVariantenPage(
  props: StaticProps<typeof getStaticProps>
) {
  const {
    pageText,
    variantSidebarValue,
    lastGenerated,
    content,
    variantTable,
    variantChart,
    dates,
  } = props;

  const { siteText } = useIntl();
  const { textNl, textShared } = pageText;

  const metadata = {
    ...siteText.pages.topicalPage.nl.nationaal_metadata,
    title: textNl.metadata.title,
    description: textNl.metadata.description,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={siteText.nationaal_layout.headings.besmettingen}
            screenReaderCategory={siteText.sidebar.metrics.variants.title}
            title={textNl.titel}
            icon={<Varianten />}
            description={textNl.pagina_toelichting}
            metadata={{
              datumsText: textNl.datums,
              dateOrRange: {
                start: dates.date_start_unix,
                end: dates.date_end_unix,
              },
              dateOfInsertionUnix: dates.date_of_insertion_unix,
              dataSources: [textNl.bronnen.rivm],
            }}
            referenceLink={textNl.reference.href}
            pageLinks={content.links}
            articles={content.articles}
          />

          {variantSidebarValue?.sample_size && (
            <VariantsTableTile
              data={variantTable}
              sampleSize={variantSidebarValue.sample_size}
              text={textShared.varianten_tabel}
              source={textNl.bronnen.rivm}
              dates={{
                date_end_unix: dates.date_end_unix,
                date_of_insertion_unix: dates.date_of_insertion_unix,
                date_start_unix: dates.date_start_unix,
              }}
            />
          )}

          <VariantsStackedAreaTile
            text={textNl.varianten_over_tijd_grafiek}
            values={variantChart}
            metadata={{
              dataSources: [textNl.bronnen.rivm],
            }}
          />
        </TileList>
      </NlLayout>
    </Layout>
  );
}
