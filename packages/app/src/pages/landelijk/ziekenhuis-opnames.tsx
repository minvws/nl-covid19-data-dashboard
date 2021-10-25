import { colors, getLastFilledValue } from '@corona-dashboard/common';
import { Ziekenhuis } from '@corona-dashboard/icons';
import { useState } from 'react';
import { RegionControlOption } from '~/components/chart-region-controls';
import { ChartTile } from '~/components/chart-tile';
import { DynamicChoropleth } from '~/components/choropleth';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { PageInformationBlock } from '~/components/page-information-block';
import { PageKpi } from '~/components/page-kpi';
import { PieChart } from '~/components/pie-chart';
import { SEOHead } from '~/components/seo-head';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { AdmissionsPerAgeGroup } from '~/domain/hospital/admissions-per-age-group';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { useIntl } from '~/intl';
import {
  createElementsQuery,
  ElementsQueryResult,
  getTimelineEvents,
} from '~/queries/create-elements-query';
import {
  createPageArticlesQuery,
  PageArticlesQueryResult,
} from '~/queries/create-page-articles-query';
import { getHospitalAdmissionsPageQuery } from '~/queries/hospital-admissions-page-query';
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
import { HospitalAdmissionsPageQuery } from '~/types/cms';
import { countTrailingNullValues } from '~/utils/count-trailing-null-values';
import { getBoundaryDateStartUnix } from '~/utils/get-boundary-date-start-unix';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectNlData(
    'difference.hospital_lcps__beds_occupied_covid',
    'hospital_lcps',
    'hospital_nice_per_age_group',
    'hospital_nice'
  ),
  createGetChoroplethData({
    vr: ({ hospital_nice }) => ({ hospital_nice }),
    gm: ({ hospital_nice }) => ({ hospital_nice }),
  }),
  createGetContent<{
    page: HospitalAdmissionsPageQuery;
    highlight: PageArticlesQueryResult;
    elements: ElementsQueryResult;
  }>((context) => {
    const { locale } = context;

    return `{
      "page": ${getHospitalAdmissionsPageQuery(context)},
      "highlight": ${createPageArticlesQuery('hospitalPage', locale)},
      "elements": ${createElementsQuery('nl', ['hospital_nice'], locale)}
    }`;
  })
);

const DAY_IN_SECONDS = 24 * 60 * 60;
const WEEK_IN_SECONDS = 7 * DAY_IN_SECONDS;

/**
 * @TODO: remove dummy data
 */

const DummyDataVaccinationStatus = {
  total_amount_of_people: 1369,
  fully_vaccinated: 340,
  fully_vaccinated_percentage: 24.8,
  has_one_shot: 31,
  has_one_shot_percentage: 2.2,
  not_vaccinated: 998,
  not_vaccinated_percentage: 72.8,
  date_start_unix: 1634726341 - WEEK_IN_SECONDS,
  date_end_unix: 1634726341,
  date_of_insertion_unix: 1634726341,
};

interface NlHospitalVaccinationStatusValue {
  total_amount_of_people: number;
  fully_vaccinated: number;
  fully_vaccinated_percentage: number;
  has_one_shot: number;
  has_one_shot_percentage: number;
  not_vaccinated: number;
  not_vaccinated_percentage: number;
  date_start_unix: number;
  date_end_unix: number;
  date_of_insertion_unix: number;
}

const IntakeHospital = (props: StaticProps<typeof getStaticProps>) => {
  const { selectedNlData: data, choropleth, content, lastGenerated } = props;
  const reverseRouter = useReverseRouter();
  const [selectedMap, setSelectedMap] = useState<RegionControlOption>('vr');

  const dataHospitalNice = data.hospital_nice;
  const dataHospitalLcps = data.hospital_lcps;
  const lastValueNice = data.hospital_nice.last_value;
  const lastValueLcps = data.hospital_lcps.last_value;

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
            pageLinks={content.page.pageLinks}
            articles={content.highlight.articles}
          />

          <TwoKpiSection>
            <KpiTile
              title={text.barscale_titel}
              description={text.extra_uitleg}
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

          <ChartTile
            title={text.vaccination_status_chart.title}
            metadata={{
              isTileFooter: true,
              date: [
                DummyDataVaccinationStatus.date_start_unix,
                DummyDataVaccinationStatus.date_end_unix,
              ],
              source: {
                ...text.vaccination_status_chart.source,
              },
            }}
            description={replaceVariablesInText(
              text.vaccination_status_chart.description,
              {
                amountOfPeople: formatNumber(
                  DummyDataVaccinationStatus.total_amount_of_people
                ),
                date_start: formatDateFromSeconds(
                  DummyDataVaccinationStatus.date_start_unix
                ),
                date_end: formatDateFromSeconds(
                  DummyDataVaccinationStatus.date_end_unix,
                  'medium'
                ),
              }
            )}
          >
            <PieChart
              data={
                DummyDataVaccinationStatus as NlHospitalVaccinationStatusValue
              }
              dataConfig={[
                {
                  metricProperty: 'not_vaccinated',
                  color: colors.data.yellow,
                  label: text.vaccination_status_chart.labels.not_vaccinated,
                },
                {
                  metricProperty: 'has_one_shot',
                  color: colors.data.cyan,
                  label: text.vaccination_status_chart.labels.has_one_shot,
                },
                {
                  metricProperty: 'fully_vaccinated',
                  color: colors.data.multiseries.cyan_dark,
                  label: text.vaccination_status_chart.labels.fully_vaccinated,
                },
              ]}
            />
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
                renderTarget="canvas"
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
                renderTarget="canvas"
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
            title={text.linechart_titel}
            description={text.linechart_description}
            metadata={{
              source: text.bronnen.nice,
            }}
            timeframeOptions={['all', '5weeks']}
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
            title={siteText.hospital_admissions_per_age_group.chart_title}
            description={
              siteText.hospital_admissions_per_age_group.chart_description
            }
            timeframeOptions={['all', '5weeks']}
            metadata={{ source: text.bronnen.nice }}
          >
            {(timeframe) => (
              <AdmissionsPerAgeGroup
                accessibility={{
                  key: 'hospital_admissions_per_age_group_over_time_chart',
                }}
                values={data.hospital_nice_per_age_group.values}
                timeframe={timeframe}
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
                    type: 'area',
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
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default IntakeHospital;
