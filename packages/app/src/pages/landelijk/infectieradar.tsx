import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { ChartTile } from '~/components/chart-tile';
import { colors, TimeframeOption, TimeframeOptionsList } from '@corona-dashboard/common';
import { createGetContent, getLastGeneratedDate, getLokalizeTexts, selectNlData } from '~/static-props/get-data';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { DateRange } from '~/components/metadata';
import { ElementsQueryResult, getElementsQuery, getTimelineEvents } from '~/queries/get-elements-query';
import { getArticleParts, getDataExplainedParts, getFaqParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { getPageInformationHeaderContent } from '~/utils/get-page-information-header-content';
import { GetStaticPropsContext } from 'next';
import { GgdTesten } from '@corona-dashboard/icons';
import { InfectionRadarSymptomsPerAgeGroup } from '~/domain/infection_radar/infection-radar-per-age-group';
import { InView } from '~/components/in-view';
import { KpiTile, KpiValue, TwoKpiSection } from '~/components';
import { Languages, SiteText } from '~/locale';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { PageArticlesTile } from '~/components/articles/page-articles-tile';
import { PageFaqTile } from '~/components/page-faq-tile';
import { PageInformationBlock } from '~/components/page-information-block';
import { replaceVariablesInText, useReverseRouter } from '~/utils';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { useCallback, useState } from 'react';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { useIntl } from '~/intl';

const pageMetrics = ['self_test_overall', 'infectionradar_symptoms_trend_per_age_group_weekly'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textNl: siteText.pages.infectie_radar_page.nl,
  jsonText: siteText.common.common.metadata.metrics_json_links,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectNlData('difference.self_test_overall', 'self_test_overall', 'infectionradar_symptoms_trend_per_age_group_weekly'),
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

  const reverseRouter = useReverseRouter();

  const [confirmedCasesSelfTestedTimeframe, setConfirmedCasesSelfTestedTimeframe] = useState<TimeframeOption>(TimeframeOption.SIX_MONTHS);
  const [confirmedCasesSelfTestedTimeframePeriod, setConfirmedCasesSelfTestedTimeframePeriod] = useState<DateRange | undefined>({ start: 0, end: 0 });

  const [confirmedCasesCovidSymptomsPerAgeTimeFrame, setConfirmedCasesCovidSymptomsPerAgeTimeFrame] = useState<TimeframeOption>(TimeframeOption.THREE_MONTHS);
  const [confirmedCasesCovidSymptomsPerAgeTimeframePeriod, setConfirmedCasesCovidSymptomsPerAgeTimeframePeriod] = useState<DateRange | undefined>({ start: 0, end: 0 });

  const { commonTexts } = useIntl();

  const { metadataTexts, textNl, jsonText } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

  const totalInfectedPercentage = data.self_test_overall.last_value.infected_percentage ? data.self_test_overall.last_value.infected_percentage : 0;

  const metadata = {
    ...metadataTexts,
    title: textNl.metadata.title,
    description: textNl.metadata.description,
  };

  const handleSetConfirmedCasesSelfTestedTimeframePeriodChange = useCallback((value: DateRange | undefined) => {
    setConfirmedCasesSelfTestedTimeframePeriod(value);
  }, []);

  const handleSetConfirmedCasesCovidSymptomsPerAgeTimeframePeriod = useCallback((value: DateRange | undefined) => {
    setConfirmedCasesCovidSymptomsPerAgeTimeframePeriod(value);
  }, []);

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);
  const lastInsertionDateConfirmedCasesCovidSymptomsPerAgeTimeframePeriod = getLastInsertionDateOfPage(data, ['infectionradar_symptoms_trend_per_age_group_weekly']);

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
              dateOfInsertion: lastInsertionDateOfPage,
              dataSources: [textNl.sources.rivm],
              jsonSources: [{ href: reverseRouter.json.national(), text: jsonText.metrics_national_json.text }],
            }}
            pageInformationHeader={getPageInformationHeaderContent({
              dataExplained: content.dataExplained,
              faq: content.faqs,
            })}
          />

          <TwoKpiSection>
            <KpiTile
              title={textNl.kpi_tile.infected_participants_percentage.title}
              metadata={{
                timeframePeriod: { start: data.self_test_overall.last_value.date_start_unix, end: data.self_test_overall.last_value.date_end_unix },
                dateOfInsertion: data.self_test_overall.last_value.date_of_insertion_unix,
                source: textNl.sources.self_test,
                isTimeframePeriodKpi: true,
              }}
              description={replaceVariablesInText(textNl.kpi_tile.infected_participants_percentage.description, {
                infectedPercentage: totalInfectedPercentage,
              })}
            >
              <KpiValue percentage={data.self_test_overall.last_value.infected_percentage} differenceFractionDigits={1} difference={data.difference.self_test_overall} isAmount />
            </KpiTile>
            <KpiTile
              title={textNl.kpi_tile.total_participants.title}
              metadata={{
                timeframePeriod: { start: data.self_test_overall.last_value.date_start_unix, end: data.self_test_overall.last_value.date_end_unix },
                dateOfInsertion: data.self_test_overall.last_value.date_of_insertion_unix,
                source: textNl.sources.self_test,
                isTimeframePeriodKpi: true,
              }}
              description={textNl.kpi_tile.total_participants.description}
            >
              <KpiValue absolute={data.self_test_overall.last_value.n_participants_total_unfiltered} numFractionDigits={0} isAmount />
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            title={textNl.chart_self_tests.title}
            description={textNl.chart_self_tests.description}
            metadata={{
              source: textNl.sources.self_test,
              timeframePeriod: confirmedCasesSelfTestedTimeframePeriod,
              dateOfInsertion: getLastInsertionDateOfPage(data, ['self_test_overall']),
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
              onHandleTimeframePeriodChange={handleSetConfirmedCasesSelfTestedTimeframePeriodChange}
            />
          </ChartTile>

          <ChartTile
            title={textNl.chart_infection_radar_age_groups.title}
            description={textNl.chart_infection_radar_age_groups.chart_description}
            timeframeOptions={TimeframeOptionsList}
            timeframeInitialValue={confirmedCasesCovidSymptomsPerAgeTimeFrame}
            metadata={{
              source: textNl.chart_infection_radar_age_groups.source.rivm,
              timeframePeriod: confirmedCasesCovidSymptomsPerAgeTimeframePeriod,
              dateOfInsertion: lastInsertionDateConfirmedCasesCovidSymptomsPerAgeTimeframePeriod,
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
              onHandleTimeframePeriodChange={handleSetConfirmedCasesCovidSymptomsPerAgeTimeframePeriod}
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
