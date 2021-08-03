import Varianten from '~/assets/varianten.svg';
import { ArticleSummary } from '~/components/article-teaser';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { VariantsStackedAreaTile } from '~/domain/international/variants-stacked-area-tile';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import {
  getVariantChartData,
  getVariantTableData,
} from '~/domain/variants/static-props';
import { VariantsTableTile } from '~/domain/variants/variants-table-tile';
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

export const getStaticProps = withFeatureNotFoundPage(
  'nlVariantsPage',
  createGetStaticProps(
    getLastGeneratedDate,
    () => {
      const data = selectNlPageMetricData('variants')();
      const variants = data.selectedNlData.variants;
      delete data.selectedNlData.variants;

      return {
        selectedNlData: data.selectedNlData,
        ...getVariantTableData(variants, data.selectedNlData.named_difference),
        ...getVariantChartData(variants),
      };
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
  const {
    selectedNlData,
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
      <NlLayout data={selectedNlData} lastGenerated={lastGenerated}>
        <TileList>
          <PageInformationBlock
            category={siteText.nationaal_layout.headings.besmettingen}
            screenReaderCategory={text.titel_sidebar}
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
            usefulLinks={content.page.pageLinks}
            articles={content.highlight.articles}
          />

          <VariantsTableTile
            data={variantTable}
            sampleSize={selectedNlData.variantSidebarValue.sample_size}
            text={tableText}
            source={text.bronnen.rivm}
            dates={{
              date_end_unix: dates.date_end_unix,
              date_of_insertion_unix: dates.date_of_insertion_unix,
              date_start_unix: dates.date_start_unix,
            }}
          />

          <VariantsStackedAreaTile
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
