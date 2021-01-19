import css from '@styled-system/css';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Afname from '~/assets/afname.svg';
import Getest from '~/assets/test.svg';
import {
  AgeDemographic,
  formatAgeGroupRange,
} from '~/components-styled/age-demographic';
import { Anchor } from '~/components-styled/anchor';
import { Box } from '~/components-styled/base';
import { RegionControlOption } from '~/components-styled/chart-region-controls';
import { ChartTile } from '~/components-styled/chart-tile';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { PageBarScale } from '~/components-styled/page-barscale';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Heading, Text } from '~/components-styled/typography';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectMunicipalHandler } from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { createPositiveTestedPeopleMunicipalTooltip } from '~/components/choropleth/tooltips/municipal/create-positive-tested-people-municipal-tooltip';
import { createPositiveTestedPeopleRegionalTooltip } from '~/components/choropleth/tooltips/region/create-positive-tested-people-regional-tooltip';
import { SEOHead } from '~/components/seoHead';
import { FCWithLayout } from '~/domain/layout/layout';
import { getNationalLayout } from '~/domain/layout/national-layout';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  getLastGeneratedDate,
  getNlData,
  getText,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { NationalTestedPerAgeGroup } from '@corona-dashboard/common';
import { assert } from '~/utils/assert';
import {
  formatDateFromMilliseconds,
  formatDateFromSeconds,
} from '~/utils/formatDate';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { replaceKpisInText } from '~/utils/replaceKpisInText';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getText,
  getNlData,
  createGetChoroplethData({
    gm: ({ tested_overall }) => ({ tested_overall }),
    vr: ({ tested_overall }) => ({ tested_overall }),
  })
);

const PositivelyTestedPeople: FCWithLayout<typeof getStaticProps> = ({
  data,
  choropleth,
  text: siteText,
}) => {
  const text = siteText.positief_geteste_personen;
  const ggdText = siteText.positief_geteste_personen_ggd;
  const [selectedMap, setSelectedMap] = useState<RegionControlOption>(
    'municipal'
  );
  const router = useRouter();

  const dataInfectedDelta = data.tested_overall;
  const dataGgdAverageLastValue = data.tested_ggd_average.last_value;
  const dataGgdDailyValues = data.tested_ggd_daily.values;

  const ageDemographicExampleData = getAgeDemographicExampleData(
    data.tested_per_age_group
  );

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <TileList>
        <ContentHeader
          category={siteText.nationaal_layout.headings.besmettingen}
          screenReaderCategory={
            siteText.positief_geteste_personen.titel_sidebar
          }
          title={text.titel}
          icon={<Getest />}
          subtitle={text.pagina_toelichting}
          metadata={{
            datumsText: text.datums,
            dateOrRange: dataInfectedDelta.last_value.date_unix,
            dateOfInsertionUnix:
              dataInfectedDelta.last_value.date_of_insertion_unix,
            dataSources: [text.bronnen.rivm],
          }}
          reference={text.reference}
        />

        <TwoKpiSection>
          <KpiTile
            title={text.kpi_titel}
            metadata={{
              date: dataInfectedDelta.last_value.date_unix,
              source: text.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="infected"
              absolute={data.tested_overall.last_value.infected}
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
                          dataGgdAverageLastValue.infected_percentage
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
            data-cy="infected_per_100k"
            metadata={{
              date: dataInfectedDelta.last_value.date_unix,
              source: text.bronnen.rivm,
            }}
          >
            <PageBarScale
              data={data}
              scope="nl"
              metricName="tested_overall"
              metricProperty="infected_per_100k"
              localeTextKey="positief_geteste_personen"
              differenceKey="tested_overall__infected_per_100k"
            />

            <Text>{text.barscale_toelichting}</Text>
          </KpiTile>
        </TwoKpiSection>

        <ChoroplethTile
          data-cy="choropleths"
          title={text.map_titel}
          metadata={{
            date: dataInfectedDelta.last_value.date_unix,
            source: text.bronnen.rivm,
          }}
          description={text.map_toelichting}
          onChartRegionChange={setSelectedMap}
          chartRegion={selectedMap}
          legend={{
            title: text.chloropleth_legenda.titel,
            thresholds: regionThresholds.tested_overall.infected_per_100k,
          }}
        >
          {/**
           * It's probably a good idea to abstract this even further, so that
           * the switching of charts, and the state involved, are all handled by
           * the component. The page does not have to be bothered with this.
           *
           * Ideally the ChoroplethTile would receive some props with the data
           * it needs to render either Choropleth without it caring about
           * MunicipalityChloropleth or SafetyRegionChloropleth, that data would
           * make the chart and define the tooltip layout for each, but maybe for
           * now that is a bridge too far. Let's take it one step at a time.
           */}
          {selectedMap === 'municipal' && (
            <MunicipalityChoropleth
              data={choropleth.gm}
              metricName="tested_overall"
              metricProperty="infected_per_100k"
              tooltipContent={createPositiveTestedPeopleMunicipalTooltip(
                createSelectMunicipalHandler(router)
              )}
              onSelect={createSelectMunicipalHandler(router)}
            />
          )}
          {selectedMap === 'region' && (
            <SafetyRegionChoropleth
              data={choropleth.vr}
              metricName="tested_overall"
              metricProperty="infected_per_100k"
              tooltipContent={createPositiveTestedPeopleRegionalTooltip(
                createSelectRegionHandler(router, 'positief-geteste-mensen')
              )}
              onSelect={createSelectRegionHandler(
                router,
                'positief-geteste-mensen'
              )}
            />
          )}
        </ChoroplethTile>

        <LineChartTile
          title={text.linechart_titel}
          description={text.linechart_toelichting}
          signaalwaarde={7}
          values={dataInfectedDelta.values}
          linesConfig={[{ metricProperty: 'infected_per_100k' }]}
          metadata={{
            source: text.bronnen.rivm,
          }}
          formatTooltip={(values) => {
            const value = values[0];

            return (
              <Text textAlign="center" m={0}>
                <span style={{ fontWeight: 'bold' }}>
                  {formatDateFromMilliseconds(value.__date.getTime())}
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

        <ChartTile
          title={siteText.infected_age_groups.title}
          description={replaceVariablesInText(
            siteText.infected_age_groups.description,
            ageDemographicExampleData
          )}
          metadata={{
            date: dataInfectedDelta.last_value.date_unix,
            source: text.bronnen.rivm,
          }}
        >
          <AgeDemographic
            data={data.tested_per_age_group}
            metricProperty="infected_percentage"
            text={siteText.infected_age_groups.graph}
          />
        </ChartTile>

        <ContentHeader
          title={ggdText.titel}
          skipLinkAnchor={true}
          id="ggd"
          icon={<Afname />}
          subtitle={ggdText.toelichting}
          metadata={{
            datumsText: ggdText.datums,
            dateOrRange: {
              start: dataGgdAverageLastValue.date_start_unix,
              end: dataGgdAverageLastValue.date_end_unix,
            },
            dateOfInsertionUnix: dataGgdAverageLastValue.date_of_insertion_unix,
            dataSources: [ggdText.bronnen.rivm],
          }}
          reference={text.reference}
        />

        <TwoKpiSection>
          <KpiTile
            title={ggdText.totaal_getest_week_titel}
            metadata={{
              date: [
                dataGgdAverageLastValue.date_start_unix,
                dataGgdAverageLastValue.date_end_unix,
              ],
              source: ggdText.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="ggd_tested_total"
              absolute={dataGgdAverageLastValue.tested_total}
              difference={data.difference.tested_ggd_average__tested_total}
            />
            <Text>{ggdText.totaal_getest_week_uitleg}</Text>
          </KpiTile>
          <KpiTile
            title={ggdText.positief_getest_week_titel}
            metadata={{
              date: [
                dataGgdAverageLastValue.date_start_unix,
                dataGgdAverageLastValue.date_end_unix,
              ],
              source: ggdText.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="ggd_infected"
              percentage={dataGgdAverageLastValue.infected_percentage}
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
                        value: formatNumber(dataGgdAverageLastValue.infected),
                      },
                      {
                        name: 'denominator',
                        value: formatNumber(
                          dataGgdAverageLastValue.tested_total
                        ),
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
          values={dataGgdDailyValues}
          linesConfig={[{ metricProperty: 'infected_percentage' }]}
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
          values={dataGgdDailyValues}
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
            const percentage = (x[1].__value * 100) / x[0].__value;

            return (
              <>
                {formatDateFromSeconds(x[0].date_unix, 'short')}
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
                {formatNumber(x[0].__value)}
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
                {formatNumber(x[1].__value)} ({formatPercentage(percentage)}%)
              </>
            );
          }}
        />
      </TileList>
    </>
  );
};

PositivelyTestedPeople.getLayout = getNationalLayout;

export default PositivelyTestedPeople;

/* Retrieves certain age demographic data to be used in the example text. */
function getAgeDemographicExampleData(data: NationalTestedPerAgeGroup) {
  const ageGroupRange = '20-29';
  const value = data.values.find((x) => x.age_group_range === ageGroupRange);

  assert(
    value,
    `NationalTestedPerAgeGroup should contain a value for age group ${ageGroupRange}`
  );

  return {
    ageGroupRange: formatAgeGroupRange(ageGroupRange),
    ageGroupPercentage: `${formatPercentage(
      value.age_group_percentage * 100
    )}%`,
    infectedPercentage: `${formatPercentage(value.infected_percentage * 100)}%`,
  };
}
