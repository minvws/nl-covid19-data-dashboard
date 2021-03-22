import { getLastFilledValue } from '@corona-dashboard/common';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { ArticleStrip } from '~/components-styled/article-strip';
import { ArticleSummary } from '~/components-styled/article-teaser';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { addBackgroundRectangleCallback } from '~/components-styled/line-chart/logic/background-rectangle';
import { PageBarScale } from '~/components-styled/page-barscale';
import { SEOHead } from '~/components-styled/seo-head';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { municipalThresholds } from '~/components/choropleth/municipal-thresholds';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectMunicipalHandler } from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { createMunicipalHospitalAdmissionsTooltip } from '~/components/choropleth/tooltips/municipal/create-municipal-hospital-admissions-tooltip';
import { createRegionHospitalAdmissionsTooltip } from '~/components/choropleth/tooltips/region/create-region-hospital-admissions-tooltip';
import { UnderReportedTooltip } from '~/domain/underreported/under-reported-tooltip';
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
  getNlData,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { createDate } from '~/utils/createDate';
import {
  DateRange,
  getTrailingDateRange,
} from '~/utils/get-trailing-date-range';
import { Layout } from '~/domain/layout/layout';
import { NationalLayout } from '~/domain/layout/national-layout';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getNlData,
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
  const { data, choropleth, content, lastGenerated } = props;
  const router = useRouter();
  const [selectedMap, setSelectedMap] = useState<'municipal' | 'region'>(
    'region'
  );
  const dataHospitalNice = data.hospital_nice;
  const dataHospitalLcps = data.hospital_lcps;
  const lastValueNice = data.hospital_nice.last_value;
  const lastValueLcps = data.hospital_lcps.last_value;

  const underReportedRange = getTrailingDateRange(dataHospitalNice.values, 4);

  const bedsLastValue = getLastFilledValue(data.hospital_lcps);

  const lcpsOldDataRange = [
    createDate(dataHospitalLcps.values[0].date_unix),
    new Date('1 June 2020'),
  ] as DateRange;

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
                metricName="hospital_nice"
                metricProperty="admissions_on_date_of_reporting"
                tooltipContent={createMunicipalHospitalAdmissionsTooltip(
                  siteText.choropleth_tooltip.hospital_admissions,
                  municipalThresholds.hospital_nice
                    .admissions_on_date_of_reporting,
                  createSelectMunicipalHandler(router, 'ziekenhuis-opnames')
                )}
                onSelect={createSelectMunicipalHandler(
                  router,
                  'ziekenhuis-opnames'
                )}
              />
            )}
            {selectedMap === 'region' && (
              <SafetyRegionChoropleth
                data={choropleth.vr}
                metricName="hospital_nice"
                metricProperty="admissions_on_date_of_reporting"
                tooltipContent={createRegionHospitalAdmissionsTooltip(
                  siteText.choropleth_tooltip.hospital_admissions,
                  regionThresholds.hospital_nice
                    .admissions_on_date_of_reporting,
                  createSelectRegionHandler(router, 'ziekenhuis-opnames')
                )}
                onSelect={createSelectRegionHandler(
                  router,
                  'ziekenhuis-opnames'
                )}
              />
            )}
          </ChoroplethTile>

          <LineChartTile
            title={text.linechart_titel}
            description={text.linechart_description}
            ariaDescription={graphDescriptions.ziekenhuisopnames}
            values={dataHospitalNice.values}
            signaalwaarde={40}
            formatTooltip={(values) => {
              const value = values[0];
              return (
                <UnderReportedTooltip
                  value={value}
                  isInUnderReportedRange={value.__date >= underReportedRange[0]}
                  underReportedText={siteText.common.incomplete}
                />
              );
            }}
            linesConfig={[
              {
                metricProperty: 'admissions_on_date_of_admission',
              },
            ]}
            metadata={{
              source: text.bronnen.nice,
            }}
            componentCallback={addBackgroundRectangleCallback(
              underReportedRange,
              {
                fill: colors.data.underReported,
              }
            )}
            legendItems={[
              {
                color: colors.data.primary,
                label: text.linechart_legend_titel,
                shape: 'line',
              },
              {
                color: colors.data.underReported,
                label: text.linechart_legend_underreported_titel,
                shape: 'square',
              },
            ]}
            showLegend
          />

          <LineChartTile
            title={text.chart_bedbezetting.title}
            description={text.chart_bedbezetting.description}
            values={dataHospitalLcps.values}
            linesConfig={[
              {
                metricProperty: 'beds_occupied_covid',
              },
            ]}
            metadata={{
              source: text.bronnen.lnaz,
            }}
            componentCallback={addBackgroundRectangleCallback(
              lcpsOldDataRange,
              {
                fill: colors.data.underReported,
              }
            )}
            formatTooltip={(values) => {
              const value = values[0];
              const isInaccurateValue = value.__date < lcpsOldDataRange[1];

              return (
                <UnderReportedTooltip
                  value={value}
                  isInUnderReportedRange={isInaccurateValue}
                  underReportedText={siteText.common.incomplete}
                />
              );
            }}
            legendItems={[
              {
                color: colors.data.primary,
                label: text.chart_bedbezetting.legend_trend_label,
                shape: 'line',
              },
              {
                color: colors.data.underReported,
                label: text.chart_bedbezetting.legend_inaccurate_label,
                shape: 'square',
              },
            ]}
            showLegend
          />
        </TileList>
      </NationalLayout>
    </Layout>
  );
};

export default IntakeHospital;
