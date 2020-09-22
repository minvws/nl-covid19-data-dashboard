import { XrangePointOptionsObject } from 'highcharts';
import {
  Regionaal,
  SewerValue,
  AverageSewerInstallationPerRegionItem,
  SewerValueElement,
} from '~/types/data.d';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { formatDate } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import siteText from '~/locale/index';

const text: typeof siteText.veiligheidsregio_rioolwater_metingen =
  siteText.veiligheidsregio_rioolwater_metingen;

// Specific interfaces to pass data between the formatting functions and the highcharts configs
export interface SewerWaterMetadata {
  dataAvailable: boolean;
  oneInstallation: boolean;
}

export interface SewerWaterBarScaleData {
  value: number | undefined;
  unix: number | undefined;
  dateInsertedUnix: number | undefined;
}

interface SewerWaterLineChartValue {
  date: number;
  value: number;
}

export interface SewerWaterLineChartData {
  averageValues: SewerWaterLineChartValue[];
  averageLabelText: string;
}

export interface SewerWaterBarChartData {
  keys: string[];
  data: XrangePointOptionsObject[];
}

function getSewerWaterMetadata(
  data: Regionaal | undefined
): SewerWaterMetadata {
  const averagesAvailable = !!data?.average_sewer_installation_per_region
    ?.last_value;

  const installationsAmount =
    data?.results_per_sewer_installation_per_region?.values?.length;

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
  data: Regionaal | undefined
): SewerWaterBarScaleData | null {
  const { dataAvailable, oneInstallation } = getSewerWaterMetadata(data);

  if (!dataAvailable) {
    return null;
  }

  if (oneInstallation) {
    const barScaleData =
      data?.results_per_sewer_installation_per_region?.values[0].last_value;

    return {
      value: barScaleData?.rna_per_ml,
      unix: barScaleData?.date_measurement_unix,
      dateInsertedUnix: barScaleData?.date_of_insertion_unix,
    };
  } else {
    const barScaleData =
      data?.average_sewer_installation_per_region?.last_value;

    return {
      value: barScaleData?.average,
      unix: barScaleData?.week_unix,
      dateInsertedUnix: barScaleData?.date_of_insertion_unix,
    };
  }
}

export function getSewerWaterLineChartData(
  data: Regionaal | undefined
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
      data?.results_per_sewer_installation_per_region?.values[0].values || [];
    return {
      averageValues: averageValues
        .map((value: SewerValue) => {
          return {
            ...value,
            value: value.rna_per_ml,
            date: value.date_measurement_unix,
          };
        })
        .sort((a: any, b: any) => b.date - a.date),
      averageLabelText: replaceVariablesInText(
        text.graph_average_label_text_rwzi,
        {
          name:
            data?.results_per_sewer_installation_per_region?.values[0]
              .last_value.rwzi_awzi_name,
        }
      ),
    };
  }

  // More than one RWZI installation:
  // Average line === the averages from `sewer_measurements`
  // Grey lines are the RWZI locations
  const averageValues =
    data?.average_sewer_installation_per_region?.values || [];

  return {
    averageValues: averageValues
      .map((value: AverageSewerInstallationPerRegionItem) => {
        return {
          ...value,
          value: value.average,
          date: value.week_unix,
        };
      })
      .sort((a: any, b: any) => b.date - a.date),
    averageLabelText: text.graph_average_label_text,
  };
}

export function getSewerWaterBarChartData(
  data: Regionaal | undefined
): SewerWaterBarChartData | null {
  const { dataAvailable, oneInstallation } = getSewerWaterMetadata(data);

  if (!dataAvailable || oneInstallation) {
    return null;
  }

  const installations =
    data?.results_per_sewer_installation_per_region?.values?.sort(
      (a: SewerValueElement, b: SewerValueElement) => {
        return b?.last_value?.rna_per_ml - a?.last_value?.rna_per_ml;
      }
    ) || [];

  // Concat keys and data to glue the "average" as first bar and then
  // the RWZI-locations from highest to lowest
  return {
    keys: [
      text.average,
      ...installations.map(
        (i: SewerValueElement) => i?.last_value?.rwzi_awzi_name
      ),
    ],
    data: [
      {
        y: data?.average_sewer_installation_per_region?.last_value.average,
        color: '#3391CC',
        label: data?.average_sewer_installation_per_region?.last_value
          ? `${formatDate(
              data.average_sewer_installation_per_region.last_value.week_unix *
                1000,
              'short'
            )}: ${formatNumber(
              data.average_sewer_installation_per_region.last_value.average
            )}`
          : false,
      } as XrangePointOptionsObject,
      ...installations.map(
        (installation: SewerValueElement): XrangePointOptionsObject =>
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
