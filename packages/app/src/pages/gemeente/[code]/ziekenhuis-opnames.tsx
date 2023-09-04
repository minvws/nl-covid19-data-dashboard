import { colors, DAY_IN_SECONDS, TimeframeOption, TimeframeOptionsList, WEEK_IN_SECONDS } from '@corona-dashboard/common';
import { Ziekenhuis } from '@corona-dashboard/icons';
import { last } from 'lodash';
import { GetStaticPropsContext } from 'next';
import { useState } from 'react';
import { ChartTile } from '~/components/chart-tile';
import { DynamicChoropleth } from '~/components/choropleth';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { InView } from '~/components/in-view';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { PageArticlesTile } from '~/components/articles/page-articles-tile';
import { PageFaqTile } from '~/components/page-faq-tile';
import { PageInformationBlock } from '~/components/page-information-block/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { GmLayout, Layout } from '~/domain/layout';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import { ElementsQueryResult, getElementsQuery, getTimelineEvents } from '~/queries/get-elements-query';
import { getArticleParts, getDataExplainedParts, getFaqParts, getLinkParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetArchivedChoroplethData, createGetChoroplethData, createGetContent, getLastGeneratedDate, getLokalizeTexts, selectGmData } from '~/static-props/get-data';
import { filterByRegionMunicipalities } from '~/static-props/utils/filter-by-region-municipalities';
import { ArticleParts, LinkParts, PagePartQueryResult } from '~/types/cms';
import { countTrailingNullValues, getBoundaryDateStartUnix, replaceVariablesInText, useReverseRouter } from '~/utils';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { getPageInformationHeaderContent } from '~/utils/get-page-information-header-content';
import { Box } from '~/components/base/box';
import { space } from '~/style/theme';

const pageMetrics = ['hospital_nice'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  textGm: siteText.pages.hospital_page.gm,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export { getStaticPaths } from '~/static-paths/gm';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectGmData('hospital_nice', 'code'),
  createGetChoroplethData({
    gm: ({ hospital_nice_choropleth }, context) => ({
      hospital_nice_choropleth: filterByRegionMunicipalities(hospital_nice_choropleth, context),
    }),
  }),
  createGetArchivedChoroplethData({
    gm: ({ hospital_nice_choropleth_archived_20230830 }, context) => ({
      hospital_nice_choropleth_archived_20230830: filterByRegionMunicipalities(hospital_nice_choropleth_archived_20230830, context),
    }),
  }),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts | LinkParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      return `{
        "parts": ${getPagePartsQuery('hospital_page')},
        "elements": ${getElementsQuery('gm', ['hospital_nice'], context.locale)}
      }`;
    })(context);

    return {
      content: {
        articles: getArticleParts(content.parts.pageParts, 'hospitalPageArticles'),
        faqs: getFaqParts(content.parts.pageParts, 'hospitalPageFAQs'),
        dataExplained: getDataExplainedParts(content.parts.pageParts, 'hospitalPageDataExplained'),
        links: getLinkParts(content.parts.pageParts, 'hospitalPageLinks'),
        elements: content.elements,
      },
    };
  }
);

function IntakeHospital(props: StaticProps<typeof getStaticProps>) {
  const { pageText, selectedGmData: data, choropleth, archivedChoropleth, municipalityName, content, lastGenerated } = props;
  const [isArchivedContentShown, setIsArchivedContentShown] = useState<boolean>(false);

  const [hospitalAdmissionsOverTimeTimeframe, setHospitalAdmissionsOverTimeTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const { commonTexts, formatDateFromSeconds } = useIntl();
  const reverseRouter = useReverseRouter();

  const { textGm } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

  const lastValue = data.hospital_nice.last_value;
  const lastValueChoropleth = last(choropleth.gm.hospital_nice_choropleth) || lastValue;

  const underReportedRange = getBoundaryDateStartUnix(data.hospital_nice.values, countTrailingNullValues(data.hospital_nice.values, 'admissions_in_the_last_7_days'));

  const sevenDayAverageDates = { start: underReportedRange - WEEK_IN_SECONDS, end: underReportedRange - DAY_IN_SECONDS };

  const metadata = {
    ...commonTexts.gemeente_index.metadata,
    title: replaceVariablesInText(textGm.metadata.title, {
      municipalityName,
    }),
    description: replaceVariablesInText(textGm.metadata.description, {
      municipalityName,
    }),
  };

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <GmLayout code={data.code} municipalityName={municipalityName}>
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.consequences_for_healthcare.title}
            title={replaceVariablesInText(textGm.titel, {
              municipality: municipalityName,
            })}
            icon={<Ziekenhuis aria-hidden="true" />}
            description={textGm.pagina_toelichting}
            metadata={{
              datumsText: textGm.datums,
              dateOrRange: lastValue.date_end_unix,
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [textGm.bronnen.rivm],
            }}
            pageLinks={content.links}
            vrNameOrGmName={municipalityName}
            warning={textGm.warning}
            pageInformationHeader={getPageInformationHeaderContent({
              dataExplained: content.dataExplained,
              faq: content.faqs,
            })}
          />

          <TwoKpiSection>
            <KpiTile
              title={textGm.barscale_titel}
              description={replaceVariablesInText(textGm.extra_uitleg, {
                dateStart: formatDateFromSeconds(lastValue.date_start_unix, 'weekday-long'),
                dateEnd: formatDateFromSeconds(lastValue.date_end_unix, 'weekday-long'),
              })}
              metadata={{
                date: { start: sevenDayAverageDates.start, end: sevenDayAverageDates.end },
                source: textGm.bronnen.rivm,
              }}
            >
              <KpiValue absolute={lastValue.admissions_in_the_last_7_days} isAmount isMovingAverageDifference />
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            title={textGm.linechart_titel}
            description={textGm.linechart_description}
            metadata={{ source: textGm.bronnen.rivm }}
            timeframeOptions={TimeframeOptionsList}
            onSelectTimeframe={setHospitalAdmissionsOverTimeTimeframe}
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
                  label: textGm.linechart_legend_titel_moving_average,
                  color: colors.primary,
                },
                {
                  type: 'bar',
                  metricProperty: 'admissions_on_date_of_admission',
                  label: textGm.linechart_legend_titel,
                  color: colors.primary,
                },
              ]}
              dataOptions={{
                timespanAnnotations: [
                  {
                    start: underReportedRange,
                    end: Infinity,
                    label: textGm.linechart_legend_underreported_titel,
                    shortLabel: commonTexts.common.incomplete,
                    cutValuesForMetricProperties: ['admissions_on_date_of_admission_moving_average_rounded'],
                  },
                ],
                timelineEvents: getTimelineEvents(content.elements.timeSeries, 'hospital_nice'),
              }}
            />
          </ChartTile>

          <ChoroplethTile
            title={replaceVariablesInText(textGm.map_titel, {
              municipality: municipalityName,
            })}
            metadata={{
              date: { start: lastValueChoropleth.date_start_unix, end: lastValueChoropleth.date_end_unix },
              source: textGm.bronnen.rivm,
            }}
            description={textGm.map_toelichting}
            legend={{
              title: textGm.chloropleth_legenda.titel,
              thresholds: thresholds.gm.admissions_in_the_last_7_days_per_100000,
              outdatedDataLabel: textGm.choropleth_legend_outdated_data_label,
            }}
            pageType="ziekenhuis-opnames"
            notification={textGm.choropleth_update_notification}
          >
            <DynamicChoropleth
              map="gm"
              accessibility={{
                key: 'hospital_admissions_choropleth',
              }}
              data={choropleth.gm.hospital_nice_choropleth}
              dataConfig={{
                metricName: 'hospital_nice_choropleth',
                metricProperty: 'admissions_in_the_last_7_days_per_100000',
              }}
              dataOptions={{
                selectedCode: data.code,
                highlightSelection: true,
                getLink: reverseRouter.gm.ziekenhuisopnames,
                tooltipVariables: {
                  patients: commonTexts.choropleth_tooltip.patients,
                },
              }}
            />
          </ChoroplethTile>

          {content.faqs && content.faqs.questions?.length > 0 && <PageFaqTile questions={content.faqs.questions} title={content.faqs.sectionTitle} />}

          {content.articles && content.articles.articles?.length > 0 && (
            <InView rootMargin="400px">
              <PageArticlesTile articles={content.articles.articles} title={content.articles.sectionTitle} />
            </InView>
          )}

          <PageInformationBlock
            title={textGm.section_archived.title}
            description={textGm.section_archived.description}
            isArchivedHidden={isArchivedContentShown}
            onToggleArchived={() => setIsArchivedContentShown(!isArchivedContentShown)}
          />

          {isArchivedContentShown && (
            <Box spacing={5} paddingTop={space[4]}>
              <ChoroplethTile
                title={replaceVariablesInText(textGm.map_titel, {
                  municipality: municipalityName,
                })}
                metadata={{
                  date: lastValueChoropleth.date_unix,
                  source: textGm.bronnen.rivm,
                }}
                description={textGm.map_toelichting}
                legend={{
                  title: textGm.chloropleth_legenda.titel,
                  thresholds: thresholds.gm.admissions_on_date_of_admission,
                }}
              >
                <DynamicChoropleth
                  map="gm"
                  accessibility={{
                    key: 'hospital_admissions_choropleth',
                  }}
                  data={archivedChoropleth.gm.hospital_nice_choropleth_archived_20230830}
                  dataConfig={{
                    metricName: 'hospital_nice_choropleth_archived_20230830',
                    metricProperty: 'admissions_on_date_of_admission_per_100000',
                  }}
                  dataOptions={{
                    selectedCode: data.code,
                    highlightSelection: true,
                    getLink: reverseRouter.gm.ziekenhuisopnames,
                    tooltipVariables: {
                      patients: commonTexts.choropleth_tooltip.patients,
                    },
                  }}
                />
              </ChoroplethTile>
            </Box>
          )}
        </TileList>
      </GmLayout>
    </Layout>
  );
}

export default IntakeHospital;
