import { useRouter } from 'next/router';
import Afname from '~/assets/afname.svg';
import Getest from '~/assets/test.svg';
import { Anchor } from '~/components-styled/anchor';
import { Box } from '~/components-styled/base';
import {
  ChoroplethChart,
  ChoroplethHeader,
  ChoroplethLegend,
  ChoroplethSection,
} from '~/components-styled/layout/choropleth';
import { KpiSection } from '~/components-styled/kpi-section';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Heading, Text } from '~/components-styled/typography';
import { LineChart } from '~/components/charts/index';
import { ChoroplethLegenda } from '~/components/choropleth/legenda/ChoroplethLegenda';
import { useSafetyRegionLegendaData } from '~/components/choropleth/legenda/hooks/useSafetyRegionLegendaData';
import { MunicipalityChoropleth } from '~/components/choropleth/MunicipalityChoropleth';
import { createSelectMunicipalHandler } from '~/components/choropleth/selectHandlers/createSelectMunicipalHandler';
import { createPositiveTestedPeopleMunicipalTooltip } from '~/components/choropleth/tooltips/municipal/createPositiveTestedPeopleMunicipalTooltip';
import { FCWithLayout } from '~/components/layout';
import { ContentHeader } from '~/components/contentHeader';
import { getSafetyRegionLayout } from '~/components/layout/SafetyRegionLayout';
import { MultipleLineChart } from '~/components/lineChart/multipleLineChart';
import { SEOHead } from '~/components/seoHead';
import { PositivelyTestedPeopleBarScale } from '~/components/veiligheidsregio/positive-tested-people-barscale';
import regionCodeToMunicipalCodeLookup from '~/data/regionCodeToMunicipalCodeLookup';
import siteText from '~/locale/index';
import {
  getSafetyRegionData,
  getSafetyRegionPaths,
  ISafetyRegionData,
} from '~/static-props/safetyregion-data';
import { ResultsPerRegion } from '~/types/data.d';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { replaceKpisInText } from '~/utils/replaceKpisInText';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { formatDateFromSeconds } from '~/utils/formatDate';

const text = siteText.veiligheidsregio_positief_geteste_personen;
const ggdText = siteText.veiligheidsregio_positief_geteste_personen_ggd;

const PostivelyTestedPeople: FCWithLayout<ISafetyRegionData> = (props) => {
  const { data, safetyRegionName } = props;
  const router = useRouter();

  const resultsPerRegion: ResultsPerRegion = data.results_per_region;

  const ggdData = data.ggd.last_value;
  const ggdValues = data.ggd.values;

  const legendItems = useSafetyRegionLegendaData('positive_tested_people');
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
      <ContentHeader
        category={siteText.veiligheidsregio_layout.headings.medisch}
        title={replaceVariablesInText(text.titel, {
          safetyRegion: safetyRegionName,
        })}
        Icon={Getest}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: resultsPerRegion.last_value.date_of_report_unix,
          dateInsertedUnix: resultsPerRegion.last_value?.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <TwoKpiSection>
        <KpiTile title={text.barscale_titel}>
          <PositivelyTestedPeopleBarScale
            data={resultsPerRegion}
            showAxis={true}
          />
          <Text>{text.barscale_toelichting}</Text>
        </KpiTile>

        <KpiTile title={text.kpi_titel}>
          <KpiValue
            absolute={Math.round(
              resultsPerRegion.last_value.total_reported_increase_per_region
            )}
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
                        ggdData.infected_percentage_daily
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

      <LineChartTile
        title={text.linechart_titel}
        description={text.linechart_toelichting}
        signaalwaarde={7}
        values={resultsPerRegion.values.map((value) => ({
          value: value.infected_increase_per_region,
          date: value.date_of_report_unix,
        }))}
      />

      <ChoroplethSection>
        <ChoroplethHeader>
          <Heading level={3}>
            {replaceVariablesInText(text.map_titel, {
              safetyRegion: safetyRegionName,
            })}
          </Heading>
          <Text>{text.map_toelichting}</Text>
        </ChoroplethHeader>
        <ChoroplethChart>
          <MunicipalityChoropleth
            selected={selectedMunicipalCode}
            highlightSelection={false}
            metricName="positive_tested_people"
            tooltipContent={createPositiveTestedPeopleMunicipalTooltip(router)}
            onSelect={createSelectMunicipalHandler(router)}
          />
        </ChoroplethChart>
        <ChoroplethLegend>
          {legendItems && (
            <ChoroplethLegenda
              items={legendItems}
              title={
                siteText.positief_geteste_personen.chloropleth_legenda.titel
              }
            />
          )}
        </ChoroplethLegend>
      </ChoroplethSection>

      <ContentHeader
        title={replaceVariablesInText(ggdText.titel, {
          safetyRegion: safetyRegionName,
        })}
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

      <TwoKpiSection>
        <KpiTile title={ggdText.totaal_getest_week_titel}>
          <KpiValue absolute={ggdData.tested_total_daily} />
          <Text>{ggdText.totaal_getest_week_uitleg}</Text>
        </KpiTile>
        <KpiTile title={ggdText.positief_getest_week_titel}>
          <KpiValue
            absolute={ggdData.infected_daily}
            percentage={ggdData.infected_percentage_daily}
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
                      value: formatNumber(ggdData.infected_daily),
                      className: 'text-blue',
                    },
                    {
                      name: 'denominator',
                      value: formatNumber(ggdData.tested_total_daily),
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
          formatYAxis={(y: number) => {
            return `${formatPercentage(y)}%`;
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

PostivelyTestedPeople.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionData();
export const getStaticPaths = getSafetyRegionPaths();

export default PostivelyTestedPeople;
