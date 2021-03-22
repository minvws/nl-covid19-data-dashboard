import { useRouter } from 'next/router';
import Getest from '~/assets/test.svg';
import { ArticleStrip } from '~/components-styled/article-strip';
import { ArticleSummary } from '~/components-styled/article-teaser';
import { ChartTileWithTimeframe } from '~/components-styled/chart-tile';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { TileList } from '~/components-styled/tile-list';
import { TimeSeriesChart } from '~/components-styled/time-series-chart';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { municipalThresholds } from '~/components/choropleth/municipal-thresholds';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { createSelectMunicipalHandler } from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { createPositiveTestedPeopleMunicipalTooltip } from '~/components/choropleth/tooltips/municipal/create-positive-tested-people-municipal-tooltip';
import { Layout } from '~/domain/layout/layout';
import { MunicipalityLayout } from '~/domain/layout/municipality-layout';
import { useIntl } from '~/intl';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getGmData,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
export { getStaticPaths } from '~/static-paths/gm';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getGmData,
  createGetChoroplethData({
    gm: ({ tested_overall }) => ({ tested_overall }),
  }),
  createGetContent<{
    articles?: ArticleSummary[];
  }>((_context) => {
    // const { locale } = context;
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return createPageArticlesQuery('positiveTestsPage', locale);
  })
);

const PositivelyTestedPeople = (props: StaticProps<typeof getStaticProps>) => {
  const { data, choropleth, municipalityName, content, lastGenerated } = props;

  const { siteText } = useIntl();
  const text = siteText.gemeente_positief_geteste_personen;
  const lastValue = data.tested_overall.last_value;

  const router = useRouter();

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
      <MunicipalityLayout lastGenerated={lastGenerated}>
        <TileList>
          <ContentHeader
            category={siteText.gemeente_layout.headings.besmettingen}
            title={replaceVariablesInText(text.titel, {
              municipality: municipalityName,
            })}
            icon={<Getest />}
            subtitle={text.pagina_toelichting}
            metadata={{
              datumsText: text.datums,
              dateOrRange: lastValue.date_unix,
              dateOfInsertionUnix: lastValue.date_of_insertion_unix,
              dataSources: [text.bronnen.rivm],
            }}
            reference={text.reference}
          />

          <ArticleStrip articles={content.articles} />

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
                difference={data.difference.tested_overall__infected}
              />
              <Text
                as="div"
                dangerouslySetInnerHTML={{ __html: text.kpi_toelichting }}
              />
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
                difference={data.difference.tested_overall__infected_per_100k}
              />
              <Text>{text.barscale_toelichting}</Text>
            </KpiTile>
          </TwoKpiSection>

          <ChartTileWithTimeframe
            title={text.linechart_titel}
            description={text.linechart_toelichting}
            metadata={{
              source: text.bronnen.rivm,
            }}
          >
            {(timeframe) => (
              <TimeSeriesChart
                values={data.tested_overall.values}
                timeframe={timeframe}
                seriesConfig={[
                  {
                    type: 'area',
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
                  isPercentage: true,
                  benchmark: {
                    value: 7,
                    label: siteText.common.signaalwaarde,
                  },
                }}
              />
            )}
          </ChartTileWithTimeframe>

          <ChoroplethTile
            title={replaceVariablesInText(text.map_titel, {
              municipality: municipalityName,
            })}
            description={text.map_toelichting}
            legend={{
              thresholds: municipalThresholds.tested_overall.infected_per_100k,
              title:
                siteText.positief_geteste_personen.chloropleth_legenda.titel,
            }}
            metadata={{
              date: lastValue.date_unix,
              source: text.bronnen.rivm,
            }}
          >
            <MunicipalityChoropleth
              selectedCode={data.code}
              data={choropleth.gm}
              metricName="tested_overall"
              metricProperty="infected_per_100k"
              tooltipContent={createPositiveTestedPeopleMunicipalTooltip(
                siteText.choropleth_tooltip.positive_tested_people,
                municipalThresholds.tested_overall.infected_per_100k,
                createSelectMunicipalHandler(router, 'positief-geteste-mensen')
              )}
              onSelect={createSelectMunicipalHandler(
                router,
                'positief-geteste-mensen'
              )}
            />
          </ChoroplethTile>
        </TileList>
      </MunicipalityLayout>
    </Layout>
  );
};

export default PositivelyTestedPeople;
