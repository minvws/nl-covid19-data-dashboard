import { useRouter } from 'next/router';
import Afname from '~/assets/afname.svg';
import Getest from '~/assets/test.svg';
import { Anchor } from '~/components-styled/anchor';
import { Box } from '~/components-styled/base';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Heading, Text } from '~/components-styled/typography';
import { useSafetyRegionLegendaData } from '~/components/choropleth/legenda/hooks/use-safety-region-legenda-data';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { createSelectMunicipalHandler } from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { createPositiveTestedPeopleMunicipalTooltip } from '~/components/choropleth/tooltips/municipal/create-positive-tested-people-municipal-tooltip';
import { ContentHeader } from '~/components/contentHeader';
import { ContentHeader_weekRangeHack } from '~/components/contentHeader_weekRangeHack';
import { FCWithLayout } from '~/components/layout';
import { getSafetyRegionLayout } from '~/components/layout/SafetyRegionLayout';
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
import { MultipleLineChartTile } from '~/components-styled/multiple-line-chart-tile';
import { colors } from '~/style/theme';
import css from '@styled-system/css';

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
        category={siteText.veiligheidsregio_layout.headings.besmettingen}
        title={replaceVariablesInText(text.titel, {
          safetyRegion: safetyRegionName,
        })}
        Icon={Getest}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: resultsPerRegion.last_value.date_of_report_unix,
          dateInsertedUnix: resultsPerRegion.last_value.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <TwoKpiSection>
        <KpiTile
          title={text.barscale_titel}
          metadata={{
            date: resultsPerRegion.last_value.date_of_report_unix,
            source: text.bron,
          }}
        >
          <PositivelyTestedPeopleBarScale
            data={resultsPerRegion}
            showAxis={true}
          />
          <Text>{text.barscale_toelichting}</Text>
        </KpiTile>

        <KpiTile
          title={text.kpi_titel}
          metadata={{
            date: resultsPerRegion.last_value.date_of_report_unix,
            source: text.bron,
          }}
        >
          <KpiValue
            absolute={Math.round(
              resultsPerRegion.last_value.total_reported_increase_per_region
            )}
          />
          <Text>{text.kpi_toelichting}</Text>
          <Box>
            <Heading level={4} fontSize={'1.2em'} mt={'1.5em'} mb={0}>
              <span
                css={css({ '& > span': { color: 'data.kpi' } })}
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
        metadata={{ source: text.bron }}
      />

      <ChoroplethTile
        title={replaceVariablesInText(text.map_titel, {
          safetyRegion: safetyRegionName,
        })}
        metadata={{
          date: resultsPerRegion.last_value.date_of_report_unix,
          source: text.bron,
        }}
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
          weekEndUnix: ggdData.week_end_unix,
          dataSource: ggdText.bron,
        }}
      />

      <TwoKpiSection>
        <KpiTile
          title={ggdText.totaal_getest_week_titel}
          metadata={{
            date: [ggdData.week_start_unix, ggdData.week_end_unix],
            source: ggdText.bron,
          }}
        >
          <KpiValue absolute={ggdData.tested_total} />
          <Text>{ggdText.totaal_getest_week_uitleg}</Text>
        </KpiTile>
        <KpiTile
          title={ggdText.positief_getest_week_titel}
          metadata={{
            date: [ggdData.week_start_unix, ggdData.week_end_unix],
            source: ggdText.bron,
          }}
        >
          <KpiValue
            absolute={ggdData.infected}
            percentage={ggdData.infected_percentage}
          />
          <Text>{ggdText.positief_getest_week_uitleg}</Text>
          <Text>
            <strong
              css={css({ '& > span': { color: 'data.kpi' } })}
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
          source: ggdText.bron,
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
          source: ggdText.bron,
        }}
      />
    </>
  );
};

PostivelyTestedPeople.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionData();
export const getStaticPaths = getSafetyRegionPaths();

export default PostivelyTestedPeople;
