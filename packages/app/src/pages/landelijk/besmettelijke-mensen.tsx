import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { ChartTile } from '~/components/chart-tile';
import { colors, getLastFilledValue } from '@corona-dashboard/common';
import { createGetContent, getLastGeneratedDate, getLokalizeTexts, selectArchivedNlData } from '~/static-props/get-data';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { getArticleParts, getDataExplainedParts, getFaqParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { getPageInformationHeaderContent } from '~/utils/get-page-information-header-content';
import { GetStaticPropsContext } from 'next';
import { InView } from '~/components/in-view';
import { Languages, SiteText } from '~/locale';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { PageArticlesTile } from '~/components/articles/page-articles-tile';
import { PageFaqTile } from '~/components/page-faq-tile';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils';
import { WarningTile } from '~/components/warning-tile';
import { Ziektegolf } from '@corona-dashboard/icons';

const selectLokalizeTexts = (siteText: SiteText) => ({
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textNl: siteText.pages.infectious_people_page.nl,
  jsonText: siteText.common.common.metadata.metrics_json_links,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectArchivedNlData('infectious_people_archived_20210709'),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<PagePartQueryResult<ArticleParts>>(() => getPagePartsQuery('infectious_people_page'))(context);

    return {
      content: {
        articles: getArticleParts(content.pageParts, 'infectiousPeoplePageArticles'),
        faqs: getFaqParts(content.pageParts, 'infectiousPeoplePageFAQs'),
        dataExplained: getDataExplainedParts(content.pageParts, 'infectiousPeoplePageDataExplained'),
      },
    };
  }
);

const InfectiousPeople = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, selectedArchivedNlData: data, lastGenerated, content } = props;
  const { commonTexts } = useIntl();
  const { metadataTexts, textNl, jsonText } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

  const reverseRouter = useReverseRouter();

  const lastFullValue = getLastFilledValue(data.infectious_people_archived_20210709);

  const metadata = {
    ...metadataTexts,
    title: textNl.metadata.title,
    description: textNl.metadata.description,
  };

  const hasActiveWarningTile = !!textNl.belangrijk_bericht;

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.archived_metrics.title}
            screenReaderCategory={commonTexts.sidebar.metrics.infectious_people.title}
            title={textNl.title}
            icon={<Ziektegolf aria-hidden="true" />}
            description={textNl.toelichting_pagina}
            metadata={{
              datumsText: textNl.datums,
              dateOrRange: lastFullValue.date_unix,
              dateOfInsertionUnix: lastFullValue.date_of_insertion_unix,
              dataSources: [textNl.bronnen.rivm],
              jsonSources: [{ href: reverseRouter.json.archivedNational(), text: jsonText.metrics_archived_national_json.text }],
            }}
            pageInformationHeader={getPageInformationHeaderContent({
              dataExplained: content.dataExplained,
              faq: content.faqs,
            })}
          />

          {hasActiveWarningTile && <WarningTile isFullWidth message={textNl.belangrijk_bericht} variant="informational" />}

          <ChartTile metadata={{ source: textNl.bronnen.rivm }} title={textNl.linechart_titel} description={textNl.linechart_description}>
            <TimeSeriesChart
              accessibility={{
                key: 'infectious_people_over_time_chart',
              }}
              tooltipTitle={textNl.linechart_titel}
              values={data.infectious_people_archived_20210709.values}
              seriesConfig={[
                {
                  type: 'line',
                  metricProperty: 'estimate',
                  label: textNl.legenda_line,
                  shortLabel: textNl.line_legend_label,
                  color: colors.primary,
                },
                {
                  type: 'range',
                  metricPropertyLow: 'margin_low',
                  metricPropertyHigh: 'margin_high',
                  label: textNl.legenda_marge,
                  shortLabel: textNl.range_legend_label,
                  color: colors.blue2,
                },
              ]}
            />
          </ChartTile>

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

export default InfectiousPeople;
