import { getLastFilledValue } from '@corona-dashboard/common';
import { Reproductiegetal } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { KpiWithIllustrationTile } from '~/components/kpi-with-illustration-tile';
import { Markdown } from '~/components/markdown';
import { PageInformationBlock } from '~/components/page-information-block';
import { PageKpi } from '~/components/page-kpi';
import { TileList } from '~/components/tile-list';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { ReproductionChartTile } from '~/domain/tested/reproduction-chart-tile';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import {
  ElementsQueryResult,
  getElementsQuery,
  getTimelineEvents,
} from '~/queries/get-elements-query';
import {
  getArticleParts,
  getPagePartsQuery,
} from '~/queries/get-page-parts-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  getLokalizeTexts,
  selectNlData,
} from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';

const pageMetrics = ['reproduction'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textNl: siteText.pages.reproduction_page.nl,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectNlData('reproduction', 'difference.reproduction__index_average'),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      const { locale } = context;
      return `{
      "parts": ${getPagePartsQuery('reproduction_page')},
      "elements": ${getElementsQuery('nl', ['reproduction'], locale)}
     }`;
    })(context);

    return {
      content: {
        articles: getArticleParts(
          content.parts.pageParts,
          'reproductionPageArticles'
        ),
        elements: content.elements,
      },
    };
  }
);

const ReproductionIndex = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, selectedNlData: data, content, lastGenerated } = props;

  const lastFilledValue = getLastFilledValue(data.reproduction);

  const { commonTexts } = useIntl();
  const { metadataTexts, textNl } = useDynamicLokalizeTexts<LokalizeTexts>(
    pageText,
    selectLokalizeTexts
  );

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
            category={
              commonTexts.sidebar.categories.development_of_the_virus.title
            }
            screenReaderCategory={
              commonTexts.sidebar.metrics.reproduction_number.title
            }
            title={textNl.titel}
            icon={<Reproductiegetal />}
            description={textNl.pagina_toelichting}
            metadata={{
              datumsText: textNl.datums,
              dateOrRange: lastFilledValue.date_unix,
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [textNl.bronnen.rivm],
            }}
            referenceLink={textNl.reference.href}
            articles={content.articles}
          />

          <TwoKpiSection>
            <KpiWithIllustrationTile
              title={textNl.barscale_titel}
              metadata={{
                date: lastFilledValue.date_unix,
                source: textNl.bronnen.rivm,
                obtainedAt: lastFilledValue.date_of_insertion_unix,
              }}
              illustration={{
                image: '/images/reproductie-explainer.svg',
                alt: textNl.reproductie_explainer_alt,
                description: textNl.extra_uitleg,
              }}
            >
              <PageKpi
                data={data}
                metricName="reproduction"
                metricProperty="index_average"
                differenceKey="reproduction__index_average"
                differenceFractionDigits={2}
                showOldDateUnix
                isAmount={false}
              />
              <Markdown content={textNl.barscale_toelichting} />
            </KpiWithIllustrationTile>
          </TwoKpiSection>

          <ReproductionChartTile
            data={data.reproduction}
            timelineEvents={getTimelineEvents(
              content.elements.timeSeries,
              'reproduction'
            )}
            text={textNl}
          />
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default ReproductionIndex;
