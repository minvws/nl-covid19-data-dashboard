import { useMemo, useState } from 'react';
import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import { BarChart } from '~/components-styled/bar-chart/bar-chart';
import { Box } from '~/components-styled/base';
import {
  ChartTile,
  ChartTileWithTimeframe,
} from '~/components-styled/chart-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { Select } from '~/components-styled/select';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { FCWithLayout } from '~/domain/layout/layout';
import { getSafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import { SewerWaterChart } from '~/components/lineChart/sewer-water-chart';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import {
  getSafetyRegionPaths,
  getSafetyRegionStaticProps,
  ISafetyRegionData,
} from '~/static-props/safetyregion-data';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import {
  getInstallationNames,
  getSewerWaterBarChartData,
  getSewerWaterLineChartData,
  getSewerWaterScatterPlotData,
} from '~/utils/sewer-water/safety-region-sewer-water.util';

const text = siteText.veiligheidsregio_rioolwater_metingen;

const SewerWater: FCWithLayout<ISafetyRegionData> = (props) => {
  const { data, safetyRegionName } = props;

  const {
    lineChartData,
    barChartData,
    scatterPlotData,
    sewerStationNames,
  } = useMemo(() => {
    return {
      lineChartData: getSewerWaterLineChartData(data),
      barChartData: getSewerWaterBarChartData(data),
      scatterPlotData: getSewerWaterScatterPlotData(data),
      sewerStationNames: getInstallationNames(data),
    };
  }, [data]);

  const sewerAverages = data.sewer;

  const [selectedInstallation, setSelectedInstallation] = useState<
    string | undefined
  >();

  return (
    <>
      <SEOHead
        title={replaceVariablesInText(text.metadata.title, {
          safetyRegionName,
        })}
        description={replaceVariablesInText(text.metadata.description, {
          safetyRegionName,
        })}
      />
      <TileList>
        <ContentHeader
          category={siteText.veiligheidsregio_layout.headings.vroege_signalen}
          title={replaceVariablesInText(text.titel, {
            safetyRegion: safetyRegionName,
          })}
          icon={<RioolwaterMonitoring />}
          subtitle={text.pagina_toelichting}
          metadata={{
            datumsText: text.datums,
            dateOrRange: {
              start: sewerAverages.last_value.date_start_unix,
              end: sewerAverages.last_value.date_end_unix,
            },
            dateOfInsertionUnix:
              sewerAverages.last_value.date_of_insertion_unix,
            dataSources: [text.bronnen.rivm],
          }}
          reference={text.reference}
        />

        <TwoKpiSection>
          <KpiTile
            title={text.barscale_titel}
            description={text.extra_uitleg}
            metadata={{
              date: [
                sewerAverages.last_value.date_start_unix,
                sewerAverages.last_value.date_end_unix,
              ],
              source: text.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="riool_normalized"
              absolute={data.sewer.last_value.average}
              valueAnnotation={siteText.waarde_annotaties.riool_normalized}
              difference={data.difference.sewer__average}
            />
          </KpiTile>
          <KpiTile
            title={text.total_installation_count_titel}
            description={
              text.total_installation_count_description +
              `<p style="color:#595959">${text.rwzi_abbrev}</p>`
            }
            metadata={{
              date: [
                sewerAverages.last_value.date_start_unix,
                sewerAverages.last_value.date_end_unix,
              ],
              source: text.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="total_installation_count"
              absolute={data.sewer.last_value.total_installation_count}
            />
          </KpiTile>
        </TwoKpiSection>

        {lineChartData && (
          <ChartTileWithTimeframe
            title={text.linechart_titel}
            metadata={{ source: text.bronnen.rivm }}
            timeframeOptions={['all', '5weeks']}
            timeframeInitialValue="all"
          >
            {(timeframe) => (
              <>
                {sewerStationNames.length > 0 && (
                  <Box display="flex" justifyContent="flex-end">
                    <Select
                      options={sewerStationNames.map((x) => ({
                        label: x,
                        value: x,
                      }))}
                      value={selectedInstallation}
                      placeholder={text.graph_selected_rwzi_placeholder}
                      onChange={setSelectedInstallation}
                      onClear={() => setSelectedInstallation(undefined)}
                    />
                  </Box>
                )}
                <SewerWaterChart
                  timeframe={timeframe}
                  scatterPlotValues={scatterPlotData}
                  averageValues={lineChartData.averageValues}
                  selectedInstallation={selectedInstallation}
                  text={{
                    average_label_text: lineChartData.averageLabelText,
                    secondary_label_text: text.graph_secondary_label_text,
                    daily_label_text: text.graph_daily_label_text_rwzi,
                    range_description: text.graph_range_description,
                  }}
                  valueAnnotation={siteText.waarde_annotaties.riool_normalized}
                />
              </>
            )}
          </ChartTileWithTimeframe>
        )}

        {barChartData && (
          <ChartTile
            title={replaceVariablesInText(text.bar_chart_title, {
              safetyRegion: safetyRegionName,
            })}
            metadata={{
              date: [
                sewerAverages.last_value.date_start_unix,
                sewerAverages.last_value.date_end_unix,
              ],
              source: text.bronnen.rivm,
            }}
          >
            <BarChart
              values={barChartData.values}
              xAxisTitle={text.bar_chart_axis_title}
              accessibilityDescription={
                text.bar_chart_accessibility_description
              }
            />
          </ChartTile>
        )}
      </TileList>
    </>
  );
};

SewerWater.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionStaticProps;
export const getStaticPaths = getSafetyRegionPaths();

export default SewerWater;
