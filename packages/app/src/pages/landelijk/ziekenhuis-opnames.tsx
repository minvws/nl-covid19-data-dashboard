import {
  colors,
  DAY_IN_SECONDS,
  getLastFilledValue,
  NlHospitalVaccinationStatusValue,
  WEEK_IN_SECONDS,
} from '@corona-dashboard/common';
import { Ziekenhuis } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { AgeDemographicProps } from '~/components/age-demographic';
import { RegionControlOption } from '~/components/chart-region-controls';
import { ChartTile } from '~/components/chart-tile';
import { DynamicChoropleth } from '~/components/choropleth';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { PageInformationBlock } from '~/components/page-information-block';
import { PageKpi } from '~/components/page-kpi';
import { PieChartProps } from '~/components/pie-chart';
import { SEOHead } from '~/components/seo-head';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { AdmissionsPerAgeGroup } from '~/domain/hospital/admissions-per-age-group';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { useIntl } from '~/intl';
import { useFeature } from '~/lib/features';
import {
  ElementsQueryResult,
  getElementsQuery,
  getTimelineEvents,
} from '~/queries/get-elements-query';
import {
  getArticleParts,
  getLinkParts,
  getPagePartsQuery,
} from '~/queries/get-page-parts-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  selectNlData,
} from '~/static-props/get-data';
import { ArticleParts, LinkParts, PagePartQueryResult } from '~/types/cms';
import { countTrailingNullValues } from '~/utils/count-trailing-null-values';
import { getBoundaryDateStartUnix } from '~/utils/get-boundary-date-start-unix';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';

// TODO: Update any to the proper type when the schema is merged.
const AgeDemographic = dynamic<AgeDemographicProps<any>>(() =>
  import('~/components/age-demographic').then((mod) => mod.AgeDemographic)
);

const PieChart = dynamic<PieChartProps<NlHospitalVaccinationStatusValue>>(() =>
  import('~/components/pie-chart').then((mod) => mod.PieChart)
);

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectNlData(
    'difference.hospital_lcps__beds_occupied_covid',
    'hospital_lcps',
    'hospital_nice_per_age_group',
    'hospital_nice',
    'hospital_vaccination_status',
    'hospital_vaccine_incidence_per_age_group'
  ),
  createGetChoroplethData({
    vr: ({ hospital_nice }) => ({ hospital_nice }),
    gm: ({ hospital_nice }) => ({ hospital_nice }),
  }),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts | LinkParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      return `{
        "parts": ${getPagePartsQuery('hospitalPage')},
        "elements": ${getElementsQuery(
          'nl',
          ['hospital_nice', 'hospital_nice_per_age_group'],
          context.locale
        )}
      }`;
    })(context);

    return {
      content: {
        articles: getArticleParts(
          content.parts.pageParts,
          'hospitalPageArticles'
        ),
        links: getLinkParts(content.parts.pageParts, 'hospitalPageLinks'),
        elements: content.elements,
      },
    };
  }
);

const IntakeHospital = (props: StaticProps<typeof getStaticProps>) => {
  const { selectedNlData: data, choropleth, content, lastGenerated } = props;
  const reverseRouter = useReverseRouter();
  const [selectedMap, setSelectedMap] = useState<RegionControlOption>('vr');

  const dataHospitalNice = data.hospital_nice;
  const dataHospitalLcps = data.hospital_lcps;
  const lastValueNice = data.hospital_nice.last_value;
  const lastValueLcps = data.hospital_lcps.last_value;
  const lastValueVaccinationStatus =
    data.hospital_vaccination_status.last_value;

  const underReportedRange = getBoundaryDateStartUnix(
    dataHospitalNice.values,
    countTrailingNullValues(
      dataHospitalNice.values,
      'admissions_on_date_of_admission_moving_average'
    )
  );

  const sevenDayAverageDates: [number, number] = [
    underReportedRange - WEEK_IN_SECONDS,
    underReportedRange - DAY_IN_SECONDS,
  ];

  const bedsLastValue = getLastFilledValue(data.hospital_lcps);
  const vaccinationStatusFeature = useFeature('nlHospitalVaccinationStatus');

  const isVaccinationIncidenceChartShown = useFeature(
    'nlHospitalAdmissionsVaccineIncidencePerAgeGroup'
  );

  const { siteText, formatNumber, formatDateFromSeconds } = useIntl();
  const text = siteText.ziekenhuisopnames_per_dag;

  return (
    <Layout {...siteText.nationaal_metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <SEOHead
          title={text.metadata.title}
          description={text.metadata.description}
        />
        <TileList>
          <PageInformationBlock
            category={siteText.nationaal_layout.headings.ziekenhuizen}
            screenReaderCategory={
              siteText.sidebar.metrics.hospital_admissions.title
            }
            title={text.titel}
            icon={<Ziekenhuis />}
            description={text.pagina_toelichting}
            metadata={{
              datumsText: text.datums,
              dateOrRange: lastValueNice.date_unix,
              dateOfInsertionUnix: lastValueNice.date_of_insertion_unix,
              dataSources: [text.bronnen.nice, text.bronnen.lnaz],
            }}
            referenceLink={text.reference.href}
            pageLinks={content.links}
            articles={content.articles}
          />

          <TwoKpiSection>
            <KpiTile
              title={text.barscale_titel}
              description={replaceVariablesInText(text.extra_uitleg, {
                dateStart: formatDateFromSeconds(sevenDayAverageDates[0]),
                dateEnd: formatDateFromSeconds(sevenDayAverageDates[1]),
              })}
              metadata={{
                date: sevenDayAverageDates,
                source: text.bronnen.nice,
              }}
            >
              <PageKpi
                data={data}
                metricName="hospital_nice"
                metricProperty="admissions_on_date_of_admission_moving_average_rounded"
                isMovingAverageDifference
                isAmount
              />
            </KpiTile>

            <KpiTile
              title={text.kpi_bedbezetting.title}
              description={text.kpi_bedbezetting.description}
              metadata={{
                date: lastValueLcps.date_unix,
                source: text.bronnen.lnaz,
              }}
            >
              {bedsLastValue.beds_occupied_covid !== null && (
                <KpiValue
                  data-cy="beds_occupied_covid"
                  absolute={bedsLastValue.beds_occupied_covid}
                  difference={
                    data.difference.hospital_lcps__beds_occupied_covid
                  }
                  isAmount
                />
              )}
            </KpiTile>
          </TwoKpiSection>

          {isVaccinationIncidenceChartShown.isEnabled && (
            <ChartTile
              title={
                siteText.hospital_admissions_incidence_age_demographic_chart
                  .title
              }
              description={
                siteText.hospital_admissions_incidence_age_demographic_chart
                  .description
              }
            >
              <AgeDemographic
                data={data.hospital_vaccine_incidence_per_age_group}
                accessibility={{
                  key: 'hospital_admissions_incidence_age_demographic_chart',
                }}
                rightColor="data.primary"
                leftColor="data.yellow"
                leftMetricProperty={'has_one_shot_or_not_vaccinated_per_100k'}
                rightMetricProperty={'fully_vaccinated_per_100k'}
                formatValue={(n) => `${n}`}
                text={
                  siteText.hospital_admissions_incidence_age_demographic_chart
                    .chart_text
                }
              />
            </ChartTile>
          )}

          {vaccinationStatusFeature.isEnabled && (
            <ChartTile
              title={text.vaccination_status_chart.title}
              metadata={{
                isTileFooter: true,
                date: [
                  lastValueVaccinationStatus.date_start_unix,
                  lastValueVaccinationStatus.date_end_unix,
                ],
                source: {
                  ...text.vaccination_status_chart.source,
                },
              }}
              description={replaceVariablesInText(
                text.vaccination_status_chart.description,
                {
                  amountOfPeople: formatNumber(
                    lastValueVaccinationStatus.total_amount_of_people
                  ),
                  date_start: formatDateFromSeconds(
                    lastValueVaccinationStatus.date_start_unix
                  ),
                  date_end: formatDateFromSeconds(
                    lastValueVaccinationStatus.date_end_unix,
                    'medium'
                  ),
                }
              )}
            >
              <PieChart
                data={lastValueVaccinationStatus}
                icon={<Ziekenhuis />}
                dataConfig={[
                  {
                    metricProperty: 'has_one_shot_or_not_vaccinated',
                    color: colors.data.yellow,
                    label:
                      text.vaccination_status_chart.labels
                        .has_one_shot_or_not_vaccinated,
                  },
                  {
                    metricProperty: 'fully_vaccinated',
                    color: colors.data.primary,
                    label:
                      text.vaccination_status_chart.labels.fully_vaccinated,
                  },
                ]}
              />
            </ChartTile>
          )}

          <ChartTile
            title={text.linechart_titel}
            description={text.linechart_description}
            metadata={{
              source: text.bronnen.nice,
            }}
            timeframeOptions={['all', '5weeks']}
            timeframeInitialValue="5weeks"
          >
            {(timeframe) => (
              <TimeSeriesChart
                accessibility={{
                  key: 'hospital_admissions_over_time_chart',
                }}
                values={dataHospitalNice.values}
                timeframe={timeframe}
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty:
                      'admissions_on_date_of_admission_moving_average',
                    label: text.linechart_legend_titel_moving_average,
                    color: colors.data.primary,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'admissions_on_date_of_admission',
                    label: text.linechart_legend_titel,
                    color: colors.data.primary,
                  },
                ]}
                dataOptions={{
                  timespanAnnotations: [
                    {
                      start: underReportedRange,
                      end: Infinity,
                      label: text.linechart_legend_underreported_titel,
                      shortLabel: siteText.common.incomplete,
                      cutValuesForMetricProperties: [
                        'admissions_on_date_of_admission_moving_average',
                      ],
                    },
                  ],
                  timelineEvents: getTimelineEvents(
                    content.elements.timeSeries,
                    'hospital_nice'
                  ),
                }}
              />
            )}
          </ChartTile>

          <ChartTile
            title={text.chart_bedbezetting.title}
            description={text.chart_bedbezetting.description}
            metadata={{
              source: text.bronnen.lnaz,
            }}
            timeframeOptions={['all', '5weeks']}
            timeframeInitialValue="5weeks"
          >
            {(timeframe) => (
              <TimeSeriesChart
                accessibility={{
                  key: 'hospital_beds_occupied_over_time_chart',
                }}
                values={dataHospitalLcps.values}
                timeframe={timeframe}
                seriesConfig={[
                  {
                    type: 'gapped-area',
                    metricProperty: 'beds_occupied_covid',
                    label: text.chart_bedbezetting.legend_trend_label,
                    color: colors.data.primary,
                  },
                ]}
                dataOptions={{
                  timespanAnnotations: [
                    {
                      start: dataHospitalLcps.values[0].date_unix,
                      end: new Date('1 June 2020').getTime() / 1000,
                      label: text.chart_bedbezetting.legend_inaccurate_label,
                      shortLabel: siteText.common.incomplete,
                    },
                  ],
                }}
              />
            )}
          </ChartTile>

          <ChoroplethTile
            title={text.map_titel}
            description={text.map_toelichting}
            onChartRegionChange={setSelectedMap}
            chartRegion={selectedMap}
            legend={{
              thresholds:
                selectedMap === 'gm'
                  ? thresholds.gm.admissions_on_date_of_reporting
                  : thresholds.gm.admissions_on_date_of_reporting,
              title: text.chloropleth_legenda.titel,
            }}
            metadata={{
              date: lastValueNice.date_unix,
              source: text.bronnen.nice,
            }}
          >
            {selectedMap === 'gm' && (
              <DynamicChoropleth
                accessibility={{
                  key: 'hospital_admissions_municipal_choropleth',
                }}
                map="gm"
                data={choropleth.gm.hospital_nice}
                dataConfig={{
                  metricName: 'hospital_nice',
                  metricProperty: 'admissions_on_date_of_reporting',
                }}
                dataOptions={{
                  getLink: reverseRouter.gm.ziekenhuisopnames,
                  tooltipVariables: {
                    patients: siteText.choropleth_tooltip.patients,
                  },
                }}
              />
            )}
            {selectedMap === 'vr' && (
              <DynamicChoropleth
                accessibility={{
                  key: 'hospital_admissions_region_choropleth',
                }}
                map="vr"
                data={choropleth.vr.hospital_nice}
                dataConfig={{
                  metricName: 'hospital_nice',
                  metricProperty: 'admissions_on_date_of_reporting',
                }}
                dataOptions={{
                  getLink: reverseRouter.vr.ziekenhuisopnames,
                  tooltipVariables: {
                    patients: siteText.choropleth_tooltip.patients,
                  },
                }}
              />
            )}
          </ChoroplethTile>

          <ChartTile
            title={siteText.hospital_admissions_per_age_group.chart_title}
            description={
              siteText.hospital_admissions_per_age_group.chart_description
            }
            timeframeOptions={['all', '5weeks']}
            timeframeInitialValue="5weeks"
            metadata={{ source: text.bronnen.nice }}
          >
            {(timeframe) => (
              <AdmissionsPerAgeGroup
                accessibility={{
                  key: 'hospital_admissions_per_age_group_over_time_chart',
                }}
                values={data.hospital_nice_per_age_group.values}
                timeframe={timeframe}
                timelineEvents={getTimelineEvents(
                  content.elements.timeSeries,
                  'hospital_nice_per_age_group'
                )}
              />
            )}
          </ChartTile>
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default IntakeHospital;
