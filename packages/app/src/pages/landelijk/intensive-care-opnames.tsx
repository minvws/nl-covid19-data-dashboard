import { getLastFilledValue } from '@corona-dashboard/common';
import Arts from '~/assets/arts.svg';
import { ArticleStrip } from '~/components/article-strip';
import { ArticleSummary } from '~/components/article-teaser';
import { ChartTile } from '~/components/chart-tile';
import { ContentHeader } from '~/components/content-header';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { PageBarScale } from '~/components/page-barscale';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Text } from '~/components/typography';
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
  createGetContent,
  getLastGeneratedDate,
  selectNlPageMetricData,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { getBoundaryDateStartUnix } from '~/utils/get-trailing-date-range';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectNlPageMetricData('intensive_care_lcps'),
  createGetContent<{
    articles?: ArticleSummary[];
  }>((_context) => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return createPageArticlesQuery('intensiveCarePage', locale);
  })
);

const IntakeIntensiveCare = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText } = useIntl();

  const text = siteText.ic_opnames_per_dag;
  const graphDescriptions = siteText.accessibility.grafieken;

  const { selectedNlData: data, content, lastGenerated } = props;
  const dataIntake = data.intensive_care_nice;

  const bedsLastValue = getLastFilledValue(data.intensive_care_lcps);

  const intakeUnderReportedRange = getBoundaryDateStartUnix(
    dataIntake.values,
    4
  );

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
            category={siteText.nationaal_layout.headings.ziekenhuizen}
            screenReaderCategory={siteText.ic_opnames_per_dag.titel_sidebar}
            title={text.titel}
            icon={<Arts />}
            subtitle={text.pagina_toelichting}
            metadata={{
              datumsText: text.datums,
              dateOrRange: dataIntake.last_value.date_unix,
              dateOfInsertionUnix: dataIntake.last_value.date_of_insertion_unix,
              dataSources: [text.bronnen.nice, text.bronnen.lnaz],
            }}
            reference={text.reference}
          />

          <ArticleStrip articles={content?.articles} />

          <TwoKpiSection>
            <KpiTile
              title={text.barscale_titel}
              metadata={{
                date: dataIntake.last_value.date_unix,
                source: text.bronnen.nice,
              }}
            >
              <PageBarScale
                data={data}
                scope="nl"
                metricName="intensive_care_nice"
                metricProperty="admissions_on_date_of_reporting"
                localeTextKey="ic_opnames_per_dag"
                differenceKey="intensive_care_nice__admissions_on_date_of_reporting"
              />
              <Text>{text.extra_uitleg}</Text>
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
                  <KpiValue
                    data-cy="beds_occupied_covid"
                    absolute={bedsLastValue.beds_occupied_covid}
                    percentage={bedsLastValue.beds_occupied_covid_percentage}
                    difference={
                      data.difference.intensive_care_lcps__beds_occupied_covid
                    }
                  />
                )}
              <Text>{text.kpi_bedbezetting.description}</Text>
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
                values={dataIntake.values}
                timeframe={timeframe}
                ariaLabelledBy={graphDescriptions.intensive_care_opnames}
                dataOptions={{
                  benchmark: {
                    value: 10,
                    label: siteText.common.signaalwaarde,
                  },
                  timespanAnnotations: [
                    {
                      start: intakeUnderReportedRange,
                      end: Infinity,
                      label: text.linechart_legend_inaccurate_label,
                      shortLabel: siteText.common.incomplete,
                    },
                  ],
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
                    type: 'area',
                    metricProperty: 'beds_occupied_covid',
                    label: text.chart_bedbezetting.legend_trend_label,
                    color: colors.data.primary,
                  },
                ]}
              />
            )}
          </ChartTile>
        </TileList>
      </NationalLayout>
    </Layout>
  );
};

export default IntakeIntensiveCare;
