import {
  colors,
  DAY_IN_SECONDS,
  getLastFilledValue,
  NlHospitalVaccineIncidencePerAgeGroupValue,
  NlIntensiveCareVaccinationStatusValue,
  TimeframeOption,
  WEEK_IN_SECONDS,
} from '@corona-dashboard/common';
import { Arts } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import dynamic from 'next/dynamic';
import {
  AgeDemographicProps,
  PieChartProps,
  TwoKpiSection,
  TimeSeriesChart,
  TileList,
  PageKpi,
  ChartTile,
  KpiTile,
  Markdown,
  PageInformationBlock,
  PageBarScale,
} from '~/components';
import { AdmissionsPerAgeGroup } from '~/domain/hospital';
import { Layout, NlLayout } from '~/domain/layout';
import { useIntl } from '~/intl';
import { useFeature } from '~/lib/features';
import { getBarScaleConfig } from '~/metric-config';
import { Languages } from '~/locale';
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
  getLokalizeTexts,
} from '~/static-props/get-data';
import type { ArticleParts, LinkParts, PagePartQueryResult } from '~/types/cms';
import {
  countTrailingNullValues,
  getBoundaryDateStartUnix,
  replaceVariablesInText,
} from '~/utils';

const AgeDemographic = dynamic<
  AgeDemographicProps<NlHospitalVaccineIncidencePerAgeGroupValue>
>(() =>
  import('~/components/age-demographic').then((mod) => mod.AgeDemographic)
);

const PieChart = dynamic<PieChartProps<NlIntensiveCareVaccinationStatusValue>>(
  () => import('~/components/pie-chart').then((mod) => mod.PieChart)
);

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(
      (siteText) => ({
        metadataTexts: siteText.pages.topicalPage.nl.nationaal_metadata,
        textNl: siteText.pages.intensiveCarePage.nl,
        textShared: siteText.pages.intensiveCarePage.shared,
      }),
      locale
    ),
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
          ['intensive_care_nice', 'intensive_care_nice_per_age_group'],
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
  const { commonTexts, formatPercentage, formatDateFromSeconds, formatNumber } =
    useIntl();

  const { pageText, selectedNlData: data, content, lastGenerated } = props;
  const { metadataTexts, textNl, textShared } = pageText;

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
    ...metadataTexts,
    title: textNl.metadata.title,
    description: textNl.metadata.description,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={commonTexts.nationaal_layout.headings.ziekenhuizen}
            screenReaderCategory={
              commonTexts.sidebar.metrics.intensive_care_admissions.title
            }
            title={textNl.titel}
            icon={<Arts />}
            description={textNl.pagina_toelichting}
            metadata={{
              datumsText: textNl.datums,
              dateOrRange: dataIntake.last_value.date_unix,
              dateOfInsertionUnix: dataIntake.last_value.date_of_insertion_unix,
              dataSources: [textNl.bronnen.nice, textNl.bronnen.lnaz],
            }}
            referenceLink={textNl.reference.href}
            pageLinks={content.links}
            articles={content.articles}
          />

          <TwoKpiSection>
            <KpiTile
              title={textNl.barscale_titel}
              metadata={{
                date: sevenDayAverageDates,
                source: textNl.bronnen.nice,
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
                content={replaceVariablesInText(textNl.extra_uitleg, {
                  dateStart: formatDateFromSeconds(sevenDayAverageDates[0]),
                  dateEnd: formatDateFromSeconds(sevenDayAverageDates[1]),
                })}
              />
            </KpiTile>

            <KpiTile
              title={textNl.kpi_bedbezetting.title}
              metadata={{
                date: bedsLastValue.date_unix,
                source: textNl.bronnen.lnaz,
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
                        textNl.kpi_bedbezetting.barscale_screenreader_text
                      }
                      isAmount
                    />

                    <Markdown
                      content={replaceVariablesInText(
                        textNl.kpi_bedbezetting.description,
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
                textShared.admissions_incidence_age_demographic_chart.title
              }
              description={
                textShared.admissions_incidence_age_demographic_chart
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
                  textShared.admissions_incidence_age_demographic_chart
                    .chart_text
                }
              />
            </ChartTile>
          )}

          {vaccinationStatusFeature.isEnabled && (
            <ChartTile
              title={textNl.vaccination_status_chart.title}
              metadata={{
                isTileFooter: true,
                date: [
                  lastValueVaccinationStatus.date_start_unix,
                  lastValueVaccinationStatus.date_end_unix,
                ],
                source: {
                  ...textNl.vaccination_status_chart.source,
                },
              }}
              description={replaceVariablesInText(
                textNl.vaccination_status_chart.description,
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
                      textNl.vaccination_status_chart.labels
                        .has_one_shot_or_not_vaccinated,
                    tooltipLabel:
                      textNl.vaccination_status_chart.tooltip_labels
                        .has_one_shot_or_not_vaccinated,
                  },
                  {
                    metricProperty: 'fully_vaccinated',
                    color: colors.data.primary,
                    label:
                      textNl.vaccination_status_chart.labels.fully_vaccinated,
                    tooltipLabel:
                      textNl.vaccination_status_chart.tooltip_labels
                        .fully_vaccinated,
                  },
                ]}
              />
            </ChartTile>
          )}

          <ChartTile
            title={textNl.linechart_titel}
            description={textNl.linechart_description}
            metadata={{ source: textNl.bronnen.nice }}
            timeframeOptions={[TimeframeOption.ALL, TimeframeOption.FIVE_WEEKS]}
            timeframeInitialValue={TimeframeOption.FIVE_WEEKS}
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
                      label: textNl.linechart_legend_inaccurate_label,
                      shortLabel: commonTexts.common.incomplete,
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
                    label: textNl.linechart_legend_trend_label_moving_average,
                    color: colors.data.primary,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'admissions_on_date_of_admission',
                    label: textNl.linechart_legend_trend_label,
                    color: colors.data.primary,
                  },
                ]}
              />
            )}
          </ChartTile>

          <ChartTile
            title={textNl.chart_bedbezetting.title}
            description={textNl.chart_bedbezetting.description}
            metadata={{ source: textNl.bronnen.lnaz }}
            timeframeOptions={[TimeframeOption.ALL, TimeframeOption.FIVE_WEEKS]}
            timeframeInitialValue={TimeframeOption.FIVE_WEEKS}
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
                      label: textNl.chart_bedbezetting.legend_inaccurate_label,
                      shortLabel: commonTexts.common.incomplete,
                    },
                  ],
                }}
                seriesConfig={[
                  {
                    type: 'gapped-area',
                    metricProperty: 'beds_occupied_covid',
                    label: textNl.chart_bedbezetting.legend_trend_label,
                    color: colors.data.primary,
                  },
                ]}
              />
            )}
          </ChartTile>

          <ChartTile
            title={textShared.admissions_per_age_group.chart_title}
            description={textShared.admissions_per_age_group.chart_description}
            timeframeOptions={[TimeframeOption.ALL, TimeframeOption.FIVE_WEEKS]}
            timeframeInitialValue={TimeframeOption.FIVE_WEEKS}
            metadata={{ source: textNl.bronnen.nice }}
          >
            {(timeframe) => (
              <AdmissionsPerAgeGroup
                accessibility={{
                  key: 'intensive_care_admissions_per_age_group_over_time_chart',
                }}
                values={data.intensive_care_nice_per_age_group.values}
                timeframe={timeframe}
                timelineEvents={getTimelineEvents(
                  content.elements.timeSeries,
                  'intensive_care_nice_per_age_group'
                )}
              />
            )}
          </ChartTile>
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default IntakeIntensiveCare;
