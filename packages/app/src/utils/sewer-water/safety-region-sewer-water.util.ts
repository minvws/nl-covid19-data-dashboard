import { BarChartValue } from '~/components-styled/bar-chart/bar-chart-coordinates';
import siteText from '~/locale/index';
import { colors } from '~/style/theme';
import { Regionaal } from '~/types/data.d';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';

const text = siteText.veiligheidsregio_rioolwater_metingen;

/**
 * @TODO these helpers for VR and GM should be merged into one using generics.
 * All of this code seems duplicate now that the type names are unified.
 */

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

export function getInstallationNames(data: Regionaal): string[] {
  return data.sewer_per_installation.values
    .map((value) => value.rwzi_awzi_name)
    .sort((a, b) => a.localeCompare(b));
}

export function getSewerWaterScatterPlotData(data: Regionaal) {
  /**
   * @TODO we could improve on this. The values per installation are merged here
   * into one big array, and because of this the chart needs to have the awzi
   * name injected for every sample so that down the line it can separate values
   * based on the selected installation. This creates overhead that should be
   * unnecessary. The chart could be made to handle the incoming values
   * organized in a per-installation manner.
   */
  const values = data.sewer_per_installation.values.flatMap((value) =>
    value.values.map((x) => ({ ...x, rwzi_awzi_name: value.rwzi_awzi_name }))
  );
  /**
   * All individual `value.values`-arrays are already sorted correctly, but due
   * to merging them into one array the sort might be off.
   */
  values.sort((a, b) => a.date_unix - b.date_unix);

  return values;
}

export function getSewerWaterLineChartData(
  data: Regionaal
): SewerWaterLineChartData | undefined {
  // More than one RWZI installation: Average line === the averages from
  // `sewer_measurements` Grey lines are the RWZI locations
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

export function getSewerWaterBarChartData(
  data: Regionaal
): SewerWaterBarChartData | undefined {
  const sortedInstallations = data.sewer_per_installation.values.sort(
    (a, b) => {
      return b.last_value.rna_normalized - a.last_value.rna_normalized;
    }
  );

  // Concat keys and data to glue the "average" as first bar and then the
  // RWZI-locations from highest to lowest
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
      ...sortedInstallations.map((installation) => ({
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
