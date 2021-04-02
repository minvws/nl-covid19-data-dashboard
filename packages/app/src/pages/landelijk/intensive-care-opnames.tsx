import { getLastFilledValue } from '@corona-dashboard/common';
import Arts from '~/assets/arts.svg';
import { ArticleStrip } from '~/components-styled/article-strip';
import { ArticleSummary } from '~/components-styled/article-teaser';
import { ChartTileWithTimeframe } from '~/components-styled/chart-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { PageBarScale } from '~/components-styled/page-barscale';
import { TileList } from '~/components-styled/tile-list';
import { TimeSeriesChart } from '~/components-styled/time-series-chart';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
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
  getNlData,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { getBoundaryDateStartUnix } from '~/utils/get-trailing-date-range';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getNlData,
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

  const { data, content, lastGenerated } = props;
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

          <ChartTileWithTimeframe
            title={text.linechart_titel}
            description={text.linechart_description}
            metadata={{ source: text.bronnen.nice }}
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
                    type: 'area',
                    metricProperty: 'admissions_on_date_of_admission',
                    label: text.linechart_legend_trend_label,
                    color: colors.data.primary,
                  },
                ]}
              />
            )}
          </ChartTileWithTimeframe>

          <ChartTileWithTimeframe
            title={text.chart_bedbezetting.title}
            description={text.chart_bedbezetting.description}
            metadata={{ source: text.bronnen.lnaz }}
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
          </ChartTileWithTimeframe>
        </TileList>
      </NationalLayout>
    </Layout>
  );
};

export default IntakeIntensiveCare;
