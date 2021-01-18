import { Municipal } from '@corona-dashboard/common';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

import siteText from '~/locale/index';
import { assert } from '../assert';
import { colors } from '~/style/theme';
import { BarChartValue } from '~/components-styled/bar-chart/bar-chart-coordinates';

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

interface SewerWaterLineChartValue {
  date: number;
  value: number;
  date_start_unix: number;
  date_end_unix: number;
}

interface SewerWaterLineChartData {
  averageValues: SewerWaterLineChartValue[];
  averageLabelText: string;
}

export interface SewerWaterBarChartData {
  values: BarChartValue[];
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
          date: value.date_unix,
          /**
           * This is hack because the line chart expects week range data but
           * it doesn't actually show it. The original data doesn't contain
           * these week start/end timestamps anymore.
           */
          date_end_unix: value.date_unix,
          date_start_unix: value.date_unix,
        };
      }),
      averageLabelText: replaceVariablesInText(
        text.graph_average_label_text_rwzi,
        {
          name: data.sewer_per_installation.values[0].rwzi_awzi_name,
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
        date: value.date_end_unix,
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
    values: [
      {
        label: text.average,
        value: data.sewer.last_value.average,
        color: colors.data.primary,
        tooltip: `${formatDateFromSeconds(
          data.sewer.last_value.date_end_unix,
          'short'
        )}: ${formatNumber(data.sewer.last_value.average)}`,
      },
      ...installations.map((installation) => ({
        label: installation.rwzi_awzi_name,
        value: installation.last_value.rna_normalized,
        color: '#C1C1C1',
        tooltip: `${formatDateFromSeconds(
          installation.last_value.date_unix,
          'short'
        )}: ${formatNumber(installation.last_value.rna_normalized)}`,
      })),
    ],
  };
}

export function getSewerWaterScatterPlotData(data: Municipal) {
  /**
   * @TODO we could improve on this. The values per installation are merged here
   * into one big array, and because of this the chart needs to have the awzi
   * name injected for every sample so that down the line it can separate values
   * based on the selected installation. This creates overhead that should be
   * unnecessary. The chart could be made to handle the incoming values
   * organized in a per-installation manner.
   */
  const values = data.sewer_per_installation?.values.flatMap((value) =>
    value.values.map((x) => ({ ...x, rwzi_awzi_name: value.rwzi_awzi_name }))
  );

  /**
   * All individual `value.values`-arrays are already sorted correctly, but
   * due to merging them into one array the sort might be off.
   */
  values?.sort((a, b) => a.date_unix - b.date_unix);

  return values;
}

export function getInstallationNames(data: Municipal): string[] {
  return (data.sewer_per_installation?.values || [])
    .map((value) => value.rwzi_awzi_name)
    .sort((a, b) => a.localeCompare(b));
}
