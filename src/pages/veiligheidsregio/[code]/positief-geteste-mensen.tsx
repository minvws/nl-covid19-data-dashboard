import { useRouter } from 'next/router';
import Afname from '~/assets/afname.svg';
import Getest from '~/assets/test.svg';
import { Anchor } from '~/components-styled/anchor';
import { Box } from '~/components-styled/base';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { KpiSection } from '~/components-styled/kpi-section';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Heading, Text } from '~/components-styled/typography';
import { useSafetyRegionLegendaData } from '~/components/choropleth/legenda/hooks/useSafetyRegionLegendaData';
import { MunicipalityChoropleth } from '~/components/choropleth/MunicipalityChoropleth';
import { createSelectMunicipalHandler } from '~/components/choropleth/selectHandlers/createSelectMunicipalHandler';
import { createPositiveTestedPeopleMunicipalTooltip } from '~/components/choropleth/tooltips/municipal/createPositiveTestedPeopleMunicipalTooltip';
import { ContentHeader } from '~/components/contentHeader';
import { ContentHeader_weekRangeHack } from '~/components/contentHeader_weekRangeHack';
import { FCWithLayout } from '~/components/layout';
import { getSafetyRegionLayout } from '~/components/layout/SafetyRegionLayout';
import {
  LineChart,
  Value,
} from '~/components/lineChart/lineChartWithWeekTooltip';
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
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { replaceKpisInText } from '~/utils/replaceKpisInText';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

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
                        ggdData.infected_percentage
                      )}%`,
                      className: 'text-blue',
                    },
                  ]),
                }}
              ></span>
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
      />

      <ChoroplethTile
        title={replaceVariablesInText(text.map_titel, {
          safetyRegion: safetyRegionName,
        })}
        description={text.map_toelichting}
        legend={
          legendItems // this data value should probably not be optional
            ? {
                title:
                  siteText.positief_geteste_personen.chloropleth_legenda.titel,
                items: legendItems,
              }
            : undefined
        }
      >
        <MunicipalityChoropleth
          selected={selectedMunicipalCode}
          highlightSelection={false}
          metricName="positive_tested_people"
          tooltipContent={createPositiveTestedPeopleMunicipalTooltip(router)}
          onSelect={createSelectMunicipalHandler(router)}
        />
      </ChoroplethTile>

      <ContentHeader_weekRangeHack
        title={replaceVariablesInText(ggdText.titel, {
          safetyRegion: safetyRegionName,
        })}
        id="ggd"
        Icon={Afname}
        subtitle={ggdText.toelichting}
        metadata={{
          datumsText: ggdText.datums,
          dateOfInsertionUnix: ggdData.date_of_insertion_unix,
          weekStartUnix: ggdData.week_start_unix,
          weekEndUnix: ggdData.week_start_unix,
          dataSource: ggdText.bron,
        }}
      />

      <TwoKpiSection>
        <KpiTile title={ggdText.totaal_getest_week_titel}>
          <KpiValue absolute={ggdData.tested_total} />
          <Text>{ggdText.totaal_getest_week_uitleg}</Text>
        </KpiTile>
        <KpiTile title={ggdText.positief_getest_week_titel}>
          <KpiValue
            absolute={ggdData.infected}
            percentage={ggdData.infected_percentage}
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
                      value: formatNumber(ggdData.infected),
                      className: 'text-blue',
                    },
                    {
                      name: 'denominator',
                      value: formatNumber(ggdData.tested_total),
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
          tooltipFormatter={function () {
            const { originalData } = (this.point as unknown) as {
              originalData: Value;
            };

            return `<strong>${formatDateFromSeconds(
              originalData.week.start,
              'short'
            )} - ${formatDateFromSeconds(
              originalData.week.end,
              'short'
            )}:</strong> ${formatPercentage(this.y)}%`;
          }}
          formatYAxis={(y: number) => {
            return `${formatPercentage(y)}%`;
          }}
        />
      </KpiSection>

      <KpiSection>
        <MultipleLineChart
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
