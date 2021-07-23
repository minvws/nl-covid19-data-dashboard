import Varianten from '~/assets/varianten.svg';
import { ArticleSummary } from '~/components/article-teaser';
import { ChartTile } from '~/components/chart-tile';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { Layout } from '~/domain/layout/layout';
import { NationalLayout } from '~/domain/layout/national-layout';
import { VariantsOverTime } from '~/domain/variants/variants-over-time';
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
  getLocaleFile,
  selectNlPageMetricData,
} from '~/static-props/get-data';
import {
  getSeriesConfig,
  getVariantChartData,
} from '~/static-props/variants/get-variant-chart-data';
import { getVariantTableData } from '~/static-props/variants/get-variant-table-data';
import { colors } from '~/style/theme';
import { VariantsPageQuery } from '~/types/cms';

export const getStaticProps = withFeatureNotFoundPage(
  'nlVariantsPage',
  createGetStaticProps(
    getLastGeneratedDate,
    () => {
      const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
      const siteText = getLocaleFile(locale);
      const data = selectNlPageMetricData('variants')();
      const variants = data.selectedNlData.variants;
      delete data.selectedNlData.variants;

      const chartData = getVariantChartData(variants);

      return {
        selectedNlData: data.selectedNlData,
        ...getVariantTableData(
          variants,
          data.selectedNlData.named_difference,
          siteText.covid_varianten.landen_van_herkomst
        ),
        ...chartData,
        ...getSeriesConfig(
          chartData?.variantChart?.[0],
          siteText.covid_varianten.varianten,
          colors.data.variants
        ),
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
    seriesConfig,
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
      <NationalLayout data={selectedNlData} lastGenerated={lastGenerated}>
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

          {variantChart && seriesConfig && (
            <ChartTile
              title={text.varianten_over_tijd.titel}
              description={text.varianten_over_tijd.beschrijving}
              timeframeOptions={['all', '5weeks']}
              metadata={{
                source: text.bronnen.rivm,
              }}
            >
              {(timeframe) => (
                <VariantsOverTime
                  values={variantChart}
                  seriesConfig={seriesConfig}
                  timeframe={timeframe}
                />
              )}
            </ChartTile>
          )}
        </TileList>
      </NationalLayout>
    </Layout>
  );
}
