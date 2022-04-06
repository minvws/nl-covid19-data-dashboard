import { colors, TimeframeOptionsList } from '@corona-dashboard/common';
import { Coronavirus } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import {
  ChartTile,
  KpiTile,
  KpiValue,
  Markdown,
  PageInformationBlock,
  TileList,
  TimeSeriesChart,
  TwoKpiSection,
} from '~/components';
import { Text } from '~/components/typography';
import { DeceasedMonitorSection } from '~/domain/deceased';
import { Layout, VrLayout } from '~/domain/layout';
import { useIntl } from '~/intl';
import { Languages } from '~/locale';
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
  selectVrData,
} from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { replaceVariablesInText } from '~/utils';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(
      (siteText) => ({
        caterogyTexts:
          siteText.common.veiligheidsregio_layout.headings.besmettingen,
        textVr: siteText.pages.deceasedPage.vr,
        textShared: siteText.pages.deceasedPage.shared,
      }),
      locale
    ),
  getLastGeneratedDate,
  selectVrData(
    'deceased_cbs',
    'deceased_rivm',
    'difference.deceased_rivm__covid_daily'
  ),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      const { locale } = context;
      return `{
      "parts": ${getPagePartsQuery('deceasedPage')},
      "elements": ${getElementsQuery('vr', ['deceased_rivm'], locale)}
     }`;
    })(context);

    return {
      content: {
        mainArticles: getArticleParts(
          content.parts.pageParts,
          'deceasedPageArticles'
        ),
        monitorArticles: getArticleParts(
          content.parts.pageParts,
          'deceasedMonitorArticles'
        ),
        elements: content.elements,
      },
    };
  }
);

const DeceasedRegionalPage = (props: StaticProps<typeof getStaticProps>) => {
  const {
    pageText,
    selectedVrData: {
      deceased_cbs: dataCbs,
      deceased_rivm: dataRivm,
      difference,
    },
    vrName,
    content,
    lastGenerated,
  } = props;

  const { commonTexts } = useIntl();
  const { caterogyTexts, textVr, textShared } = pageText;

  const metadata = {
    ...commonTexts.veiligheidsregio_index.metadata,
    title: replaceVariablesInText(textVr.metadata.title, {
      safetyRegion: vrName,
    }),
    description: replaceVariablesInText(textVr.metadata.description, {
      safetyRegion: vrName,
    }),
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <VrLayout vrName={vrName}>
        <TileList>
          <PageInformationBlock
            category={caterogyTexts}
            title={replaceVariablesInText(textVr.section_deceased_rivm.title, {
              safetyRegion: vrName,
            })}
            icon={<Coronavirus />}
            description={textVr.section_deceased_rivm.description}
            referenceLink={textVr.section_deceased_rivm.reference.href}
            metadata={{
              datumsText: textVr.section_deceased_rivm.datums,
              dateOrRange: dataRivm.last_value.date_unix,
              dateOfInsertionUnix: dataRivm.last_value.date_of_insertion_unix,
              dataSources: [textVr.section_deceased_rivm.bronnen.rivm],
            }}
            articles={content.mainArticles}
            vrNameOrGmName={vrName}
            warning={textVr.warning}
          />

          <TwoKpiSection>
            <KpiTile
              title={textVr.section_deceased_rivm.kpi_covid_daily_title}
              metadata={{
                date: dataRivm.last_value.date_unix,
                source: textVr.section_deceased_rivm.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="covid_daily"
                absolute={dataRivm.last_value.covid_daily}
                difference={difference.deceased_rivm__covid_daily}
                isAmount
              />
              <Markdown
                content={
                  textVr.section_deceased_rivm.kpi_covid_daily_description
                }
              />
            </KpiTile>
            <KpiTile
              title={textVr.section_deceased_rivm.kpi_covid_total_title}
              metadata={{
                date: dataRivm.last_value.date_unix,
                source: textVr.section_deceased_rivm.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="covid_total"
                absolute={dataRivm.last_value.covid_total}
              />
              <Text>
                {textVr.section_deceased_rivm.kpi_covid_total_description}
              </Text>
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            timeframeOptions={TimeframeOptionsList}
            title={textVr.section_deceased_rivm.line_chart_covid_daily_title}
            description={
              textVr.section_deceased_rivm.line_chart_covid_daily_description
            }
            metadata={{
              source: textVr.section_deceased_rivm.bronnen.rivm,
            }}
          >
            {(timeframe) => (
              <TimeSeriesChart
                accessibility={{
                  key: 'deceased_over_time_chart',
                }}
                values={dataRivm.values}
                timeframe={timeframe}
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty: 'covid_daily_moving_average',
                    label:
                      textVr.section_deceased_rivm
                        .line_chart_covid_daily_legend_trend_label_moving_average,
                    shortLabel:
                      textVr.section_deceased_rivm
                        .line_chart_covid_daily_legend_trend_short_label_moving_average,
                    color: colors.data.primary,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'covid_daily',
                    label:
                      textVr.section_deceased_rivm
                        .line_chart_covid_daily_legend_trend_label,
                    shortLabel:
                      textVr.section_deceased_rivm
                        .line_chart_covid_daily_legend_trend_short_label,
                    color: colors.data.primary,
                  },
                ]}
                dataOptions={{
                  timelineEvents: getTimelineEvents(
                    content.elements.timeSeries,
                    'deceased_rivm'
                  ),
                }}
              />
            )}
          </ChartTile>

          <PageInformationBlock
            title={textVr.section_sterftemonitor.title}
            icon={<Coronavirus />}
            description={textVr.section_sterftemonitor.description}
            referenceLink={textVr.section_sterftemonitor.reference.href}
            metadata={{
              datumsText: textVr.section_sterftemonitor.datums,
              dateOrRange: {
                start: dataCbs.last_value.date_start_unix,
                end: dataCbs.last_value.date_end_unix,
              },
              dateOfInsertionUnix: dataCbs.last_value.date_of_insertion_unix,
              dataSources: [textVr.section_sterftemonitor.bronnen.cbs],
            }}
            articles={content.monitorArticles}
          />

          <DeceasedMonitorSection
            text={textShared.section_sterftemonitor}
            data={dataCbs}
          />
        </TileList>
      </VrLayout>
    </Layout>
  );
};

export default DeceasedRegionalPage;
