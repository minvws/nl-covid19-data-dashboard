/**
 * This file is called new-logic to keep it separated from ./logic.ts which
 * should be deleted later. I think we can move some more logic from the
 * new-sewer-chart here later and rename it to logic.
 */

import {
  assert,
  MunicipalSewer,
  SewerPerInstallationData,
  VrSewer,
} from '@corona-dashboard/common';
import { set } from 'lodash';

type MergedValue = {
  average: number | null;
  selected_installation_rna_normalized: number | null;
};

type MergedValuesByTimestamp = Record<number, MergedValue>;

export type MergedSewerType = ReturnType<typeof mergeData>[number];

/**
 * Data for averages and per installations are two completely separate sources
 * with different formats. In order to display them in the chart together we
 * need to convert them to format with the same type of timestamps.
 */
export function mergeData(
  dataAverages: VrSewer | MunicipalSewer,
  dataPerInstallation: SewerPerInstallationData,
  selectedInstallation: string
) {
  const valuesForInstallation = dataPerInstallation.values.find(
    (x) => x.rwzi_awzi_name === selectedInstallation
  )?.values;

  assert(
    valuesForInstallation,
    `Failed to find data for rwzi_awzi_name ${selectedInstallation}`
  );

  const mergedValuesByTimestamp =
    valuesForInstallation.reduce<MergedValuesByTimestamp>(
      (acc, v) =>
        set(acc, v.date_unix, {
          selected_installation_rna_normalized: v.rna_normalized,
          average: null,
        }),
      {}
    );

  for (const value of dataAverages.values) {
    /**
     * For averages pick the date in the middle of the week, because that's how
     * the values are displayed when just viewing averages, and for this merged
     * set we'll need to use single dates.
     */
    const date_unix =
      value.date_start_unix + (value.date_end_unix - value.date_start_unix) / 2;

    const existingValue = mergedValuesByTimestamp[date_unix] as
      | MergedValue
      | undefined;

    /**
     * If we happen to fall exactly on an existing installation timestamp we
     * want to combine the two property values.
     */
    if (existingValue) {
      mergedValuesByTimestamp[date_unix] = {
        average: value.average,
        selected_installation_rna_normalized:
          existingValue.selected_installation_rna_normalized,
      };
    } else {
      mergedValuesByTimestamp[date_unix] = {
        average: value.average,
        selected_installation_rna_normalized: null,
      };
    }
  }

  /**
   * Convert the map to a series of sorted timestamped values.
   */
  return Object.entries(mergedValuesByTimestamp)
    .map(([date_unix, obj]) => ({
      date_unix: Number(date_unix),
      ...obj,
    }))
    .sort((a, b) => a.date_unix - b.date_unix);
}
