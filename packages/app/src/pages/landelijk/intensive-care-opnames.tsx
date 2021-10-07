import { getLastFilledValue } from '@corona-dashboard/common';
import { Arts } from '@corona-dashboard/icons';
import { ChartTile } from '~/components/chart-tile';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { PageInformationBlock } from '~/components/page-information-block';
import { PageKpi } from '~/components/page-kpi';
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
import { getIntakeHospitalPageQuery } from '~/queries/intake-hospital-page-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  selectNlData,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { IntakeHospitalPageQuery } from '~/types/cms';
import { getBoundaryDateStartUnix } from '~/utils/get-trailing-date-range';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectNlData(
    'intensive_care_lcps',
    'intensive_care_nice',
    'intensive_care_nice_per_age_group',
    'difference.intensive_care_lcps__beds_occupied_covid'
  ),
  createGetContent<{
    page: IntakeHospitalPageQuery;
    highlight: PageArticlesQueryResult;
    elements: ElementsQueryResult;
  }>((context) => {
    const { locale } = context;
    return `{
      "page": ${getIntakeHospitalPageQuery(context)},
      "highlight": ${createPageArticlesQuery('intensiveCarePage', locale)},
      "elements": ${createElementsQuery('nl', ['intensive_care_nice'], locale)}
    }`;
  })
);

const IntakeIntensiveCare = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText, formatPercentage } = useIntl();

  const text = siteText.ic_opnames_per_dag;

  const { selectedNlData: data, content, lastGenerated } = props;

  const bedsLastValue = getLastFilledValue(data.intensive_care_lcps);

  const dataIntake = data.intensive_care_nice;
  const intakeUnderReportedRange = getBoundaryDateStartUnix(
    dataIntake.values,
    3
  );

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
            pageLinks={content.page.pageLinks}
            articles={content.highlight.articles}
          />

          <TwoKpiSection>
            <KpiTile
              title={text.barscale_titel}
              metadata={{
                source: text.bronnen.nice,
              }}
            >
              <PageKpi
                data={data}
                metricName="intensive_care_nice"
                metricProperty="admissions_on_date_of_admission_moving_average"
                isAmount
                isMovingAverageDifference
              />
              <Markdown content={text.extra_uitleg} />
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
                    <KpiValue
                      data-cy="beds_occupied_covid"
                      absolute={bedsLastValue.beds_occupied_covid}
                      difference={
                        data.difference.intensive_care_lcps__beds_occupied_covid
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

          <ChartTile
            title={text.linechart_titel}
            description={text.linechart_description}
            metadata={{ source: text.bronnen.nice }}
            timeframeOptions={['all', '5weeks']}
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
            title={siteText.ic_admissions_per_age_group.chart_title}
            description={siteText.ic_admissions_per_age_group.chart_description}
            timeframeOptions={['all', '5weeks']}
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

          <ChartTile
            title={text.chart_bedbezetting.title}
            description={text.chart_bedbezetting.description}
            metadata={{ source: text.bronnen.lnaz }}
            timeframeOptions={['all', '5weeks']}
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
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default IntakeIntensiveCare;
