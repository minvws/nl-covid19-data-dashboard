import { useMemo } from 'react';
import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { BarChart } from '~/components/charts';
import { ContentHeader_weekRangeHack } from '~/components/contentHeader_weekRangeHack';
import { FCWithLayout } from '~/components/layout';
import { getMunicipalityLayout } from '~/components/layout/MunicipalityLayout';
import { MunicipalSewerWaterLineChart } from '~/components/lineChart/municipalSewerWaterLineChart';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import {
  getMunicipalityData,
  getMunicipalityPaths,
  IMunicipalityData,
} from '~/static-props/municipality-data';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import {
  getSewerWaterBarChartData,
  getSewerWaterBarScaleData,
  getSewerWaterLineChartData,
} from '~/utils/sewer-water/municipality-sewer-water.util';
import { ChartTile } from '~/components-styled/chart-tile';

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

  const sewerAverages = data.sewer;

  if (!sewerAverages) {
    /**
     * It is possible that there is no sewer data available for this GM. Then
     * this page should never be linked because the sidebar item is then
     * disabled.
     */
    return null;
  }

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

      <ContentHeader_weekRangeHack
        category={siteText.gemeente_layout.headings.vroege_signalen}
        title={replaceVariablesInText(text.titel, {
          municipality: municipalityName,
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

      <TwoKpiSection>
        {barScaleData?.value !== undefined && (
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
        )}

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
            absolute={sewerAverages.last_value.total_installation_count}
          />
        </KpiTile>
      </TwoKpiSection>

      {lineChartData && (
        <ChartTile
          title={text.linechart_titel}
          metadata={{ source: text.bron }}
        >
          <MunicipalSewerWaterLineChart
            averageValues={lineChartData.averageValues}
            text={{
              average_label_text: lineChartData.averageLabelText,
              secondary_label_text: text.graph_secondary_label_text,
            }}
            valueAnnotation={siteText.waarde_annotaties.riool_normalized}
          />
        </ChartTile>
      )}

      {barChartData && (
        <ChartTile
          title={replaceVariablesInText(text.bar_chart_title, {
            municipality: municipalityName,
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

SewerWater.getLayout = getMunicipalityLayout();

export const getStaticProps = getMunicipalityData();
export const getStaticPaths = getMunicipalityPaths();

export default SewerWater;
