import { colors } from '@corona-dashboard/common';
import { Coronavirus } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { AgeDemographic } from '~/components/age-demographic';
import { ChartTile } from '~/components/chart-tile';
import { Divider } from '~/components/divider';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Text } from '~/components/typography';
import { DeceasedMonitorSection } from '~/domain/deceased/deceased-monitor-section';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
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
  selectNlData,
} from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(
      (siteText) => ({
        textNl: siteText.pages.deceasedPage.nl,
        textShared: siteText.pages.deceasedPage.shared,
      }),
      locale
    ),
  getLastGeneratedDate,
  selectNlData(
    'deceased_cbs',
    'deceased_rivm_per_age_group',
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
      "elements": ${getElementsQuery('nl', ['deceased_rivm'], locale)}
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

const DeceasedNationalPage = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, selectedNlData: data, lastGenerated, content } = props;
  const dataCbs = data.deceased_cbs;
  const dataRivm = data.deceased_rivm;
  const dataDeceasedPerAgeGroup = data.deceased_rivm_per_age_group;

  const { siteText, formatPercentage } = useIntl();
  const { textNl, textShared } = pageText;

  const metadata = {
    ...siteText.nationaal_metadata,
    title: textNl.metadata.title,
    description: textNl.metadata.description,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={siteText.nationaal_layout.headings.besmettingen}
            title={textNl.section_deceased_rivm.title}
            icon={<Coronavirus />}
            description={textNl.section_deceased_rivm.description}
            referenceLink={textNl.section_deceased_rivm.reference.href}
            metadata={{
              datumsText: textNl.section_deceased_rivm.datums,
              dateOrRange: dataRivm.last_value.date_unix,
              dateOfInsertionUnix: dataRivm.last_value.date_of_insertion_unix,
              dataSources: [textNl.section_deceased_rivm.bronnen.rivm],
            }}
            articles={content.mainArticles}
          />

          <TwoKpiSection>
            <KpiTile
              title={textNl.section_deceased_rivm.kpi_covid_daily_title}
              metadata={{
                date: dataRivm.last_value.date_unix,
                source: textNl.section_deceased_rivm.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="covid_daily"
                absolute={dataRivm.last_value.covid_daily}
                difference={data.difference.deceased_rivm__covid_daily}
                isAmount
              />
              <Markdown
                content={
                  textNl.section_deceased_rivm.kpi_covid_daily_description
                }
              />
            </KpiTile>
            <KpiTile
              title={textNl.section_deceased_rivm.kpi_covid_total_title}
              metadata={{
                date: dataRivm.last_value.date_unix,
                source: textNl.section_deceased_rivm.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="covid_total"
                absolute={dataRivm.last_value.covid_total}
              />
              <Text>
                {textNl.section_deceased_rivm.kpi_covid_total_description}
              </Text>
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            timeframeOptions={['all', '5weeks']}
            title={textNl.section_deceased_rivm.line_chart_covid_daily_title}
            description={
              textNl.section_deceased_rivm.line_chart_covid_daily_description
            }
            metadata={{
              source: textNl.section_deceased_rivm.bronnen.rivm,
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
                      textNl.section_deceased_rivm
                        .line_chart_covid_daily_legend_trend_label_moving_average,
                    shortLabel:
                      textNl.section_deceased_rivm
                        .line_chart_covid_daily_legend_trend_short_label_moving_average,
                    color: colors.data.primary,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'covid_daily',
                    label:
                      textNl.section_deceased_rivm
                        .line_chart_covid_daily_legend_trend_label,
                    shortLabel:
                      textNl.section_deceased_rivm
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

          <ChartTile
            title={textShared.age_groups.title}
            description={textShared.age_groups.description}
            metadata={{
              date: dataRivm.last_value.date_unix,
              source: textShared.age_groups.bronnen.rivm,
            }}
          >
            <AgeDemographic
              accessibility={{
                key: 'deceased_per_age_group_over_time_chart',
              }}
              data={dataDeceasedPerAgeGroup}
              rightMetricProperty="covid_percentage"
              leftMetricProperty="age_group_percentage"
              rightColor={'data.primary'}
              leftColor={'data.neutral'}
              maxDisplayValue={60}
              text={textShared.age_groups.graph}
              formatValue={(a: number) => `${formatPercentage(a * 100)}%`}
            />
          </ChartTile>

          <Divider />

          <PageInformationBlock
            title={textShared.section_sterftemonitor.title}
            icon={<Coronavirus />}
            description={textShared.section_sterftemonitor.description}
            referenceLink={textShared.section_sterftemonitor.reference.href}
            metadata={{
              datumsText: textShared.section_sterftemonitor.datums,
              dateOrRange: {
                start: dataCbs.last_value.date_start_unix,
                end: dataCbs.last_value.date_end_unix,
              },
              dateOfInsertionUnix: dataCbs.last_value.date_of_insertion_unix,
              dataSources: [textShared.section_sterftemonitor.bronnen.cbs],
            }}
            articles={content.monitorArticles}
          />

          <DeceasedMonitorSection
            data={dataCbs}
            text={textShared.section_sterftemonitor}
            showDataMessage
            showCauseMessage
          />
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default DeceasedNationalPage;
