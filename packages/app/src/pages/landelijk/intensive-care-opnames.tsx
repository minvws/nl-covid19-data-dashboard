import {
  colors,
  DAY_IN_SECONDS,
  getLastFilledValue,
  TimeframeOption,
  TimeframeOptionsList,
  WEEK_IN_SECONDS,
} from '@corona-dashboard/common';
import { Arts } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import {
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
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';

const pageMetrics = [
  'intensive_care_lcps',
  'intensive_care_nice',
  'intensive_care_nice_per_age_group',
];

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
    'difference.intensive_care_lcps__beds_occupied_covid'
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
  const { commonTexts, formatPercentage, formatDateFromSeconds } = useIntl();

  const { pageText, selectedNlData: data, content, lastGenerated } = props;
  const { metadataTexts, textNl, textShared } = pageText;

  const bedsLastValue = getLastFilledValue(data.intensive_care_lcps);

  const dataIntake = data.intensive_care_nice;
  const intakeUnderReportedRange = getBoundaryDateStartUnix(
    dataIntake.values,
    countTrailingNullValues(
      dataIntake.values,
      'admissions_on_date_of_admission_moving_average'
    )
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

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

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

          <ChartTile
            title={textNl.linechart_titel}
            description={textNl.linechart_description}
            metadata={{ source: textNl.bronnen.nice }}
            timeframeOptions={TimeframeOptionsList}
            timeframeInitialValue={TimeframeOption.THIRTY_DAYS}
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
            timeframeOptions={TimeframeOptionsList}
            timeframeInitialValue={TimeframeOption.THIRTY_DAYS}
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
                    type: 'line',
                    metricProperty: 'beds_occupied_covid',
                    nonInteractive: true,
                    hideInLegend: true,
                    label: textNl.chart_bedbezetting.legend_trend_label,
                    color: colors.data.primary,
                  },
                  {
                    type: 'scatter-plot',
                    metricProperty: 'beds_occupied_covid',
                    label: textNl.chart_bedbezetting.legend_dot_label,
                    color: colors.data.primary,
                  },
                ]}
              />
            )}
          </ChartTile>

          <ChartTile
            title={textShared.admissions_per_age_group.chart_title}
            description={textShared.admissions_per_age_group.chart_description}
            timeframeOptions={TimeframeOptionsList}
            timeframeInitialValue={TimeframeOption.THIRTY_DAYS}
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
