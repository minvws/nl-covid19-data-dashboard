import { XrangePointOptionsObject } from 'highcharts';
import siteText from '~/locale/index';
import { Regionaal, RegionalSewerPerInstallationValue } from '~/types/data.d';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.veiligheidsregio_rioolwater_metingen;

/**
 * @TODO these helpers for VR and GM should be merged into one using generics.
 * All of this code seems duplicate now that the type names are unified.
 */

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

function getSewerWaterMetadata(data: Regionaal): SewerWaterMetadata {
  const installationCount = data.sewer_per_installation.values.length;

  const oneInstallation = installationCount === 1;

  // Data is available in case there is 1 or more installation
  const dataAvailable = installationCount > 0;

  return {
    dataAvailable,
    oneInstallation,
  };
}

export function getSewerWaterBarScaleData(
  data: Regionaal
): SewerWaterBarScaleData | undefined {
  const { dataAvailable, oneInstallation } = getSewerWaterMetadata(data);

  if (!dataAvailable) {
    return;
  }

  if (oneInstallation) {
    const barScaleData = data.sewer_per_installation.values[0].last_value;

    return {
      value: barScaleData.rna_normalized,
      unix: barScaleData.date_measurement_unix,
      dateInsertedUnix: barScaleData.date_of_insertion_unix,
    };
  } else {
    const barScaleData = data.sewer.values[0];

    return {
      value: barScaleData.average,
      unix: barScaleData.week_unix,
      dateInsertedUnix: barScaleData.date_of_insertion_unix,
    };
  }
}

export function getInstallationNames(data: Regionaal): string[] {
  const { dataAvailable, oneInstallation } = getSewerWaterMetadata(data);

  if (!data || !dataAvailable || oneInstallation) {
    return [];
  }

  return data.sewer_per_installation.values
    .flatMap((value) => value.values)
    .map((value) => value.rwzi_awzi_name)
    .filter((value, index, arr) => arr.indexOf(value) === index);
}

export function getSewerWaterScatterPlotData(
  data: Regionaal
): RegionalSewerPerInstallationValue[] | undefined {
  const { dataAvailable, oneInstallation } = getSewerWaterMetadata(data);

  if (!data || !dataAvailable || oneInstallation) {
    return;
  }

  return data.sewer_per_installation.values.flatMap((value) => value.values);
}

export function getSewerWaterLineChartData(
  data: Regionaal
): SewerWaterLineChartData | undefined {
  const { dataAvailable, oneInstallation } = getSewerWaterMetadata(data);

  if (!dataAvailable) {
    return;
  }

  if (oneInstallation) {
    // One RWZI installation:
    // Average line === the installations data
    // No grey lines
    const averageValues = data.sewer_per_installation.values[0].values;

    return {
      averageValues: averageValues.map((value) => {
        return {
          ...value,
          value: value.rna_normalized,
          date: value.date_measurement_unix,
        };
      }),
      averageLabelText: replaceVariablesInText(
        text.graph_average_label_text_rwzi,
        {
          name: data.sewer_per_installation.values[0].last_value.rwzi_awzi_name,
        }
      ),
    };
  }

  // More than one RWZI installation:
  // Average line === the averages from `sewer_measurements`
  // Grey lines are the RWZI locations
  const averageValues = data.sewer.values;

  return {
    averageValues: averageValues.map((value) => {
      return {
        ...value,
        value: value.average,
        date: value.week_unix,
      };
    }),
    averageLabelText: text.graph_average_label_text,
  };
}

export function getSewerWaterBarChartData(
  data: Regionaal
): SewerWaterBarChartData | undefined {
  const { dataAvailable, oneInstallation } = getSewerWaterMetadata(data);

  if (!dataAvailable || oneInstallation) {
    return;
  }

  const sortedInstallations = data.sewer_per_installation.values.sort(
    (a, b) => {
      return b.last_value.rna_normalized - a.last_value.rna_normalized;
    }
  );

  // Concat keys and data to glue the "average" as first bar and then
  // the RWZI-locations from highest to lowest
  return {
    keys: [
      text.average,
      ...sortedInstallations.map((i) => i.last_value.rwzi_awzi_name),
    ],
    data: [
      {
        y: data.sewer.last_value.average,
        color: '#3391CC',
        label: data.sewer.last_value
          ? `${formatDateFromSeconds(
              data.sewer.last_value.week_unix,
              'short'
            )}: ${formatNumber(data.sewer.last_value.average)}`
          : false,
      } as XrangePointOptionsObject,
      ...sortedInstallations.map(
        (installation) =>
          ({
            y: installation.last_value.rna_normalized,
            color: '#C1C1C1',
            label: installation.last_value
              ? `${formatDateFromSeconds(
                  installation.last_value.date_measurement_unix,
                  'short'
                )}: ${formatNumber(installation.last_value.rna_normalized)}`
              : false,
          } as XrangePointOptionsObject)
      ),
    ],
  };
}
