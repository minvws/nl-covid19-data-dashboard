import { FCWithLayout } from '~/components/layout';
import { getMunicipalityLayout } from '~/components/layout/MunicipalityLayout';
import { ContentHeader } from '~/components/layout/Content';

import { SewerWaterBarScale } from '~/components/gemeente/sewer-water-barscale';

import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';

import { RegionalSewerWaterLineChart } from '~/components/lineChart/regionalSewerWaterLineChart';
import { useMemo } from 'react';
import { BarChart } from '~/components/charts';
import {
  getSewerWaterBarScaleData,
  getSewerWaterLineChartData,
  getSewerWaterBarChartData,
} from '~/utils/sewer-water/municipality-sewer-water.util';
import {
  getMunicipalityData,
  getMunicipalityPaths,
  IMunicipalityData,
} from '~/static-props/municipality-data';

import siteText from '~/locale/index';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.gemeente_rioolwater_metingen;

const SewerWater: FCWithLayout<IMunicipalityData> = (props) => {
  const { data, municipalityName } = props;

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
        category={siteText.gemeente_layout.headings.overig}
        title={replaceVariablesInText(text.titel, {
          municipality: municipalityName,
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
        <h3>{text.linechart_titel}</h3>

        {lineChartData && (
          <RegionalSewerWaterLineChart
            averageValues={lineChartData.averageValues}
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
              municipality: municipalityName,
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

export const getStaticProps = getMunicipalityData();
export const getStaticPaths = getMunicipalityPaths();

export default SewerWater;
