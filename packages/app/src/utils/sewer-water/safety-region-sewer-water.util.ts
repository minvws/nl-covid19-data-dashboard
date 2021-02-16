import { BarChartValue } from '~/components-styled/bar-chart/bar-chart-coordinates';
import siteText from '~/locale/index';
import { colors } from '~/style/theme';
import { Regionaal } from '@corona-dashboard/common';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';

const text = siteText.veiligheidsregio_rioolwater_metingen;

export interface SewerWaterBarChartData {
  values: BarChartValue[];
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
          'day-month'
        )}: ${formatNumber(data.sewer.last_value.average)}`,
      },
      ...sortedInstallations.map((installation) => ({
        label: installation.rwzi_awzi_name,
        value: installation.last_value.rna_normalized,
        color: '#C1C1C1',
        tooltip: `${formatDateFromSeconds(
          installation.last_value.date_unix,
          'day-month'
        )}: ${formatNumber(installation.last_value.rna_normalized)}`,
      })),
    ],
  };
}
