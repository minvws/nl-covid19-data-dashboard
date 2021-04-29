import {
  getLastFilledValue,
  MunicipalHospitalNiceValue,
  MunicipalityProperties,
  RegionalHospitalNiceValue,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import { useState } from 'react';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { ArticleStrip } from '~/components/article-strip';
import { ArticleSummary } from '~/components/article-teaser';
import { ChartTile } from '~/components/chart-tile';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { municipalThresholds } from '~/components/choropleth/municipal-thresholds';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { HospitalAdmissionsMunicipalTooltip } from '~/components/choropleth/tooltips/municipal/municipal-hospital-admissions-tooltip';
import { HospitalAdmissionsRegionalTooltip } from '~/components/choropleth/tooltips/region/hospital-admissions-regional-tooltip';
import { ContentHeader } from '~/components/content-header';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { PageBarScale } from '~/components/page-barscale';
import { SEOHead } from '~/components/seo-head';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { AdmissionsPerAgeGroup } from '~/domain/hospital/admissions-per-age-group';
import { Layout } from '~/domain/layout/layout';
import { NationalLayout } from '~/domain/layout/national-layout';
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
  selectNlPageMetricData,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { getBoundaryDateStartUnix } from '~/utils/get-trailing-date-range';
import { useReverseRouter } from '~/utils/use-reverse-router';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectNlPageMetricData('hospital_lcps'),
  createGetChoroplethData({
    vr: ({ hospital_nice }) => ({ hospital_nice }),
    gm: ({ hospital_nice }) => ({ hospital_nice }),
  }),
  createGetContent<{
    articles?: ArticleSummary[];
  }>((_context) => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return createPageArticlesQuery('hospitalPage', locale);
  })
);

const IntakeHospital = (props: StaticProps<typeof getStaticProps>) => {
  const { selectedNlData: data, choropleth, content, lastGenerated } = props;
  const reverseRouter = useReverseRouter();
  const [selectedMap, setSelectedMap] = useState<'municipal' | 'region'>(
    'region'
  );
  const dataHospitalNice = data.hospital_nice;
  const dataHospitalLcps = data.hospital_lcps;
  const lastValueNice = data.hospital_nice.last_value;
  const lastValueLcps = data.hospital_lcps.last_value;

  const underReportedRange = getBoundaryDateStartUnix(
    dataHospitalNice.values,
    4
  );

  const bedsLastValue = getLastFilledValue(data.hospital_lcps);

  const { siteText } = useIntl();
  const text = siteText.ziekenhuisopnames_per_dag;
  const graphDescriptions = siteText.accessibility.grafieken;

  return (
    <Layout {...siteText.nationaal_metadata} lastGenerated={lastGenerated}>
      <NationalLayout data={data} lastGenerated={lastGenerated}>
        <SEOHead
          title={text.metadata.title}
          description={text.metadata.description}
        />
        <TileList>
          <ContentHeader
            category={siteText.nationaal_layout.headings.ziekenhuizen}
            screenReaderCategory={
              siteText.ziekenhuisopnames_per_dag.titel_sidebar
            }
            title={text.titel}
            icon={<Ziekenhuis />}
            subtitle={text.pagina_toelichting}
            metadata={{
              datumsText: text.datums,
              dateOrRange: lastValueNice.date_unix,
              dateOfInsertionUnix: lastValueNice.date_of_insertion_unix,
              dataSources: [text.bronnen.nice, text.bronnen.lnaz],
            }}
            reference={text.reference}
          />

          <ArticleStrip articles={content.articles} />

          <TwoKpiSection>
            <KpiTile
              title={text.barscale_titel}
              description={text.extra_uitleg}
              metadata={{
                date: lastValueNice.date_unix,
                source: text.bronnen.nice,
              }}
            >
              <PageBarScale
                data={data}
                scope="nl"
                metricName="hospital_nice"
                metricProperty="admissions_on_date_of_reporting"
                localeTextKey="ziekenhuisopnames_per_dag"
                differenceKey="hospital_nice__admissions_on_date_of_reporting"
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
                />
              )}
            </KpiTile>
          </TwoKpiSection>

          <ChoroplethTile
            title={text.map_titel}
            description={text.map_toelichting}
            onChartRegionChange={setSelectedMap}
            chartRegion={selectedMap}
            legend={{
              thresholds:
                selectedMap === 'municipal'
                  ? municipalThresholds.hospital_nice
                      .admissions_on_date_of_reporting
                  : regionThresholds.hospital_nice
                      .admissions_on_date_of_reporting,
              title: text.chloropleth_legenda.titel,
            }}
            metadata={{
              date: lastValueNice.date_unix,
              source: text.bronnen.nice,
            }}
          >
            {selectedMap === 'municipal' && (
              <MunicipalityChoropleth
                data={choropleth.gm}
                getLink={reverseRouter.gm.ziekenhuisopnames}
                metricName="hospital_nice"
                metricProperty="admissions_on_date_of_reporting"
                tooltipContent={(
                  context: MunicipalityProperties & MunicipalHospitalNiceValue
                ) => <HospitalAdmissionsMunicipalTooltip context={context} />}
              />
            )}
            {selectedMap === 'region' && (
              <SafetyRegionChoropleth
                data={choropleth.vr}
                getLink={reverseRouter.vr.ziekenhuisopnames}
                metricName="hospital_nice"
                metricProperty="admissions_on_date_of_reporting"
                tooltipContent={(
                  context: SafetyRegionProperties & RegionalHospitalNiceValue
                ) => <HospitalAdmissionsRegionalTooltip context={context} />}
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
                values={dataHospitalNice.values}
                timeframe={timeframe}
                ariaLabelledBy={graphDescriptions.ziekenhuisopnames}
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
                  benchmark: {
                    value: 40,
                    label: siteText.common.signaalwaarde,
                  },
                  timespanAnnotations: [
                    {
                      start: underReportedRange,
                      end: Infinity,
                      label: text.linechart_legend_underreported_titel,
                      shortLabel: siteText.common.incomplete,
                    },
                  ],
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
      </NationalLayout>
    </Layout>
  );
};

export default IntakeHospital;
