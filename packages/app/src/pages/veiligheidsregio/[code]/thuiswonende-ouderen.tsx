import ElderlyIcon from '~/assets/elderly.svg';
import { ChartTile } from '~/components-styled/chart-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { TileList } from '~/components-styled/tile-list';
import { TimeSeriesChart } from '~/components-styled/time-series-chart';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { Layout } from '~/domain/layout/layout';
import { SafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import { getLastGeneratedDate, getVrData } from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { getBoundaryDateStartUnix } from '~/utils/get-trailing-date-range';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getVrData
);

const ElderlyAtHomeRegionalPage = (
  props: StaticProps<typeof getStaticProps>
) => {
  const { safetyRegionName, data, lastGenerated } = props;
  const { elderly_at_home, difference } = data;

  const { siteText } = useIntl();

  const text = siteText.veiligheidsregio_thuiswonende_ouderen;

  const elderlyAtHomeUnderReportedRange = getBoundaryDateStartUnix(
    elderly_at_home.values,
    4
  );

  const elderlyAtHomeDeceasedUnderReportedRange = getBoundaryDateStartUnix(
    elderly_at_home.values,
    7
  );

  const metadata = {
    ...siteText.veiligheidsregio_index.metadata,
    title: replaceVariablesInText(text.metadata.title, {
      safetyRegion: safetyRegionName,
    }),
    description: replaceVariablesInText(text.metadata.description, {
      safetyRegion: safetyRegionName,
    }),
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <SafetyRegionLayout
        data={data}
        safetyRegionName={safetyRegionName}
        lastGenerated={lastGenerated}
      >
        <TileList>
          <ContentHeader
            category={
              siteText.veiligheidsregio_layout.headings.kwetsbare_groepen
            }
            screenReaderCategory={siteText.thuiswonende_ouderen.titel_sidebar}
            title={replaceVariablesInText(text.section_positive_tested.title, {
              safetyRegion: safetyRegionName,
            })}
            icon={<ElderlyIcon />}
            subtitle={replaceVariablesInText(
              text.section_positive_tested.description,
              {
                safetyRegion: safetyRegionName,
              }
            )}
            metadata={{
              datumsText: text.section_positive_tested.datums,
              dateOrRange: elderly_at_home.last_value.date_unix,
              dateOfInsertionUnix:
                elderly_at_home.last_value.date_of_insertion_unix,
              dataSources: [text.section_positive_tested.bronnen.rivm],
            }}
            reference={text.section_positive_tested.reference}
          />

          <TwoKpiSection>
            <KpiTile
              title={text.section_positive_tested.kpi_daily_title}
              metadata={{
                date: elderly_at_home.last_value.date_unix,
                source: text.section_positive_tested.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="positive_tested_daily"
                absolute={elderly_at_home.last_value.positive_tested_daily}
                difference={difference.elderly_at_home__positive_tested_daily}
              />
              <Text>{text.section_positive_tested.kpi_daily_description}</Text>
            </KpiTile>
            <KpiTile
              title={text.section_positive_tested.kpi_daily_per_100k_title}
              metadata={{
                date: elderly_at_home.last_value.date_unix,
                source: text.section_positive_tested.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="positive_tested_daily_per_100k"
                absolute={
                  elderly_at_home.last_value.positive_tested_daily_per_100k
                }
              />
              <Text>
                {text.section_positive_tested.kpi_daily_per_100k_description}
              </Text>
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            timeframeOptions={['all', '5weeks']}
            title={text.section_positive_tested.line_chart_daily_title}
            metadata={{ source: text.section_positive_tested.bronnen.rivm }}
          >
            {(timeframe) => (
              <TimeSeriesChart
                timeframe={timeframe}
                values={elderly_at_home.values}
                seriesConfig={[
                  {
                    type: 'area',
                    metricProperty: 'positive_tested_daily',
                    label:
                      text.section_positive_tested
                        .line_chart_legend_trend_label,
                    color: colors.data.primary,
                  },
                ]}
                dataOptions={{
                  timespanAnnotations: [
                    {
                      start: elderlyAtHomeUnderReportedRange,
                      end: Infinity,
                      label:
                        text.section_deceased
                          .line_chart_legend_inaccurate_label,
                      shortLabel: siteText.common.incomplete,
                    },
                  ],
                }}
              />
            )}
          </ChartTile>

          <ContentHeader
            title={replaceVariablesInText(text.section_deceased.title, {
              safetyRegion: safetyRegionName,
            })}
            icon={<ElderlyIcon />}
            subtitle={replaceVariablesInText(
              text.section_deceased.description,
              {
                safetyRegion: safetyRegionName,
              }
            )}
            metadata={{
              datumsText: text.section_deceased.datums,
              dateOrRange: elderly_at_home.last_value.date_unix,
              dateOfInsertionUnix:
                elderly_at_home.last_value.date_of_insertion_unix,
              dataSources: [text.section_deceased.bronnen.rivm],
            }}
            reference={text.section_deceased.reference}
          />

          <TwoKpiSection>
            <KpiTile
              title={text.section_deceased.kpi_daily_title}
              description={text.section_deceased.kpi_daily_description}
              metadata={{
                date: elderly_at_home.last_value.date_unix,
                source: text.section_deceased.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="deceased_daily"
                absolute={elderly_at_home.last_value.deceased_daily}
              />
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            timeframeOptions={['all', '5weeks']}
            title={text.section_deceased.line_chart_daily_title}
            metadata={{ source: text.section_positive_tested.bronnen.rivm }}
          >
            {(timeframe) => (
              <TimeSeriesChart
                timeframe={timeframe}
                values={elderly_at_home.values}
                seriesConfig={[
                  {
                    type: 'area',
                    metricProperty: 'deceased_daily',
                    label:
                      text.section_positive_tested
                        .line_chart_legend_trend_label,
                    color: colors.data.primary,
                  },
                ]}
                dataOptions={{
                  timespanAnnotations: [
                    {
                      start: elderlyAtHomeDeceasedUnderReportedRange,
                      end: Infinity,
                      label:
                        text.section_deceased
                          .line_chart_legend_inaccurate_label,
                      shortLabel: siteText.common.incomplete,
                    },
                  ],
                }}
              />
            )}
          </ChartTile>
        </TileList>
      </SafetyRegionLayout>
    </Layout>
  );
};

export default ElderlyAtHomeRegionalPage;
