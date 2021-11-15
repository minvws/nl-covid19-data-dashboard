import {
  colors,
  DAY_IN_SECONDS,
  getLastFilledValue,
  NlIntensiveCareVaccinationStatusValue,
  WEEK_IN_SECONDS,
} from '@corona-dashboard/common';
import { Arts } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import dynamic from 'next/dynamic';
import type { AgeDemographicProps } from '~/components/age-demographic';
import { ChartTile } from '~/components/chart-tile';
import { KpiTile } from '~/components/kpi-tile';
import { Markdown } from '~/components/markdown';
import { PageBarScale } from '~/components/page-barscale';
import { PageInformationBlock } from '~/components/page-information-block';
import { PageKpi } from '~/components/page-kpi';
import type { PieChartProps } from '~/components/pie-chart';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { AdmissionsPerAgeGroup } from '~/domain/hospital/admissions-per-age-group';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { useIntl } from '~/intl';
import { useFeature } from '~/lib/features';
import { getBarScaleConfig } from '~/metric-config';
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
  createGetContent,
  getLastGeneratedDate,
  selectNlData,
} from '~/static-props/get-data';
import type { ArticleParts, LinkParts, PagePartQueryResult } from '~/types/cms';
import { countTrailingNullValues } from '~/utils/count-trailing-null-values';
import { getBoundaryDateStartUnix } from '~/utils/get-boundary-date-start-unix';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

// TODO: Update any to the proper type when the schema is merged.
const AgeDemographic = dynamic<AgeDemographicProps<any>>(() =>
  import('~/components/age-demographic').then((mod) => mod.AgeDemographic)
);

const PieChart = dynamic<PieChartProps<NlIntensiveCareVaccinationStatusValue>>(
  () => import('~/components/pie-chart').then((mod) => mod.PieChart)
);

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectNlData(
    'intensive_care_lcps',
    'intensive_care_nice',
    'intensive_care_nice_per_age_group',
    'difference.intensive_care_lcps__beds_occupied_covid',
    'intensive_care_vaccination_status',
    'hospital_vaccine_incidence_per_age_group'
  ),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts | LinkParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      return `{
        "parts": ${getPagePartsQuery('intensiveCarePage')},
        "elements": ${getElementsQuery(
          'nl',
          ['intensive_care_nice'],
          context.locale
        )}
      }`;
    })(context);

    return {
      content: {
        articles: getArticleParts(
          content.parts.pageParts,
          'intensiveCarePageArticles'
        ),
        links: getLinkParts(content.parts.pageParts, 'intensiveCarePageLinks'),
        elements: content.elements,
      },
    };
  }
);

const IntakeIntensiveCare = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText, formatPercentage, formatDateFromSeconds, formatNumber } =
    useIntl();

  const text = siteText.ic_opnames_per_dag;

  const { selectedNlData: data, content, lastGenerated } = props;

  const bedsLastValue = getLastFilledValue(data.intensive_care_lcps);

  const dataIntake = data.intensive_care_nice;
  const lastValueVaccinationStatus =
    data.intensive_care_vaccination_status.last_value;
  const intakeUnderReportedRange = getBoundaryDateStartUnix(
    dataIntake.values,
    countTrailingNullValues(
      dataIntake.values,
      'admissions_on_date_of_admission_moving_average'
    )
  );

  const vaccinationStatusFeature = useFeature(
    'nlIntensiveCareVaccinationStatus'
  );

  const icVaccinationIncidencePerAgeGroupFeature = useFeature(
    'nlIcAdmissionsIncidencePerAgeGroup'
  );

  const sevenDayAverageDates: [number, number] = [
    intakeUnderReportedRange - WEEK_IN_SECONDS,
    intakeUnderReportedRange - DAY_IN_SECONDS,
  ];

  const metadata = {
    ...siteText.nationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={siteText.nationaal_layout.headings.ziekenhuizen}
            screenReaderCategory={
              siteText.sidebar.metrics.intensive_care_admissions.title
            }
            title={text.titel}
            icon={<Arts />}
            description={text.pagina_toelichting}
            metadata={{
              datumsText: text.datums,
              dateOrRange: dataIntake.last_value.date_unix,
              dateOfInsertionUnix: dataIntake.last_value.date_of_insertion_unix,
              dataSources: [text.bronnen.nice, text.bronnen.lnaz],
            }}
            referenceLink={text.reference.href}
            pageLinks={content.links}
            articles={content.articles}
          />

          <TwoKpiSection>
            <KpiTile
              title={text.barscale_titel}
              metadata={{
                date: sevenDayAverageDates,
                source: text.bronnen.nice,
              }}
            >
              <PageKpi
                data={data}
                metricName="intensive_care_nice"
                metricProperty="admissions_on_date_of_admission_moving_average_rounded"
                isAmount
                isMovingAverageDifference
              />
              <Markdown
                content={replaceVariablesInText(text.extra_uitleg, {
                  dateStart: formatDateFromSeconds(sevenDayAverageDates[0]),
                  dateEnd: formatDateFromSeconds(sevenDayAverageDates[1]),
                })}
              />
            </KpiTile>

            <KpiTile
              title={text.kpi_bedbezetting.title}
              metadata={{
                date: bedsLastValue.date_unix,
                source: text.bronnen.lnaz,
              }}
            >
              {bedsLastValue.beds_occupied_covid !== null &&
                bedsLastValue.beds_occupied_covid_percentage !== null && (
                  <>
                    <PageBarScale
                      value={bedsLastValue.beds_occupied_covid}
                      config={getBarScaleConfig(
                        'nl',
                        'intensive_care_lcps',
                        'beds_occupied_covid'
                      )}
                      difference={
                        data.difference.intensive_care_lcps__beds_occupied_covid
                      }
                      screenReaderText={
                        text.kpi_bedbezetting.barscale_screenreader_text
                      }
                      isAmount
                    />

                    <Markdown
                      content={replaceVariablesInText(
                        text.kpi_bedbezetting.description,
                        {
                          percentage: formatPercentage(
                            bedsLastValue.beds_occupied_covid_percentage,
                            { maximumFractionDigits: 1 }
                          ),
                        }
                      )}
                    />
                  </>
                )}
            </KpiTile>
          </TwoKpiSection>

          {icVaccinationIncidencePerAgeGroupFeature.isEnabled && (
            <ChartTile
              title={
                siteText.ic_admissions_incidence_age_demographic_chart.title
              }
              description={
                siteText.ic_admissions_incidence_age_demographic_chart
                  .description
              }
            >
              <AgeDemographic
                // This is correct, hospital admissions data is supposed to be displayed here.
                data={data.hospital_vaccine_incidence_per_age_group}
                accessibility={{
                  key: 'ic_admissions_incidence_age_demographic_chart',
                }}
                rightColor="data.primary"
                leftColor="data.yellow"
                leftMetricProperty={'has_one_shot_or_not_vaccinated_per_100k'}
                rightMetricProperty={'fully_vaccinated_per_100k'}
                formatValue={(n: number) => `${n}`}
                text={
                  siteText.ic_admissions_incidence_age_demographic_chart
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
                icon={<Arts />}
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
            metadata={{ source: text.bronnen.nice }}
            timeframeOptions={['all', '5weeks']}
            timeframeInitialValue="5weeks"
          >
            {(timeframe) => (
              <TimeSeriesChart
                accessibility={{
                  key: 'intensive_care_admissions_over_time_chart',
                }}
                values={dataIntake.values}
                timeframe={timeframe}
                dataOptions={{
                  timespanAnnotations: [
                    {
                      start: intakeUnderReportedRange,
                      end: Infinity,
                      label: text.linechart_legend_inaccurate_label,
                      shortLabel: siteText.common.incomplete,
                      cutValuesForMetricProperties: [
                        'admissions_on_date_of_admission_moving_average',
                      ],
                    },
                  ],
                  timelineEvents: getTimelineEvents(
                    content.elements.timeSeries,
                    'intensive_care_nice'
                  ),
                }}
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty:
                      'admissions_on_date_of_admission_moving_average',
                    label: text.linechart_legend_trend_label_moving_average,
                    color: colors.data.primary,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'admissions_on_date_of_admission',
                    label: text.linechart_legend_trend_label,
                    color: colors.data.primary,
                  },
                ]}
              />
            )}
          </ChartTile>

          <ChartTile
            title={text.chart_bedbezetting.title}
            description={text.chart_bedbezetting.description}
            metadata={{ source: text.bronnen.lnaz }}
            timeframeOptions={['all', '5weeks']}
            timeframeInitialValue="5weeks"
          >
            {(timeframe) => (
              <TimeSeriesChart
                accessibility={{
                  key: 'intensive_care_beds_occupied_over_time_chart',
                }}
                values={data.intensive_care_lcps.values}
                timeframe={timeframe}
                dataOptions={{
                  timespanAnnotations: [
                    {
                      start: data.intensive_care_lcps.values[0].date_unix,
                      end: new Date('1 June 2020').getTime() / 1000,
                      label: text.chart_bedbezetting.legend_inaccurate_label,
                      shortLabel: siteText.common.incomplete,
                    },
                  ],
                }}
                seriesConfig={[
                  {
                    type: 'gapped-area',
                    metricProperty: 'beds_occupied_covid',
                    label: text.chart_bedbezetting.legend_trend_label,
                    color: colors.data.primary,
                  },
                ]}
              />
            )}
          </ChartTile>

          <ChartTile
            title={siteText.ic_admissions_per_age_group.chart_title}
            description={siteText.ic_admissions_per_age_group.chart_description}
            timeframeOptions={['all', '5weeks']}
            timeframeInitialValue="5weeks"
            metadata={{ source: text.bronnen.nice }}
          >
            {(timeframe) => (
              <AdmissionsPerAgeGroup
                accessibility={{
                  key: 'intensive_care_admissions_per_age_group_over_time_chart',
                }}
                values={data.intensive_care_nice_per_age_group.values}
                timeframe={timeframe}
              />
            )}
          </ChartTile>
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default IntakeIntensiveCare;
