import {
  MunicipalSewer,
  SewerPerInstallationData,
  VrSewer,
} from '@corona-dashboard/common';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { Select } from '~/components/select';
import { useSewerStationSelectPropsSimplified } from '~/components/sewer-chart/logic';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { colors } from '~/style/theme';
import { AccessibilityDefinition } from '~/utils/use-accessibility-annotations';
import { LocationTooltip } from './components/location-tooltip';
import { mergeData } from './new-logic';

export function NewSewerChart({
  accessibility,
  dataAverages,
  dataPerInstallation,
  text,
}: {
  /**
   * The mandatory AccessibilityDefinition provides a reference to annotate the
   * graph with a label and description.
   */
  accessibility: AccessibilityDefinition;
  dataAverages: VrSewer | MunicipalSewer;
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
      segment_0: string;
      segment_1: string;
      segment_2: string;
      segment_3: string;
    };
    averagesDataLabel: string;
    valueAnnotation: string;
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
      value: 10,
      color: colors.data.scale.blue[0],
      label: text.splitLabels.segment_0,
    },
    {
      value: 50,
      color: colors.data.scale.blue[1],
      label: text.splitLabels.segment_1,
    },
    {
      value: 100,
      color: colors.data.scale.blue[2],
      label: text.splitLabels.segment_2,
    },
    {
      value: Infinity,
      color: colors.data.scale.blue[3],
      label: text.splitLabels.segment_3,
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
                accessibility={accessibility}
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
                dataOptions={{ valueAnnotation: text.valueAnnotation }}
              />
            ) : (
              <TimeSeriesChart
                accessibility={accessibility}
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
                dataOptions={{ valueAnnotation: text.valueAnnotation }}
              />
            )
          }
        </>
      )}
    </ChartTile>
  );
}
