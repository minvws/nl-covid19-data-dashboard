import { Municipal } from '@corona-dashboard/common';

import { useIntl } from '~/intl';
import { assert } from '../assert';
import { colors } from '~/style/theme';
import { BarChartValue } from '~/components-styled/bar-chart/bar-chart-coordinates';

/**
 * @TODO these helpers for VR and GM should be merged into one using generics.
 * All of this code seems duplicate now that the type names are unified.
 */

// Specific interfaces to pass data between the formatting functions and the highcharts configs
interface SewerWaterMetadata {
  dataAvailable: boolean;
  oneInstallation: boolean;
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
 * Formats data to be used for the bar chart component for sewer water
 * The formatting differs based on the amount of RWZI locations
 * @param data
 */
export function useSewerWaterBarChartData(
  data: Municipal
): SewerWaterBarChartData | undefined {
  const { dataAvailable, oneInstallation } = getSewerWaterMetadata(data);
  const { siteText, formatDateFromSeconds, formatNumber } = useIntl();
  const text = siteText.gemeente_rioolwater_metingen;

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
          'day-month'
        )}: ${formatNumber(data.sewer.last_value.average)}`,
      },
      ...installations.map((installation) => ({
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
