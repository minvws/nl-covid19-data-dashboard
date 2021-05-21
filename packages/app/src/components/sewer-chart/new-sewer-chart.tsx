import {
  assert,
  MunicipalSewer,
  RegionalSewer,
  SewerPerInstallationData,
} from '@corona-dashboard/common';
import { set } from 'lodash';
import { isDefined } from 'ts-is-present';
import { Select } from '~/components/select';
import { useSewerStationSelectPropsSimplified } from '~/components/sewer-chart/logic';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';
import { colors } from '~/style/theme';
import { ChartTile } from '../chart-tile';

export function NewSewerChart({
  dataAverages,
  dataPerInstallation,
}: {
  dataAverages: RegionalSewer | MunicipalSewer;
  dataPerInstallation?: SewerPerInstallationData;
  siteText: SiteText;
}) {
  const { siteText } = useIntl();

  /**
   * @TODO I'm assuming nl/gm/vr share use the same texts really but should check if
   * this is correct. Maybe we can make the switch here if not based on a
   * "context" prop if their texts are different but the structure is compatible.
   */
  const text = siteText.veiligheidsregio_rioolwater_metingen;

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

  /**
   * If there is installation data, and an installation was selected we need to
   * convert the data to combine the two.
   */
  const chartInputValues =
    dataPerInstallation && selectedInstallation
      ? mergeData(dataAverages, dataPerInstallation, selectedInstallation)
      : dataAverages.values;

  console.log('chartInputValues', chartInputValues);

  return (
    <ChartTile
      timeframeOptions={['all', '5weeks']}
      title={text.linechart_titel}
      metadata={{
        source: text.bronnen.rivm,
      }}
      description={text.linechart_description}
    >
      {(timeframe) => (
        <div>
          {options[0].value !== '__no_installations' && (
            <Select
              options={options}
              onChange={onChange}
              onClear={onClear}
              value={selectedInstallation}
              placeholder={text.graph_selected_rwzi_placeholder}
            />
          )}

          <TimeSeriesChart
            // @ts-expect-error
            values={chartInputValues}
            timeframe={timeframe}
            /**
             * Not sure why TS is complaining here. Can't seem to make part of
             * the config conditional.
             */
            // @ts-expect-error
            seriesConfig={[
              dataPerInstallation && selectedInstallation
                ? {
                    type: 'line',
                    metricProperty: 'selected_installation_rna_normalized',
                    label: selectedInstallation,
                    color: 'black',
                    style: 'dashed',
                  }
                : undefined,
              {
                type: 'split-area',
                metricProperty: 'average',
                label: 'Weekgemiddelde',
                splitPoints: [
                  {
                    value: 200,
                    color: colors.data.scale.blue[0],
                    label: '0 - 200',
                  },
                  {
                    value: 400,
                    color: colors.data.scale.blue[1],
                    label: '200 - 400',
                  },
                  {
                    value: 600,
                    color: colors.data.scale.blue[2],
                    // color: 'hotpink',
                    label: '400 - 600',
                  },
                  {
                    value: 800,
                    color: colors.data.scale.blue[3],
                    label: '600 - 800',
                  },
                  {
                    value: Infinity,
                    color: colors.data.scale.blue[4],
                    label: '800 - 1000',
                  },
                ],
              },
            ].filter(isDefined)}
            dataOptions={{
              valueAnnotation: siteText.waarde_annotaties.riool_normalized,
            }}
          />
        </div>
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

  const mergedValuesByTimestamp = valuesForInstallation.reduce<MergedValuesByTimestamp>(
    (acc, v) =>
      set(acc, v.date_unix, {
        selected_installation_rna_normalized: v.rna_normalized,
        average: Math.random() * 200,
      }),
    {}
  );

  for (const value of dataAverages.values) {
    /**
     * For averages pick the date in the middle of the week, because that's how
     * the values are displayed when just viewing averages, but now we need to
     * convert everything to day timestamps.
     *
     * @TODO alternatively we could pick start or end, and they would line up
     * with at least some of the installation samples, but it also means the
     * average trend gets a little distorted when selecting an installation.
     */
    const date_unix =
      value.date_start_unix + (value.date_end_unix - value.date_start_unix) / 2;

    const existingValue = mergedValuesByTimestamp[date_unix] as
      | MergedValue
      | undefined;

    /**
     * If we happen to fall exactly on an existing installation timestamp we
     * want to merge that data.
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

  // console.log('mergedValuesByTimestamp', mergedValuesByTimestamp);
  return Object.entries(mergedValuesByTimestamp)
    .map(([date_unix, obj]) => ({
      date_unix: Number(date_unix),
      ...obj,
    }))
    .sort((a, b) => a.date_unix - b.date_unix);
}
