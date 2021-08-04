import CoronaVirusIcon from '~/assets/coronavirus.svg';
import { ChartTile } from '~/components/chart-tile';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Text } from '~/components/typography';
import { GmLayout } from '~/domain/layout/gm-layout';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import {
  createPageArticlesQuery,
  PageArticlesQueryResult,
} from '~/queries/create-page-articles-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  selectGmPageMetricData,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

export { getStaticPaths } from '~/static-paths/gm';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectGmPageMetricData('deceased_rivm', 'difference', 'code'),
  createGetContent<PageArticlesQueryResult>(() => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return createPageArticlesQuery('deceasedPage', locale);
  })
);

const DeceasedMunicipalPage = (props: StaticProps<typeof getStaticProps>) => {
  const {
    sideBarData,
    municipalityName,
    selectedGmData: { deceased_rivm: dataRivm, difference, code },
    content,
    lastGenerated,
  } = props;

  const { siteText } = useIntl();
  const text = siteText.gemeente_sterfte;

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
      <GmLayout
        data={sideBarData}
        code={code}
        difference={difference}
        municipalityName={municipalityName}
        lastGenerated={lastGenerated}
      >
        <TileList>
          <PageInformationBlock
            category={siteText.gemeente_layout.headings.besmettingen}
            title={replaceVariablesInText(text.section_deceased_rivm.title, {
              municipalityName,
            })}
            icon={<CoronaVirusIcon />}
            description={text.section_deceased_rivm.description}
            referenceLink={text.section_deceased_rivm.reference.href}
            metadata={{
              datumsText: text.section_deceased_rivm.datums,
              dateOrRange: dataRivm.last_value.date_unix,
              dateOfInsertionUnix: dataRivm.last_value.date_of_insertion_unix,
              dataSources: [text.section_deceased_rivm.bronnen.rivm],
            }}
            articles={content.articles}
          />

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
                accessibility={{
                  key: 'deceased_over_time_chart',
                }}
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
              />
            )}
          </ChartTile>
        </TileList>
      </GmLayout>
    </Layout>
  );
};

export default DeceasedMunicipalPage;
