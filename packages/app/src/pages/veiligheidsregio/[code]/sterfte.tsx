import CoronaVirusIcon from '~/assets/coronavirus.svg';
import { ArticleStrip } from '~/components-styled/article-strip';
import { ArticleSummary } from '~/components-styled/article-teaser';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { addBackgroundRectangleCallback } from '~/components-styled/line-chart/logic';
import { Layout } from '~/domain/layout/layout';
import { SafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { DeceasedMonitorSection } from '~/domain/deceased/deceased-monitor-section';
import { useIntl } from '~/intl';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
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
  createGetContent<{
    articles?: ArticleSummary[];
  }>((_context) => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return createPageArticlesQuery('deceasedPage', locale);
  })
);

const DeceasedRegionalPage = (props: StaticProps<typeof getStaticProps>) => {
  const {
    safetyRegionName: safetyRegion,
    data: { deceased_cbs: dataCbs, deceased_rivm: dataRivm, difference },
    content,
    lastGenerated,
  } = props;

  const { siteText } = useIntl();
  const text = siteText.veiligheidsregio_sterfte;

  const dataRivmUnderReportedRange = getTrailingDateRange(dataRivm.values, 4);

  const metadata = {
    ...siteText.veiligheidsregio_index.metadata,
    title: replaceVariablesInText(text.metadata.title, { safetyRegion }),
    description: replaceVariablesInText(text.metadata.description, {
      safetyRegion,
    }),
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <SafetyRegionLayout lastGenerated={lastGenerated}>
        <TileList>
          <ContentHeader
            category={siteText.veiligheidsregio_layout.headings.besmettingen}
            title={replaceVariablesInText(text.section_deceased_rivm.title, {
              safetyRegion,
            })}
            icon={<CoronaVirusIcon />}
            subtitle={text.section_deceased_rivm.description}
            reference={text.section_deceased_rivm.reference}
            metadata={{
              datumsText: text.section_deceased_rivm.datums,
              dateOrRange: dataRivm.last_value.date_unix,
              dateOfInsertionUnix: dataRivm.last_value.date_of_insertion_unix,
              dataSources: [text.section_deceased_rivm.bronnen.rivm],
            }}
          />

          <ArticleStrip articles={content.articles} />

          <TwoKpiSection>
            <KpiTile
              title={text.section_deceased_rivm.kpi_covid_daily_title}
              metadata={{
                date: dataRivm.last_value.date_unix,
                source: text.section_deceased_rivm.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="covid_daily"
                absolute={dataRivm.last_value.covid_daily}
                difference={difference.deceased_rivm__covid_daily}
              />
              <Text>
                {text.section_deceased_rivm.kpi_covid_daily_description}
              </Text>
            </KpiTile>
            <KpiTile
              title={text.section_deceased_rivm.kpi_covid_total_title}
              metadata={{
                date: dataRivm.last_value.date_unix,
                source: text.section_deceased_rivm.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="covid_total"
                absolute={dataRivm.last_value.covid_total}
              />
              <Text>
                {text.section_deceased_rivm.kpi_covid_total_description}
              </Text>
            </KpiTile>
          </TwoKpiSection>

          <LineChartTile
            timeframeOptions={['all', '5weeks']}
            title={text.section_deceased_rivm.line_chart_covid_daily_title}
            description={
              text.section_deceased_rivm.line_chart_covid_daily_description
            }
            values={dataRivm.values}
            linesConfig={[
              {
                metricProperty: 'covid_daily',
              },
            ]}
            metadata={{ source: text.section_deceased_rivm.bronnen.rivm }}
            componentCallback={addBackgroundRectangleCallback(
              dataRivmUnderReportedRange,
              {
                fill: colors.data.underReported,
              }
            )}
            legendItems={[
              {
                color: colors.data.primary,
                label:
                  text.section_deceased_rivm
                    .line_chart_covid_daily_legend_trend_label,
                shape: 'line',
              },
              {
                color: colors.data.underReported,
                label:
                  text.section_deceased_rivm
                    .line_chart_covid_daily_legend_inaccurate_label,
                shape: 'square',
              },
            ]}
            showLegend
          />

          <ContentHeader
            title={siteText.section_sterftemonitor_vr.title}
            icon={<CoronaVirusIcon />}
            subtitle={siteText.section_sterftemonitor_vr.description}
            reference={siteText.section_sterftemonitor_vr.reference}
            metadata={{
              datumsText: siteText.section_sterftemonitor_vr.datums,
              dateOrRange: {
                start: dataCbs.last_value.date_start_unix,
                end: dataCbs.last_value.date_end_unix,
              },
              dateOfInsertionUnix: dataCbs.last_value.date_of_insertion_unix,
              dataSources: [siteText.section_sterftemonitor_vr.bronnen.cbs],
            }}
          />

          <DeceasedMonitorSection data={dataCbs} />
        </TileList>
      </SafetyRegionLayout>
    </Layout>
  );
};

export default DeceasedRegionalPage;
