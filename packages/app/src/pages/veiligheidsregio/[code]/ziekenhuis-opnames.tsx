import {
  MunicipalHospitalNiceValue,
  MunicipalityProperties,
} from '@corona-dashboard/common';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { ArticleStrip } from '~/components/article-strip';
import { ArticleSummary } from '~/components/article-teaser';
import { ChartTile } from '~/components/chart-tile';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { municipalThresholds } from '~/components/choropleth/municipal-thresholds';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { HospitalAdmissionsMunicipalTooltip } from '~/components/choropleth/tooltips/municipal/municipal-hospital-admissions-tooltip';
import { ContentHeader } from '~/components/content-header';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { gmCodesByVrCode } from '~/data/gm-codes-by-vr-code';
import { Layout } from '~/domain/layout/layout';
import { SafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import { useIntl } from '~/intl';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  selectVrPageMetricData,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { getBoundaryDateStartUnix } from '~/utils/get-trailing-date-range';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectVrPageMetricData(),
  createGetChoroplethData({
    gm: ({ hospital_nice }) => ({ hospital_nice }),
  }),
  createGetContent<{
    articles?: ArticleSummary[];
  }>(() => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return createPageArticlesQuery('hospitalPage', locale);
  })
);

const IntakeHospital = (props: StaticProps<typeof getStaticProps>) => {
  const {
    selectedVrData: data,
    safetyRegionName,
    choropleth,
    content,
    lastGenerated,
  } = props;
  const { siteText } = useIntl();
  const reverseRouter = useReverseRouter();

  const text = siteText.veiligheidsregio_ziekenhuisopnames_per_dag;
  const lastValue = data.hospital_nice.last_value;

  const municipalCodes = gmCodesByVrCode[data.code];
  const selectedMunicipalCode = municipalCodes ? municipalCodes[0] : undefined;

  const underReportedRange = getBoundaryDateStartUnix(
    data.hospital_nice.values,
    4
  );

  const metadata = {
    ...siteText.veiligheidsregio_index.metadata,
    title: replaceVariablesInText(text.metadata.title, {
      safetyRegionName,
    }),
    description: replaceVariablesInText(text.metadata.description, {
      safetyRegionName,
    }),
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <SafetyRegionLayout
        data={data}
        safetyRegionName={safetyRegionName}
        lastGenerated={lastGenerated}
      >
        <TileList>
          <ContentHeader
            category={siteText.veiligheidsregio_layout.headings.ziekenhuizen}
            title={replaceVariablesInText(text.titel, {
              safetyRegion: safetyRegionName,
            })}
            icon={<Ziekenhuis />}
            subtitle={text.pagina_toelichting}
            metadata={{
              datumsText: text.datums,
              dateOrRange: lastValue.date_unix,
              dateOfInsertionUnix: lastValue.date_of_insertion_unix,
              dataSources: [text.bronnen.rivm],
            }}
            reference={text.reference}
          />

          <ArticleStrip articles={content.articles} />

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
                data-cy="hospital_moving_avg_per_region"
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
              safetyRegion: safetyRegionName,
            })}
            description={text.map_toelichting}
            legend={{
              thresholds:
                municipalThresholds.hospital_nice
                  .admissions_on_date_of_reporting,
              title:
                siteText.ziekenhuisopnames_per_dag.chloropleth_legenda.titel,
            }}
            metadata={{
              date: lastValue.date_unix,
              source: text.bronnen.rivm,
            }}
          >
            <MunicipalityChoropleth
              accessibility={{
                key: 'hospital_admissions_choropleth',
              }}
              selectedCode={selectedMunicipalCode}
              highlightSelection={false}
              data={choropleth.gm}
              getLink={reverseRouter.gm.ziekenhuisopnames}
              metricName="hospital_nice"
              metricProperty="admissions_on_date_of_reporting"
              tooltipContent={(
                context: MunicipalityProperties & MunicipalHospitalNiceValue
              ) => <HospitalAdmissionsMunicipalTooltip context={context} />}
            />
          </ChoroplethTile>

          <ChartTile
            metadata={{ source: text.bronnen.rivm }}
            title={text.linechart_titel}
            description={text.linechart_description}
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
                }}
              />
            )}
          </ChartTile>
        </TileList>
      </SafetyRegionLayout>
    </Layout>
  );
};

export default IntakeHospital;
