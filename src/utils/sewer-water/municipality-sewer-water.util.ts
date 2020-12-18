import { Municipal } from '~/types/data.d';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

import siteText from '~/locale/index';
import { assert } from '../assert';
import { colors } from '~/style/theme';

/**
 * @TODO these helpers for VR and GM should be merged into one using generics.
 * All of this code seems duplicate now that the type names are unified.
 */

const text = siteText.gemeente_rioolwater_metingen;

// Specific interfaces to pass data between the formatting functions and the highcharts configs
interface SewerWaterMetadata {
  dataAvailable: boolean;
  oneInstallation: boolean;
}

interface SewerWaterBarScaleData {
  value: number | undefined;
  unix: number | undefined;
  dateInsertedUnix: number | undefined;
  week_start_unix: number | undefined;
  week_end_unix: number | undefined;
}

interface SewerWaterLineChartValue {
  date: number;
  value: number;
  week_start_unix: number;
  week_end_unix: number;
}

interface SewerWaterLineChartData {
  averageValues: SewerWaterLineChartValue[];
  averageLabelText: string;
}

interface SewerWaterBarChartData {
  keys: string[];
  data: Highcharts.XrangePointOptionsObject[];
}

/**
 * Determines if for the given data structure the sewer data can be properly calculated.
 * If so, it also calculates if the sewer data consists of exactly 1 installation.
 * @param data
 */
function getSewerWaterMetadata(data: Municipal): SewerWaterMetadata {
  const averagesAvailable = !!data.sewer;

  const installationCount = data.sewer_per_installation?.values.length;
  const oneInstallation = installationCount === 1;

  // Data is available in case there is 1 or more installation
  // If there are more than 1, averages also need to be available
  const dataAvailable =
    !!installationCount && (installationCount > 1 ? averagesAvailable : true);

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
  data: Municipal
): SewerWaterBarScaleData | undefined {
  const { dataAvailable, oneInstallation } = getSewerWaterMetadata(data);

  if (!dataAvailable) {
    return;
  }

  if (oneInstallation) {
    assert(data.sewer_per_installation, 'Missing sewer per installation data');
    const barScaleData = data.sewer_per_installation.values[0].last_value;

    return {
      value: barScaleData.rna_normalized,
      unix: barScaleData.date_measurement_unix,
      dateInsertedUnix: barScaleData.date_of_insertion_unix,
      week_end_unix: barScaleData.week_end_unix,
      week_start_unix: barScaleData.week_start_unix,
    };
  } else {
    assert(data.sewer, 'Missing sewer data');
    const barScaleData = data.sewer.last_value;

    return {
      value: barScaleData.average,
      unix: barScaleData.week_unix,
      dateInsertedUnix: barScaleData.date_of_insertion_unix,
      week_end_unix: barScaleData.week_end_unix,
      week_start_unix: barScaleData.week_start_unix,
    };
  }
}

/**
 * Formats data to be used for the line chart component for sewer water
 * The formatting differs based on the amount of RWZI locations
 * @param data
 */
export function getSewerWaterLineChartData(
  data: Municipal
): SewerWaterLineChartData | undefined {
  const { dataAvailable, oneInstallation } = getSewerWaterMetadata(data);

  if (!dataAvailable) {
    return;
  }

  if (oneInstallation) {
    // One RWZI installation:
    // Average line === the installations data
    // No grey lines
    assert(data.sewer_per_installation, 'Missing sewer per installation data');
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
  // Average line === the averages from `sewer`
  // Grey lines are the RWZI locations
  assert(data.sewer, 'Missing sewer data');
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

/**
 * Formats data to be used for the bar chart component for sewer water
 * The formatting differs based on the amount of RWZI locations
 * @param data
 */
export function getSewerWaterBarChartData(
  data: Municipal
): SewerWaterBarChartData | undefined {
  const { dataAvailable, oneInstallation } = getSewerWaterMetadata(data);

  if (!dataAvailable || oneInstallation) {
    return;
  }

  assert(data.sewer_per_installation, 'Missing sewer per installation data');
  assert(data.sewer, 'Missing sewer data');

  const installations = data.sewer_per_installation.values.sort((a, b) => {
    return b.last_value.rna_normalized - a.last_value.rna_normalized;
  });

  // Concat keys and data to glue the "average" as first bar and then
  // the RWZI-locations from highest to lowest
  return {
    keys: [
      text.average,
      ...installations.map((i) => i.last_value.rwzi_awzi_name),
    ],
    data: [
      {
        y: data.sewer.last_value.average,
        color: colors.data.primary,
        label: data.sewer.last_value
          ? `${formatDateFromSeconds(
              data.sewer.last_value.week_unix,
              'short'
            )}: ${formatNumber(data.sewer.last_value.average)}`
          : false,
      } as Highcharts.XrangePointOptionsObject,
      ...installations.map(
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
          } as Highcharts.XrangePointOptionsObject)
      ),
    ],
  };
}

export function getSewerWaterScatterPlotData(data: Municipal) {
  const values = data.sewer_per_installation?.values.flatMap(
    (value) => value.values
  );

  /**
   * All individual `value.values`-arrays are already sorted correctly, but
   * due to merging them into one array the sort might be off.
   */
  values?.sort((a, b) => a.date_measurement_unix - b.date_measurement_unix);

  return values;
}

export function getInstallationNames(data: Municipal): string[] {
  return (
    (data.sewer_per_installation?.values || [])
      .flatMap((value) => value.values)
      .map((value) => value.rwzi_awzi_name)
      // deduplicate installation names
      .filter((value, index, arr) => arr.indexOf(value) === index)
      .sort((a, b) => a.localeCompare(b))
  );
}
