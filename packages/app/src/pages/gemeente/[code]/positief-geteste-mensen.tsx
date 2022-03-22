import { colors } from '@corona-dashboard/common';
import { Test } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { DynamicChoropleth } from '~/components/choropleth';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { InView } from '~/components/in-view';
import { CollapsibleContent } from '~/components/collapsible';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { InlineText, Text } from '~/components/typography';
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
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  selectGmData,
  getLokalizeTexts,
} from '~/static-props/get-data';
import { filterByRegionMunicipalities } from '~/static-props/utils/filter-by-region-municipalities';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { getVrForMunicipalityCode } from '~/utils/get-vr-for-municipality-code';
import { useReverseRouter } from '~/utils/use-reverse-router';
export { getStaticPaths } from '~/static-paths/gm';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(
      (siteText) => ({
        textGm: siteText.pages.positiveTestsPage.gm,
        textShared: siteText.pages.positiveTestsPage.shared,
      }),
      locale
    ),
  getLastGeneratedDate,
  selectGmData(
    'code',
    'difference.tested_overall__infected_moving_average',
    'difference.tested_overall__infected_per_100k_moving_average',
    'static_values.population_count',
    'tested_overall'
  ),
  createGetChoroplethData({
    gm: ({ tested_overall }, context) => ({
      tested_overall: filterByRegionMunicipalities(tested_overall, context),
    }),
    vr: ({ tested_overall }) => ({ tested_overall }),
  }),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      const { locale } = context;
      return `{
       "parts": ${getPagePartsQuery('positiveTestsPage')},
       "elements": ${getElementsQuery('gm', ['tested_overall'], locale)}
      }`;
    })(context);
    return {
      content: {
        articles: getArticleParts(
          content.parts.pageParts,
          'positiveTestsPageArticles'
        ),
        elements: content.elements,
      },
    } as const;
  }
);

const PositivelyTestedPeople = (props: StaticProps<typeof getStaticProps>) => {
  const {
    pageText,
    selectedGmData: data,
    choropleth,
    municipalityName,
    content,
    lastGenerated,
  } = props;

  const { siteText, formatNumber, formatDateFromSeconds } = useIntl();
  const reverseRouter = useReverseRouter();
  const { textGm, textShared } = pageText;

  const lastValue = data.tested_overall.last_value;
  const populationCount = data.static_values.population_count;
  const vrForMunicipality = getVrForMunicipalityCode(data.code);
  const vrData = choropleth.vr.tested_overall.find(
    (v) => v.vrcode === vrForMunicipality?.code
  );
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
            title={replaceVariablesInText(textGm.titel, {
              municipality: municipalityName,
            })}
            icon={<Test />}
            description={textGm.pagina_toelichting}
            metadata={{
              datumsText: textGm.datums,
              dateOrRange: lastValue.date_unix,
              dateOfInsertionUnix: lastValue.date_of_insertion_unix,
              dataSources: [textGm.bronnen.rivm],
            }}
            referenceLink={textGm.reference.href}
            articles={content.articles}
            vrNameOrGmName={municipalityName}
            warning={textGm.warning}
          />

          <TwoKpiSection>
            <KpiTile
              title={textGm.infected_kpi.title}
              metadata={{
                date: lastValue.date_unix,
                source: textGm.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="infected_moving_average"
                absolute={lastValue.infected_moving_average_rounded}
                isAmount
              />
              <Text>
                {replaceComponentsInText(
                  siteText.gemeente_index.population_count,
                  {
                    municipalityName,
                    populationCount: (
                      <strong>{formatNumber(populationCount)}</strong>
                    ),
                  }
                )}
              </Text>
              <Markdown content={textGm.infected_kpi.description} />

              <Box spacing={3}>
                <Text variant="body2" fontWeight="bold">
                  {replaceComponentsInText(
                    textGm.infected_kpi.last_value_text,
                    {
                      infected: (
                        <InlineText color="data.primary">{`${formatNumber(
                          lastValue.infected
                        )}`}</InlineText>
                      ),
                      dateTo: formatDateFromSeconds(
                        lastValue.date_unix,
                        'weekday-medium'
                      ),
                    }
                  )}
                </Text>
                {textGm.infected_kpi.link_cta && (
                  <Markdown content={textGm.infected_kpi.link_cta} />
                )}
              </Box>
            </KpiTile>

            <KpiTile
              title={textGm.barscale_titel}
              metadata={{
                date: lastValue.date_unix,
                source: textGm.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="infected_per_100k_moving_average"
                absolute={lastValue.infected_per_100k_moving_average}
                isAmount
              />
              <Text>{textGm.barscale_toelichting}</Text>

              <CollapsibleContent
                label={
                  siteText.gemeente_index.population_count_explanation_title
                }
              >
                <Text>
                  {replaceComponentsInText(
                    textGm.population_count_explanation,
                    {
                      municipalityName: <strong>{municipalityName}</strong>,
                      value: (
                        <strong>
                          {formatNumber(
                            lastValue.infected_per_100k_moving_average
                          )}
                        </strong>
                      ),
                    }
                  )}
                </Text>
              </CollapsibleContent>
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            title={textGm.linechart_titel}
            description={textGm.linechart_toelichting}
            metadata={{
              source: textGm.bronnen.rivm,
            }}
            timeframeOptions={['all', '5weeks']}
          >
            {(timeframe) => (
              <TimeSeriesChart
                accessibility={{
                  key: 'confirmed_cases_infected_over_time_chart',
                }}
                values={data.tested_overall.values}
                timeframe={timeframe}
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty: 'infected_moving_average',
                    label: textShared.tooltip_labels.infected_moving_average,
                    color: colors.data.primary,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'infected',
                    label: textShared.tooltip_labels.infected,
                    color: colors.data.primary,
                  },
                ]}
                dataOptions={{
                  timelineEvents: getTimelineEvents(
                    content.elements.timeSeries,
                    'tested_overall'
                  ),
                }}
              />
            )}
          </ChartTile>

          <InView rootMargin="400px">
            <ChoroplethTile
              title={replaceVariablesInText(textGm.map_titel, {
                municipality: municipalityName,
              })}
              description={
                <>
                  <Markdown content={textGm.map_toelichting} />
                  <Text variant="body2" fontWeight="bold">
                    {replaceComponentsInText(textGm.map_last_value_text, {
                      infected_per_100k: (
                        <InlineText color="data.primary">{`${formatNumber(
                          lastValue.infected_per_100k
                        )}`}</InlineText>
                      ),
                      municipality: municipalityName,
                    })}
                  </Text>
                  <Text variant="body2" fontWeight="bold">
                    {replaceComponentsInText(
                      textGm.map_safety_region_last_value_text,
                      {
                        infected_per_100k: (
                          <InlineText color="data.primary">{`${formatNumber(
                            vrData?.infected_per_100k
                          )}`}</InlineText>
                        ),
                        safetyRegion: vrForMunicipality?.name,
                      }
                    )}
                  </Text>
                </>
              }
              legend={{
                thresholds: thresholds.gm.infected_per_100k,
                title: textShared.chloropleth_legenda.titel,
              }}
              metadata={{
                date: lastValue.date_unix,
                source: textGm.bronnen.rivm,
              }}
            >
              <DynamicChoropleth
                map="gm"
                accessibility={{
                  key: 'confirmed_cases_choropleth',
                }}
                data={choropleth.gm.tested_overall}
                dataConfig={{
                  metricName: 'tested_overall',
                  metricProperty: 'infected_per_100k',
                  dataFormatters: {
                    infected: formatNumber,
                    infected_per_100k: formatNumber,
                  },
                }}
                dataOptions={{
                  selectedCode: data.code,
                  highlightSelection: true,
                  getLink: reverseRouter.gm.positiefGetesteMensen,
                }}
              />
            </ChoroplethTile>
          </InView>
        </TileList>
      </GmLayout>
    </Layout>
  );
};

export default PositivelyTestedPeople;
