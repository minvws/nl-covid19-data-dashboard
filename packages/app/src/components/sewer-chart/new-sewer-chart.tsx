import {
  assert,
  MunicipalSewer,
  RegionalSewer,
  SewerPerInstallationData,
} from '@corona-dashboard/common';
import { set } from 'lodash';
import { Select } from '~/components/select';
import { useSewerStationSelectPropsSimplified } from '~/components/sewer-chart/logic';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { colors } from '~/style/theme';
import { Box } from '../base';
import { ChartTile } from '../chart-tile';

export function NewSewerChart({
  dataAverages,
  dataPerInstallation,
  text,
}: {
  dataAverages: RegionalSewer | MunicipalSewer;
  dataPerInstallation?: SewerPerInstallationData;
  text: {
    title: string;
    description: string;
    source: {
      href: string;
      text: string;
    };
    selectPlaceholder?: string;
    splitLabels: {
      waarde_0_200: string;
      waarde_200_400: string;
      waarde_400_600: string;
      waarde_600_800: string;
      waarde_800_plus: string;
    };
    averagesDataLabel: string;
  };
}) {
  const {
    options,
    value: selectedInstallation,
    onChange,
    onClear,
  } = useSewerStationSelectPropsSimplified(
    dataPerInstallation ||
      ({
        values: [
          {
            /**
             * Here I'm using a little hack because hooks can't be used
             * conditionally but NL doesn't have "per installation" data. So
             * this provides some mock data that is filtered out later.
             */
            rwzi_awzi_name: '__no_installations',
          },
        ],
      } as SewerPerInstallationData)
  );

  const averageSplitPoints = [
    {
      value: 200,
      color: colors.data.scale.blue[0],
      label: text.splitLabels.waarde_0_200,
    },
    {
      value: 400,
      color: colors.data.scale.blue[1],
      label: text.splitLabels.waarde_200_400,
    },
    {
      value: 600,
      color: colors.data.scale.blue[2],
      label: text.splitLabels.waarde_400_600,
    },
    {
      value: 800,
      color: colors.data.scale.blue[3],
      label: text.splitLabels.waarde_600_800,
    },
    {
      value: Infinity,
      color: colors.data.scale.blue[4],
      label: text.splitLabels.waarde_800_plus,
    },
  ];

  return (
    <ChartTile
      timeframeOptions={['all', '5weeks']}
      title={text.title}
      metadata={{
        source: text.source,
      }}
      description={text.description}
    >
      {(timeframe) => (
        <>
          {dataPerInstallation && (
            <Box alignSelf="flex-start" mb={3}>
              <Select
                options={options}
                onChange={onChange}
                onClear={onClear}
                value={selectedInstallation}
                placeholder={text.selectPlaceholder}
              />
            </Box>
          )}

          {
            /**
             * If there is installation data, and an installation was selected we need to
             * convert the data to combine the two.
             */
            dataPerInstallation && selectedInstallation ? (
              <TimeSeriesChart
                values={mergeData(
                  dataAverages,
                  dataPerInstallation,
                  selectedInstallation
                )}
                timeframe={timeframe}
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty: 'selected_installation_rna_normalized',
                    label: selectedInstallation,
                    color: 'black',
                    style: 'dashed',
                  },
                  {
                    type: 'split-area',
                    metricProperty: 'average',
                    label: text.averagesDataLabel,
                    splitPoints: averageSplitPoints,
                    isNonInteractive: true,
                  },
                ]}
              />
            ) : (
              <TimeSeriesChart
                values={dataAverages.values}
                timeframe={timeframe}
                seriesConfig={[
                  {
                    type: 'split-area',
                    metricProperty: 'average',
                    label: text.averagesDataLabel,
                    splitPoints: averageSplitPoints,
                  },
                ]}
              />
            )
          }
        </>
      )}
    </ChartTile>
  );
}

function mergeData(
  dataAverages: RegionalSewer | MunicipalSewer,
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

  type MergedValue = {
    average: number | null;
    selected_installation_rna_normalized: number | null;
  };

  type MergedValuesByTimestamp = Record<number, MergedValue>;

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
     * the values are displayed when just viewing averages, but for this merged
     * set we'll need to use day timestamps.
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
