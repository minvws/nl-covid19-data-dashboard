import { useRouter } from 'next/router';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { ArticleStrip } from '~/components-styled/article-strip';
import { ArticleSummary } from '~/components-styled/article-teaser';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { addBackgroundRectangleCallback } from '~/components-styled/line-chart/logic/background-rectangle';
import { Layout } from '~/domain/layout/layout';
import { SafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { municipalThresholds } from '~/components/choropleth/municipal-thresholds';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { createSelectMunicipalHandler } from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { createMunicipalHospitalAdmissionsTooltip } from '~/components/choropleth/tooltips/municipal/create-municipal-hospital-admissions-tooltip';
import regionCodeToMunicipalCodeLookup from '~/data/regionCodeToMunicipalCodeLookup';
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
  getVrData,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { getTrailingDateRange } from '~/utils/get-trailing-date-range';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getVrData,
  createGetChoroplethData({
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
  const { data, safetyRegionName, choropleth, content, lastGenerated } = props;
  const router = useRouter();
  const { siteText } = useIntl();

  const text = siteText.veiligheidsregio_ziekenhuisopnames_per_dag;
  const graphDescriptions = siteText.accessibility.grafieken;
  const lastValue = data.hospital_nice.last_value;

  const municipalCodes = regionCodeToMunicipalCodeLookup[data.code];
  const selectedMunicipalCode = municipalCodes ? municipalCodes[0] : undefined;

  const underReportedRange = getTrailingDateRange(data.hospital_nice.values, 4);

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
      <SafetyRegionLayout lastGenerated={lastGenerated}>
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
                  data.difference.hospital_nice__admissions_on_date_of_reporting
                }
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
              selectedCode={selectedMunicipalCode}
              highlightSelection={false}
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
          </ChoroplethTile>

          <LineChartTile
            metadata={{ source: text.bronnen.rivm }}
            title={text.linechart_titel}
            description={text.linechart_description}
            ariaDescription={graphDescriptions.ziekenhuis_opnames}
            values={data.hospital_nice.values}
            formatTooltip={(values) => {
              const value = values[0];
              const isInrange =
                value.__date >= underReportedRange[0] &&
                value.__date <= underReportedRange[1];
              return (
                <UnderReportedTooltip
                  value={value}
                  isInUnderReportedRange={isInrange}
                  underReportedText={siteText.common.incomplete}
                />
              );
            }}
            linesConfig={[
              {
                metricProperty: 'admissions_on_date_of_admission',
              },
            ]}
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
        </TileList>
      </SafetyRegionLayout>
    </Layout>
  );
};

export default IntakeHospital;
