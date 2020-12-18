import css from '@styled-system/css';
import { useRouter } from 'next/router';
import Afname from '~/assets/afname.svg';
import Getest from '~/assets/test.svg';
import { Anchor } from '~/components-styled/anchor';
import { Box } from '~/components-styled/base';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { MultipleLineChartTile } from '~/components-styled/multiple-line-chart-tile';
import { PageBarScale } from '~/components-styled/page-barscale';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Heading, Text } from '~/components-styled/typography';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { createSelectMunicipalHandler } from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { createPositiveTestedPeopleMunicipalTooltip } from '~/components/choropleth/tooltips/municipal/create-positive-tested-people-municipal-tooltip';
import { FCWithLayout } from '~/domain/layout/layout';
import { getSafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import { SEOHead } from '~/components/seoHead';
import regionCodeToMunicipalCodeLookup from '~/data/regionCodeToMunicipalCodeLookup';
import {
  getSafetyRegionPaths,
  getSafetyRegionStaticProps,
  ISafetyRegionData,
} from '~/static-props/safetyregion-data';
import { colors } from '~/style/theme';
import { ResultsPerRegion } from '~/types/data.d';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { replaceKpisInText } from '~/utils/replaceKpisInText';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const PostivelyTestedPeople: FCWithLayout<ISafetyRegionData> = (props) => {
  const { data, safetyRegionName, text: siteText } = props;

  const text = siteText.veiligheidsregio_positief_geteste_personen;
  const ggdText = siteText.veiligheidsregio_positief_geteste_personen_ggd;

  const router = useRouter();

  const resultsPerRegion: ResultsPerRegion = data.results_per_region;

  const ggdData = data.ggd.last_value;
  const ggdValues = data.ggd.values;

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
          title={replaceVariablesInText(text.titel, {
            safetyRegion: safetyRegionName,
          })}
          icon={<Getest />}
          subtitle={text.pagina_toelichting}
          metadata={{
            datumsText: text.datums,
            dateInfo: resultsPerRegion.last_value.date_of_report_unix,
            dateOfInsertionUnix:
              resultsPerRegion.last_value.date_of_insertion_unix,
            dataSources: [text.bronnen.rivm],
          }}
          reference={text.reference}
        />

        <TwoKpiSection>
          <KpiTile
            title={text.barscale_titel}
            metadata={{
              date: resultsPerRegion.last_value.date_of_report_unix,
              source: text.bronnen.rivm,
            }}
          >
            <PageBarScale
              data={data}
              scope="vr"
              metricName="results_per_region"
              metricProperty="infected_increase_per_region"
              localeTextKey="veiligheidsregio_positief_geteste_personen"
              differenceKey="results_per_region__infected_increase_per_region"
            />
            <Text>{text.barscale_toelichting}</Text>
          </KpiTile>

          <KpiTile
            title={text.kpi_titel}
            metadata={{
              date: resultsPerRegion.last_value.date_of_report_unix,
              source: text.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="total_reported_increase_per_region"
              absolute={Math.round(
                resultsPerRegion.last_value.total_reported_increase_per_region
              )}
              difference={
                data.difference
                  .results_per_region__total_reported_increase_per_region
              }
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
                          ggdData.infected_percentage
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
        </TwoKpiSection>

        <LineChartTile
          title={text.linechart_titel}
          description={text.linechart_toelichting}
          signaalwaarde={7}
          values={resultsPerRegion.values.map((value) => ({
            value: value.infected_increase_per_region,
            date: value.date_of_report_unix,
          }))}
          metadata={{ source: text.bronnen.rivm }}
        />

        <ChoroplethTile
          title={replaceVariablesInText(text.map_titel, {
            safetyRegion: safetyRegionName,
          })}
          metadata={{
            date: resultsPerRegion.last_value.date_of_report_unix,
            source: text.bronnen.rivm,
          }}
          description={text.map_toelichting}
          legend={{
            title: siteText.positief_geteste_personen.chloropleth_legenda.titel,
            thresholds:
              regionThresholds.positive_tested_people.positive_tested_people,
          }}
        >
          <MunicipalityChoropleth
            selected={selectedMunicipalCode}
            highlightSelection={false}
            metricName="positive_tested_people"
            metricProperty="positive_tested_people"
            tooltipContent={createPositiveTestedPeopleMunicipalTooltip(
              createSelectMunicipalHandler(router)
            )}
            onSelect={createSelectMunicipalHandler(router)}
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
            dateOfInsertionUnix: ggdData.date_of_insertion_unix,
            dateInfo: {
              weekStartUnix: ggdData.week_start_unix,
              weekEndUnix: ggdData.week_end_unix,
            },
            dataSources: [ggdText.bronnen.rivm],
          }}
          reference={text.reference}
        />

        <TwoKpiSection>
          <KpiTile
            title={ggdText.totaal_getest_week_titel}
            metadata={{
              date: [ggdData.week_start_unix, ggdData.week_end_unix],
              source: ggdText.bronnen.rivm,
            }}
          >
            <KpiValue
              absolute={ggdData.tested_total}
              difference={data.difference.ggd__tested_total}
            />
            <Text>{ggdText.totaal_getest_week_uitleg}</Text>
          </KpiTile>
          <KpiTile
            title={ggdText.positief_getest_week_titel}
            metadata={{
              date: [ggdData.week_start_unix, ggdData.week_end_unix],
              source: ggdText.bronnen.rivm,
            }}
          >
            <KpiValue
              percentage={ggdData.infected_percentage}
              difference={data.difference.ggd__infected_percentage}
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
                        value: formatNumber(ggdData.infected),
                      },
                      {
                        name: 'denominator',
                        value: formatNumber(ggdData.tested_total),
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
          values={ggdValues.map((value) => ({
            value: value.infected_percentage,
            date: value.week_unix,
            week: {
              start: value.week_start_unix,
              end: value.week_end_unix,
            },
          }))}
          formatTooltip={(x) => {
            return `<strong>${formatDateFromSeconds(
              x.week.start,
              'short'
            )} - ${formatDateFromSeconds(
              x.week.end,
              'short'
            )}:</strong> ${formatPercentage(x.value)}%`;
          }}
          formatYAxis={(y: number) => {
            return `${formatPercentage(y)}%`;
          }}
          metadata={{
            source: ggdText.bronnen.rivm,
          }}
        />

        <MultipleLineChartTile
          timeframeOptions={['all', '5weeks']}
          title={ggdText.linechart_totaltests_titel}
          description={ggdText.linechart_totaltests_toelichting}
          values={[
            ggdValues.map((value) => ({
              value: value.tested_total,
              date: value.week_unix,
              week: {
                start: value.week_start_unix,
                end: value.week_end_unix,
              },
            })),
            ggdValues.map((value) => ({
              value: value.infected,
              date: value.week_unix,
              week: {
                start: value.week_start_unix,
                end: value.week_end_unix,
              },
            })),
          ]}
          linesConfig={[
            {
              color: colors.data.secondary,
              legendLabel: ggdText.linechart_totaltests_legend_label,
            },
            {
              color: colors.data.primary,
              legendLabel: ggdText.linechart_positivetests_legend_label,
            },
          ]}
          metadata={{
            source: ggdText.bronnen.rivm,
          }}
        />
      </TileList>
    </>
  );
};

PostivelyTestedPeople.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionStaticProps;
export const getStaticPaths = getSafetyRegionPaths();

export default PostivelyTestedPeople;
