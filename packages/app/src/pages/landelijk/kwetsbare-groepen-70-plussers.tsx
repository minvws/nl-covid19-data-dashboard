import { colors, TimeframeOption, TimeframeOptionsList } from '@corona-dashboard/common';
import { Coronavirus, VulnerableGroups as VulnerableGroupsIcon } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { useState } from 'react';
import { DynamicChoropleth, InView } from '~/components/';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { Divider } from '~/components/divider';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { BorderedKpiSection } from '~/components/kpi/bordered-kpi-section';
import { Markdown } from '~/components/markdown';
import { PageArticlesTile } from '~/components/page-articles-tile';
import { PageFaqTile } from '~/components/page-faq-tile';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { WarningTile } from '~/components/warning-tile';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import { ElementsQueryResult, getElementsQuery, getTimelineEvents } from '~/queries/get-elements-query';
import { getArticleParts, getDataExplainedParts, getFaqParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetChoroplethData, createGetContent, getLastGeneratedDate, getLokalizeTexts, selectNlData } from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { getBoundaryDateStartUnix } from '~/utils/get-boundary-date-start-unix';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';

const pageMetrics = [
  'difference.nursing_home__deceased_daily_archived_20230126',
  'difference.vulnerable_nursing_home__infected_locations_total',
  'difference.nursing_home__newly_infected_people_archived_20230126',
  'difference.vulnerable_hospital_admissions',
  'vulnerable_nursing_home',
  'nursing_home_archived_20230126',
  'vulnerable_hospital_admissions',
];

const selectLokalizeTexts = (siteText: SiteText) => ({
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textNl: siteText.pages.nursing_home_page.nl,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectNlData(
    'difference.nursing_home__deceased_daily_archived_20230126',
    'difference.vulnerable_nursing_home__infected_locations_total',
    'difference.nursing_home__newly_infected_people_archived_20230126',
    'difference.vulnerable_hospital_admissions',
    'vulnerable_nursing_home',
    'nursing_home_archived_20230126',
    'vulnerable_hospital_admissions'
  ),
  createGetChoroplethData({
    vr: ({ vulnerable_nursing_home }) => ({ vulnerable_nursing_home }),
  }),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      const { locale } = context;
      return `{
      "parts": ${getPagePartsQuery('nursing_home_page')},
      "elements": ${getElementsQuery('nl', ['nursing_home_archived_20230126'], locale)}
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
  const { pageText, selectedNlData: data, choropleth, lastGenerated, content } = props;

  const [nursingHomeConfirmedCasesTimeframe, setNursingHomeConfirmedCasesTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const [nursingHomeInfectedLocationsTimeframe, setNursingHomeInfectedLocationsTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const [nursingHomeDeceasedTimeframe, setNursingHomeDeceasedTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const [isArchivedContentShown, setIsArchivedContentShown] = useState<boolean>(false);

  const nursinghomeDataLastValue = data.nursing_home_archived_20230126.last_value;
  const nusingHomeArchivedUnderReportedDateStart = getBoundaryDateStartUnix(data.nursing_home_archived_20230126.values, 7);

  const { commonTexts, formatNumber } = useIntl();
  const { metadataTexts, textNl } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);
  const infectedLocationsText = textNl.verpleeghuis_besmette_locaties;
  const positiveTestedPeopleText = textNl.verpleeghuis_positief_geteste_personen;

  const vulnerableNursingHomeDataLastValue = data.vulnerable_nursing_home.last_value;
  const vulnerableHospitalAdmissionsData = data.vulnerable_hospital_admissions;

  const ElderlyPeopleText = textNl['70_plussers'];

  const metadata = {
    ...metadataTexts,
    title: infectedLocationsText.metadata.title,
    description: infectedLocationsText.metadata.description,
  };

  const hasActiveWarningTile = textNl.osiris_archiving_notification;

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.consequences_for_healthcare.title}
            screenReaderCategory={commonTexts.sidebar.metrics.nursing_home_care.title}
            title={positiveTestedPeopleText.titel}
            icon={<VulnerableGroupsIcon aria-hidden="true" />}
            description={<Markdown content={positiveTestedPeopleText.pagina_toelichting} />}
            metadata={{
              datumsText: positiveTestedPeopleText.datums,
              dateOrRange: vulnerableNursingHomeDataLastValue.date_unix,
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [positiveTestedPeopleText.bronnen.rivm],
            }}
            pageInformationHeader={{
              dataExplained: content.dataExplained
                ? {
                    link: `/verantwoording/${content.dataExplained.item.slug.current}`,
                    button: {
                      header: content.dataExplained.buttonTitle,
                      text: content.dataExplained.buttonText,
                    },
                  }
                : undefined,
              faq:
                content.faqs && content.faqs.questions.length > 0
                  ? {
                      link: 'veelgestelde-vragen',
                      button: {
                        header: content.faqs.buttonTitle,
                        text: content.faqs.buttonText,
                      },
                    }
                  : undefined,
            }}
          />

          {hasActiveWarningTile && <WarningTile isFullWidth message={hasActiveWarningTile} variant="informational" />}

          <TwoKpiSection>
            <KpiTile
              title={ElderlyPeopleText.hospital_admissions.kpi_titel}
              description={ElderlyPeopleText.hospital_admissions.kpi_toelichting}
              metadata={{
                date: [vulnerableHospitalAdmissionsData.date_start_unix, vulnerableHospitalAdmissionsData.date_end_unix],
                source: ElderlyPeopleText.bronnen.rivm,
              }}
            >
              <KpiValue absolute={vulnerableHospitalAdmissionsData.admissions_age_70_plus} difference={data.difference.vulnerable_hospital_admissions} isAmount />
            </KpiTile>
          </TwoKpiSection>

          <BorderedKpiSection
            title={textNl.kpi_tiles.infected_locations.title}
            description={textNl.kpi_tiles.infected_locations.description}
            source={infectedLocationsText.bronnen.rivm}
            dateUnix={vulnerableNursingHomeDataLastValue.date_unix}
            tilesData={[
              {
                value: vulnerableNursingHomeDataLastValue.infected_locations_total,
                differenceValue: data.difference.vulnerable_nursing_home__infected_locations_total,
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
              date: vulnerableNursingHomeDataLastValue.date_unix,
              source: infectedLocationsText.bronnen.rivm,
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
              data={choropleth.vr.vulnerable_nursing_home}
              dataConfig={{
                metricName: 'vulnerable_nursing_home',
                metricProperty: 'infected_locations_percentage',
                dataFormatters: {
                  infected_locations_percentage: formatNumber,
                },
              }}
            />
          </ChoroplethTile>

          <ChartTile
            metadata={{ source: infectedLocationsText.bronnen.rivm }}
            title={infectedLocationsText.linechart_titel}
            timeframeOptions={TimeframeOptionsList}
            description={infectedLocationsText.linechart_description}
            onSelectTimeframe={setNursingHomeInfectedLocationsTimeframe}
          >
            <TimeSeriesChart
              accessibility={{
                key: 'nursing_home_infected_locations_over_time_chart',
              }}
              values={data.vulnerable_nursing_home.values}
              timeframe={nursingHomeInfectedLocationsTimeframe}
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

          {content.faqs && content.faqs.questions.length > 0 && (
            <InView rootMargin="400px">
              <PageFaqTile questions={content.faqs.questions} title={content.faqs.sectionTitle} />
            </InView>
          )}

          {content.articles && content.articles.articles.length > 0 && (
            <InView rootMargin="400px">
              <PageArticlesTile articles={content.articles.articles} title={content.articles.sectionTitle} />
            </InView>
          )}

          <Divider />

          <PageInformationBlock
            title={textNl.section_archived.title}
            description={textNl.section_archived.description}
            isArchivedHidden={isArchivedContentShown}
            onToggleArchived={() => setIsArchivedContentShown(!isArchivedContentShown)}
          />

          {isArchivedContentShown && (
            <Box spacing={5}>
              <TwoKpiSection>
                <KpiTile
                  title={positiveTestedPeopleText.barscale_titel}
                  description={positiveTestedPeopleText.extra_uitleg}
                  metadata={{
                    date: nursinghomeDataLastValue.date_unix,
                    source: positiveTestedPeopleText.bronnen.rivm,
                  }}
                >
                  <KpiValue absolute={nursinghomeDataLastValue.newly_infected_people} difference={data.difference.nursing_home__newly_infected_people_archived_20230126} isAmount />
                </KpiTile>
              </TwoKpiSection>

              <ChartTile
                metadata={{ source: positiveTestedPeopleText.bronnen.rivm }}
                title={positiveTestedPeopleText.linechart_titel}
                description={positiveTestedPeopleText.linechart_description}
                timeframeOptions={TimeframeOptionsList}
                onSelectTimeframe={setNursingHomeConfirmedCasesTimeframe}
              >
                <TimeSeriesChart
                  accessibility={{
                    key: 'nursing_home_confirmed_cases_over_time_chart',
                  }}
                  values={data.nursing_home_archived_20230126.values}
                  timeframe={nursingHomeConfirmedCasesTimeframe}
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
                        start: nusingHomeArchivedUnderReportedDateStart,
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
                  dateOfInsertionUnix: nursinghomeDataLastValue.date_of_insertion_unix,
                  dataSources: [textNl.bronnen.rivm],
                }}
                referenceLink={textNl.reference.href}
              />

              <TwoKpiSection>
                <KpiTile
                  title={textNl.barscale_titel}
                  description={textNl.extra_uitleg}
                  metadata={{
                    date: nursinghomeDataLastValue.date_unix,
                    source: textNl.bronnen.rivm,
                  }}
                >
                  <KpiValue absolute={nursinghomeDataLastValue.deceased_daily} />
                </KpiTile>
              </TwoKpiSection>

              <ChartTile
                metadata={{ source: textNl.bronnen.rivm }}
                title={textNl.linechart_titel}
                timeframeOptions={TimeframeOptionsList}
                description={textNl.linechart_description}
                onSelectTimeframe={setNursingHomeDeceasedTimeframe}
              >
                <TimeSeriesChart
                  accessibility={{
                    key: 'nursing_home_deceased_over_time_chart',
                  }}
                  values={data.nursing_home_archived_20230126.values}
                  timeframe={nursingHomeDeceasedTimeframe}
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
                        start: nusingHomeArchivedUnderReportedDateStart,
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
          )}
        </TileList>
      </NlLayout>
    </Layout>
  );
}

export default VulnerableGroups;
