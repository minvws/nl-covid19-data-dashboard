import CoronaVirusIcon from '~/assets/coronavirus.svg';
import { AgeDemographic } from '~/components/age-demographic';
import { ArticleStrip } from '~/components/article-strip';
import { ArticleSummary } from '~/components/article-teaser';
import { ChartTile } from '~/components/chart-tile';
import { ContentHeader } from '~/components/content-header';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Text } from '~/components/typography';
import { DeceasedMonitorSection } from '~/domain/deceased/deceased-monitor-section';
import { Layout } from '~/domain/layout/layout';
import { NationalLayout } from '~/domain/layout/national-layout';
import { useIntl } from '~/intl';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  selectNlPageMetricData,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { getBoundaryDateStartUnix } from '~/utils/get-trailing-date-range';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectNlPageMetricData('deceased_cbs', 'deceased_rivm_per_age_group'),
  createGetContent<{
    articles?: ArticleSummary[];
  }>((_context) => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return createPageArticlesQuery('deceasedPage', locale);
  })
);

const DeceasedNationalPage = (props: StaticProps<typeof getStaticProps>) => {
  const { selectedNlData: data, lastGenerated } = props;

  const dataCbs = data.deceased_cbs;
  const dataRivm = data.deceased_rivm;
  const dataDeceasedPerAgeGroup = data.deceased_rivm_per_age_group;
  const content = props.content;

  const dataRivmUnderReportedDateStart = getBoundaryDateStartUnix(
    dataRivm.values,
    4
  );

  const { siteText } = useIntl();

  const text = siteText.sterfte;

  const metadata = {
    ...siteText.nationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NationalLayout data={data} lastGenerated={lastGenerated}>
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
                difference={data.difference.deceased_rivm__covid_daily}
                isMovingAverageDifference
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

          <ChartTile
            timeframeOptions={['all', '5weeks']}
            title={text.section_deceased_rivm.line_chart_covid_daily_title}
            description={
              text.section_deceased_rivm.line_chart_covid_daily_description
            }
            metadata={{ source: text.section_deceased_rivm.bronnen.rivm }}
          >
            {(timeframe) => (
              <TimeSeriesChart
                values={dataRivm.values}
                timeframe={timeframe}
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty: 'covid_daily_moving_average',
                    label:
                      text.section_deceased_rivm
                        .line_chart_covid_daily_legend_trend_label_moving_average,
                    shortLabel:
                      text.section_deceased_rivm
                        .line_chart_covid_daily_legend_trend_short_label_moving_average,
                    color: colors.data.primary,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'covid_daily',
                    label:
                      text.section_deceased_rivm
                        .line_chart_covid_daily_legend_trend_label,
                    shortLabel:
                      text.section_deceased_rivm
                        .line_chart_covid_daily_legend_trend_short_label,
                    color: colors.data.primary,
                  },
                ]}
                dataOptions={{
                  timespanAnnotations: [
                    {
                      start: dataRivmUnderReportedDateStart,
                      end: Infinity,
                      label:
                        text.section_deceased_rivm
                          .line_chart_covid_daily_legend_inaccurate_label,
                      shortLabel: siteText.common.incomplete,
                      cutValuesForMetricProperties: [
                        'covid_daily_moving_average',
                      ],
                    },
                  ],
                }}
              />
            )}
          </ChartTile>

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
      </NationalLayout>
    </Layout>
  );
};

export default DeceasedNationalPage;
