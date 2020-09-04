import useSWR from 'swr';

import BarScale from 'components/barScale';
import { FCWithLayout } from 'components/layout';
import { getMunicipalityLayout } from 'components/layout/MunicipalityLayout';
import { ContentHeader } from 'components/layout/Content';

import RioolwaterMonitoring from 'assets/rioolwater-monitoring.svg';

import siteText from 'locale';

import { Municipal } from 'types/data';
import RegionalSewerWaterLineChart from 'components/lineChart/regionalSewerWaterLineChart';
import replaceVariablesInText from 'utils/replaceVariablesInText';
import { useMemo } from 'react';
import BarChart from 'components/barChart';
import {
  SewerWaterBarScaleData,
  getSewerWaterBarScaleData,
  getSewerWaterLineChartData,
  getSewerWaterBarChartData,
} from '../../utils/sewer-water/municipality-sewer-water.util';

const text: typeof siteText.gemeente_rioolwater_metingen =
  siteText.gemeente_rioolwater_metingen;

export function SewerWaterBarScale(props: {
  data: SewerWaterBarScaleData | null;
}) {
  const { data } = props;

  if (data === null) return null;

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
  const { data } = useSWR<Municipal>(`/json/GM0014.json`);

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
          municipality: 'Gemeentenaam',
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
              municipality: 'Gemeentenaam',
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

SewerWater.getLayout = getMunicipalityLayout();

export default SewerWater;
