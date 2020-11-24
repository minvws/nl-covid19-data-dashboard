import { useMemo, useState } from 'react';
import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import { Box } from '~/components-styled/base';
import {
  ChartTile,
  ChartTileWithTimeframe,
} from '~/components-styled/chart-tile';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { Select } from '~/components-styled/select';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { BarChart } from '~/components/charts';
import { ContentHeader_weekRangeHack } from '~/components/contentHeader_weekRangeHack';
import { FCWithLayout } from '~/components/layout';
import { getSafetyRegionLayout } from '~/components/layout/SafetyRegionLayout';
import { SewerWaterChart } from '~/components/lineChart/sewer-water-chart';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import {
  getSafetyRegionData,
  getSafetyRegionPaths,
  ISafetyRegionData,
} from '~/static-props/safetyregion-data';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import {
  getInstallationNames,
  getSewerWaterBarChartData,
  getSewerWaterBarScaleData,
  getSewerWaterLineChartData,
  getSewerWaterScatterPlotData,
} from '~/utils/sewer-water/safety-region-sewer-water.util';

const text = siteText.veiligheidsregio_rioolwater_metingen;

const SewerWater: FCWithLayout<ISafetyRegionData> = (props) => {
  const { data, safetyRegionName } = props;

  const {
    barScaleData,
    lineChartData,
    barChartData,
    scatterPlotData,
    sewerStationNames,
  } = useMemo(() => {
    return {
      barScaleData: getSewerWaterBarScaleData(data),
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
      <ContentHeader_weekRangeHack
        category={siteText.veiligheidsregio_layout.headings.vroege_signalen}
        title={replaceVariablesInText(text.titel, {
          safetyRegion: safetyRegionName,
        })}
        icon={<RioolwaterMonitoring />}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          weekStartUnix: sewerAverages.last_value.week_start_unix,
          weekEndUnix: sewerAverages.last_value.week_end_unix,
          dateOfInsertionUnix: sewerAverages.last_value.date_of_insertion_unix,
          dataSource: text.bron,
        }}
        reference={text.reference}
      />

      {barScaleData && barScaleData.value !== undefined && (
        <TwoKpiSection>
          <KpiTile
            title={text.barscale_titel}
            description={text.extra_uitleg}
            metadata={{
              date: [
                sewerAverages.last_value.week_start_unix,
                sewerAverages.last_value.week_end_unix,
              ],
              source: text.bron,
            }}
          >
            <KpiValue
              absolute={barScaleData.value}
              valueAnnotation={siteText.waarde_annotaties.riool_normalized}
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
                sewerAverages.last_value.week_start_unix,
                sewerAverages.last_value.week_end_unix,
              ],
              source: text.bron,
            }}
          >
            <KpiValue
              absolute={data.sewer.last_value.total_installation_count}
            />
          </KpiTile>
        </TwoKpiSection>
      )}

      {lineChartData && (
        <ChartTileWithTimeframe
          title={text.linechart_titel}
          metadata={{ source: text.bron }}
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
              sewerAverages.last_value.week_start_unix,
              sewerAverages.last_value.week_end_unix,
            ],
            source: text.bron,
          }}
        >
          <BarChart
            keys={barChartData.keys}
            data={barChartData.data}
            axisTitle={text.bar_chart_axis_title}
            valueAnnotation={siteText.waarde_annotaties.riool_normalized}
          />
        </ChartTile>
      )}
    </>
  );
};

SewerWater.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionData();
export const getStaticPaths = getSafetyRegionPaths();

export default SewerWater;
