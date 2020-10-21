import { useMemo } from 'react';
import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import { BarChart } from '~/components/charts';
import { FCWithLayout } from '~/components/layout';
import { ContentHeader } from '~/components/layout/Content';
import { getMunicipalityLayout } from '~/components/layout/MunicipalityLayout';
import { MunicipalSewerWaterLineChart } from '~/components/lineChart/municipalSewerWaterLineChart';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import {
  getMunicipalityData,
  getMunicipalityPaths,
  IMunicipalityData,
} from '~/static-props/municipality-data';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import {
  getSewerWaterBarChartData,
  getSewerWaterBarScaleData,
  getSewerWaterLineChartData,
} from '~/utils/sewer-water/municipality-sewer-water.util';

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
      <SEOHead
        title={replaceVariablesInText(text.metadata.title, {
          municipalityName,
        })}
        description={replaceVariablesInText(text.metadata.description, {
          municipalityName,
        })}
      />
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
          <p className="text-blue kpi" data-cy="infected_daily_total">
            {formatNumber(barScaleData?.value)}
          </p>
        </div>

        <div className="column-item column-item-extra-margin">
          <p>{text.extra_uitleg}</p>
        </div>
      </article>

      <article className="metric-article">
        <h3>{text.linechart_titel}</h3>

        {lineChartData && (
          <MunicipalSewerWaterLineChart
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
