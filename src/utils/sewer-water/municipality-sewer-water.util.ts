import {
  Municipal,
  ResultsPerSewerInstallationPerMunicipalityItem,
  SewerMeasurementsLastValue,
  ResultsPerSewerInstallationPerMunicipalityLastValue,
} from '~/types/data.d';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { XrangePointOptionsObject } from 'highcharts';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

import siteText from '~/locale/index';

const text = siteText.gemeente_rioolwater_metingen;

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
  week_start_unix: number;
  week_end_unix: number;
}

export interface SewerWaterLineChartData {
  averageValues: SewerWaterLineChartValue[];
  averageLabelText: string;
}

export interface SewerWaterBarChartData {
  keys: string[];
  data: XrangePointOptionsObject[];
}

/**
 * Determines if for the given data structure the sewer data can be properly calculated.
 * If so, it also calculates if the sewer data consists of exactly 1 installation.
 * @param data
 */
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

/**
 * Formats data to be used for the bar scale component for sewer water
 * The formatting differs based on the amount of RWZI locations
 * @param data
 */
export function getSewerWaterBarScaleData(
  data: Municipal | undefined
): SewerWaterBarScaleData {
  const { oneInstallation } = getSewerWaterMetadata(data);

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

/**
 * Formats data to be used for the line chart component for sewer water
 * The formatting differs based on the amount of RWZI locations
 * @param data
 */
export function getSewerWaterLineChartData(
  data: Municipal | undefined
): SewerWaterLineChartData {
  const { oneInstallation } = getSewerWaterMetadata(data);

  if (oneInstallation) {
    // One RWZI installation:
    // Average line === the installations data
    // No grey lines
    const averageValues =
      data?.results_per_sewer_installation_per_municipality?.values[0].values ||
      [];
    return {
      averageValues: averageValues.map(
        (value: ResultsPerSewerInstallationPerMunicipalityLastValue) => {
          return {
            ...value,
            value: value.rna_per_ml,
            date: value.date_measurement_unix,
          };
        }
      ),
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

  return {
    averageValues: averageValues.map((value: SewerMeasurementsLastValue) => {
      return {
        ...value,
        value: value.average,
        date: value.week_unix,
      };
    }),
    averageLabelText: text.graph_average_label_text,
  };
}

/**
 * Formats data to be used for the bar chart component for sewer water
 * The formatting differs based on the amount of RWZI locations
 * @param data
 */
export function getSewerWaterBarChartData(
  data: Municipal | undefined
): SewerWaterBarChartData | null {
  const { oneInstallation } = getSewerWaterMetadata(data);

  if (oneInstallation) {
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
          ? `${formatDateFromSeconds(
              data.sewer_measurements.last_value.week_unix,
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
              ? `${formatDateFromSeconds(
                  installation.last_value.date_measurement_unix,
                  'short'
                )}: ${formatNumber(installation.last_value.rna_per_ml)}`
              : false,
          } as XrangePointOptionsObject)
      ),
    ],
  };
}
