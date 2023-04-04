import { colors, TimeframeOption, TimeframeOptionsList } from '@corona-dashboard/common';
import { useState } from 'react';
import { Elderly } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
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
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import { ElementsQueryResult, getElementsQuery, getTimelineEvents } from '~/queries/get-elements-query';
import { getArticleParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate, selectVrData, getLokalizeTexts } from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { getBoundaryDateStartUnix } from '~/utils/get-boundary-date-start-unix';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';

const pageMetrics = ['elderly_at_home'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  textShared: siteText.pages.elderly_at_home_page.shared,
  textVr: siteText.pages.elderly_at_home_page.vr,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectVrData('elderly_at_home_archived_20230126', 'difference.elderly_at_home__positive_tested_daily_archived_20230126'),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      const { locale } = context;
      return `{
      "parts": ${getPagePartsQuery('elderly_at_home_page')},
      "elements": ${getElementsQuery('vr', ['elderly_at_home_archived_20230126'], locale)}
     }`;
    })(context);

    return {
      content: {
        articles: getArticleParts(content.parts.pageParts, 'elderlyAtHomePageArticles'),
        elements: content.elements,
      },
    };
  }
);

function ElderlyAtHomeRegionalPage(props: StaticProps<typeof getStaticProps>) {
  const { pageText, vrName, selectedVrData: data, lastGenerated, content } = props;

  const [elderlyAtHomeConfirmedCasesTimeframe, setElderlyAtHomeConfirmedCasesTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const [elderlyAtHomeConfirmedCasesOverTimeTimeframe, setElderlyAtHomeConfirmedCasesOverTimeTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const { elderly_at_home_archived_20230126, difference } = data;

  const { commonTexts } = useIntl();
  const { textShared, textVr } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);
  const elderlyAtHomeUnderReportedRange = getBoundaryDateStartUnix(elderly_at_home_archived_20230126.values, 4);

  const elderlyAtHomeDeceasedUnderReportedRange = getBoundaryDateStartUnix(elderly_at_home_archived_20230126.values, 7);

  const metadata = {
    ...commonTexts.veiligheidsregio_index.metadata,
    title: replaceVariablesInText(textVr.metadata.title, {
      safetyRegion: vrName,
    }),
    description: replaceVariablesInText(textVr.metadata.description, {
      safetyRegion: vrName,
    }),
  };

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  const hasActiveWarningTile = !!textShared.belangrijk_bericht;

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <VrLayout vrName={vrName}>
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.archived_metrics.title}
            screenReaderCategory={commonTexts.sidebar.metrics.elderly_at_home.title}
            title={replaceVariablesInText(textVr.section_positive_tested.title, {
              safetyRegion: vrName,
            })}
            icon={<Elderly aria-hidden="true" />}
            description={replaceVariablesInText(textVr.section_positive_tested.description, {
              safetyRegion: vrName,
            })}
            metadata={{
              datumsText: textVr.section_positive_tested.datums,
              dateOrRange: elderly_at_home_archived_20230126.last_value.date_unix,
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [textVr.section_positive_tested.bronnen.rivm],
            }}
            referenceLink={textVr.section_positive_tested.reference.href}
            articles={content.articles}
            vrNameOrGmName={vrName}
            warning={textVr.warning}
          />

          {hasActiveWarningTile && <WarningTile isFullWidth message={textShared.belangrijk_bericht} variant="informational" />}

          <TwoKpiSection>
            <KpiTile
              title={textVr.section_positive_tested.kpi_daily_title}
              metadata={{
                date: elderly_at_home_archived_20230126.last_value.date_unix,
                source: textVr.section_positive_tested.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="positive_tested_daily"
                absolute={elderly_at_home_archived_20230126.last_value.positive_tested_daily}
                difference={difference.elderly_at_home__positive_tested_daily_archived_20230126}
                isAmount
              />
              <Text>{textVr.section_positive_tested.kpi_daily_description}</Text>
            </KpiTile>
            <KpiTile
              title={textVr.section_positive_tested.kpi_daily_per_100k_title}
              metadata={{
                date: elderly_at_home_archived_20230126.last_value.date_unix,
                source: textVr.section_positive_tested.bronnen.rivm,
              }}
            >
              <KpiValue data-cy="positive_tested_daily_per_100k" absolute={elderly_at_home_archived_20230126.last_value.positive_tested_daily_per_100k} />
              <Text>{textVr.section_positive_tested.kpi_daily_per_100k_description}</Text>
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            timeframeOptions={TimeframeOptionsList}
            title={textVr.section_positive_tested.line_chart_daily_title}
            metadata={{ source: textVr.section_positive_tested.bronnen.rivm }}
            description={textVr.section_positive_tested.line_chart_daily_description}
            onSelectTimeframe={setElderlyAtHomeConfirmedCasesTimeframe}
          >
            <TimeSeriesChart
              accessibility={{
                key: 'elderly_at_home_confirmed_cases_over_time_chart',
              }}
              timeframe={elderlyAtHomeConfirmedCasesTimeframe}
              values={elderly_at_home_archived_20230126.values}
              seriesConfig={[
                {
                  type: 'line',
                  metricProperty: 'positive_tested_daily_moving_average',
                  label: textVr.section_positive_tested.line_chart_positive_tested_daily_moving_average,
                  shortLabel: textVr.section_positive_tested.line_chart_positive_tested_daily_moving_average_short_label,
                  color: colors.primary,
                },
                {
                  type: 'bar',
                  metricProperty: 'positive_tested_daily',
                  label: textVr.section_positive_tested.line_chart_legend_trend_label,
                  color: colors.primary,
                },
              ]}
              dataOptions={{
                timespanAnnotations: [
                  {
                    start: elderlyAtHomeUnderReportedRange,
                    end: Infinity,
                    label: textVr.section_deceased.line_chart_legend_inaccurate_label,
                    shortLabel: commonTexts.common.incomplete,
                    cutValuesForMetricProperties: ['positive_tested_daily_moving_average'],
                  },
                ],
                timelineEvents: getTimelineEvents(content.elements.timeSeries, 'elderly_at_home_archived_20230126', 'positive_tested_daily'),
              }}
            />
          </ChartTile>

          <Divider />

          <PageInformationBlock
            title={replaceVariablesInText(textVr.section_deceased.title, {
              safetyRegion: vrName,
            })}
            icon={<Elderly aria-hidden="true" />}
            description={replaceVariablesInText(textVr.section_deceased.description, {
              safetyRegion: vrName,
            })}
            metadata={{
              datumsText: textVr.section_deceased.datums,
              dateOrRange: elderly_at_home_archived_20230126.last_value.date_unix,
              dateOfInsertionUnix: elderly_at_home_archived_20230126.last_value.date_of_insertion_unix,
              dataSources: [textVr.section_deceased.bronnen.rivm],
            }}
            referenceLink={textVr.section_deceased.reference.href}
          />

          <TwoKpiSection>
            <KpiTile
              title={textVr.section_deceased.kpi_daily_title}
              description={textVr.section_deceased.kpi_daily_description}
              metadata={{
                date: elderly_at_home_archived_20230126.last_value.date_unix,
                source: textVr.section_deceased.bronnen.rivm,
              }}
            >
              <KpiValue data-cy="deceased_daily" absolute={elderly_at_home_archived_20230126.last_value.deceased_daily} />
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            timeframeOptions={TimeframeOptionsList}
            title={textVr.section_deceased.line_chart_daily_title}
            metadata={{ source: textVr.section_positive_tested.bronnen.rivm }}
            description={textVr.section_deceased.line_chart_daily_description}
            onSelectTimeframe={setElderlyAtHomeConfirmedCasesOverTimeTimeframe}
          >
            <TimeSeriesChart
              accessibility={{
                key: 'elderly_at_home_deceased_over_time_chart',
              }}
              timeframe={elderlyAtHomeConfirmedCasesOverTimeTimeframe}
              values={elderly_at_home_archived_20230126.values}
              seriesConfig={[
                {
                  type: 'line',
                  metricProperty: 'deceased_daily_moving_average',
                  label: textVr.section_deceased.line_chart_deceased_daily_moving_average,
                  shortLabel: textVr.section_deceased.line_chart_deceased_daily_moving_average_short_label,
                  color: colors.primary,
                },
                {
                  type: 'bar',
                  metricProperty: 'deceased_daily',
                  label: textVr.section_deceased.line_chart_legend_trend_label,
                  color: colors.primary,
                },
              ]}
              dataOptions={{
                timespanAnnotations: [
                  {
                    start: elderlyAtHomeDeceasedUnderReportedRange,
                    end: Infinity,
                    label: textVr.section_deceased.line_chart_legend_inaccurate_label,
                    shortLabel: commonTexts.common.incomplete,
                    cutValuesForMetricProperties: ['deceased_daily_moving_average'],
                  },
                ],
                timelineEvents: getTimelineEvents(content.elements.timeSeries, 'elderly_at_home_archived_20230126', 'deceased_daily'),
              }}
            />
          </ChartTile>
        </TileList>
      </VrLayout>
    </Layout>
  );
}

export default ElderlyAtHomeRegionalPage;
