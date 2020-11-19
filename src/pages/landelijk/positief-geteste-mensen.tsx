import { useRouter } from 'next/router';
import { useState } from 'react';
import Afname from '~/assets/afname.svg';
import Getest from '~/assets/test.svg';
import { Anchor } from '~/components-styled/anchor';
import { Box } from '~/components-styled/base';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Heading, Text } from '~/components-styled/typography';
import { BarChart } from '~/components/charts/index';
import { useSafetyRegionLegendaData } from '~/components/choropleth/legenda/hooks/use-safety-region-legenda-data';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectMunicipalHandler } from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { createPositiveTestedPeopleMunicipalTooltip } from '~/components/choropleth/tooltips/municipal/create-positive-tested-people-municipal-tooltip';
import { createPositiveTestedPeopleRegionalTooltip } from '~/components/choropleth/tooltips/region/create-positive-tested-people-regional-tooltip';
import { ContentHeader } from '~/components/contentHeader';
import { ContentHeader_weekRangeHack } from '~/components/contentHeader_weekRangeHack';
import { PositiveTestedPeopleBarScale } from '~/components/landelijk/positive-tested-people-barscale';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import getNlData, { INationalData } from '~/static-props/nl-data';
import {
  InfectedPeopleDeltaNormalized,
  IntakeShareAgeGroups,
  NationalInfectedPeopleTotal,
} from '~/types/data.d';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { replaceKpisInText } from '~/utils/replaceKpisInText';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { MultipleLineChartTile } from '~/components-styled/multiple-line-chart-tile';
import { RegionControlOption } from '~/components-styled/chart-region-controls';
import { ChartTile } from '~/components-styled/chart-tile';
import { colors } from '~/style/theme';
import css from '@styled-system/css';

const text = siteText.positief_geteste_personen;
const ggdText = siteText.positief_geteste_personen_ggd;

const PositivelyTestedPeople: FCWithLayout<INationalData> = (props) => {
  const { data } = props;
  const [selectedMap, setSelectedMap] = useState<RegionControlOption>(
    'municipal'
  );
  const router = useRouter();

  const legendItems = useSafetyRegionLegendaData('positive_tested_people');
  const delta: InfectedPeopleDeltaNormalized =
    data.infected_people_delta_normalized;
  const age: IntakeShareAgeGroups = data.intake_share_age_groups;
  const total: NationalInfectedPeopleTotal = data?.infected_people_total;

  const ggdLastValue = data.ggd.last_value;
  const ggdValues = data.ggd.values;

  const barChartTotal: number = age.values.reduce(
    (mem: number, part): number => {
      return mem + part.infected_per_agegroup_increase;
    },
    0
  );

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <ContentHeader
        category={siteText.nationaal_layout.headings.besmettingen}
        title={text.titel}
        Icon={Getest}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: delta.last_value.date_of_report_unix,
          dateInsertedUnix: delta.last_value.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <TwoKpiSection>
        <KpiTile
          title={text.barscale_titel}
          data-cy="infected_daily_increase"
          metadata={{
            date: delta.last_value.date_of_report_unix,
            source: text.bron,
          }}
        >
          {delta && (
            <PositiveTestedPeopleBarScale data={delta} showAxis={true} />
          )}
          <Text>{text.barscale_toelichting}</Text>
        </KpiTile>

        <KpiTile
          title={text.kpi_titel}
          metadata={{
            date: delta.last_value.date_of_report_unix,
            source: text.bron,
          }}
        >
          <KpiValue
            data-cy="infected_daily_total"
            absolute={total.last_value.infected_daily_total}
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
                        ggdLastValue.infected_percentage
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
          date: delta.last_value.date_of_report_unix,
          source: text.bron,
        }}
        description={text.map_toelichting}
        onChangeControls={setSelectedMap}
        legend={
          legendItems // this data value should probably not be optional
            ? {
                title: text.chloropleth_legenda.titel,
                items: legendItems,
              }
            : undefined
        }
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
            tooltipContent={createPositiveTestedPeopleMunicipalTooltip(router)}
            onSelect={createSelectMunicipalHandler(router)}
          />
        )}
        {selectedMap === 'region' && (
          <SafetyRegionChoropleth
            metricName="positive_tested_people"
            tooltipContent={createPositiveTestedPeopleRegionalTooltip(router)}
            onSelect={createSelectRegionHandler(router)}
          />
        )}
      </ChoroplethTile>

      <LineChartTile
        title={text.linechart_titel}
        description={text.linechart_toelichting}
        signaalwaarde={7}
        values={delta.values.map((value) => ({
          value: value.infected_daily_increase,
          date: value.date_of_report_unix,
        }))}
        metadata={{
          source: text.bron,
        }}
      />

      <ChartTile
        title={text.barchart_titel}
        description={text.barchart_toelichting}
        metadata={{
          date: delta.last_value.date_of_report_unix,
          source: text.bron,
        }}
      >
        <BarChart
          keys={text.barscale_keys}
          data={age.values.map((value) => ({
            y: value.infected_per_agegroup_increase,
            label:
              barChartTotal > 0
                ? `${(
                    (value.infected_per_agegroup_increase * 100) /
                    barChartTotal
                  ).toFixed(0)}%`
                : false,
          }))}
          axisTitle={text.barchart_axis_titel}
        />
      </ChartTile>

      <ContentHeader_weekRangeHack
        title={ggdText.titel}
        id="ggd"
        Icon={Afname}
        subtitle={ggdText.toelichting}
        metadata={{
          datumsText: ggdText.datums,
          weekStartUnix: ggdLastValue.week_start_unix,
          weekEndUnix: ggdLastValue.week_end_unix,
          dateOfInsertionUnix: ggdLastValue.date_of_insertion_unix,
          dataSource: ggdText.bron,
        }}
      />

      <TwoKpiSection>
        <KpiTile
          title={ggdText.totaal_getest_week_titel}
          metadata={{
            date: [ggdLastValue.week_start_unix, ggdLastValue.week_end_unix],
            source: ggdText.bron,
          }}
        >
          <KpiValue absolute={ggdLastValue.tested_total} />
          <Text>{ggdText.totaal_getest_week_uitleg}</Text>
        </KpiTile>
        <KpiTile
          title={ggdText.positief_getest_week_titel}
          metadata={{
            date: [ggdLastValue.week_start_unix, ggdLastValue.week_end_unix],
            source: ggdText.bron,
          }}
        >
          <KpiValue
            absolute={ggdLastValue.infected}
            percentage={ggdLastValue.infected_percentage}
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
                      value: formatNumber(ggdLastValue.infected),
                    },
                    {
                      name: 'denominator',
                      value: formatNumber(ggdLastValue.tested_total),
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
          source: ggdText.bron,
        }}
      />

      <MultipleLineChartTile
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
          source: ggdText.bron,
        }}
      />
    </>
  );
};

PositivelyTestedPeople.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default PositivelyTestedPeople;
