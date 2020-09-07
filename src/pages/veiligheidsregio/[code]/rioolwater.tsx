import { useRouter } from 'next/router';
import useSWR from 'swr';

import BarScale from 'components/barScale';
import { FCWithLayout } from 'components/layout';
import { getSafetyRegionLayout } from 'components/layout/SafetyRegionLayout';
import { ContentHeader } from 'components/layout/Content';

import RioolwaterMonitoring from 'assets/rioolwater-monitoring.svg';

import siteText from 'locale';

import { Regionaal } from 'types/data';
import RegionalSewerWaterLineChart from 'components/lineChart/regionalSewerWaterLineChart';
import replaceVariablesInText from 'utils/replaceVariablesInText';
import { useMemo } from 'react';
import BarChart from 'components/barChart';
import {
  SewerWaterBarScaleData,
  getSewerWaterBarScaleData,
  getSewerWaterLineChartData,
  getSewerWaterBarChartData,
} from 'utils/sewer-water/safety-region-sewer-water.util';
import safetyRegions from 'data/index';

const text: typeof siteText.veiligheidsregio_rioolwater_metingen =
  siteText.veiligheidsregio_rioolwater_metingen;

export function SewerWaterBarScale(props: {
  data: SewerWaterBarScaleData | null;
}) {
  const { data } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={100}
      screenReaderText={text.screen_reader_graph_content}
      value={Number(data.value)}
      id="rioolwater_metingen"
      rangeKey="average"
      gradient={[
        {
          color: '#3391CC',
          value: 0,
        },
      ]}
    />
  );
}

const SewerWater: FCWithLayout = () => {
  const router = useRouter();
  const { code } = router.query;
  const { data } = useSWR<Regionaal>(`/json/${code}.json`);
  const safetyRegion = safetyRegions.find((region) => region.code === code);

  const { barScaleData, lineChartData, barChartData } = useMemo(() => {
    return {
      barScaleData: getSewerWaterBarScaleData(data),
      lineChartData: getSewerWaterLineChartData(data),
      barChartData: getSewerWaterBarChartData(data),
    };
  }, [data]);

  return (
    <>
      <ContentHeader
        category="Overige indicatoren"
        title={replaceVariablesInText(text.titel, {
          safetyRegion: safetyRegion?.name,
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

          <SewerWaterBarScale data={barScaleData} />
        </div>

        <div className="column-item column-item-extra-margin">
          <p>{text.extra_uitleg}</p>
        </div>
      </article>

      <article className="metric-article">
        <h3>{text.linechart_titel}</h3>

        {lineChartData && (
          <RegionalSewerWaterLineChart
            averageValues={lineChartData.averageValues}
            allValues={lineChartData.allValues}
            text={{
              average_label_text: lineChartData.averageLabelText,
              secondary_label_text: text.graph_secondary_label_text,
            }}
          />
        )}
      </article>

      {barChartData && (
        <article className="metric-article">
          <h3>
            {replaceVariablesInText(text.bar_chart_title, {
              safetyRegion: safetyRegion?.name,
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

export default SewerWater;
