import { ArticleParts, LinkParts, PagePartQueryResult } from '~/types/cms';
import { BorderedKpiSection } from '~/components/kpi/bordered-kpi-section';
import { createGetContent, getLastGeneratedDate, getLokalizeTexts, selectArchivedNlData, selectNlData } from '~/static-props/get-data';
import { getArchivedVariantChartData, getVariantBarChartData, getVariantOrderColors, getVariantOrders, getVariantTableData } from '~/domain/variants/data-selection';
import { getArticleParts, getDataExplainedParts, getFaqParts, getLinkParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { getPageInformationHeaderContent } from '~/utils/get-page-information-header-content';
import { GetStaticPropsContext } from 'next';
import { InView } from '~/components/in-view';
import { Languages, SiteText } from '~/locale';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { NlVariantsVariant } from '@corona-dashboard/common';
import { PageArticlesTile } from '~/components/articles/page-articles-tile';
import { PageFaqTile } from '~/components/page-faq-tile';
import { PageInformationBlock } from '~/components/page-information-block';
import { StaticProps, createGetStaticProps } from '~/static-props/create-get-static-props';
import { TileList } from '~/components/tile-list';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils';
import { useCallback, useState } from 'react';
import { VariantDynamicLabels } from '~/domain/variants/data-selection/types';
import { Varianten } from '@corona-dashboard/icons';
import { VariantsStackedAreaTile, VariantsStackedBarChartTile, VariantsTableTile } from '~/domain/variants';
import { DateRange } from '~/components/metadata';

const pageMetrics = ['variants', 'named_difference'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textNl: siteText.pages.variants_page.nl,
  jsonText: siteText.common.common.metadata.metrics_json_links,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  selectNlData('variants', 'named_difference'),
  selectArchivedNlData('variants_archived_20231101'),
  getLastGeneratedDate,
  () => {
    const data = selectNlData('variants', 'named_difference')();
    const archivedData = selectArchivedNlData('variants_archived_20231101')();

    const {
      selectedNlData: { variants },
    } = data;

    const {
      selectedArchivedNlData: { variants_archived_20231101 },
    } = archivedData;

    const variantColors = getVariantOrderColors(variants);

    const variantOrders = getVariantOrders(variants);

    return {
      ...getVariantTableData(variants, data.selectedNlData.named_difference, variantColors),
      ...getVariantBarChartData(variants),
      ...getArchivedVariantChartData(variants_archived_20231101),
      variantColors,
      variantOrders,
    };
  },
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<PagePartQueryResult<ArticleParts | LinkParts>>(() => getPagePartsQuery('variants_page'))(context);

    return {
      content: {
        articles: getArticleParts(content.pageParts, 'variantsPageArticles'),
        faqs: getFaqParts(content.pageParts, 'variantsPageFAQs'),
        dataExplained: getDataExplainedParts(content.pageParts, 'variantsPageDataExplained'),
        links: getLinkParts(content.pageParts, 'variantsPageLinks'),
      },
    };
  }
);

export default function CovidVariantenPage(props: StaticProps<typeof getStaticProps>) {
  const {
    pageText,
    selectedNlData: data,
    selectedArchivedNlData: archivedData,
    lastGenerated,
    content,
    variantTable,
    variantChart,
    archivedVariantChart,
    variantColors,
    variantOrders,
    dates,
  } = props;

  const reverseRouter = useReverseRouter();

  const { commonTexts, locale } = useIntl();
  const { metadataTexts, textNl, jsonText } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);
  const [isArchivedContentShown, setIsArchivedContentShown] = useState<boolean>(false);

  const [covidVariantsTimeframePeriod, setCovidVariantsTimeframePeriod] = useState<DateRange | undefined>({ start: 0, end: 0 });
  const archivedCovidVariantsTimeframePeriod = archivedVariantChart
    ? {
        start: archivedVariantChart[0].date_start_unix,
        end: archivedVariantChart[archivedVariantChart?.length - 1].date_end_unix,
      }
    : undefined;

  const handleSetCovidVariantsTimeframePeriod = useCallback((value: DateRange | undefined) => {
    setCovidVariantsTimeframePeriod(value);
  }, []);

  const metadata = {
    ...metadataTexts,
    title: textNl.metadata.title,
    description: textNl.metadata.description,
  };

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  const totalVariants = data.variants
    ? data.variants.values.reduce(
        (accumulator, currentVariant: NlVariantsVariant) =>
          currentVariant.last_value.occurrence > 0 && currentVariant.variant_code !== 'other_variants' ? 1 + accumulator : accumulator,
        0
      )
    : NaN;

  const sampleThresholdPassed = data.variants ? data.variants.values[0].last_value.sample_size > 0 : false; // Hack to set to 0 because we aim to match the variants page on RIVM.nl

  const variantLabels: VariantDynamicLabels = {};

  const variantenTableDescription = sampleThresholdPassed ? textNl.varianten_omschrijving : textNl.varianten_tabel.omschrijving_te_weinig_samples;

  data.variants?.values.forEach((variant) => {
    variantLabels[`${variant.variant_code}`] = locale === 'nl' ? variant.values[0].label_nl : variant.values[0].label_en;
  });

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
                start: data.variants.values[0].last_value.date_start_unix,
                end: data.variants.values[0].last_value.date_end_unix,
              },
              dateOfInsertion: lastInsertionDateOfPage,
              dataSources: [textNl.bronnen.rivm],
              jsonSources: [
                { href: reverseRouter.json.national(), text: jsonText.metrics_national_json.text },
                { href: reverseRouter.json.archivedNational(), text: jsonText.metrics_archived_national_json.text },
              ],
            }}
            pageLinks={content.links}
            pageInformationHeader={getPageInformationHeaderContent({
              dataExplained: content.dataExplained,
              faq: content.faqs,
            })}
          />

          <BorderedKpiSection
            title={textNl.kpi_amount_of_samples.kpi_tile_title}
            description={textNl.kpi_amount_of_samples.kpi_tile_description}
            source={textNl.bronnen.rivm}
            disclaimer={textNl.kpi_amount_of_samples.disclaimer}
            timeframePeriod={{
              start: data.variants.values[0].last_value.date_start_unix,
              end: data.variants.values[0].last_value.date_end_unix,
            }}
            dateOfInsertion={data.variants.values[0].last_value.date_of_insertion_unix}
            tilesData={[
              {
                value: data.variants ? data.variants.values[0].last_value.sample_size : null,
                title: textNl.kpi_amount_of_samples.tile_total_samples.title,
                description: textNl.kpi_amount_of_samples.tile_total_samples.description,
              },
              {
                value: totalVariants,
                title: textNl.kpi_amount_of_samples.tile_total_variants.title,
                description: textNl.kpi_amount_of_samples.tile_total_variants.description,
              },
            ]}
          />

          {variantChart && variantLabels && (
            <VariantsStackedBarChartTile
              title={textNl.varianten_barchart.titel}
              description={textNl.varianten_barchart.description}
              tooltipLabels={textNl.varianten_over_tijd_grafiek}
              values={variantChart}
              variantLabels={variantLabels}
              variantColors={variantColors}
              variantOrders={variantOrders}
              metadata={{
                datumsText: textNl.datums,
                source: textNl.bronnen.rivm,
                timeframePeriod: covidVariantsTimeframePeriod,
                dateOfInsertion: getLastInsertionDateOfPage(data, ['variants']),
              }}
              onHandleTimeframePeriodChange={handleSetCovidVariantsTimeframePeriod}
            />
          )}

          {variantLabels && (
            <VariantsTableTile
              data={variantTable}
              text={{ ...textNl.varianten_tabel, variantCodes: variantLabels, description: variantenTableDescription }}
              sampleThresholdPassed={sampleThresholdPassed}
              source={textNl.bronnen.rivm}
              dates={{
                date_end_unix: dates.date_end_unix,
                date_of_report_unix: getLastInsertionDateOfPage(data, ['variants']),
                date_start_unix: dates.date_start_unix,
              }}
            />
          )}

          {content.faqs && content.faqs.questions?.length > 0 && <PageFaqTile questions={content.faqs.questions} title={content.faqs.sectionTitle} />}

          {content.articles && content.articles.articles?.length > 0 && (
            <InView rootMargin="400px">
              <PageArticlesTile articles={content.articles.articles} title={content.articles.sectionTitle} />
            </InView>
          )}

          <PageInformationBlock
            title={textNl.section_archived.title}
            description={textNl.section_archived.description}
            isArchivedHidden={isArchivedContentShown}
            onToggleArchived={() => setIsArchivedContentShown(!isArchivedContentShown)}
          />

          {isArchivedContentShown && (
            <>
              {archivedVariantChart && variantLabels && (
                <VariantsStackedAreaTile
                  text={{ ...textNl.varianten_over_tijd_grafiek, variantCodes: variantLabels as VariantDynamicLabels }}
                  values={archivedVariantChart}
                  variantColors={variantColors}
                  metadata={{
                    datumsText: textNl.datums,
                    source: textNl.bronnen.rivm,
                    timeframePeriod: archivedCovidVariantsTimeframePeriod,
                    dateOfInsertion: archivedData.variants_archived_20231101.values[0].last_value.date_of_report_unix,
                    isArchived: true,
                  }}
                />
              )}
            </>
          )}
        </TileList>
      </NlLayout>
    </Layout>
  );
}
