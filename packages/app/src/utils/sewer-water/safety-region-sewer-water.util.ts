import { BarChartValue } from '~/components-styled/bar-chart/bar-chart-coordinates';
import siteText from '~/locale/index';
import { colors } from '~/style/theme';
import { Regionaal, RegionalSewerPerInstallationValue } from '~/types/data.d';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';

const text = siteText.veiligheidsregio_rioolwater_metingen;

/**
 * @TODO these helpers for VR and GM should be merged into one using generics.
 * All of this code seems duplicate now that the type names are unified.
 */

interface SewerWaterBarScaleData {
  value: number | undefined;
  unix: number | undefined;
  dateInsertedUnix: number | undefined;
  week_end_unix: number | undefined;
  week_start_unix: number | undefined;
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

export interface SewerWaterBarChartData {
  values: BarChartValue[];
}

export function getSewerWaterBarScaleData(
  data: Regionaal
): SewerWaterBarScaleData {
  const barScaleData = data.sewer.last_value;

  return {
    value: barScaleData.average,
    unix: barScaleData.week_end_unix,
    dateInsertedUnix: barScaleData.date_of_insertion_unix,
    week_start_unix: barScaleData.week_start_unix,
    week_end_unix: barScaleData.week_end_unix,
  };
}

export function getInstallationNames(data: Regionaal): string[] {
  return data.sewer_per_installation.values
    .flatMap((value) => value.values)
    .map((value) => value.rwzi_awzi_name)
    .filter((value, index, arr) => arr.indexOf(value) === index)
    .sort((a, b) => a.localeCompare(b));
}

export function getSewerWaterScatterPlotData(
  data: Regionaal
): RegionalSewerPerInstallationValue[] | undefined {
  const values = data.sewer_per_installation.values.flatMap(
    (value) => value.values
  );
  /**
   * All individual `value.values`-arrays are already sorted correctly, but
   * due to merging them into one array the sort might be off.
   */
  values.sort((a, b) => a.date_measurement_unix - b.date_measurement_unix);

  return values;
}

export function getSewerWaterLineChartData(
  data: Regionaal
): SewerWaterLineChartData | undefined {
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
  const sortedInstallations = data.sewer_per_installation.values.sort(
    (a, b) => {
      return b.last_value.rna_normalized - a.last_value.rna_normalized;
    }
  );

  // Concat keys and data to glue the "average" as first bar and then
  // the RWZI-locations from highest to lowest
  return {
    values: [
      {
        label: text.average,
        value: data.sewer.last_value.average,
        color: colors.data.primary,
        tooltip: `${formatDateFromSeconds(
          data.sewer.last_value.week_unix,
          'short'
        )}: ${formatNumber(data.sewer.last_value.average)}`,
      },
      ...sortedInstallations.map((installation) => ({
        label: installation.last_value.rwzi_awzi_name,
        value: installation.last_value.rna_normalized,
        color: '#C1C1C1',
        tooltip: `${formatDateFromSeconds(
          installation.last_value.date_measurement_unix,
          'short'
        )}: ${formatNumber(installation.last_value.rna_normalized)}`,
      })),
    ],
  };
}
