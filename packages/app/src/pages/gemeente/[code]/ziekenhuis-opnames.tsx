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
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { municipalThresholds } from '~/components/choropleth/municipal-thresholds';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { createSelectMunicipalHandler } from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { createMunicipalHospitalAdmissionsTooltip } from '~/components/choropleth/tooltips/municipal/create-municipal-hospital-admissions-tooltip';
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
  getGmData,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { getTrailingDateRange } from '~/utils/get-trailing-date-range';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { MunicipalityLayout } from '~/domain/layout/municipality-layout';
import { Layout } from '~/domain/layout/layout';

export { getStaticPaths } from '~/static-paths/gm';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getGmData,
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
  const { data, choropleth, municipalityName, content, lastGenerated } = props;
  const router = useRouter();
  const { siteText } = useIntl();

  const text = siteText.gemeente_ziekenhuisopnames_per_dag;
  const graphDescriptions = siteText.accessibility.grafieken;

  const lastValue = data.hospital_nice.last_value;

  const underReportedRange = getTrailingDateRange(data.hospital_nice.values, 4);

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
      <MunicipalityLayout lastGenerated={lastGenerated}>
        <TileList>
          <ContentHeader
            category={siteText.gemeente_layout.headings.ziekenhuizen}
            title={replaceVariablesInText(text.titel, {
              municipality: municipalityName,
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
                data-cy="admissions_on_date_of_reporting"
                absolute={lastValue.admissions_on_date_of_reporting}
                difference={
                  data.difference.hospital_nice__admissions_on_date_of_reporting
                }
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
              thresholds:
                municipalThresholds.hospital_nice
                  .admissions_on_date_of_reporting,
            }}
          >
            <MunicipalityChoropleth
              selectedCode={data.code}
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
            title={text.linechart_titel}
            description={text.linechart_description}
            ariaDescription={graphDescriptions.ziekenhuis_opnames}
            metadata={{ source: text.bronnen.rivm }}
            timeframeOptions={['all', '5weeks', 'week']}
            values={data.hospital_nice.values}
            formatTooltip={(values) => {
              const value = values[0];
              const isInrange = value.__date >= underReportedRange[0];
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
      </MunicipalityLayout>
    </Layout>
  );
};

export default IntakeHospital;
