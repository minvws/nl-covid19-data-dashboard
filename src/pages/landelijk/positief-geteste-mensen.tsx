import { useRouter } from 'next/router';
import { useState } from 'react';
import Afname from '~/assets/afname.svg';
import Getest from '~/assets/test.svg';
import { ChartRegionControls } from '~/components-styled/chart-region-controls';
import { Anchor } from '~/components-styled/anchor';
import { Box } from '~/components-styled/base';
import {
  ChoroplethChart,
  ChoroplethHeader,
  ChoroplethLegend,
  ChoroplethSection,
} from '~/components-styled/layout/choropleth';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Heading, Text } from '~/components-styled/typography';
import { BarChart, LineChart } from '~/components/charts/index';
import { ChloroplethLegenda } from '~/components/chloropleth/legenda/ChloroplethLegenda';
import { useSafetyRegionLegendaData } from '~/components/chloropleth/legenda/hooks/useSafetyRegionLegendaData';
import { MunicipalityChloropleth } from '~/components/chloropleth/MunicipalityChloropleth';
import { SafetyRegionChloropleth } from '~/components/chloropleth/SafetyRegionChloropleth';
import { createSelectMunicipalHandler } from '~/components/chloropleth/selectHandlers/createSelectMunicipalHandler';
import { createSelectRegionHandler } from '~/components/chloropleth/selectHandlers/createSelectRegionHandler';
import { createPositiveTestedPeopleMunicipalTooltip } from '~/components/chloropleth/tooltips/municipal/createPositiveTestedPeopleMunicipalTooltip';
import { createPositiveTestedPeopleRegionalTooltip } from '~/components/chloropleth/tooltips/region/createPositiveTestedPeopleRegionalTooltip';
import { PositiveTestedPeopleBarScale } from '~/components/landelijk/positive-tested-people-barscale';
import { FCWithLayout } from '~/components/layout';
import { ContentHeader } from '~/components/contentHeader';
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
import { KpiSection } from '~/components-styled/kpi-section';
import { MultipleLineChart } from '~/components/lineChart/multipleLineChart';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { formatDateFromSeconds } from '~/utils/formatDate';

const text = siteText.positief_geteste_personen;
const ggdText = siteText.positief_geteste_personen_ggd;

const PositivelyTestedPeople: FCWithLayout<INationalData> = (props) => {
  const { data } = props;
  const [selectedMap, setSelectedMap] = useState<'municipal' | 'region'>(
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
        category={siteText.nationaal_layout.headings.medisch}
        title={text.titel}
        Icon={Getest}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: delta?.last_value?.date_of_report_unix,
          dateInsertedUnix: delta?.last_value?.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <TwoKpiSection>
        <KpiTile title={text.barscale_titel} data-cy="infected_daily_increase">
          {delta && (
            <PositiveTestedPeopleBarScale data={delta} showAxis={true} />
          )}
          <Text>{text.barscale_toelichting}</Text>
        </KpiTile>

        <KpiTile title={text.kpi_titel}>
          <KpiValue
            data-cy="infected_daily_total"
            absolute={total.last_value.infected_daily_total}
          />
          <Text>{text.kpi_toelichting}</Text>
          <Box>
            <Heading level={4} fontSize={'1.2em'} mt={'1.5em'} mb={0}>
              <span
                dangerouslySetInnerHTML={{
                  __html: replaceKpisInText(ggdText.summary_title, [
                    {
                      name: 'percentage',
                      value: `${formatPercentage(
                        ggdLastValue.infected_percentage_daily
                      )}%`,
                      className: 'text-blue',
                    },
                  ]),
                }}
              ></span>
            </Heading>
            <Text mt={0} lineHeight={1}>
              <Anchor anchorName="ggd" text={ggdText.summary_link_cta} />
            </Text>
          </Box>
        </KpiTile>
      </TwoKpiSection>

      <ChoroplethSection data-cy="chloropleths">
        <ChoroplethHeader>
          <Heading level={3}>{text.map_titel}</Heading>
          <Text>{text.map_toelichting}</Text>
          <Box display="flex" justifyContent="flex-start">
            <ChartRegionControls
              onChange={(val: 'region' | 'municipal') => setSelectedMap(val)}
            />
          </Box>
        </ChoroplethHeader>
        <ChoroplethChart>
          {selectedMap === 'municipal' && (
            <MunicipalityChloropleth
              metricName="positive_tested_people"
              tooltipContent={createPositiveTestedPeopleMunicipalTooltip(
                router
              )}
              onSelect={createSelectMunicipalHandler(router)}
            />
          )}
          {selectedMap === 'region' && (
            <SafetyRegionChloropleth
              metricName="positive_tested_people"
              tooltipContent={createPositiveTestedPeopleRegionalTooltip(router)}
              onSelect={createSelectRegionHandler(router)}
            />
          )}
        </ChoroplethChart>
        <ChoroplethLegend>
          {legendItems && (
            <ChloroplethLegenda
              items={legendItems}
              title={text.chloropleth_legenda.titel}
            />
          )}
        </ChoroplethLegend>
      </ChoroplethSection>

      <LineChartTile
        title={text.linechart_titel}
        description={text.linechart_toelichting}
        signaalwaarde={7}
        values={delta.values.map((value) => ({
          value: value.infected_daily_increase,
          date: value.date_of_report_unix,
        }))}
      />

      <KpiSection>
        <Box flex="0 0 50%">
          <Heading level={3}>{text.barchart_titel}</Heading>
          <Text>{text.barchart_toelichting}</Text>
        </Box>
        <Box flex="0 0 50%">
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
        </Box>
      </KpiSection>

      <ContentHeader
        title={ggdText.titel}
        id="ggd"
        Icon={Afname}
        subtitle={ggdText.toelichting}
        metadata={{
          datumsText: ggdText.datums,
          dateUnix: ggdLastValue.date_of_report_unix,
          dateInsertedUnix: ggdLastValue.date_of_insertion_unix,
          dataSource: ggdText.bron,
        }}
      />

      <TwoKpiSection>
        <KpiTile title={ggdText.totaal_getest_week_titel}>
          <KpiValue absolute={ggdLastValue.tested_total_daily} />
          <Text>{ggdText.totaal_getest_week_uitleg}</Text>
        </KpiTile>
        <KpiTile title={ggdText.positief_getest_week_titel}>
          <KpiValue
            absolute={ggdLastValue.infected_daily}
            percentage={ggdLastValue.infected_percentage_daily}
          />
          <Text>{ggdText.positief_getest_week_uitleg}</Text>
          <Text>
            <strong
              className="additional-kpi"
              dangerouslySetInnerHTML={{
                __html: replaceKpisInText(
                  ggdText.positief_getest_getest_week_uitleg,
                  [
                    {
                      name: 'numerator',
                      value: formatNumber(ggdLastValue.infected_daily),
                      className: 'text-blue',
                    },
                    {
                      name: 'denominator',
                      value: formatNumber(ggdLastValue.tested_total_daily),
                      className: 'text-blue',
                    },
                  ]
                ),
              }}
            />
          </Text>
        </KpiTile>
      </TwoKpiSection>

      <KpiSection>
        <LineChart
          title={ggdText.linechart_percentage_titel}
          description={ggdText.linechart_percentage_toelichting}
          values={ggdValues.map((value) => ({
            value: value.infected_percentage_daily,
            date: value.date_of_report_unix,
          }))}
          formatTooltip={(x: number, y: number) => {
            return `${formatDateFromSeconds(x)}: ${formatPercentage(y)}%`;
          }}
        />
      </KpiSection>

      <KpiSection>
        <MultipleLineChart
          title={ggdText.linechart_totaltests_titel}
          description={ggdText.linechart_totaltests_toelichting}
          values={[
            ggdValues.map((value) => ({
              value: value.tested_total_daily,
              date: value.date_of_report_unix,
            })),
            ggdValues.map((value) => ({
              value: value.infected_daily,
              date: value.date_of_report_unix,
            })),
          ]}
          linesConfig={[
            {
              color: '#154273',
              legendLabel: ggdText.linechart_totaltests_legend_label,
            },
            {
              color: '#3391CC',
              legendLabel: ggdText.linechart_positivetests_legend_label,
            },
          ]}
        />
      </KpiSection>
    </>
  );
};

PositivelyTestedPeople.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default PositivelyTestedPeople;
