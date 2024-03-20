import {
  colors,
  ArchivedGmCollectionHospitalNiceChoropleth,
  TimeframeOption,
  TimeframeOptionsList,
  ArchivedGmCollectionHospitalNiceChoroplethWeeklyAdmissions,
} from '@corona-dashboard/common';
import { AdmissionsPerAgeGroup } from '~/domain/hospital/admissions-per-age-group/admissions-per-age-group';
import { ArticleParts, LinkParts, PagePartQueryResult } from '~/types/cms';
import { Box } from '~/components/base/box';
import { ChartTile } from '~/components/chart-tile';
import { ChartTileToggleItem } from '~/components/chart-tile-toggle';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { countTrailingNullValues, getBoundaryDateStartUnix, useReverseRouter } from '~/utils';
import { createGetArchivedChoroplethData, createGetContent, getLastGeneratedDate, getLokalizeTexts, selectNlData } from '~/static-props/get-data';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { DynamicChoropleth } from '~/components/choropleth';
import { ElementsQueryResult, getElementsQuery, getTimelineEvents } from '~/queries/get-elements-query';
import { getArticleParts, getDataExplainedParts, getFaqParts, getLinkParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { getPageInformationHeaderContent } from '~/utils/get-page-information-header-content';
import { GetStaticPropsContext } from 'next';
import { InView } from '~/components/in-view';
import { Languages, SiteText } from '~/locale';
import { Layout, NlLayout } from '~/domain/layout';
import { PageArticlesTile } from '~/components/articles/page-articles-tile';
import { PageFaqTile } from '~/components/page-faq-tile';
import { PageInformationBlock } from '~/components/page-information-block';
import { SEOHead } from '~/components/seo-head';
import { space } from '~/style/theme';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { useIntl } from '~/intl';
import { useCallback, useState } from 'react';
import { Ziekenhuis } from '@corona-dashboard/icons';
import { DateRange } from '~/components/metadata';

const pageMetrics = ['hospital_nice_per_age_group', 'intensive_care_nice_per_age_group', 'hospital_nice', 'intensive_care_nice'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textNl: siteText.pages.patients_page.nl,
  jsonText: siteText.common.common.metadata.metrics_json_links,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectNlData('hospital_nice_per_age_group', 'intensive_care_nice_per_age_group', 'hospital_nice', 'intensive_care_nice'),
  createGetArchivedChoroplethData({
    gm: ({ hospital_nice_choropleth_archived_20230830, hospital_nice_choropleth_archived_20240228 }) => ({
      hospital_nice_choropleth_archived_20230830,
      hospital_nice_choropleth_archived_20240228,
    }),
  }),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts | LinkParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      return `{
            "parts": ${getPagePartsQuery('patients_page')},
            "elements": ${getElementsQuery('nl', ['hospital_nice', 'intensive_care_nice_per_age_group', 'hospital_nice_per_age_group', 'intensive_care_nice'], context.locale)}
          }`;
    })(context);

    return {
      content: {
        articles: getArticleParts(content.parts.pageParts, 'patientsPageArticles'),
        faqs: getFaqParts(content.parts.pageParts, 'patientsPageFAQs'),
        dataExplained: getDataExplainedParts(content.parts.pageParts, 'patientsPageDataExplained'),
        links: getLinkParts(content.parts.pageParts, 'patientsPageLinks'),
        elements: content.elements,
      },
    };
  }
);

const PatientsPage = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, selectedNlData: data, archivedChoropleth, content, lastGenerated } = props;
  const { commonTexts } = useIntl();
  const { metadataTexts, textNl, jsonText } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

  const [selectedAdmissionsPerAgeGroupOverTimeChart, setSelectedAdmissionsPerAgeGroupOverTimeChart] = useState<string>('admissions_per_age_group_over_time_hospital');
  const [hospitalAdmissionsPerAgeGroupOverTimeTimeframe, setHospitalAdmissionsPerAgeGroupOverTimeTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);
  const [intensiveCareAdmissionsPerAgeGroupOverTimeTimeframe, setIntensiveCareAdmissionsPerAgeGroupOverTimeTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const [hospitalAdmissionsPerAgeGroupOverTimetimeframePeriod, setHospitalAdmissionsPerAgeGroupOverTimetimeframePeriod] = useState<DateRange | undefined>({ start: 0, end: 0 });
  const [intensiveCareAdmissionsPerAgeGroupOverTimetimeframePeriod, setIntensiveCareAdmissionsPerAgeGroupOverTimetimeframePeriod] = useState<DateRange | undefined>({
    start: 0,
    end: 0,
  });

  const [isArchivedContentShown, setIsArchivedContentShown] = useState<boolean>(false);

  const admissionsPerAgeGroupOverTimeToggleItems: ChartTileToggleItem[] = [
    {
      label: textNl.hospitals.admissions_per_age_group_chart.toggle_label,
      value: 'admissions_per_age_group_over_time_hospital',
    },
    {
      label: textNl.icu.admissions_per_age_group_chart.toggle_label,
      value: 'admissions_per_age_group_over_time_icu',
    },
  ];

  const [selectedAdmissionsOverTimeChart, setSelectedAdmissionsOverTimeChart] = useState<string>('admissions_over_time_hospital');
  const [hospitalAdmissionsOverTimeTimeframe, setHospitalAdmissionsOverTimeTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);
  const [intensiveCareAdmissionsOverTimeTimeframe, setIntensiveCareAdmissionsOverTimeTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const [hospitalAdmissionsOverTimetimeframePeriod, setHospitalAdmissionsOverTimetimeframePeriod] = useState<DateRange | undefined>({ start: 0, end: 0 });
  const [intensiveCareAdmissionsOverTimetimeframePeriod, setIntensiveCareAdmissionsOverTimetimeframePeriod] = useState<DateRange | undefined>({ start: 0, end: 0 });

  const handleHospitalAdmissionsPerAgeGroupOverTimetimeframePeriod = useCallback((value: DateRange | undefined) => {
    setHospitalAdmissionsPerAgeGroupOverTimetimeframePeriod(value);
  }, []);

  const handleIntensiveCareAdmissionsPerAgeGroupOverTimetimeframePeriodChange = useCallback((value: DateRange | undefined) => {
    setIntensiveCareAdmissionsPerAgeGroupOverTimetimeframePeriod(value);
  }, []);

  const handleHospitalAdmissionsOverTimetimeframePeriodChange = useCallback((value: DateRange | undefined) => {
    setHospitalAdmissionsOverTimetimeframePeriod(value);
  }, []);

  const handleIntensiveCareAdmissionsOverTimetimeframePeriodChange = useCallback((value: DateRange | undefined) => {
    setIntensiveCareAdmissionsOverTimetimeframePeriod(value);
  }, []);

  const admissionsOverTimeToggleItems: ChartTileToggleItem[] = [
    {
      label: textNl.hospitals.admissions_chart.toggle_label,
      value: 'admissions_over_time_hospital',
    },
    {
      label: textNl.icu.admissions_chart.toggle_label,
      value: 'admissions_over_time_icu',
    },
  ];

  const reverseRouter = useReverseRouter();

  const lastValueNice = data.hospital_nice.last_value;
  const underReportedRange = getBoundaryDateStartUnix(
    data.hospital_nice.values,
    countTrailingNullValues(data.hospital_nice.values, 'admissions_on_date_of_admission_moving_average')
  );

  const intakeUnderReportedRange = getBoundaryDateStartUnix(
    data.intensive_care_nice.values,
    countTrailingNullValues(data.intensive_care_nice.values, 'admissions_on_date_of_admission_moving_average')
  );

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);
  const lastInsertionDateHospitalAdmissionsPerAgeGroupOverTime = getLastInsertionDateOfPage(data, ['hospital_nice_per_age_group']);
  const lastInsertionDateIntensiveCareAdmissionsPerAgeGroupOverTime = getLastInsertionDateOfPage(data, ['intensive_care_nice_per_age_group']);
  const lastInsertionDateHospitalAdmissionsOverTime = getLastInsertionDateOfPage(data, ['hospital_nice']);
  const lastInsertionDateIntensiveCareAdmissionsOverTime = getLastInsertionDateOfPage(data, ['intensive_care_nice']);

  const archivedChoroplethDataGm: ArchivedGmCollectionHospitalNiceChoropleth[] = archivedChoropleth.gm.hospital_nice_choropleth_archived_20230830;
  const archivedChoroplethDataGmWeelklyAdmissions: ArchivedGmCollectionHospitalNiceChoroplethWeeklyAdmissions[] = archivedChoropleth.gm.hospital_nice_choropleth_archived_20240228;

  return (
    <Layout {...metadataTexts} lastGenerated={lastGenerated}>
      <NlLayout>
        <SEOHead title={textNl.metadata.title} description={textNl.metadata.description} />
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.consequences_for_healthcare.title}
            screenReaderCategory={commonTexts.sidebar.metrics.hospitals_and_care.title}
            title={textNl.title}
            icon={<Ziekenhuis aria-hidden="true" />}
            description={textNl.description}
            metadata={{
              datumsText: textNl.datums,
              dateOrRange: lastValueNice.date_unix,
              dateOfInsertion: lastInsertionDateOfPage,
              dataSources: [textNl.sources.nice],
              jsonSources: [
                { href: reverseRouter.json.national(), text: jsonText.metrics_national_json.text },
                { href: reverseRouter.json.archivedGmCollection(), text: jsonText.metrics_archived_gm_collection_json.text },
              ],
            }}
            pageLinks={content.links}
            pageInformationHeader={getPageInformationHeaderContent({
              dataExplained: content.dataExplained,
              faq: content.faqs,
            })}
          />

          <InView rootMargin="400px">
            {selectedAdmissionsPerAgeGroupOverTimeChart === 'admissions_per_age_group_over_time_hospital' && (
              <ChartTile
                title={textNl.hospitals.admissions_per_age_group_chart.title}
                description={textNl.hospitals.admissions_per_age_group_chart.description}
                timeframeOptions={TimeframeOptionsList}
                timeframeInitialValue={TimeframeOption.THIRTY_DAYS}
                metadata={{
                  source: textNl.sources.nice,
                  dateOfInsertion: lastInsertionDateHospitalAdmissionsPerAgeGroupOverTime,
                  timeframePeriod: hospitalAdmissionsPerAgeGroupOverTimetimeframePeriod,
                }}
                onSelectTimeframe={setHospitalAdmissionsPerAgeGroupOverTimeTimeframe}
                toggle={{
                  initialValue: selectedAdmissionsPerAgeGroupOverTimeChart,
                  items: admissionsPerAgeGroupOverTimeToggleItems,
                  onChange: (value) => setSelectedAdmissionsPerAgeGroupOverTimeChart(value),
                }}
              >
                <AdmissionsPerAgeGroup
                  accessibility={{
                    key: 'hospital_admissions_per_age_group_over_time_chart',
                  }}
                  values={data.hospital_nice_per_age_group.values}
                  timeframe={hospitalAdmissionsPerAgeGroupOverTimeTimeframe}
                  timelineEvents={getTimelineEvents(content.elements.timeSeries, 'hospital_nice_per_age_group')}
                  onHandletimeframePeriodChange={handleHospitalAdmissionsPerAgeGroupOverTimetimeframePeriod}
                />
              </ChartTile>
            )}

            {selectedAdmissionsPerAgeGroupOverTimeChart === 'admissions_per_age_group_over_time_icu' && (
              <ChartTile
                title={textNl.icu.admissions_per_age_group_chart.title}
                description={textNl.icu.admissions_per_age_group_chart.description}
                timeframeOptions={TimeframeOptionsList}
                timeframeInitialValue={TimeframeOption.THIRTY_DAYS}
                metadata={{
                  source: textNl.sources.nice,
                  dateOfInsertion: lastInsertionDateIntensiveCareAdmissionsPerAgeGroupOverTime,
                  timeframePeriod: intensiveCareAdmissionsPerAgeGroupOverTimetimeframePeriod,
                }}
                onSelectTimeframe={setIntensiveCareAdmissionsPerAgeGroupOverTimeTimeframe}
                toggle={{
                  initialValue: selectedAdmissionsPerAgeGroupOverTimeChart,
                  items: admissionsPerAgeGroupOverTimeToggleItems,
                  onChange: (value) => setSelectedAdmissionsPerAgeGroupOverTimeChart(value),
                }}
              >
                <AdmissionsPerAgeGroup
                  accessibility={{
                    key: 'intensive_care_admissions_per_age_group_over_time_chart',
                  }}
                  values={data.intensive_care_nice_per_age_group.values}
                  timeframe={intensiveCareAdmissionsPerAgeGroupOverTimeTimeframe}
                  timelineEvents={getTimelineEvents(content.elements.timeSeries, 'intensive_care_nice_per_age_group')}
                  onHandletimeframePeriodChange={handleIntensiveCareAdmissionsPerAgeGroupOverTimetimeframePeriodChange}
                />
              </ChartTile>
            )}
          </InView>

          <InView rootMargin="400px">
            {selectedAdmissionsOverTimeChart === 'admissions_over_time_hospital' && (
              <ChartTile
                title={textNl.hospitals.admissions_chart.title}
                description={textNl.hospitals.admissions_chart.description}
                metadata={{
                  source: textNl.sources.nice,
                  dateOfInsertion: lastInsertionDateHospitalAdmissionsOverTime,
                  timeframePeriod: hospitalAdmissionsOverTimetimeframePeriod,
                }}
                timeframeOptions={TimeframeOptionsList}
                timeframeInitialValue={TimeframeOption.THIRTY_DAYS}
                onSelectTimeframe={setHospitalAdmissionsOverTimeTimeframe}
                toggle={{
                  initialValue: selectedAdmissionsOverTimeChart,
                  items: admissionsOverTimeToggleItems,
                  onChange: (value) => setSelectedAdmissionsOverTimeChart(value),
                }}
              >
                <TimeSeriesChart
                  accessibility={{
                    key: 'hospital_admissions_over_time_chart',
                  }}
                  values={data.hospital_nice.values}
                  timeframe={hospitalAdmissionsOverTimeTimeframe}
                  seriesConfig={[
                    {
                      type: 'line',
                      metricProperty: 'admissions_on_date_of_admission_moving_average',
                      label: textNl.hospitals.admissions_chart.legend_title_moving_average,
                      color: colors.primary,
                    },
                    {
                      type: 'bar',
                      metricProperty: 'admissions_on_date_of_admission',
                      label: textNl.hospitals.admissions_chart.legend_title,
                      color: colors.primary,
                    },
                  ]}
                  dataOptions={{
                    timespanAnnotations: [
                      {
                        start: underReportedRange,
                        end: Infinity,
                        label: textNl.hospitals.admissions_chart.legend_underreported_title,
                        shortLabel: commonTexts.common.incomplete,
                        cutValuesForMetricProperties: ['admissions_on_date_of_admission_moving_average'],
                      },
                    ],
                    timelineEvents: getTimelineEvents(content.elements.timeSeries, 'hospital_nice'),
                  }}
                  onHandletimeframePeriodChange={handleHospitalAdmissionsOverTimetimeframePeriodChange}
                />
              </ChartTile>
            )}

            {selectedAdmissionsOverTimeChart === 'admissions_over_time_icu' && (
              <ChartTile
                title={textNl.icu.admissions_chart.title}
                description={textNl.icu.admissions_chart.description}
                metadata={{
                  source: textNl.sources.nice,
                  dateOfInsertion: lastInsertionDateIntensiveCareAdmissionsOverTime,
                  timeframePeriod: intensiveCareAdmissionsOverTimetimeframePeriod,
                }}
                timeframeOptions={TimeframeOptionsList}
                timeframeInitialValue={TimeframeOption.THIRTY_DAYS}
                onSelectTimeframe={setIntensiveCareAdmissionsOverTimeTimeframe}
                toggle={{
                  initialValue: selectedAdmissionsOverTimeChart,
                  items: admissionsOverTimeToggleItems,
                  onChange: (value) => setSelectedAdmissionsOverTimeChart(value),
                }}
              >
                <TimeSeriesChart
                  accessibility={{
                    key: 'intensive_care_admissions_over_time_chart',
                  }}
                  values={data.intensive_care_nice.values}
                  timeframe={intensiveCareAdmissionsOverTimeTimeframe}
                  dataOptions={{
                    timespanAnnotations: [
                      {
                        start: intakeUnderReportedRange,
                        end: Infinity,
                        label: textNl.icu.admissions_chart.legend_underreported_title,
                        shortLabel: commonTexts.common.incomplete,
                        cutValuesForMetricProperties: ['admissions_on_date_of_admission_moving_average'],
                      },
                    ],
                    timelineEvents: getTimelineEvents(content.elements.timeSeries, 'intensive_care_nice'),
                  }}
                  seriesConfig={[
                    {
                      type: 'line',
                      metricProperty: 'admissions_on_date_of_admission_moving_average',
                      label: textNl.icu.admissions_chart.legend_title_moving_average,
                      color: colors.primary,
                    },
                    {
                      type: 'bar',
                      metricProperty: 'admissions_on_date_of_admission',
                      label: textNl.icu.admissions_chart.legend_title_trend_label,
                      color: colors.primary,
                    },
                  ]}
                  onHandletimeframePeriodChange={handleIntensiveCareAdmissionsOverTimetimeframePeriodChange}
                />
              </ChartTile>
            )}
          </InView>

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
            <Box spacing={5} paddingTop={space[4]}>
              <ChoroplethTile
                title={textNl.section_archived.archived_choropleth.title}
                description={textNl.section_archived.archived_choropleth.description}
                legend={{
                  thresholds: thresholds.gm.admissions_on_date_of_admission_per_100000,
                  title: textNl.section_archived.archived_choropleth.legend_title,
                }}
                metadata={{
                  date: archivedChoropleth.gm.hospital_nice_choropleth_archived_20230830[archivedChoropleth.gm.hospital_nice_choropleth_archived_20230830.length - 1].date_unix,
                  source: textNl.sources.nice,
                }}
              >
                <DynamicChoropleth
                  accessibility={{
                    key: 'hospital_admissions_municipal_choropleth',
                  }}
                  map="gm"
                  data={archivedChoroplethDataGm}
                  dataConfig={{
                    metricName: 'hospital_nice_choropleth_archived_20230830',
                    metricProperty: 'admissions_on_date_of_admission_per_100000',
                  }}
                  dataOptions={{
                    getLink: reverseRouter.gm.patientenInBeeld,
                    tooltipVariables: {
                      patients: commonTexts.choropleth_tooltip.patients,
                    },
                  }}
                />
              </ChoroplethTile>

              <ChoroplethTile
                title={textNl.choropleth.title}
                description={textNl.choropleth.description}
                legend={{
                  thresholds: thresholds.gm.admissions_in_the_last_7_days_per_100000,
                  title: textNl.choropleth.legend_title,
                  outdatedDataLabel: textNl.choropleth_legend_outdated_data_label,
                }}
                metadata={{
                  date: {
                    start:
                      archivedChoropleth.gm.hospital_nice_choropleth_archived_20240228[archivedChoropleth.gm.hospital_nice_choropleth_archived_20240228.length - 1].date_start_unix,
                    end: archivedChoropleth.gm.hospital_nice_choropleth_archived_20240228[archivedChoropleth.gm.hospital_nice_choropleth_archived_20240228.length - 1]
                      .date_end_unix,
                  },
                  source: textNl.sources.nice,
                }}
                pageType="patienten-in-beeld"
                notification={textNl.choropleth_update_notification}
              >
                <DynamicChoropleth
                  accessibility={{
                    key: 'admissions_in_the_last_7_days_per_100000',
                  }}
                  map="gm"
                  data={archivedChoroplethDataGmWeelklyAdmissions}
                  dataConfig={{
                    metricName: 'hospital_nice_choropleth_archived_20240228',
                    metricProperty: 'admissions_in_the_last_7_days_per_100000',
                  }}
                  dataOptions={{
                    getLink: reverseRouter.gm.patientenInBeeld,
                    tooltipVariables: {
                      patients: commonTexts.choropleth_tooltip.patients,
                    },
                  }}
                />
              </ChoroplethTile>
            </Box>
          )}
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default PatientsPage;
