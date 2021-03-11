import css from '@styled-system/css';
import { useRouter } from 'next/router';
import Afname from '~/assets/afname.svg';
import Getest from '~/assets/test.svg';
import { Anchor } from '~/components-styled/anchor';
import { ArticleStrip } from '~/components-styled/article-strip';
import { ArticleSummary } from '~/components-styled/article-teaser';
import { Box } from '~/components-styled/base';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { PageBarScale } from '~/components-styled/page-barscale';
import { SEOHead } from '~/components-styled/seo-head';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Heading, Text } from '~/components-styled/typography';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { createSelectMunicipalHandler } from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { createPositiveTestedPeopleMunicipalTooltip } from '~/components/choropleth/tooltips/municipal/create-positive-tested-people-municipal-tooltip';
import regionCodeToMunicipalCodeLookup from '~/data/regionCodeToMunicipalCodeLookup';
import { FCWithLayout } from '~/domain/layout/layout';
import { getSafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  getText,
  getVrData,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import {
  formatDateFromMilliseconds,
  formatDateFromSeconds,
} from '~/utils/formatDate';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { replaceKpisInText } from '~/utils/replaceKpisInText';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getText,
  getVrData,
  createGetChoroplethData({
    gm: ({ tested_overall }) => ({ tested_overall }),
  }),
  createGetContent<{
    articles?: ArticleSummary[];
  }>(createPageArticlesQuery('positiveTestsPage'))
);

const PositivelyTestedPeople: FCWithLayout<typeof getStaticProps> = (props) => {
  const { data, choropleth, safetyRegionName, text: siteText, content } = props;

  const text = siteText.veiligheidsregio_positief_geteste_personen;
  const ggdText = siteText.veiligheidsregio_positief_geteste_personen_ggd;

  const router = useRouter();

  const lastValue = data.tested_overall.last_value;
  const ggdAverageLastValue = data.tested_ggd_average.last_value;
  const ggdDailyValues = data.tested_ggd_daily.values;

  const municipalCodes = regionCodeToMunicipalCodeLookup[data.code];
  const selectedMunicipalCode = municipalCodes ? municipalCodes[0] : undefined;

  return (
    <>
      <SEOHead
        title={replaceVariablesInText(text.metadata.title, {
          safetyRegionName,
        })}
        description={replaceVariablesInText(text.metadata.description, {
          safetyRegionName,
        })}
      />
      <TileList>
        <ContentHeader
          category={siteText.veiligheidsregio_layout.headings.besmettingen}
          screenReaderCategory={
            siteText.positief_geteste_personen.titel_sidebar
          }
          title={replaceVariablesInText(text.titel, {
            safetyRegion: safetyRegionName,
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
              absolute={Math.round(lastValue.infected)}
              difference={data.difference.tested_overall__infected}
            />

            <Text
              as="div"
              dangerouslySetInnerHTML={{ __html: text.kpi_toelichting }}
            />

            <Box>
              <Heading level={4} fontSize={'1.2em'} mt={'1.5em'} mb={0}>
                <span
                  css={css({ '& > span': { color: 'data.primary' } })}
                  dangerouslySetInnerHTML={{
                    __html: replaceKpisInText(ggdText.summary_title, [
                      {
                        name: 'percentage',
                        value: `${formatPercentage(
                          ggdAverageLastValue.infected_percentage
                        )}%`,
                      },
                    ]),
                  }}
                />
              </Heading>
              <Text mt={0} lineHeight={1}>
                <Anchor name="ggd" text={ggdText.summary_link_cta} />
              </Text>
            </Box>
          </KpiTile>

          <KpiTile
            title={text.barscale_titel}
            metadata={{
              date: lastValue.date_unix,
              source: text.bronnen.rivm,
            }}
          >
            <PageBarScale
              data={data}
              scope="vr"
              metricName="tested_overall"
              metricProperty="infected_per_100k"
              localeTextKey="veiligheidsregio_positief_geteste_personen"
              differenceKey="tested_overall__infected_per_100k"
            />
            <Text>{text.barscale_toelichting}</Text>
          </KpiTile>
        </TwoKpiSection>

        <LineChartTile
          title={text.linechart_titel}
          description={text.linechart_toelichting}
          signaalwaarde={7}
          values={data.tested_overall.values}
          linesConfig={[
            {
              metricProperty: 'infected_per_100k',
            },
          ]}
          metadata={{ source: text.bronnen.rivm }}
          formatTooltip={(values) => {
            const value = values[0];

            return (
              <Text textAlign="center" m={0}>
                <span style={{ fontWeight: 'bold' }}>
                  {formatDateFromMilliseconds(value.__date.getTime(), 'medium')}
                </span>
                <br />
                <span
                  style={{
                    height: '0.5em',
                    width: '0.5em',
                    marginBottom: '0.5px',
                    backgroundColor: colors.data.primary,
                    borderRadius: '50%',
                    display: 'inline-block',
                  }}
                />{' '}
                {replaceVariablesInText(
                  siteText.common.tooltip.positive_tested_value,
                  {
                    totalPositiveValue: formatNumber(value.__value),
                  }
                )}
                <br />
                {replaceVariablesInText(
                  siteText.common.tooltip.positive_tested_people,
                  {
                    totalPositiveTestedPeople: formatNumber(value.infected),
                  }
                )}
              </Text>
            );
          }}
        />

        <ChoroplethTile
          title={replaceVariablesInText(text.map_titel, {
            safetyRegion: safetyRegionName,
          })}
          metadata={{
            date: lastValue.date_unix,
            source: text.bronnen.rivm,
          }}
          description={text.map_toelichting}
          legend={{
            title: siteText.positief_geteste_personen.chloropleth_legenda.titel,
            thresholds: regionThresholds.tested_overall.infected_per_100k,
          }}
        >
          <MunicipalityChoropleth
            selectedCode={selectedMunicipalCode}
            highlightSelection={false}
            data={choropleth.gm}
            metricName="tested_overall"
            metricProperty="infected_per_100k"
            tooltipContent={createPositiveTestedPeopleMunicipalTooltip(
              siteText.choropleth_tooltip.positive_tested_people,
              regionThresholds.tested_overall.infected_per_100k,
              createSelectMunicipalHandler(router, 'positief-geteste-mensen')
            )}
            onSelect={createSelectMunicipalHandler(
              router,
              'positief-geteste-mensen'
            )}
          />
        </ChoroplethTile>

        <ContentHeader
          id="ggd"
          title={replaceVariablesInText(ggdText.titel, {
            safetyRegion: safetyRegionName,
          })}
          skipLinkAnchor={true}
          icon={<Afname />}
          subtitle={ggdText.toelichting}
          metadata={{
            datumsText: ggdText.datums,
            dateOfInsertionUnix: ggdAverageLastValue.date_of_insertion_unix,
            dateOrRange: {
              start: ggdAverageLastValue.date_start_unix,
              end: ggdAverageLastValue.date_end_unix,
            },
            dataSources: [ggdText.bronnen.rivm],
          }}
          reference={text.reference}
        />

        <TwoKpiSection>
          <KpiTile
            title={ggdText.totaal_getest_week_titel}
            metadata={{
              date: [
                ggdAverageLastValue.date_start_unix,
                ggdAverageLastValue.date_end_unix,
              ],
              source: ggdText.bronnen.rivm,
            }}
          >
            <KpiValue
              absolute={ggdAverageLastValue.tested_total}
              difference={data.difference.tested_ggd_average__tested_total}
            />
            <Text>{ggdText.totaal_getest_week_uitleg}</Text>
          </KpiTile>
          <KpiTile
            title={ggdText.positief_getest_week_titel}
            metadata={{
              date: ggdAverageLastValue.date_end_unix,
              source: ggdText.bronnen.rivm,
            }}
          >
            <KpiValue
              percentage={ggdAverageLastValue.infected_percentage}
              difference={
                data.difference.tested_ggd_average__infected_percentage
              }
            />
            <Text>{ggdText.positief_getest_week_uitleg}</Text>
            <Text>
              <strong
                css={css({ '& > span': { color: 'data.primary' } })}
                dangerouslySetInnerHTML={{
                  __html: replaceKpisInText(
                    ggdText.positief_getest_getest_week_uitleg,
                    [
                      {
                        name: 'numerator',
                        value: formatNumber(ggdAverageLastValue.infected),
                      },
                      {
                        name: 'denominator',
                        value: formatNumber(ggdAverageLastValue.tested_total),
                      },
                    ]
                  ),
                }}
              />
            </Text>
          </KpiTile>
        </TwoKpiSection>

        <LineChartTile
          timeframeOptions={['all', '5weeks']}
          title={ggdText.linechart_percentage_titel}
          description={ggdText.linechart_percentage_toelichting}
          values={ggdDailyValues}
          linesConfig={[
            {
              metricProperty: 'infected_percentage',
            },
          ]}
          isPercentage
          metadata={{
            source: ggdText.bronnen.rivm,
          }}
        />

        <LineChartTile
          timeframeOptions={['all', '5weeks']}
          title={ggdText.linechart_totaltests_titel}
          description={ggdText.linechart_totaltests_toelichting}
          hideFill={true}
          showLegend
          padding={{
            left: 45,
          }}
          values={ggdDailyValues}
          linesConfig={[
            {
              metricProperty: 'tested_total',
              color: colors.data.secondary,
              legendLabel: ggdText.linechart_totaltests_legend_label,
            },
            {
              metricProperty: 'infected',
              color: colors.data.primary,
              legendLabel: ggdText.linechart_positivetests_legend_label,
            },
          ]}
          metadata={{
            source: ggdText.bronnen.rivm,
          }}
          formatTooltip={(x) => {
            const numerator = x[0].__value;
            const denominator = x[1].__value;

            const percentage =
              numerator === 0 ? 0 : (denominator * 100) / numerator;

            return (
              <>
                {formatDateFromSeconds(x[0].date_unix, 'medium')}
                <br />
                <span
                  style={{
                    height: '0.5em',
                    width: '0.5em',
                    backgroundColor: colors.data.secondary,
                    borderRadius: '50%',
                    display: 'inline-block',
                  }}
                />{' '}
                {formatNumber(numerator)}
                <br />
                <span
                  style={{
                    height: '0.5em',
                    width: '0.5em',
                    backgroundColor: colors.data.primary,
                    borderRadius: '50%',
                    display: 'inline-block',
                  }}
                />{' '}
                {formatNumber(denominator)} ({formatPercentage(percentage)}%)
              </>
            );
          }}
        />
      </TileList>
    </>
  );
};

PositivelyTestedPeople.getLayout = getSafetyRegionLayout();

export default PositivelyTestedPeople;
