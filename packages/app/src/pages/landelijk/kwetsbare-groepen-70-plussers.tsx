import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { BorderedKpiSection } from '~/components/kpi/bordered-kpi-section';
import { Box } from '~/components/base/box';
import { ChartTile } from '~/components/chart-tile';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { colors } from '@corona-dashboard/common';
import { Coronavirus, VulnerableGroups as VulnerableGroupsIcon } from '@corona-dashboard/icons';
import { createGetArchivedChoroplethData, createGetContent, getLastGeneratedDate, getLokalizeTexts, selectArchivedNlData } from '~/static-props/get-data';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { Divider } from '~/components/divider';
import { DynamicChoropleth } from '~/components/choropleth';
import { ElementsQueryResult, getElementsQuery, getTimelineEvents } from '~/queries/get-elements-query';
import { getArticleParts, getDataExplainedParts, getFaqParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { getBoundaryDateStartUnix } from '~/utils/get-boundary-date-start-unix';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { getPageInformationHeaderContent } from '~/utils/get-page-information-header-content';
import { GetStaticPropsContext } from 'next';
import { InView } from '~/components/in-view';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Languages, SiteText } from '~/locale';
import { Layout } from '~/domain/layout/layout';
import { Markdown } from '~/components/markdown';
import { NlLayout } from '~/domain/layout/nl-layout';
import { PageArticlesTile } from '~/components/articles/page-articles-tile';
import { PageFaqTile } from '~/components/page-faq-tile';
import { PageInformationBlock } from '~/components/page-information-block';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils';
import { WarningTile } from '~/components/warning-tile';

const pageMetrics = [
  'difference.nursing_home__deceased_daily_archived_20230126',
  'difference.nursing_home__newly_infected_people_archived_20230126',
  'difference.vulnerable_hospital_admissions_archived_20230711',
  'difference.vulnerable_nursing_home__infected_locations_total_archived_20230711',
  'nursing_home_archived_20230126',
  'vulnerable_hospital_admissions_archived_20230711',
  'vulnerable_nursing_home_archived_20230711',
];

const selectLokalizeTexts = (siteText: SiteText) => ({
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textNl: siteText.pages.nursing_home_page.nl,
  jsonText: siteText.common.common.metadata.metrics_json_links,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectArchivedNlData(
    'difference.nursing_home__deceased_daily_archived_20230126',
    'difference.vulnerable_nursing_home__infected_locations_total_archived_20230711',
    'difference.nursing_home__newly_infected_people_archived_20230126',
    'difference.vulnerable_hospital_admissions_archived_20230711',
    'vulnerable_nursing_home_archived_20230711',
    'nursing_home_archived_20230126',
    'vulnerable_hospital_admissions_archived_20230711'
  ),
  createGetArchivedChoroplethData({
    vr: ({ vulnerable_nursing_home_archived_20230711 }) => ({ vulnerable_nursing_home_archived_20230711 }),
  }),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      const { locale } = context;
      return `{
      "parts": ${getPagePartsQuery('nursing_home_page')},
      "elements": ${getElementsQuery('archived_nl', ['nursing_home_archived_20230126'], locale)}
     }`;
    })(context);

    return {
      content: {
        articles: getArticleParts(content.parts.pageParts, 'nursingHomePageArticles'),
        faqs: getFaqParts(content.parts.pageParts, 'nursingHomePageFAQs'),
        dataExplained: getDataExplainedParts(content.parts.pageParts, 'nursingHomePageDataExplained'),
        elements: content.elements,
      },
    };
  }
);

function VulnerableGroups(props: StaticProps<typeof getStaticProps>) {
  const { pageText, selectedArchivedNlData: data, archivedChoropleth, lastGenerated, content } = props;

  const reverseRouter = useReverseRouter();

  const nursinghomeDataLastValue = data.nursing_home_archived_20230126.last_value;
  const nursingHomeArchivedUnderReportedDateStart = getBoundaryDateStartUnix(data.nursing_home_archived_20230126.values, 7);

  const { commonTexts, formatNumber } = useIntl();
  const { metadataTexts, textNl, jsonText } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);
  const infectedLocationsText = textNl.verpleeghuis_besmette_locaties;
  const positiveTestedPeopleText = textNl.verpleeghuis_positief_geteste_personen;

  const vulnerableNursingHomeDataLastValue = data.vulnerable_nursing_home_archived_20230711.last_value;
  const vulnerableHospitalAdmissionsData = data.vulnerable_hospital_admissions_archived_20230711;

  const ElderlyPeopleText = textNl['70_plussers'];

  const nursingHomeInfectedLocationsOverTimeTimeframePeriod = {
    start: data.vulnerable_nursing_home_archived_20230711.values[0].date_unix,
    end: data.vulnerable_nursing_home_archived_20230711.values[data.vulnerable_nursing_home_archived_20230711.values.length - 1].date_unix,
  };

  const nursingHomeConfirmedCasesOverTimeTimeframePeriod = {
    start: data.nursing_home_archived_20230126.values[0].date_unix,
    end: data.nursing_home_archived_20230126.values[data.nursing_home_archived_20230126.values.length - 1].date_unix,
  };

  const nursingHomeDeceasedOverTimeTimeframePeriod = {
    start: data.nursing_home_archived_20230126.values[0].date_unix,
    end: data.nursing_home_archived_20230126.values[data.nursing_home_archived_20230126.values.length - 1].date_unix,
  };

  const metadata = {
    ...metadataTexts,
    title: infectedLocationsText.metadata.title,
    description: infectedLocationsText.metadata.description,
  };

  const hasActiveWarningTile = !!textNl.belangrijk_bericht;

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);
  const lastInsertionDateNursingHomeInfectedLocationsOverTime = getLastInsertionDateOfPage(data, ['vulnerable_nursing_home_archived_20230711']);
  const lastInsertionDateNursingHomeConfirmedCasesOverTime = getLastInsertionDateOfPage(data, ['nursing_home_archived_20230126']);
  const lastInsertionDateNursingHomeDeceasedOverTime = getLastInsertionDateOfPage(data, ['nursing_home_archived_20230126']);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.archived_metrics.title}
            screenReaderCategory={commonTexts.sidebar.metrics.nursing_home_care.title}
            title={positiveTestedPeopleText.titel}
            icon={<VulnerableGroupsIcon aria-hidden="true" />}
            description={<Markdown content={positiveTestedPeopleText.pagina_toelichting} />}
            metadata={{
              datumsText: positiveTestedPeopleText.datums,
              dateOrRange: vulnerableNursingHomeDataLastValue.date_unix,
              dateOfInsertion: lastInsertionDateOfPage,
              dataSources: [positiveTestedPeopleText.bronnen.rivm],
              jsonSources: [
                { href: reverseRouter.json.archivedNational(), text: jsonText.metrics_archived_national_json.text },
                { href: reverseRouter.json.archivedGmCollection(), text: jsonText.metrics_archived_gm_collection_json.text },
              ],
            }}
            pageInformationHeader={getPageInformationHeaderContent({
              dataExplained: content.dataExplained,
              faq: content.faqs,
            })}
          />

          {hasActiveWarningTile && <WarningTile isFullWidth message={textNl.belangrijk_bericht} variant="informational" />}

          <TwoKpiSection>
            <KpiTile
              title={ElderlyPeopleText.hospital_admissions.kpi_titel}
              description={ElderlyPeopleText.hospital_admissions.kpi_toelichting}
              metadata={{
                timeframePeriod: { start: vulnerableHospitalAdmissionsData.date_start_unix, end: vulnerableHospitalAdmissionsData.date_end_unix },
                dateOfInsertion: vulnerableHospitalAdmissionsData.date_of_insertion_unix,
                source: ElderlyPeopleText.bronnen.rivm,
                isTimeframePeriodKpi: true,
                isArchived: true,
              }}
            >
              <KpiValue absolute={vulnerableHospitalAdmissionsData.admissions_age_70_plus} difference={data.difference.vulnerable_hospital_admissions_archived_20230711} isAmount />
            </KpiTile>
          </TwoKpiSection>

          <BorderedKpiSection
            title={textNl.kpi_tiles.infected_locations.title}
            description={textNl.kpi_tiles.infected_locations.description}
            source={infectedLocationsText.bronnen.rivm}
            timeframePeriod={vulnerableNursingHomeDataLastValue.date_unix}
            isTimeframePeriodKpi={true}
            dateOfInsertion={vulnerableNursingHomeDataLastValue.date_of_insertion_unix}
            isArchived={true}
            tilesData={[
              {
                value: vulnerableNursingHomeDataLastValue.infected_locations_total,
                differenceValue: data.difference.vulnerable_nursing_home__infected_locations_total_archived_20230711,
                title: infectedLocationsText.kpi_titel,
                description: infectedLocationsText.kpi_toelichting,
              },
              {
                value: vulnerableNursingHomeDataLastValue.newly_infected_locations,
                title: infectedLocationsText.barscale_titel,
                description: infectedLocationsText.barscale_toelichting,
              },
            ]}
          />

          <ChoroplethTile
            title={infectedLocationsText.map_titel}
            description={infectedLocationsText.map_toelichting}
            metadata={{
              timeframePeriod: vulnerableNursingHomeDataLastValue.date_unix,
              dateOfInsertion: vulnerableNursingHomeDataLastValue.date_of_insertion_unix,
              source: infectedLocationsText.bronnen.rivm,
              isTimeframePeriodKpi: true,
              isArchived: true,
            }}
            legend={{
              thresholds: thresholds.vr.infected_locations_percentage,
              title: infectedLocationsText.chloropleth_legenda.titel,
            }}
          >
            <DynamicChoropleth
              map="vr"
              accessibility={{
                key: 'nursing_home_infected_people_choropleth',
              }}
              data={archivedChoropleth.vr.vulnerable_nursing_home_archived_20230711}
              dataConfig={{
                metricName: 'vulnerable_nursing_home_archived_20230711',
                metricProperty: 'infected_locations_percentage',
                dataFormatters: {
                  infected_locations_percentage: formatNumber,
                },
              }}
            />
          </ChoroplethTile>

          <ChartTile
            metadata={{
              source: infectedLocationsText.bronnen.rivm,
              dateOfInsertion: lastInsertionDateNursingHomeInfectedLocationsOverTime,
              timeframePeriod: nursingHomeInfectedLocationsOverTimeTimeframePeriod,
              isArchived: true,
            }}
            title={infectedLocationsText.linechart_titel}
            description={infectedLocationsText.linechart_description}
          >
            <TimeSeriesChart
              accessibility={{
                key: 'nursing_home_infected_locations_over_time_chart',
              }}
              values={data.vulnerable_nursing_home_archived_20230711.values}
              seriesConfig={[
                {
                  type: 'line',
                  metricProperty: 'infected_locations_total',
                  label: textNl.verpleeghuis_besmette_locaties.linechart_tooltip_label,
                  color: colors.primary,
                },
              ]}
              forceLegend
            />
          </ChartTile>

          <Box spacing={5}>
            <TwoKpiSection>
              <KpiTile
                title={positiveTestedPeopleText.barscale_titel}
                description={positiveTestedPeopleText.extra_uitleg}
                metadata={{
                  timeframePeriod: nursinghomeDataLastValue.date_unix,
                  dateOfInsertion: nursinghomeDataLastValue.date_of_insertion_unix,
                  source: positiveTestedPeopleText.bronnen.rivm,
                  isTimeframePeriodKpi: true,
                  isArchived: true,
                }}
              >
                <KpiValue absolute={nursinghomeDataLastValue.newly_infected_people} difference={data.difference.nursing_home__newly_infected_people_archived_20230126} isAmount />
              </KpiTile>
            </TwoKpiSection>

            <ChartTile
              metadata={{
                source: positiveTestedPeopleText.bronnen.rivm,
                dateOfInsertion: lastInsertionDateNursingHomeConfirmedCasesOverTime,
                timeframePeriod: nursingHomeConfirmedCasesOverTimeTimeframePeriod,
                isArchived: true,
              }}
              title={positiveTestedPeopleText.linechart_titel}
              description={positiveTestedPeopleText.linechart_description}
            >
              <TimeSeriesChart
                accessibility={{
                  key: 'nursing_home_confirmed_cases_over_time_chart',
                }}
                values={data.nursing_home_archived_20230126.values}
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty: 'newly_infected_people_moving_average',
                    color: colors.primary,
                    label: positiveTestedPeopleText.line_chart_legend_trend_moving_average_label,
                    shortLabel: positiveTestedPeopleText.tooltip_labels.newly_infected_people_moving_average,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'newly_infected_people',
                    color: colors.primary,
                    label: positiveTestedPeopleText.line_chart_legend_trend_label,
                    shortLabel: positiveTestedPeopleText.tooltip_labels.newly_infected_people,
                  },
                ]}
                dataOptions={{
                  timespanAnnotations: [
                    {
                      start: nursingHomeArchivedUnderReportedDateStart,
                      end: Infinity,
                      label: positiveTestedPeopleText.line_chart_legend_inaccurate_label,
                      shortLabel: positiveTestedPeopleText.tooltip_labels.inaccurate,
                      cutValuesForMetricProperties: ['newly_infected_people_moving_average'],
                    },
                  ],
                  timelineEvents: getTimelineEvents(content.elements.timeSeries, 'nursing_home_archived_20230126', 'newly_infected_people'),
                }}
              />
            </ChartTile>

            <Divider />

            <PageInformationBlock
              id="sterfte"
              title={textNl.titel}
              icon={<Coronavirus />}
              description={textNl.pagina_toelichting}
              metadata={{
                datumsText: textNl.datums,
                dateOrRange: nursinghomeDataLastValue.date_unix,
                dateOfInsertion: nursinghomeDataLastValue.date_of_insertion_unix,
                dataSources: [textNl.bronnen.rivm],
              }}
              referenceLink={textNl.reference.href}
            />

            <TwoKpiSection>
              <KpiTile
                title={textNl.barscale_titel}
                description={textNl.extra_uitleg}
                metadata={{
                  timeframePeriod: nursinghomeDataLastValue.date_unix,
                  dateOfInsertion: nursinghomeDataLastValue.date_of_insertion_unix,
                  source: textNl.bronnen.rivm,
                  isTimeframePeriodKpi: true,
                  isArchived: true,
                }}
              >
                <KpiValue absolute={nursinghomeDataLastValue.deceased_daily} />
              </KpiTile>
            </TwoKpiSection>

            <ChartTile
              title={textNl.linechart_titel}
              description={textNl.linechart_description}
              metadata={{
                source: textNl.bronnen.rivm,
                dateOfInsertion: lastInsertionDateNursingHomeDeceasedOverTime,
                timeframePeriod: nursingHomeDeceasedOverTimeTimeframePeriod,
                isArchived: true,
              }}
            >
              <TimeSeriesChart
                accessibility={{
                  key: 'nursing_home_deceased_over_time_chart',
                }}
                values={data.nursing_home_archived_20230126.values}
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty: 'deceased_daily_moving_average',
                    label: textNl.line_chart_legend_trend_moving_average_label,
                    shortLabel: textNl.tooltip_labels.deceased_daily_moving_average,
                    color: colors.primary,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'deceased_daily',
                    label: textNl.line_chart_legend_trend_label,
                    shortLabel: textNl.tooltip_labels.deceased_daily,
                    color: colors.primary,
                  },
                ]}
                dataOptions={{
                  timespanAnnotations: [
                    {
                      start: nursingHomeArchivedUnderReportedDateStart,
                      end: Infinity,
                      label: textNl.line_chart_legend_inaccurate_label,
                      shortLabel: textNl.tooltip_labels.inaccurate,
                      cutValuesForMetricProperties: ['deceased_daily_moving_average'],
                    },
                  ],
                  timelineEvents: getTimelineEvents(content.elements.timeSeries, 'nursing_home_archived_20230126', 'deceased_daily'),
                }}
              />
            </ChartTile>
          </Box>

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
}

export default VulnerableGroups;
