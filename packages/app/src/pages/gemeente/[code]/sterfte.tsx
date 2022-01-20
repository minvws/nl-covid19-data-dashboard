import { colors } from '@corona-dashboard/common';
import { Coronavirus } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { ChartTile } from '~/components/chart-tile';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Text } from '~/components/typography';
import { GmLayout } from '~/domain/layout/gm-layout';
import { Layout } from '~/domain/layout/layout';
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
  selectGmData,
} from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

export { getStaticPaths } from '~/static-paths/gm';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(
      (siteText) => ({ textGm: siteText.pages.deceased.gm }),
      locale
    ),
  getLastGeneratedDate,
  selectGmData(
    'difference.deceased_rivm__covid_daily',
    'deceased_rivm',
    'code'
  ),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      const { locale } = context;
      return `{
      "parts": ${getPagePartsQuery('deceasedPage')},
      "elements": ${getElementsQuery('gm', ['deceased_rivm'], locale)}
     }`;
    })(context);

    return {
      content: {
        articles: getArticleParts(
          content.parts.pageParts,
          'deceasedPageArticles'
        ),
        elements: content.elements,
      },
    };
  }
);

const DeceasedMunicipalPage = (props: StaticProps<typeof getStaticProps>) => {
  const {
    pageText,
    municipalityName,
    selectedGmData: data,
    content,
    lastGenerated,
  } = props;

  const { siteText } = useIntl();
  const { textGm } = pageText;

  const metadata = {
    ...siteText.gemeente_index.metadata,
    title: replaceVariablesInText(textGm.metadata.title, {
      municipalityName,
    }),
    description: replaceVariablesInText(textGm.metadata.description, {
      municipalityName,
    }),
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <GmLayout code={data.code} municipalityName={municipalityName}>
        <TileList>
          <PageInformationBlock
            category={siteText.gemeente_layout.headings.besmettingen}
            title={replaceVariablesInText(textGm.section_deceased_rivm.title, {
              municipalityName,
            })}
            icon={<Coronavirus />}
            description={textGm.section_deceased_rivm.description}
            referenceLink={textGm.section_deceased_rivm.reference.href}
            metadata={{
              datumsText: textGm.section_deceased_rivm.datums,
              dateOrRange: data.deceased_rivm.last_value.date_unix,
              dateOfInsertionUnix:
                data.deceased_rivm.last_value.date_of_insertion_unix,
              dataSources: [textGm.section_deceased_rivm.bronnen.rivm],
            }}
            articles={content.articles}
            vrNameOrGmName={municipalityName}
            warning={textGm.warning}
          />

          <TwoKpiSection>
            <KpiTile
              title={textGm.section_deceased_rivm.kpi_covid_daily_title}
              metadata={{
                date: data.deceased_rivm.last_value.date_unix,
                source: textGm.section_deceased_rivm.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="covid_daily"
                absolute={data.deceased_rivm.last_value.covid_daily}
                difference={data.difference.deceased_rivm__covid_daily}
                isAmount
              />
              <Markdown
                content={
                  textGm.section_deceased_rivm.kpi_covid_daily_description
                }
              />
            </KpiTile>
            <KpiTile
              title={textGm.section_deceased_rivm.kpi_covid_total_title}
              metadata={{
                date: data.deceased_rivm.last_value.date_unix,
                source: textGm.section_deceased_rivm.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="covid_total"
                absolute={data.deceased_rivm.last_value.covid_total}
              />
              <Text>
                {textGm.section_deceased_rivm.kpi_covid_total_description}
              </Text>
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            timeframeOptions={['all', '5weeks']}
            title={textGm.section_deceased_rivm.line_chart_covid_daily_title}
            description={
              textGm.section_deceased_rivm.line_chart_covid_daily_description
            }
            metadata={{ source: textGm.section_deceased_rivm.bronnen.rivm }}
          >
            {(timeframe) => (
              <TimeSeriesChart
                accessibility={{
                  key: 'deceased_over_time_chart',
                }}
                values={data.deceased_rivm.values}
                timeframe={timeframe}
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty: 'covid_daily_moving_average',
                    label:
                      textGm.section_deceased_rivm
                        .line_chart_covid_daily_legend_trend_label_moving_average,
                    shortLabel:
                      textGm.section_deceased_rivm
                        .line_chart_covid_daily_legend_trend_short_label_moving_average,
                    color: colors.data.primary,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'covid_daily',
                    label:
                      textGm.section_deceased_rivm
                        .line_chart_covid_daily_legend_trend_label,
                    shortLabel:
                      textGm.section_deceased_rivm
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
        </TileList>
      </GmLayout>
    </Layout>
  );
};

export default DeceasedMunicipalPage;
