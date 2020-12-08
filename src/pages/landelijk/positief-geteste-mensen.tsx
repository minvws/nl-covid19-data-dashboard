import css from '@styled-system/css';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Afname from '~/assets/afname.svg';
import Getest from '~/assets/test.svg';
import { Anchor } from '~/components-styled/anchor';
import { Box } from '~/components-styled/base';
import { RegionControlOption } from '~/components-styled/chart-region-controls';
import { ChartTile } from '~/components-styled/chart-tile';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { MultipleLineChartTile } from '~/components-styled/multiple-line-chart-tile';
import { PageBarScale } from '~/components-styled/page-barscale';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Heading, Text } from '~/components-styled/typography';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectMunicipalHandler } from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { createPositiveTestedPeopleMunicipalTooltip } from '~/components/choropleth/tooltips/municipal/create-positive-tested-people-municipal-tooltip';
import { createPositiveTestedPeopleRegionalTooltip } from '~/components/choropleth/tooltips/region/create-positive-tested-people-regional-tooltip';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { SEOHead } from '~/components/seoHead';
import { AgeDemographic } from '~/domain/infected-people/age-demographic/age-demographic';
import { formatAgeGroupRange } from '~/domain/infected-people/age-demographic/age-demographic-chart';
import siteText from '~/locale/index';
import {
  getNationalStaticProps,
  NationalPageProps,
} from '~/static-props/nl-data';
import { colors } from '~/style/theme';
import { NationalInfectedAgeGroups } from '~/types/data.d';
import { assert } from '~/utils/assert';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { replaceKpisInText } from '~/utils/replaceKpisInText';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.positief_geteste_personen;
const ggdText = siteText.positief_geteste_personen_ggd;

/* Retrieves certain age demographic data to be used in the example text. */
function getAgeDemographicExampleData(data: NationalInfectedAgeGroups) {
  const ageGroupRange = '20-29';
  const value = data.values.find((x) => x.age_group_range === ageGroupRange);

  assert(
    value,
    `NationalInfectedAgeGroups should contain a value for age group ${ageGroupRange}`
  );

  return {
    ageGroupRange: formatAgeGroupRange(ageGroupRange),
    ageGroupPercentage: `${formatPercentage(
      value.age_group_percentage * 100
    )}%`,
    infectedPercentage: `${formatPercentage(value.infected_percentage * 100)}%`,
  };
}

const PositivelyTestedPeople: FCWithLayout<NationalPageProps> = ({ data }) => {
  const [selectedMap, setSelectedMap] = useState<RegionControlOption>(
    'municipal'
  );
  const router = useRouter();

  const dataInfectedDelta = data.infected_people_delta_normalized;
  const dataGgdLastValue = data.ggd.last_value;
  const dataGgdValues = data.ggd.values;

  const ageDemographicExampleData = getAgeDemographicExampleData(
    data.infected_age_groups
  );

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <ContentHeader
        category={siteText.nationaal_layout.headings.besmettingen}
        screenReaderCategory={siteText.positief_geteste_personen.titel_sidebar}
        title={text.titel}
        icon={<Getest />}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateInfo: dataInfectedDelta.last_value.date_of_report_unix,
          dateOfInsertionUnix:
            dataInfectedDelta.last_value.date_of_insertion_unix,
          dataSources: [text.bronnen.rivm],
        }}
        reference={text.reference}
      />

      <TwoKpiSection>
        <KpiTile
          title={text.barscale_titel}
          data-cy="infected_daily_increase"
          metadata={{
            date: dataInfectedDelta.last_value.date_of_report_unix,
            source: text.bronnen.rivm,
          }}
        >
          <PageBarScale
            data={data}
            scope="nl"
            metricName="infected_people_delta_normalized"
            metricProperty="infected_daily_increase"
            localeTextKey="positief_geteste_personen"
            differenceKey="infected_people_delta_normalized__infected_daily_increase"
          />

          <Text>{text.barscale_toelichting}</Text>
        </KpiTile>

        <KpiTile
          title={text.kpi_titel}
          metadata={{
            date: dataInfectedDelta.last_value.date_of_report_unix,
            source: text.bronnen.rivm,
          }}
        >
          <KpiValue
            data-cy="infected_daily_total"
            absolute={
              data.infected_people_total.last_value.infected_daily_total
            }
            difference={
              data.difference.infected_people_total__infected_daily_total
            }
          />
          <Text>{text.kpi_toelichting}</Text>
          <Box>
            <Heading level={4} fontSize={'1.2em'} mt={'1.5em'} mb={0}>
              <span
                css={css({ '& > span': { color: 'data.primary' } })}
                dangerouslySetInnerHTML={{
                  __html: replaceKpisInText(ggdText.summary_title, [
                    {
                      name: 'percentage',
                      value: `${formatPercentage(
                        dataGgdLastValue.infected_percentage
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

      <ChoroplethTile
        data-cy="chloropleths"
        title={text.map_titel}
        metadata={{
          date: dataInfectedDelta.last_value.date_of_report_unix,
          source: text.bronnen.rivm,
        }}
        description={text.map_toelichting}
        onChangeControls={setSelectedMap}
        legend={{
          title: text.chloropleth_legenda.titel,
          thresholds:
            regionThresholds.positive_tested_people.positive_tested_people,
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
            metricName="positive_tested_people"
            metricProperty="positive_tested_people"
            tooltipContent={createPositiveTestedPeopleMunicipalTooltip(
              createSelectMunicipalHandler(router)
            )}
            onSelect={createSelectMunicipalHandler(router)}
          />
        )}
        {selectedMap === 'region' && (
          <SafetyRegionChoropleth
            metricName="positive_tested_people"
            metricProperty="positive_tested_people"
            tooltipContent={createPositiveTestedPeopleRegionalTooltip(
              createSelectRegionHandler(router)
            )}
            onSelect={createSelectRegionHandler(router)}
          />
        )}
      </ChoroplethTile>

      <LineChartTile
        title={text.linechart_titel}
        description={text.linechart_toelichting}
        signaalwaarde={7}
        values={dataInfectedDelta.values.map((value) => ({
          value: value.infected_daily_increase,
          date: value.date_of_report_unix,
        }))}
        metadata={{
          source: text.bronnen.rivm,
        }}
      />

      <ChartTile
        title={siteText.infected_age_groups.title}
        description={siteText.infected_age_groups.description}
        metadata={{
          date: dataInfectedDelta.last_value.date_of_report_unix,
          source: text.bronnen.rivm,
        }}
      >
        <Text mt={0}>
          {replaceVariablesInText(
            siteText.infected_age_groups.example,
            ageDemographicExampleData
          )}
        </Text>
        <AgeDemographic data={data.infected_age_groups} />
      </ChartTile>

      <ContentHeader
        title={ggdText.titel}
        skipLinkAnchor={true}
        id="ggd"
        icon={<Afname />}
        subtitle={ggdText.toelichting}
        metadata={{
          datumsText: ggdText.datums,
          dateInfo: {
            weekStartUnix: dataGgdLastValue.week_start_unix,
            weekEndUnix: dataGgdLastValue.week_end_unix,
          },
          dateOfInsertionUnix: dataGgdLastValue.date_of_insertion_unix,
          dataSources: [ggdText.bronnen.rivm],
        }}
        reference={text.reference}
      />

      <TwoKpiSection>
        <KpiTile
          title={ggdText.totaal_getest_week_titel}
          metadata={{
            date: [
              dataGgdLastValue.week_start_unix,
              dataGgdLastValue.week_end_unix,
            ],
            source: ggdText.bronnen.rivm,
          }}
        >
          <KpiValue
            data-cy="ggd_tested_total"
            absolute={dataGgdLastValue.tested_total}
            difference={data.difference.ggd__tested_total}
          />
          <Text>{ggdText.totaal_getest_week_uitleg}</Text>
        </KpiTile>
        <KpiTile
          title={ggdText.positief_getest_week_titel}
          metadata={{
            date: [
              dataGgdLastValue.week_start_unix,
              dataGgdLastValue.week_end_unix,
            ],
            source: ggdText.bronnen.rivm,
          }}
        >
          <KpiValue
            data-cy="ggd_infected"
            absolute={dataGgdLastValue.infected}
            percentage={dataGgdLastValue.infected_percentage}
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
                      value: formatNumber(dataGgdLastValue.infected),
                    },
                    {
                      name: 'denominator',
                      value: formatNumber(dataGgdLastValue.tested_total),
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
        values={dataGgdValues.map((value) => ({
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
          dataGgdValues.map((value) => ({
            value: value.tested_total,
            date: value.week_unix,
            week: {
              start: value.week_start_unix,
              end: value.week_end_unix,
            },
          })),
          dataGgdValues.map((value) => ({
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
    </>
  );
};

PositivelyTestedPeople.getLayout = getNationalLayout;

export const getStaticProps = getNationalStaticProps;

export default PositivelyTestedPeople;
