import { FCWithLayout } from '~/components/layout';
import { getSafetyRegionLayout } from '~/components/layout/SafetyRegionLayout';
import { ContentHeader } from '~/components/layout/Content';

import { SewerWaterBarScale } from '~/components/veiligheidsregio/sewer-water-barscale';

import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';

import siteText from '~/locale/index';

import { useMemo, useState } from 'react';
import { BarChart } from '~/components/charts';
import {
  getSewerWaterBarScaleData,
  getSewerWaterLineChartData,
  getSewerWaterBarChartData,
  getSewerWaterScatterPlotData,
  getSewerWaterStationNames,
} from '~/utils/sewer-water/safety-region-sewer-water.util';
import {
  getSafetyRegionData,
  getSafetyRegionPaths,
  ISafetyRegionData,
} from '~/static-props/safetyregion-data';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { SEOHead } from '~/components/seoHead';
import { RegionalSewerWaterChart } from '~/components/lineChart/regionalSewerWaterChart';
import {
  ChartTimeControls,
  TimeframeOption,
} from '~/components/chartTimeControls';
import { RWZISelector } from '~/components/lineChart/rwziSelector';
import styles from '~/components/lineChart/rwziselector.module.scss';

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
      sewerStationNames: getSewerWaterStationNames(data),
    };
  }, [data]);

  const [timeframe, setTimeframe] = useState<TimeframeOption>('all');
  const [selectedRWZI, setSelectedRWZI] = useState<string | undefined>();

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
      <ContentHeader
        category={siteText.veiligheidsregio_layout.headings.overig}
        title={replaceVariablesInText(text.titel, {
          safetyRegion: safetyRegionName,
        })}
        Icon={RioolwaterMonitoring}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: barScaleData?.unix,
          dateInsertedUnix: barScaleData?.dateInsertedUnix,
          dataSource: text.bron,
        }}
      />

      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{text.barscale_titel}</h3>

          <SewerWaterBarScale data={barScaleData} showAxis={true} />
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
                <RWZISelector
                  placeholderText={text.graph_selected_rwzi_placeholder}
                  onChange={setSelectedRWZI}
                  stationNames={sewerStationNames}
                />
              </div>
            )}
            <RegionalSewerWaterChart
              timeframe={timeframe}
              scatterPlotValues={scatterPlotData}
              averageValues={lineChartData.averageValues}
              selectedRWZI={selectedRWZI}
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
