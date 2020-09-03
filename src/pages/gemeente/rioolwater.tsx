import useSWR from 'swr';

import BarScale from 'components/barScale';
import { FCWithLayout } from 'components/layout';
import { getMunicipalityLayout } from 'components/layout/MunicipalityLayout';
import { ContentHeader } from 'components/layout/Content';

import RioolwaterMonitoring from 'assets/rioolwater-monitoring.svg';

import siteText from 'locale';

import {
  Municipal,
  SewerMeasurementsLastValue,
  ResultsPerSewerInstallationPerMunicipalityLastValue,
  ResultsPerSewerInstallationPerMunicipalityItem,
} from 'types/data';
import RegionalSewerWaterLineChart from 'components/lineChart/regionalSewerWaterLineChart';
import replaceVariablesInText from 'utils/replaceVariablesInText';
import { useMemo } from 'react';
import formatDate from 'utils/formatDate';
import formatNumber from 'utils/formatNumber';
import BarChart from 'components/barChart';
import { XrangePointOptionsObject } from 'highcharts';

const text: typeof siteText.rioolwater_metingen = siteText.rioolwater_metingen;

// Specific interfaces to pass data between the formatting functions and the highcharts configs
interface SewerWaterMetadata {
  dataAvailable: boolean;
  oneInstallation: boolean;
}

interface SewerWaterBarScaleData {
  value: number | undefined;
  unix: number | undefined;
  dateInsertedUnix: number | undefined;
}

interface SewerWaterLineChartData {
  averageValues: any[];
  allValues: any[][];
  averageLabelText: string;
}

interface SewerWaterBarChartData {
  keys: any[];
  data: XrangePointOptionsObject[];
}

function getSewerWaterMetadata(
  data: Municipal | undefined
): SewerWaterMetadata {
  const averagesAvailable = !!data?.sewer_measurements?.last_value;

  const installationsAmount =
    data?.results_per_sewer_installation_per_municipality?.values?.length;

  const oneInstallation = installationsAmount === 1;

  // Data is available in case there is 1 or more installation
  // If there are more than 1, averages also need to be available
  const dataAvailable =
    !!installationsAmount &&
    (installationsAmount > 1 ? averagesAvailable : true);

  return {
    dataAvailable,
    oneInstallation,
  };
}

export function getSewerWaterBarScaleData(
  data: Municipal | undefined
): SewerWaterBarScaleData | null {
  const { dataAvailable, oneInstallation } = getSewerWaterMetadata(data);

  if (!dataAvailable) {
    return null;
  }

  if (oneInstallation) {
    const barScaleData =
      data?.results_per_sewer_installation_per_municipality?.values[0]
        .last_value;

    return {
      value: barScaleData?.rna_per_ml,
      unix: barScaleData?.date_measurement_unix,
      dateInsertedUnix: barScaleData?.date_of_insertion_unix,
    };
  } else {
    const barScaleData = data?.sewer_measurements?.last_value;

    return {
      value: barScaleData?.average,
      unix: barScaleData?.week_unix,
      dateInsertedUnix: barScaleData?.date_of_insertion_unix,
    };
  }
}

function getSewerWaterLineChartData(
  data: Municipal | undefined
): SewerWaterLineChartData | null {
  const { dataAvailable, oneInstallation } = getSewerWaterMetadata(data);

  if (!dataAvailable) {
    return null;
  }

  if (oneInstallation) {
    // One RWZI installation:
    // Average line === the installations data
    // No grey lines
    const averageValues =
      data?.results_per_sewer_installation_per_municipality?.values[0].values ||
      [];
    return {
      averageValues: averageValues
        .map((value: ResultsPerSewerInstallationPerMunicipalityLastValue) => {
          return {
            ...value,
            value: value.rna_per_ml,
            date: value.date_measurement_unix,
          };
        })
        .sort((a: any, b: any) => b.date - a.date),
      allValues: [],
      averageLabelText: replaceVariablesInText(
        text.graph_average_label_text_rwzi,
        {
          name:
            data?.results_per_sewer_installation_per_municipality?.values[0]
              .last_value.rwzi_awzi_name,
        }
      ),
    };
  }

  // More than one RWZI installation:
  // Average line === the averages from `sewer_measurements`
  // Grey lines are the RWZI locations
  const averageValues = data?.sewer_measurements?.values || [];
  const allValues =
    data?.results_per_sewer_installation_per_municipality?.values || [];

  return {
    averageValues: averageValues
      .map((value: SewerMeasurementsLastValue) => {
        return {
          ...value,
          value: value.average,
          date: value.week_unix,
        };
      })
      .sort((a: any, b: any) => b.date - a.date),
    allValues: allValues.map(
      (installation: ResultsPerSewerInstallationPerMunicipalityItem) => {
        return installation?.values
          .map((value: any) => {
            return {
              ...value,
              value: value.rna_per_ml || 0,
              date: value.date_measurement_unix,
            };
          })
          .sort((a: any, b: any) => b.date - a.date);
      }
    ),
    averageLabelText: text.graph_average_label_text,
  };
}

function getSewerWaterBarChartData(
  data: Municipal | undefined
): SewerWaterBarChartData | null {
  const { dataAvailable, oneInstallation } = getSewerWaterMetadata(data);

  if (!dataAvailable || oneInstallation) {
    return null;
  }

  const installations =
    data?.results_per_sewer_installation_per_municipality?.values?.sort(
      (
        a: ResultsPerSewerInstallationPerMunicipalityItem,
        b: ResultsPerSewerInstallationPerMunicipalityItem
      ) => {
        return b?.last_value?.rna_per_ml - a?.last_value?.rna_per_ml;
      }
    ) || [];

  // Concat keys and data to glue the "average" as first bar and then
  // the RWZI-locations from highest to lowest
  return {
    keys: [
      text.average,
      ...installations.map(
        (i: ResultsPerSewerInstallationPerMunicipalityItem) =>
          i?.last_value?.rwzi_awzi_name
      ),
    ],
    data: [
      {
        y: data?.sewer_measurements?.last_value.average,
        color: '#3391CC',
        label: data?.sewer_measurements?.last_value
          ? `${formatDate(
              data.sewer_measurements.last_value.week_unix * 1000,
              'short'
            )}: ${formatNumber(data.sewer_measurements.last_value.average)}`
          : false,
      } as XrangePointOptionsObject,
      ...installations.map(
        (
          installation: ResultsPerSewerInstallationPerMunicipalityItem
        ): XrangePointOptionsObject =>
          ({
            y: installation?.last_value?.rna_per_ml,
            color: '#C1C1C1',
            label: installation?.last_value
              ? `${formatDate(
                  installation.last_value.date_measurement_unix * 1000,
                  'short'
                )}: ${formatNumber(installation.last_value.rna_per_ml)}`
              : false,
          } as XrangePointOptionsObject)
      ),
    ],
  };
}

export function SewerWaterBarScale(props: {
  data: SewerWaterBarScaleData | null;
}) {
  const { data } = props;

  if (data === null) return null;

  return (
    <BarScale
      min={0}
      max={100}
      screenReaderText={text.barscale_screenreader_text}
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
        title={text.titel}
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
          <h3>{text.bar_chart_title}</h3>
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
