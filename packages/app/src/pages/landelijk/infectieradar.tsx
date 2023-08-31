import { colors, TimeframeOption, TimeframeOptionsList } from '@corona-dashboard/common';
import { GgdTesten } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { useState } from 'react';
import { ChartTile } from '~/components/chart-tile';
import { InView } from '~/components/in-view';
import { PageArticlesTile } from '~/components/articles/page-articles-tile';
import { PageFaqTile } from '~/components/page-faq-tile';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { InfectionRadarSymptomsPerAgeGroup } from '~/domain/infection_radar/infection-radar-per-age-group';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import { ElementsQueryResult, getElementsQuery, getTimelineEvents } from '~/queries/get-elements-query';
import { getArticleParts, getDataExplainedParts, getFaqParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate, getLokalizeTexts, selectNlData } from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { getPageInformationHeaderContent } from '~/utils/get-page-information-header-content';

const pageMetrics = ['self_test_overall', 'infection_radar_symptoms_per_age_group'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textNl: siteText.pages.infectie_radar_page.nl,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectNlData('self_test_overall', 'infectionradar_symptoms_trend_per_age_group_weekly'),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      const { locale } = context;
      return `{
        "parts": ${getPagePartsQuery('infection_radar_page')},
        "elements": ${getElementsQuery('nl', ['self_test_overall', 'infectionradar_symptoms_trend_per_age_group_weekly'], locale)}
      }`;
    })(context);
    return {
      content: {
        articles: getArticleParts(content.parts.pageParts, 'infectionRadarPageArticles'),
        faqs: getFaqParts(content.parts.pageParts, 'infectionRadarPageFAQs'),
        dataExplained: getDataExplainedParts(content.parts.pageParts, 'infectionRadarPageDataExplained'),
        elements: content.elements,
      },
    };
  }
);

const InfectionRadar = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, selectedNlData: data, content, lastGenerated } = props;

  const [confirmedCasesSelfTestedTimeframe, setConfirmedCasesSelfTestedTimeframe] = useState<TimeframeOption>(TimeframeOption.SIX_MONTHS);

  const [confirmedCasesCovidSymptomsPerAgeTimeFrame, setConfirmedCasesCovidSymptomsPerAgeTimeFrame] = useState<TimeframeOption>(TimeframeOption.THREE_MONTHS);

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
            screenReaderCategory={commonTexts.sidebar.metrics.infection_radar.title}
            title={textNl.title}
            icon={<GgdTesten aria-hidden="true" />}
            description={textNl.description}
            metadata={{
              datumsText: textNl.dates,
              dateOrRange: {
                start: data.self_test_overall.last_value.date_start_unix,
                end: data.self_test_overall.last_value.date_end_unix,
              },
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [textNl.sources.rivm],
            }}
            pageInformationHeader={getPageInformationHeaderContent({
              dataExplained: content.dataExplained,
              faq: content.faqs,
            })}
          />

          <ChartTile
            title={textNl.chart_self_tests.title}
            description={textNl.chart_self_tests.description}
            metadata={{
              source: textNl.sources.self_test,
            }}
            timeframeOptions={TimeframeOptionsList}
            timeframeInitialValue={confirmedCasesSelfTestedTimeframe}
            onSelectTimeframe={setConfirmedCasesSelfTestedTimeframe}
          >
            <TimeSeriesChart
              accessibility={{
                key: 'confirmed_cases_self_tested_over_time_chart',
              }}
              values={data.self_test_overall.values}
              timeframe={confirmedCasesSelfTestedTimeframe}
              seriesConfig={[
                {
                  type: 'line',
                  metricProperty: 'infected_percentage',
                  label: textNl.chart_self_tests.tooltip_label,
                  color: colors.primary,
                },
              ]}
              dataOptions={{
                isPercentage: true,
                timelineEvents: getTimelineEvents(content.elements.timeSeries, 'self_test_overall'),
              }}
              forceLegend
            />
          </ChartTile>

          <ChartTile
            title={textNl.chart_infection_radar_age_groups.title}
            description={textNl.chart_infection_radar_age_groups.chart_description}
            timeframeOptions={TimeframeOptionsList}
            timeframeInitialValue={confirmedCasesCovidSymptomsPerAgeTimeFrame}
            metadata={{
              source: textNl.chart_infection_radar_age_groups.source.rivm,
            }}
            onSelectTimeframe={setConfirmedCasesCovidSymptomsPerAgeTimeFrame}
          >
            <InfectionRadarSymptomsPerAgeGroup
              accessibility={{
                key: 'reported_cases_covid_19_like_symptoms_time_chart',
              }}
              values={data.infectionradar_symptoms_trend_per_age_group_weekly.values}
              timeframe={confirmedCasesCovidSymptomsPerAgeTimeFrame}
              timelineEvents={getTimelineEvents(content.elements.timeSeries, 'infectionradar_symptoms_trend_per_age_group_weekly')}
              text={textNl}
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

export default InfectionRadar;
