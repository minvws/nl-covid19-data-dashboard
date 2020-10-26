import { useMemo, useState } from 'react';
import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import { ChartTimeControls } from '~/components-styled/chart-time-controls';
import { BarChart } from '~/components/charts';
import { ContentHeader_weekRangeHack } from '~/components/contentHeader_weekRangeHack';
import { FCWithLayout } from '~/components/layout';
import { getSafetyRegionLayout } from '~/components/layout/SafetyRegionLayout';
import { InstallationSelector } from '~/components/lineChart/installationSelector';
import styles from '~/components/lineChart/installationselector.module.scss';
import { RegionalSewerWaterChart } from '~/components/lineChart/regionalSewerWaterChart';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import {
  getSafetyRegionData,
  getSafetyRegionPaths,
  ISafetyRegionData,
} from '~/static-props/safetyregion-data';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import {
  getInstallationNames,
  getSewerWaterBarChartData,
  getSewerWaterBarScaleData,
  getSewerWaterLineChartData,
  getSewerWaterScatterPlotData,
} from '~/utils/sewer-water/safety-region-sewer-water.util';
import { TimeframeOption } from '~/utils/timeframe';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';

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

  const sewerAverages = data.average_sewer_installation_per_region;

  const [timeframe, setTimeframe] = useState<TimeframeOption>('all');
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
        category={siteText.veiligheidsregio_layout.headings.overig}
        title={replaceVariablesInText(text.titel, {
          safetyRegion: safetyRegionName,
        })}
        Icon={RioolwaterMonitoring}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          weekStartUnix: sewerAverages.last_value.week_start_unix,
          weekEndUnix: sewerAverages.last_value.week_end_unix,
          dateOfInsertionUnix: sewerAverages.last_value.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      {barScaleData && barScaleData.value !== undefined && (
        <TwoKpiSection>
          <KpiTile title={text.barscale_titel} description={text.extra_uitleg}>
            <KpiValue
              absolute={barScaleData.value}
              data-cy="infected_daily_total"
            />
          </KpiTile>
          <KpiTile
            title={text.total_installation_count_titel}
            description={text.total_installation_count_description}
          >
            <KpiValue
              absolute={
                data.average_sewer_installation_per_region.last_value
                  .total_installation_count
              }
            />
          </KpiTile>
        </TwoKpiSection>
      )}

      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{text.barscale_titel}</h3>
          <p className="text-blue kpi" data-cy="infected_daily_total">
            {formatNumber(barScaleData?.value)}
          </p>
        </div>

        <div className="column-item column-item-extra-margin">
          <p>{text.extra_uitleg}</p>
        </div>
      </article>

      <article className="metric-article">
        <div className="metric-article-header">
          <h3>{text.linechart_titel}</h3>
          <ChartTimeControls
            timeframe={timeframe}
            onChange={(value) => setTimeframe(value)}
          />
        </div>

        {scatterPlotData && lineChartData && (
          <>
            {sewerStationNames.length > 0 && (
              <div className={styles.selectorContainer}>
                <InstallationSelector
                  placeholderText={text.graph_selected_rwzi_placeholder}
                  onChange={setSelectedInstallation}
                  stationNames={sewerStationNames}
                />
              </div>
            )}
            <RegionalSewerWaterChart
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
            />
          </>
        )}
      </article>

      {barChartData && (
        <article className="metric-article">
          <h3>
            {replaceVariablesInText(text.bar_chart_title, {
              safetyRegion: safetyRegionName,
            })}
          </h3>
          <BarChart
            keys={barChartData.keys}
            data={barChartData.data}
            axisTitle={text.bar_chart_axis_title}
          />
        </article>
      )}
    </>
  );
};

SewerWater.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionData();
export const getStaticPaths = getSafetyRegionPaths();

export default SewerWater;
