import { colors, TimeframeOption, TimeframeOptionsList } from '@corona-dashboard/common';
import { useState } from 'react';
import { Coronavirus, Location, VulnerableGroups as VulnerableGroupsIcon } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { Divider } from '~/components/divider';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { WarningTile } from '~/components/warning-tile';
import { Text } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { VrLayout } from '~/domain/layout/vr-layout';
import { Languages, SiteText } from '~/locale';
import { useIntl } from '~/intl';
import { ElementsQueryResult, getElementsQuery, getTimelineEvents } from '~/queries/get-elements-query';
import { getArticleParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate, getLokalizeTexts, selectVrData } from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { getBoundaryDateStartUnix } from '~/utils/get-boundary-date-start-unix';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';

const pageMetrics = ['nursing_home'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  textVr: siteText.pages.nursing_home_page.vr,
  textShared: siteText.pages.nursing_home_page.shared,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectVrData(
    'difference.nursing_home__deceased_daily_archived_20230126',
    'difference.vulnerable_nursing_home__infected_locations_total',
    'difference.nursing_home__newly_infected_people_archived_20230126',
    'nursing_home_archived_20230126',
    'vulnerable_nursing_home'
  ),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      const { locale } = context;
      return `{
      "parts": ${getPagePartsQuery('nursing_home_page')},
      "elements": ${getElementsQuery('vr', ['nursing_home_archived_20230126'], locale)}
     }`;
    })(context);

    return {
      content: {
        articles: getArticleParts(content.parts.pageParts, 'nursingHomePageArticles'),
        elements: content.elements,
      },
    };
  }
);

function VulnerableGroups(props: StaticProps<typeof getStaticProps>) {
  const { pageText, selectedVrData: data, vrName, lastGenerated, content } = props;

  const [nursingHomeConfirmedCasesTimeframe, setNursingHomeConfirmedCasesTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const [nursingHomeInfectedLocationsTimeframe, setNursingHomeInfectedLocationsTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const [nursingHomeDeceasedTimeframe, setNursingHomeDeceasedTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const [isArchivedContentShown, setIsArchivedContentShown] = useState<boolean>(false);

  const { commonTexts } = useIntl();

  const { textVr, textShared } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

  const nursingHomeArchived20230126LastValue = data.nursing_home_archived_20230126.last_value;
  const vulnerableNursingHomeLastValue = data.nursing_home_archived_20230126.last_value;
  const underReportedDateStart = getBoundaryDateStartUnix(data.nursing_home_archived_20230126.values, 7);

  const metadata = {
    ...commonTexts.veiligheidsregio_index.metadata,
    title: replaceVariablesInText(textVr.besmette_locaties.metadata.title, {
      safetyRegionName: vrName,
    }),
    description: replaceVariablesInText(textVr.besmette_locaties.metadata.description, {
      safetyRegionName: vrName,
    }),
  };

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  const hasActiveWarningTile = textShared.osiris_archiving_notification;

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <VrLayout vrName={vrName}>
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.consequences_for_healthcare.title}
            screenReaderCategory={commonTexts.sidebar.metrics.nursing_home_care.title}
            title={replaceVariablesInText(textVr.positief_geteste_personen.titel, {
              safetyRegion: vrName,
            })}
            icon={<VulnerableGroupsIcon aria-hidden="true" />}
            description={replaceVariablesInText(textVr.positief_geteste_personen.pagina_toelichting, {
              safetyRegion: vrName,
            })}
            metadata={{
              datumsText: textVr.positief_geteste_personen.datums,
              dateOrRange: vulnerableNursingHomeLastValue.date_unix,
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [textVr.positief_geteste_personen.bronnen.rivm],
            }}
            referenceLink={textVr.positief_geteste_personen.reference.href}
            articles={content.articles}
            vrNameOrGmName={vrName}
            warning={textVr.positief_geteste_personen.warning}
          />

          {hasActiveWarningTile && <WarningTile isFullWidth message={hasActiveWarningTile} variant="informational" />}

          <PageInformationBlock
            id="besmette-locaties"
            title={replaceVariablesInText(textVr.besmette_locaties.titel, {
              safetyRegion: vrName,
            })}
            icon={<Location aria-hidden="true" />}
            description={textVr.besmette_locaties.pagina_toelichting}
            metadata={{
              datumsText: textVr.besmette_locaties.datums,
              dateOrRange: vulnerableNursingHomeLastValue.date_unix,
              dateOfInsertionUnix: vulnerableNursingHomeLastValue.date_of_insertion_unix,
              dataSources: [textVr.besmette_locaties.bronnen.rivm],
            }}
            referenceLink={textVr.besmette_locaties.reference.href}
          />

          <TwoKpiSection>
            <KpiTile
              title={textVr.besmette_locaties.kpi_titel}
              metadata={{
                date: vulnerableNursingHomeLastValue.date_unix,
                source: textVr.besmette_locaties.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="infected_locations_total"
                absolute={vulnerableNursingHomeLastValue.infected_locations_total}
                percentage={vulnerableNursingHomeLastValue.infected_locations_percentage}
                difference={data.difference.vulnerable_nursing_home__infected_locations_total}
                isAmount
              />
              <Text>{textVr.besmette_locaties.kpi_toelichting}</Text>
            </KpiTile>
            <KpiTile
              title={textVr.besmette_locaties.barscale_titel}
              metadata={{
                date: vulnerableNursingHomeLastValue.date_unix,
                source: textVr.besmette_locaties.bronnen.rivm,
              }}
            >
              <KpiValue data-cy="newly_infected_locations" absolute={vulnerableNursingHomeLastValue.newly_infected_locations} />
              <Text>{textVr.besmette_locaties.barscale_toelichting}</Text>
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            metadata={{ source: textVr.besmette_locaties.bronnen.rivm }}
            title={textVr.besmette_locaties.linechart_titel}
            timeframeOptions={TimeframeOptionsList}
            description={textVr.besmette_locaties.linechart_description}
            onSelectTimeframe={setNursingHomeInfectedLocationsTimeframe}
          >
            <TimeSeriesChart
              accessibility={{
                key: 'nursing_home_infected_locations_over_time_chart',
              }}
              values={data.nursing_home_archived_20230126.values}
              timeframe={nursingHomeInfectedLocationsTimeframe}
              seriesConfig={[
                {
                  type: 'area',
                  metricProperty: 'infected_locations_total',
                  label: textShared.verpleeghuis_besmette_locaties.linechart_tooltip_label,
                  color: colors.primary,
                },
              ]}
            />
          </ChartTile>

          <Divider />

          <PageInformationBlock
            title={textShared.section_archived.title}
            description={textShared.section_archived.description}
            isArchivedHidden={isArchivedContentShown}
            onToggleArchived={() => setIsArchivedContentShown(!isArchivedContentShown)}
          />

          {isArchivedContentShown && (
            <Box spacing={5}>
              <TwoKpiSection>
                <KpiTile
                  title={textVr.positief_geteste_personen.barscale_titel}
                  description={textVr.positief_geteste_personen.extra_uitleg}
                  metadata={{
                    date: nursingHomeArchived20230126LastValue.date_unix,
                    source: textVr.positief_geteste_personen.bronnen.rivm,
                  }}
                >
                  <KpiValue
                    data-cy="newly_infected_people"
                    absolute={nursingHomeArchived20230126LastValue.newly_infected_people}
                    difference={data.difference.nursing_home__newly_infected_people_archived_20230126}
                    isAmount
                  />
                </KpiTile>
              </TwoKpiSection>

              <ChartTile
                metadata={{ source: textVr.positief_geteste_personen.bronnen.rivm }}
                title={textVr.positief_geteste_personen.linechart_titel}
                timeframeOptions={TimeframeOptionsList}
                description={textVr.positief_geteste_personen.linechart_description}
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
                      label: textVr.positief_geteste_personen.line_chart_legend_trend_moving_average_label,
                      shortLabel: textVr.positief_geteste_personen.tooltip_labels.newly_infected_people_moving_average,
                    },
                    {
                      type: 'bar',
                      metricProperty: 'newly_infected_people',
                      color: colors.primary,
                      label: textVr.positief_geteste_personen.line_chart_legend_trend_label,
                      shortLabel: textVr.positief_geteste_personen.tooltip_labels.newly_infected_people,
                    },
                  ]}
                  dataOptions={{
                    timespanAnnotations: [
                      {
                        start: underReportedDateStart,
                        end: Infinity,
                        label: textVr.positief_geteste_personen.line_chart_legend_inaccurate_label,
                        shortLabel: textVr.positief_geteste_personen.tooltip_labels.inaccurate,
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
                title={replaceVariablesInText(textVr.titel, {
                  safetyRegion: vrName,
                })}
                icon={<Coronavirus aria-hidden="true" />}
                description={textVr.pagina_toelichting}
                metadata={{
                  datumsText: textVr.datums,
                  dateOrRange: nursingHomeArchived20230126LastValue.date_unix,
                  dateOfInsertionUnix: nursingHomeArchived20230126LastValue.date_of_insertion_unix,
                  dataSources: [textVr.bronnen.rivm],
                }}
                referenceLink={textVr.reference.href}
              />

              <TwoKpiSection>
                <KpiTile
                  title={textVr.barscale_titel}
                  description={textVr.extra_uitleg}
                  metadata={{
                    date: nursingHomeArchived20230126LastValue.date_unix,
                    source: textVr.bronnen.rivm,
                  }}
                >
                  <KpiValue
                    data-cy="deceased_daily"
                    absolute={nursingHomeArchived20230126LastValue.deceased_daily}
                    difference={data.difference.nursing_home__deceased_daily_archived_20230126}
                    isAmount
                  />
                </KpiTile>
              </TwoKpiSection>

              <ChartTile
                metadata={{ source: textVr.bronnen.rivm }}
                title={textVr.linechart_titel}
                timeframeOptions={TimeframeOptionsList}
                description={textVr.linechart_description}
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
                      label: textVr.line_chart_legend_trend_moving_average_label,
                      shortLabel: textVr.tooltip_labels.deceased_daily_moving_average,
                      color: colors.primary,
                    },
                    {
                      type: 'bar',
                      metricProperty: 'deceased_daily',
                      label: textVr.line_chart_legend_trend_label,
                      shortLabel: textVr.tooltip_labels.deceased_daily,
                      color: colors.primary,
                    },
                  ]}
                  dataOptions={{
                    timespanAnnotations: [
                      {
                        start: underReportedDateStart,
                        end: Infinity,
                        label: textVr.line_chart_legend_inaccurate_label,
                        shortLabel: textVr.tooltip_labels.inaccurate,
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
      </VrLayout>
    </Layout>
  );
}

export default VulnerableGroups;
