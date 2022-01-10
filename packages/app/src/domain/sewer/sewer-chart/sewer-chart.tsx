import {
  colors,
  NlSewer,
  SewerPerInstallationData,
  VrSewer,
} from '@corona-dashboard/common';
import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import { Warning } from '@corona-dashboard/icons';
import { Box } from '~/components/base';
import { Text } from '~/components/typography';
import { ChartTile } from '~/components/chart-tile';
import { RichContentSelect } from '~/components/rich-content-select';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { AccessibilityDefinition } from '~/utils/use-accessibility-annotations';
import { LocationTooltip } from './components/location-tooltip';
import { WarningTile } from '~/components/warning-tile';
import { mergeData, useSewerStationSelectPropsSimplified } from './logic';
import { useIntl } from '~/intl';
import { useScopedWarning } from '~/utils/use-scoped-warning';

type SewerChartProps = {
  /**
   * The mandatory AccessibilityDefinition provides a reference to annotate the
   * graph with a label and description.
   */
  accessibility: AccessibilityDefinition;
  dataAverages: VrSewer | NlSewer;
  dataPerInstallation?: SewerPerInstallationData;
  text: {
    title: string;
    description: string;
    source: {
      href: string;
      text: string;
    };
    selectPlaceholder: string;
    splitLabels: {
      segment_0: string;
      segment_1: string;
      segment_2: string;
      segment_3: string;
    };
    averagesDataLabel: string;
    valueAnnotation: string;
  };
  vrNameOrGmName?: string;
  warning?: string;
};

export function SewerChart({
  accessibility,
  dataAverages,
  dataPerInstallation,
  text,
  vrNameOrGmName,
  warning,
}: SewerChartProps) {
  const {
    options,
    value: selectedInstallation,
    onChange,
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
  const { siteText } = useIntl();
  const scopedGmName = siteText.gemeente_index.municipality_warning;

  const scopedWarning = useScopedWarning(vrNameOrGmName || '', warning || '');

  const optionsWithContent = useMemo(
    () =>
      options
        .map((option) => ({
          ...option,
          content: (
            <Box pr={2}>
              <Text>{option.label}</Text>
            </Box>
          ),
        }))
        .filter(isPresent),
    [options]
  );

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
            <Box alignSelf="flex-start" mb={3} minWidth={207}>
              <RichContentSelect
                label={text.selectPlaceholder}
                visuallyHiddenLabel
                initialValue={selectedInstallation}
                options={optionsWithContent}
                onChange={(option) => onChange(option.value)}
              />
            </Box>
          )}
          {scopedWarning &&
            scopedGmName.toUpperCase() === selectedInstallation && (
              <Box mt={2} mb={4}>
                <WarningTile
                  variant="emphasis"
                  message={scopedWarning}
                  icon={Warning}
                  isFullWidth
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
                    nonInteractive: true,
                  },
                ]}
                formatTooltip={(data) => {
                  /**
                   * Silently fail when unable to find line configuration in location tooltip
                   */
                  if (data.config.find((x) => x.type === 'line')) {
                    return <LocationTooltip data={data} />;
                  }
                }}
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
                dataOptions={{
                  valueAnnotation: text.valueAnnotation,
                }}
              />
            )
          }
        </>
      )}
    </ChartTile>
  );
}
