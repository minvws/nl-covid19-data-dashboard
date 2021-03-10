import CoronaVirusIcon from '~/assets/coronavirus.svg';
import { AgeDemographic } from '~/components-styled/age-demographic';
import { ArticleStrip } from '~/components-styled/article-strip';
import { ArticleSummary } from '~/components-styled/article-teaser';
import { ChartTile } from '~/components-styled/chart-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { addBackgroundRectangleCallback } from '~/components-styled/line-chart/logic';
import { SEOHead } from '~/components-styled/seo-head';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { DeceasedMonitorSection } from '~/domain/deceased/deceased-monitor-section';
import { FCWithLayout } from '~/domain/layout/layout';
import { getNationalLayout } from '~/domain/layout/national-layout';
import siteText from '~/locale/index';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  getNlData,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { getTrailingDateRange } from '~/utils/get-trailing-date-range';

const text = siteText.sterfte;

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getNlData,
  createGetContent<{
    articles?: ArticleSummary[];
  }>(createPageArticlesQuery('deceasedPage'))
);

const DeceasedNationalPage: FCWithLayout<typeof getStaticProps> = (props) => {
  const dataCbs = props.data.deceased_cbs;
  const dataRivm = props.data.deceased_rivm;
  const dataDeceasedPerAgeGroup = props.data.deceased_rivm_per_age_group;
  const content = props.content;

  const dataRivmUnderReportedRange = getTrailingDateRange(dataRivm.values, 4);

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <TileList>
        <ContentHeader
          category={siteText.nationaal_layout.headings.besmettingen}
          title={text.section_deceased_rivm.title}
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
              difference={props.data.difference.deceased_rivm__covid_daily}
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

        <ChartTile
          title={siteText.deceased_age_groups.title}
          description={siteText.deceased_age_groups.description}
          metadata={{
            date: dataRivm.last_value.date_unix,
            source: siteText.deceased_age_groups.bronnen.rivm,
          }}
        >
          <AgeDemographic
            data={dataDeceasedPerAgeGroup}
            metricProperty="covid_percentage"
            displayMaxPercentage={45}
            text={siteText.deceased_age_groups.graph}
          />
        </ChartTile>

        <ContentHeader
          title={siteText.section_sterftemonitor.title}
          icon={<CoronaVirusIcon />}
          subtitle={siteText.section_sterftemonitor.description}
          reference={siteText.section_sterftemonitor.reference}
          metadata={{
            datumsText: siteText.section_sterftemonitor.datums,
            dateOrRange: {
              start: dataCbs.last_value.date_start_unix,
              end: dataCbs.last_value.date_end_unix,
            },
            dateOfInsertionUnix: dataCbs.last_value.date_of_insertion_unix,
            dataSources: [siteText.section_sterftemonitor.bronnen.cbs],
          }}
        />

        <DeceasedMonitorSection data={dataCbs} showDataMessage />
      </TileList>
    </>
  );
};

DeceasedNationalPage.getLayout = getNationalLayout;

export default DeceasedNationalPage;
