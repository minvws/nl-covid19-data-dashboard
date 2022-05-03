import {
  colors,
  DAY_IN_SECONDS,
  getLastFilledValue,
  NlHospitalVaccinationStatusValue,
  NlHospitalVaccineIncidencePerAgeGroupValue,
  TimeframeOption,
  TimeframeOptionsList,
  WEEK_IN_SECONDS,
} from '@corona-dashboard/common';
import { Ziekenhuis } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import {
  TwoKpiSection,
  TimeSeriesChart,
  TileList,
  SEOHead,
  AgeDemographicProps,
  PieChartProps,
  ChartTile,
  DynamicChoropleth,
  ChoroplethTile,
  KpiTile,
  KpiValue,
  PageInformationBlock,
  PageKpi,
} from '~/components';
import { RegionControlOption } from '~/components/chart-region-controls';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { AdmissionsPerAgeGroup } from '~/domain/hospital';
import { Layout, NlLayout } from '~/domain/layout';
import { useIntl } from '~/intl';
import { Languages } from '~/locale';
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
  getLokalizeTexts,
  selectNlData,
} from '~/static-props/get-data';
import { ArticleParts, LinkParts, PagePartQueryResult } from '~/types/cms';
import {
  countTrailingNullValues,
  getBoundaryDateStartUnix,
  replaceVariablesInText,
  useReverseRouter,
} from '~/utils';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { last } from 'lodash';

const AgeDemographic = dynamic<
  AgeDemographicProps<NlHospitalVaccineIncidencePerAgeGroupValue>
>(() =>
  import('~/components/age-demographic').then((mod) => mod.AgeDemographic)
);

const PieChart = dynamic<PieChartProps<NlHospitalVaccinationStatusValue>>(() =>
  import('~/components/pie-chart').then((mod) => mod.PieChart)
);

const pageMetrics = [
  'hospital_lcps',
  'hospital_nice_per_age_group',
  'hospital_nice',
  'hospital_vaccination_status',
  'hospital_vaccine_incidence_per_age_group',
];

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(
      (siteText) => ({
        metadataTexts: siteText.pages.topicalPage.nl.nationaal_metadata,
        textNl: siteText.pages.hospitalPage.nl,
        textShared: siteText.pages.hospitalPage.shared,
      }),
      locale
    ),
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
    vr: ({ hospital_nice_choropleth }) => ({ hospital_nice_choropleth }),
    gm: ({ hospital_nice_choropleth }) => ({ hospital_nice_choropleth }),
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
  const {
    pageText,
    selectedNlData: data,
    choropleth,
    content,
    lastGenerated,
  } = props;
  const reverseRouter = useReverseRouter();
  const [selectedMap, setSelectedMap] = useState<RegionControlOption>('vr');

  const dataHospitalNice = data.hospital_nice;
  const dataHospitalLcps = data.hospital_lcps;
  const lastValueLcps = data.hospital_lcps.last_value;
  const lastValueVaccinationStatus =
    data.hospital_vaccination_status.last_value;

  const lastValueNice =
    (selectedMap === 'gm'
      ? last(choropleth.gm.hospital_nice_choropleth)
      : last(choropleth.vr.hospital_nice_choropleth)) ||
    data.hospital_nice.last_value;

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

  const { commonTexts, formatNumber, formatDateFromSeconds } = useIntl();
  const { metadataTexts, textNl, textShared } = pageText;

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  return (
    <Layout {...metadataTexts} lastGenerated={lastGenerated}>
      <NlLayout>
        <SEOHead
          title={textNl.metadata.title}
          description={textNl.metadata.description}
        />
        <TileList>
          <PageInformationBlock
            category={commonTexts.nationaal_layout.headings.ziekenhuizen}
            screenReaderCategory={
              commonTexts.sidebar.metrics.hospital_admissions.title
            }
            title={textNl.titel}
            icon={<Ziekenhuis />}
            description={textNl.pagina_toelichting}
            metadata={{
              datumsText: textNl.datums,
              dateOrRange: lastValueNice.date_unix,
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [textNl.bronnen.nice, textNl.bronnen.lnaz],
            }}
            referenceLink={textNl.reference.href}
            pageLinks={content.links}
            articles={content.articles}
          />
          <TwoKpiSection>
            <KpiTile
              title={textNl.barscale_titel}
              description={replaceVariablesInText(textNl.extra_uitleg, {
                dateStart: formatDateFromSeconds(sevenDayAverageDates[0]),
                dateEnd: formatDateFromSeconds(sevenDayAverageDates[1]),
              })}
              metadata={{
                date: sevenDayAverageDates,
                source: textNl.bronnen.nice,
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
              title={textNl.kpi_bedbezetting.title}
              description={textNl.kpi_bedbezetting.description}
              metadata={{
                date: lastValueLcps.date_unix,
                source: textNl.bronnen.lnaz,
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
                commonTexts.hospital_admissions_incidence_age_demographic_chart
                  .title
              }
              description={
                commonTexts.hospital_admissions_incidence_age_demographic_chart
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
                  commonTexts
                    .hospital_admissions_incidence_age_demographic_chart
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
                icon={<Ziekenhuis />}
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
            metadata={{
              source: textNl.bronnen.nice,
            }}
            timeframeOptions={TimeframeOptionsList}
            timeframeInitialValue={TimeframeOption.THIRTY_DAYS}
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
                    label: textNl.linechart_legend_titel_moving_average,
                    color: colors.data.primary,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'admissions_on_date_of_admission',
                    label: textNl.linechart_legend_titel,
                    color: colors.data.primary,
                  },
                ]}
                dataOptions={{
                  timespanAnnotations: [
                    {
                      start: underReportedRange,
                      end: Infinity,
                      label: textNl.linechart_legend_underreported_titel,
                      shortLabel: commonTexts.common.incomplete,
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
            title={textNl.chart_bedbezetting.title}
            description={textNl.chart_bedbezetting.description}
            metadata={{
              source: textNl.bronnen.lnaz,
            }}
            timeframeOptions={TimeframeOptionsList}
            timeframeInitialValue={TimeframeOption.THIRTY_DAYS}
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
                    label: textNl.chart_bedbezetting.legend_trend_label,
                    color: colors.data.primary,
                  },
                ]}
                dataOptions={{
                  timespanAnnotations: [
                    {
                      start: dataHospitalLcps.values[0].date_unix,
                      end: new Date('1 June 2020').getTime() / 1000,
                      label: textNl.chart_bedbezetting.legend_inaccurate_label,
                      shortLabel: commonTexts.common.incomplete,
                    },
                  ],
                }}
              />
            )}
          </ChartTile>

          <ChoroplethTile
            title={textNl.map_titel}
            description={textNl.map_toelichting}
            onChartRegionChange={setSelectedMap}
            chartRegion={selectedMap}
            legend={{
              thresholds:
                selectedMap === 'gm'
                  ? thresholds.gm.admissions_on_date_of_admission
                  : thresholds.gm.admissions_on_date_of_admission,
              title: textShared.chloropleth_legenda.titel,
            }}
            metadata={{
              date: lastValueNice.date_unix,
              source: textNl.bronnen.nice,
            }}
          >
            {selectedMap === 'gm' && (
              <DynamicChoropleth
                accessibility={{
                  key: 'hospital_admissions_municipal_choropleth',
                }}
                map="gm"
                data={choropleth.gm.hospital_nice_choropleth}
                dataConfig={{
                  metricName: 'hospital_nice_choropleth',
                  metricProperty: 'admissions_on_date_of_admission',
                }}
                dataOptions={{
                  getLink: reverseRouter.gm.ziekenhuisopnames,
                  tooltipVariables: {
                    patients: commonTexts.choropleth_tooltip.patients,
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
                thresholdMap="gm"
                data={choropleth.vr.hospital_nice_choropleth}
                dataConfig={{
                  metricName: 'hospital_nice_choropleth',
                  metricProperty: 'admissions_on_date_of_admission',
                }}
                dataOptions={{
                  getLink: reverseRouter.vr.ziekenhuisopnames,
                  tooltipVariables: {
                    patients: commonTexts.choropleth_tooltip.patients,
                  },
                }}
              />
            )}
          </ChoroplethTile>

          <ChartTile
            title={commonTexts.hospital_admissions_per_age_group.chart_title}
            description={
              commonTexts.hospital_admissions_per_age_group.chart_description
            }
            timeframeOptions={TimeframeOptionsList}
            timeframeInitialValue={TimeframeOption.THIRTY_DAYS}
            metadata={{ source: textNl.bronnen.nice }}
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
