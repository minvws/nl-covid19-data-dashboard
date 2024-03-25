import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { createGetContent, getLastGeneratedDate, getLokalizeTexts, selectArchivedNlData } from '~/static-props/get-data';
import { ElementsQueryResult, getElementsQuery } from '~/queries/get-elements-query';
import { getArticleParts, getDataExplainedParts, getFaqParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { getLastFilledValue } from '@corona-dashboard/common';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { getPageInformationHeaderContent } from '~/utils/get-page-information-header-content';
import { GetStaticPropsContext } from 'next';
import { IllustrationTile } from '~/components/illustration-tile';
import { InView } from '~/components/in-view';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Languages, SiteText } from '~/locale';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { PageArticlesTile } from '~/components/articles/page-articles-tile';
import { PageFaqTile } from '~/components/page-faq-tile';
import { PageInformationBlock } from '~/components/page-information-block';
import { Reproductiegetal } from '@corona-dashboard/icons';
import { ReproductionChartTile } from '~/domain/tested/reproduction-chart-tile';
import { StaticProps, createGetStaticProps } from '~/static-props/create-get-static-props';
import { TileList } from '~/components/tile-list';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils';
import { WarningTile } from '~/components/warning-tile';

const pageMetrics = ['reproduction_archived_20230711'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textNl: siteText.pages.reproduction_page.nl,
  jsonText: siteText.common.common.metadata.metrics_json_links,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectArchivedNlData('reproduction_archived_20230711', 'difference.reproduction__index_average_archived_20230711'),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      const { locale } = context;
      return `{
      "parts": ${getPagePartsQuery('reproduction_page')},
      "elements": ${getElementsQuery('nl', ['reproduction_archived_20230711'], locale)}
     }`;
    })(context);

    return {
      content: {
        articles: getArticleParts(content.parts.pageParts, 'reproductionPageArticles'),
        faqs: getFaqParts(content.parts.pageParts, 'reproductionPageFAQs'),
        dataExplained: getDataExplainedParts(content.parts.pageParts, 'reproductionPageDataExplained'),
        elements: content.elements,
      },
    };
  }
);

const ReproductionIndex = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, selectedArchivedNlData: data, content, lastGenerated } = props;

  const reverseRouter = useReverseRouter();

  const reproductionLastValue = getLastFilledValue(data.reproduction_archived_20230711);
  const reproductionValues = data.reproduction_archived_20230711;

  const { commonTexts } = useIntl();
  const { metadataTexts, textNl, jsonText } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

  const metadata = {
    ...metadataTexts,
    title: textNl.metadata.title,
    description: textNl.metadata.description,
  };

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  const hasActiveWarningTile = !!textNl.belangrijk_bericht;

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.archived_metrics.title}
            screenReaderCategory={commonTexts.sidebar.metrics.reproduction_number.title}
            title={textNl.titel}
            icon={<Reproductiegetal aria-hidden="true" />}
            description={textNl.pagina_toelichting}
            metadata={{
              datumsText: textNl.datums,
              dateOrRange: reproductionLastValue.date_unix,
              dateOfInsertion: lastInsertionDateOfPage,
              dataSources: [textNl.bronnen.rivm],
              jsonSources: [{ href: reverseRouter.json.archivedNational(), text: jsonText.metrics_archived_national_json.text }],
            }}
            pageInformationHeader={getPageInformationHeaderContent({
              dataExplained: content.dataExplained,
              faq: content.faqs,
            })}
          />

          {hasActiveWarningTile && <WarningTile isFullWidth message={textNl.belangrijk_bericht} variant="informational" />}

          <TwoKpiSection hasBorder>
            <KpiTile
              title={textNl.barscale_titel}
              metadata={{
                timeframePeriod: reproductionLastValue.date_unix,
                dateOfInsertion: reproductionLastValue.date_of_insertion_unix,
                source: textNl.bronnen.rivm,
                isTimeframePeriodKpi: true,
                isArchived: true,
              }}
              hasNoBorder
              description={textNl.barscale_toelichting}
            >
              <KpiValue
                absolute={reproductionLastValue.index_average}
                differenceFractionDigits={2}
                difference={data.difference.reproduction__index_average_archived_20230711}
                showOldDateUnixForDifference
                isAmount
              />
            </KpiTile>

            <IllustrationTile image={'/images/reproductie-explainer.svg'} alt={textNl.reproductie_explainer_alt} description={textNl.extra_uitleg} hasNoBorder />
          </TwoKpiSection>

          <ReproductionChartTile data={reproductionValues} text={textNl} />

          {content.faqs && content.faqs.questions?.length > 0 && <PageFaqTile questions={content.faqs.questions} title={content.faqs.sectionTitle} />}

          {content.articles && content.articles.articles?.length > 0 && (
            <InView rootMargin="400px">
              <PageArticlesTile articles={content.articles.articles} title={content.articles.sectionTitle} />
            </InView>
          )}
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default ReproductionIndex;
