import {
  MunicipalSewer,
  RegionalSewer,
  SewerPerInstallationData,
} from '@corona-dashboard/common';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { Select } from '~/components/select';
import { useSewerStationSelectPropsSimplified } from '~/components/sewer-chart/logic';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { colors } from '~/style/theme';
import { LocationTooltip } from './components/location-tooltip';
import { mergeData } from './new-logic';

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
                formatTooltip={(data) => <LocationTooltip data={data} />}
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
