import { Test } from '@corona-dashboard/icons';
import dynamic from 'next/dynamic';import { ChartTile } from '~/components/chart-tile';
import { ChoroplethComponent } from '~/components/choropleth';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { CollapsibleContent } from '~/components/collapsible';
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
import {
  createElementsQuery,
  ElementsQueryResult,
  getTimelineEvents,
} from '~/queries/create-elements-query';
import {
  createPageArticlesQuery,
  PageArticlesQueryResult,
} from '~/queries/create-page-articles-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  selectGmPageMetricData,
} from '~/static-props/get-data';
import { filterByRegionMunicipalities } from '~/static-props/utils/filter-by-region-municipalities';
import { colors } from '~/style/theme';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';
export { getStaticPaths } from '~/static-paths/gm';

const DynamicChoropleth = dynamic(
  () => import('../../../components/choropleth').then((mod) => mod.Choropleth),
  {
    ssr: false,
    loading: () => <p>Loading component...</p>,
  }
) as ChoroplethComponent;

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectGmPageMetricData(
    'static_values',
    'tested_overall',
    'difference',
    'code'
  ),
  createGetChoroplethData({
    gm: ({ tested_overall }, context) => ({
      tested_overall: filterByRegionMunicipalities(tested_overall, context),
    }),
  }),
  createGetContent<{
    page: PageArticlesQueryResult;
    elements: ElementsQueryResult;
  }>((context) => {
    const { locale } = context;
    return `{
      "page": ${createPageArticlesQuery('positiveTestsPage', locale)},
      "elements": ${createElementsQuery('gm', ['tested_overall'], locale)}
    }`;
  })
);

const PositivelyTestedPeople = (props: StaticProps<typeof getStaticProps>) => {
  const {
    selectedGmData: data,
    sideBarData,
    choropleth,
    municipalityName,
    content,
    lastGenerated,
  } = props;

  const { siteText, formatNumber } = useIntl();
  const reverseRouter = useReverseRouter();
  const text = siteText.gemeente_positief_geteste_personen;
  const lastValue = data.tested_overall.last_value;
  const populationCount = data.static_values.population_count;

  const metadata = {
    ...siteText.gemeente_index.metadata,
    title: replaceVariablesInText(text.metadata.title, {
      municipalityName,
    }),
    description: replaceVariablesInText(text.metadata.description, {
      municipalityName,
    }),
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <GmLayout
        data={sideBarData}
        code={data.code}
        difference={data.difference}
        municipalityName={municipalityName}
        lastGenerated={lastGenerated}
      >
        <TileList>
          <PageInformationBlock
            category={siteText.gemeente_layout.headings.besmettingen}
            title={replaceVariablesInText(text.titel, {
              municipality: municipalityName,
            })}
            icon={<Test />}
            description={text.pagina_toelichting}
            metadata={{
              datumsText: text.datums,
              dateOrRange: lastValue.date_unix,
              dateOfInsertionUnix: lastValue.date_of_insertion_unix,
              dataSources: [text.bronnen.rivm],
            }}
            referenceLink={text.reference.href}
            articles={content.page.articles}
          />

          <TwoKpiSection>
            <KpiTile
              title={text.kpi_titel}
              metadata={{
                date: lastValue.date_unix,
                source: text.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="infected"
                absolute={lastValue.infected}
                difference={
                  data.difference.tested_overall__infected_moving_average
                }
                isMovingAverageDifference
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
              <Markdown content={text.kpi_toelichting} />
            </KpiTile>

            <KpiTile
              title={text.barscale_titel}
              metadata={{
                date: lastValue.date_unix,
                source: text.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="infected_per_100k"
                absolute={lastValue.infected_per_100k}
                difference={
                  data.difference
                    .tested_overall__infected_per_100k_moving_average
                }
                isMovingAverageDifference
              />
              <Text>{text.barscale_toelichting}</Text>

              <CollapsibleContent
                label={
                  siteText.gemeente_index.population_count_explanation_title
                }
              >
                <Text>
                  {replaceComponentsInText(text.population_count_explanation, {
                    municipalityName: <strong>{municipalityName}</strong>,
                    value: (
                      <strong>
                        {formatNumber(lastValue.infected_per_100k)}
                      </strong>
                    ),
                  })}
                </Text>
              </CollapsibleContent>
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            title={text.linechart_titel}
            description={text.linechart_toelichting}
            metadata={{
              source: text.bronnen.rivm,
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
                    metricProperty: 'infected_per_100k_moving_average',
                    label:
                      siteText.positief_geteste_personen.tooltip_labels
                        .infected_per_100k_moving_average,
                    color: colors.data.primary,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'infected_per_100k',
                    label:
                      siteText.positief_geteste_personen.tooltip_labels
                        .infected_per_100k,
                    color: colors.data.primary,
                  },
                  {
                    type: 'invisible',
                    metricProperty: 'infected',
                    label: siteText.common.totaal,
                  },
                ]}
                dataOptions={{
                  benchmark: {
                    value: 7,
                    label: siteText.common.signaalwaarde,
                  },
                  timelineEvents: getTimelineEvents(
                    content.elements.timeSeries,
                    'tested_overall'
                  ),
                }}
              />
            )}
          </ChartTile>

          <ChoroplethTile
            title={replaceVariablesInText(text.map_titel, {
              municipality: municipalityName,
            })}
            description={text.map_toelichting}
            legend={{
              thresholds: thresholds.gm.infected_per_100k,
              title:
                siteText.positief_geteste_personen.chloropleth_legenda.titel,
            }}
            metadata={{
              date: lastValue.date_unix,
              source: text.bronnen.rivm,
            }}
          >
            <DynamicChoropleth
              map="gm"
              accessibility={{
                key: 'confirmed_cases_choropleth',
              }}
              data={choropleth.gm.tested_overall}
              dataConfig={{
                metricProperty: 'infected_per_100k',
              }}
              dataOptions={{
                selectedCode: data.code,
                highlightSelection: true,
                getLink: reverseRouter.gm.positiefGetesteMensen,
              }}
            />
          </ChoroplethTile>
        </TileList>
      </GmLayout>
    </Layout>
  );
};

export default PositivelyTestedPeople;
