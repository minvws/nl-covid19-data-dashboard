import {
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

  const valuesForInstallation = selectedInstallation
    ? dataPerInstallation?.values.find(
        (x) => x.rwzi_awzi_name === selectedInstallation
      )?.values
    : undefined;

  const valuesForInstallationByTimestamp =
    valuesForInstallation?.reduce(
      (acc, v) => set(acc, v.date_unix, v.rna_normalized),
      {} as Record<number, number>
      /**
       * Assigning an empty record as a fallback makes it a little easier to
       * work with the type below.
       */
    ) || ({} as Record<number, number>);

  const valuesForAverageByTimestamp = dataAverages.values.reduce(
    (acc, v) => set(acc, v.date_start_unix, v.average),
    {} as Record<number, number>
  );

  const mergedValues = valuesForInstallation
    ? valuesForInstallation.map((x) => ({
        ...x,
        selected_instalation_value: x.rna_normalized,
        average: valuesForAverageByTimestamp[x.date_unix] || null,
      }))
    : dataAverages.values.map((x) => ({
        ...x,
        selected_instalation_value:
          valuesForInstallationByTimestamp[x.date_start_unix] || null,
      }));

  // const mergedValues = dataAverages.values.map((x) => ({
  //   ...x,
  //   selected_instalation_value:
  //     selectedInstallation && valuesForInstallationByTimestamp
  //       ? valuesForInstallationByTimestamp[x.date_start_unix]
  //       : null,
  // }));

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
            values={mergedValues}
            timeframe={timeframe}
            /**
             * Not sure why TS is complaining here. Can't seem to make part of
             * the config conditional.
             */
            // @ts-expect-error
            seriesConfig={[
              selectedInstallation
                ? {
                    type: 'line',
                    metricProperty: 'selected_instalation_value',
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
