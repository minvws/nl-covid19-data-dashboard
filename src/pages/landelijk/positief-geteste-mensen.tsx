import { useRouter } from 'next/router';
import { useState } from 'react';
import Afname from '~/assets/afname.svg';
import Getest from '~/assets/test.svg';
import { ChartRegionControls } from '~/components-styled/chart-region-controls';
import { Anchor } from '~/components-styled/anchor';
import { Box } from '~/components-styled/base';
import { ChoroplethSection } from '~/components-styled/choropleth/choropleth-section';
import { ChoroplethHeader } from '~/components-styled/choropleth/choropleth-header';
import { ChoroplethLegend } from '~/components-styled/choropleth/choropleth-legend';
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
import { ContentHeader } from '~/components/layout/Content';
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

  const ggdData = data.infected_people_percentage.last_value;

  const barChartTotal: number = age?.values
    ? age.values.reduce((mem: number, part): number => {
        const amount = part.infected_per_agegroup_increase || 0;
        return mem + ((amount as number) || 0);
      }, 0)
    : 0;

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
                        ggdData.percentage_infected_ggd
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
          <Box>
            <ChartRegionControls
              onChange={(val: 'region' | 'municipal') => setSelectedMap(val)}
            />
          </Box>
        </ChoroplethHeader>
        <Box gridArea={'c'}>
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
        </Box>
        <ChoroplethLegend>
          <div className="chloropleth-legend">
            {legendItems && (
              <ChloroplethLegenda
                items={legendItems}
                title={text.chloropleth_legenda.titel}
              />
            )}
          </div>
        </ChoroplethLegend>
      </ChoroplethSection>

      <KpiSection>
        <LineChart
          title={text.linechart_titel}
          description={text.linechart_toelichting}
          values={delta.values.map((value) => ({
            value: value.infected_daily_increase,
            date: value.date_of_report_unix,
          }))}
          signaalwaarde={7}
        />
      </KpiSection>

      <TwoKpiSection fixed={true} bg="white" borderRadius={5}>
        <Box>
          <Heading level={3}>{text.barchart_titel}</Heading>
          <Text>{text.barchart_toelichting}</Text>
        </Box>
        <BarChart
          keys={text.barscale_keys}
          data={age.values.map((value) => ({
            y: value.infected_per_agegroup_increase || 0,
            label: value?.infected_per_agegroup_increase
              ? `${(
                  ((value.infected_per_agegroup_increase as number) * 100) /
                  barChartTotal
                ).toFixed(0)}%`
              : false,
          }))}
          axisTitle={text.barchart_axis_titel}
        />
      </TwoKpiSection>

      {ggdData && (
        <>
          <ContentHeader
            title={ggdText.titel}
            id="ggd"
            Icon={Afname}
            subtitle={ggdText.toelichting}
            metadata={{
              datumsText: ggdText.datums,
              dateUnix: ggdData.date_of_report_unix,
              dateInsertedUnix: ggdData.date_of_insertion_unix,
              dataSource: ggdText.bron,
            }}
          />

          <div className="layout-two-column">
            <article className="metric-article column-item">
              <h3>{ggdText.totaal_getest_week_titel}</h3>
              <h3>
                <span className="text-blue kpi">
                  {formatNumber(ggdData?.total_tested_ggd)}
                </span>
              </h3>

              <p>{ggdText.totaal_getest_week_uitleg}</p>
            </article>

            <article className="metric-article column-item">
              <h3>{ggdText.positief_getest_week_titel}</h3>
              <h3>
                <span className="text-blue kpi">
                  {`${formatPercentage(ggdData?.percentage_infected_ggd)}%`}
                </span>
              </h3>
              <p>{ggdText.positief_getest_week_uitleg}</p>
              <p>
                <strong
                  className="additional-kpi"
                  dangerouslySetInnerHTML={{
                    __html: replaceKpisInText(
                      ggdText.positief_getest_getest_week_uitleg,
                      [
                        {
                          name: 'numerator',
                          value: formatNumber(ggdData?.infected_ggd),
                          className: 'text-blue',
                        },
                        {
                          name: 'denominator',
                          value: formatNumber(ggdData?.total_tested_ggd),
                          className: 'text-blue',
                        },
                      ]
                    ),
                  }}
                ></strong>
              </p>
            </article>
          </div>
        </>
      )}
    </>
  );
};

PositivelyTestedPeople.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default PositivelyTestedPeople;
