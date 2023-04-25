import { Varianten } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { getVariantChartData, getVariantOrderColors, getVariantTableData } from '~/domain/variants/static-props';
import { VariantsStackedAreaTile } from '~/domain/variants/variants-stacked-area-tile';
import { VariantsTableTile } from '~/domain/variants/variants-table-tile';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import { getArticleParts, getLinkParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate, selectNlData, getLokalizeTexts } from '~/static-props/get-data';
import { ArticleParts, LinkParts, PagePartQueryResult } from '~/types/cms';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';

const pageMetrics = ['variants', 'named_difference'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textNl: siteText.pages.variants_page.nl,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  selectNlData('variants', 'named_difference'),
  getLastGeneratedDate,
  () => {
    const data = selectNlData('variants', 'named_difference')();

    const {
      selectedNlData: { variants },
    } = data;

    const variantColors = getVariantOrderColors(variants);

    return {
      ...getVariantTableData(variants, data.selectedNlData.named_difference, variantColors),
      ...getVariantChartData(variants),
      variantColors,
    };
  },
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<PagePartQueryResult<ArticleParts | LinkParts>>(() => getPagePartsQuery('variants_page'))(context);

    return {
      content: {
        articles: getArticleParts(content.pageParts, 'variantsPageArticles'),
        links: getLinkParts(content.pageParts, 'variantsPageLinks'),
      },
    };
  }
);

export default function CovidVariantenPage(props: StaticProps<typeof getStaticProps>) {
  const { pageText, selectedNlData: data, lastGenerated, content, variantTable, variantChart, variantColors, dates } = props;

  const { commonTexts } = useIntl();
  const { metadataTexts, textNl } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

  const metadata = {
    ...metadataTexts,
    title: textNl.metadata.title,
    description: textNl.metadata.description,
  };

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.development_of_the_virus.title}
            screenReaderCategory={commonTexts.sidebar.metrics.variants.title}
            title={textNl.titel}
            icon={<Varianten aria-hidden="true" />}
            description={textNl.pagina_toelichting}
            metadata={{
              datumsText: textNl.datums,
              dateOrRange: {
                start: dates.date_start_unix,
                end: dates.date_end_unix,
              },
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [textNl.bronnen.rivm],
            }}
            referenceLink={textNl.reference.href}
            pageLinks={content.links}
            articles={content.articles}
          />

          {variantChart && (
            <VariantsStackedAreaTile
              text={{
                ...textNl.varianten_over_tijd_grafiek,
                variantCodes: commonTexts.variant_codes,
              }}
              values={variantChart}
              variantColors={variantColors}
              metadata={{
                datumsText: textNl.datums,
                date: getLastInsertionDateOfPage(data, ['variants']),
                source: textNl.bronnen.rivm,
              }}
            />
          )}

          <VariantsTableTile
            data={variantTable}
            text={{
              ...textNl.varianten_tabel,
              variantCodes: commonTexts.variant_codes,
              description: textNl.varianten_omschrijving,
            }}
            source={textNl.bronnen.rivm}
            dates={{
              date_end_unix: dates.date_end_unix,
              date_of_report_unix: dates.date_of_report_unix,
              date_start_unix: dates.date_start_unix,
            }}
          />
        </TileList>
      </NlLayout>
    </Layout>
  );
}
