import { Ziekenhuis } from '@corona-dashboard/icons';
import { ChartTile } from '~/components/chart-tile';
import { DynamicChoropleth } from '~/components/choropleth';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { GmLayout } from '~/domain/layout/gm-layout';
import { Layout } from '~/domain/layout/layout';
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
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  selectGmPageMetricData,
} from '~/static-props/get-data';
import { filterByRegionMunicipalities } from '~/static-props/utils/filter-by-region-municipalities';
import { colors } from '~/style/theme';
import { getBoundaryDateStartUnix } from '~/utils/get-trailing-date-range';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { HospitalAdmissionsPageQuery } from '~/types/cms';
import { getHospitalAdmissionsPageQuery } from '~/queries/hospital-admissions-page-query';

export { getStaticPaths } from '~/static-paths/gm';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectGmPageMetricData('hospital_nice', 'difference', 'code'),
  createGetChoroplethData({
    gm: ({ hospital_nice }, context) => ({
      hospital_nice: filterByRegionMunicipalities(hospital_nice, context),
    }),
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
      "elements": ${createElementsQuery('gm', ['hospital_nice'], locale)}
    }`;
  })
);

const IntakeHospital = (props: StaticProps<typeof getStaticProps>) => {
  const {
    selectedGmData: data,
    sideBarData,
    choropleth,
    municipalityName,
    content,
    lastGenerated,
  } = props;
  const { siteText } = useIntl();
  const reverseRouter = useReverseRouter();

  const text = siteText.gemeente_ziekenhuisopnames_per_dag;

  const lastValue = data.hospital_nice.last_value;

  const underReportedRange = getBoundaryDateStartUnix(
    data.hospital_nice.values,
    4
  );

  const metadata = {
    ...siteText.gemeente_index.metadata,
    title: replaceVariablesInText(text.metadata.title, {
      municipalityName,
    }),
    description: replaceVariablesInText(text.metadata.description, {
      municipalityName,
    }),
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <GmLayout
        data={sideBarData}
        code={data.code}
        difference={data.difference}
        municipalityName={municipalityName}
        lastGenerated={lastGenerated}
      >
        <TileList>
          <PageInformationBlock
            category={siteText.gemeente_layout.headings.ziekenhuizen}
            title={replaceVariablesInText(text.titel, {
              municipality: municipalityName,
            })}
            icon={<Ziekenhuis />}
            description={text.pagina_toelichting}
            metadata={{
              datumsText: text.datums,
              dateOrRange: lastValue.date_unix,
              dateOfInsertionUnix: lastValue.date_of_insertion_unix,
              dataSources: [text.bronnen.rivm],
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
                date: lastValue.date_unix,
                source: text.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="admissions_on_date_of_reporting"
                absolute={lastValue.admissions_on_date_of_reporting}
                difference={
                  data.difference
                    .hospital_nice__admissions_on_date_of_reporting_moving_average
                }
                isMovingAverageDifference
              />
            </KpiTile>
          </TwoKpiSection>

          <ChoroplethTile
            title={replaceVariablesInText(text.map_titel, {
              municipality: municipalityName,
            })}
            metadata={{
              date: lastValue.date_unix,
              source: text.bronnen.rivm,
            }}
            description={text.map_toelichting}
            legend={{
              title:
                siteText.ziekenhuisopnames_per_dag.chloropleth_legenda.titel,
              thresholds: thresholds.gm.admissions_on_date_of_reporting,
            }}
          >
            <DynamicChoropleth
              renderTarget="canvas"
              map="gm"
              accessibility={{
                key: 'hospital_admissions_choropleth',
              }}
              data={choropleth.gm.hospital_nice}
              dataConfig={{
                metricName: 'hospital_nice',
                metricProperty: 'admissions_on_date_of_reporting',
              }}
              dataOptions={{
                selectedCode: data.code,
                highlightSelection: true,
                getLink: reverseRouter.gm.ziekenhuisopnames,
                tooltipVariables: {
                  patients: siteText.choropleth_tooltip.patients,
                },
              }}
            />
          </ChoroplethTile>

          <ChartTile
            title={text.linechart_titel}
            description={text.linechart_description}
            metadata={{ source: text.bronnen.rivm }}
            timeframeOptions={['all', '5weeks']}
          >
            {(timeframe) => (
              <TimeSeriesChart
                accessibility={{
                  key: 'hospital_admissions_over_time_chart',
                }}
                values={data.hospital_nice.values}
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
        </TileList>
      </GmLayout>
    </Layout>
  );
};

export default IntakeHospital;
