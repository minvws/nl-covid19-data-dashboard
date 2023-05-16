import { colors, NlSewer, SewerPerInstallationData, TimeframeOption, TimeframeOptionsList } from '@corona-dashboard/common';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { isPresent } from 'ts-is-present';
import { Warning } from '@corona-dashboard/icons';
import { Box } from '~/components/base';
import { Text } from '~/components/typography';
import { ChartTile } from '~/components/chart-tile';
import { RichContentSelect } from '~/components/rich-content-select';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { AccessibilityDefinition } from '~/utils/use-accessibility-annotations';
import { WarningTile } from '~/components/warning-tile';
import { mergeData, useSewerStationSelectPropsSimplified } from './logic';
import { useIntl } from '~/intl';
import { mediaQueries, space } from '~/style/theme';
import { useScopedWarning } from '~/utils/use-scoped-warning';
import { TimelineEventConfig } from '~/components/time-series-chart/components/timeline';
import { ChartTimeControls } from '~/components/chart-time-controls';
import styled from 'styled-components';

interface SewerChartProps {
  /**
   * The mandatory AccessibilityDefinition provides a reference to annotate the
   * graph with a label and description.
   */
  accessibility: AccessibilityDefinition;
  dataAverages: NlSewer;
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
    averagesLegendLabel: string;
    averagesTooltipLabel: string;
    valueAnnotation: string;
    rwziSelectDropdown?: {
      dropdown_label_rwzi: string;
      dropdown_label_timeselection: string;
      select_none_label: string;
    };
    rwziLabel?: string;
  };
  vrNameOrGmName?: string;
  incompleteDatesAndTexts?: {
    zeewolde_date_end_in_unix_time: string;
    zeewolde_date_start_in_unix_time: string;
    zeewolde_label: string;
    zeewolde_short_label: string;
  };
  warning?: string;
  timelineEvents?: TimelineEventConfig[];
}

export const SewerChart = ({ accessibility, dataAverages, dataPerInstallation, text, vrNameOrGmName, incompleteDatesAndTexts, warning, timelineEvents }: SewerChartProps) => {
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
      } as SewerPerInstallationData),
    text.rwziSelectDropdown?.select_none_label || ''
  );

  const router = useRouter();

  useEffect(() => {
    const routeChangeHandler = () => onChange(undefined);
    router.events.on('routeChangeStart', routeChangeHandler);
    return () => router.events.off('routeChangeStart', routeChangeHandler);
  }, [onChange, router.events]);

  const [sewerTimeframe, setSewerTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const { commonTexts } = useIntl();
  const scopedGmName = commonTexts.gemeente_index.municipality_warning;

  const scopedWarning = useScopedWarning(vrNameOrGmName || '', warning || '');

  const [timeframe, setTimeframe] = useState(TimeframeOption.ALL);

  useEffect(() => {
    setSewerTimeframe(timeframe);
  }, [timeframe, setSewerTimeframe]);

  const dataOptions =
    incompleteDatesAndTexts && selectedInstallation === 'ZEEWOLDE'
      ? {
          valueAnnotation: text.valueAnnotation,
          timespanAnnotations: [
            {
              start: parseInt(incompleteDatesAndTexts.zeewolde_date_start_in_unix_time),
              end: parseInt(incompleteDatesAndTexts.zeewolde_date_end_in_unix_time),
              label: incompleteDatesAndTexts.zeewolde_label,
              shortLabel: incompleteDatesAndTexts.zeewolde_short_label,
            },
          ],
        }
      : {
          valueAnnotation: text.valueAnnotation,
          timelineEvents,
        };

  const optionsWithContent = useMemo(
    () =>
      options
        .map((option) => ({
          ...option,
          content: (
            <Box paddingRight={space[2]}>
              <Text>{option.label}</Text>
            </Box>
          ),
        }))
        .filter(isPresent),
    [options]
  );

  return (
    <ChartTile
      title={text.title}
      metadata={{
        source: text.source,
      }}
      description={text.description}
    >
      <SelectBoxes display="flex" justifyContent="flex-start" marginBottom={space[3]}>
        {TimeframeOptionsList && (
          <Box>
            <strong>{text.rwziSelectDropdown?.dropdown_label_timeselection}</strong>
            <ChartTimeControls timeframeOptions={TimeframeOptionsList} timeframe={timeframe} onChange={setTimeframe} />
          </Box>
        )}
        {dataPerInstallation && (
          <Box>
            <strong>{text.rwziSelectDropdown?.dropdown_label_rwzi}</strong>
            <RichContentSelect
              label={text.selectPlaceholder}
              visuallyHiddenLabel
              initialValue={selectedInstallation}
              options={optionsWithContent}
              onChange={(option) => onChange(option.value)}
            />
          </Box>
        )}
      </SelectBoxes>
      {scopedWarning && scopedGmName.toUpperCase() === selectedInstallation && (
        <Box marginTop={space[2]} marginBottom={space[4]}>
          <WarningTile variant="emphasis" message={scopedWarning} icon={Warning} isFullWidth />
        </Box>
      )}
      {
        /**
         * If there is installation data, and an installation was selected we need to
         * convert the data to combine the two.
         */
        dataPerInstallation && selectedInstallation && selectedInstallation !== 'average' ? (
          <TimeSeriesChart
            accessibility={accessibility}
            values={mergeData(dataAverages, dataPerInstallation, selectedInstallation)}
            timeframe={sewerTimeframe}
            seriesConfig={[
              {
                type: 'line',
                metricProperty: 'selected_installation_rna_normalized',
                label: text.rwziLabel ? `${text.rwziLabel} ${selectedInstallation}` : selectedInstallation,
                color: colors.orange1,
              },
              {
                type: 'line',
                metricProperty: 'average',
                label: text.averagesLegendLabel,
                shortLabel: text.averagesTooltipLabel,
                color: colors.scale.blue[3],
              },
            ]}
            dataOptions={dataOptions}
            forceLegend
          />
        ) : (
          <TimeSeriesChart
            accessibility={accessibility}
            values={dataAverages.values}
            timeframe={sewerTimeframe}
            seriesConfig={[
              {
                type: 'line',
                metricProperty: 'average',
                label: text.averagesLegendLabel,
                shortLabel: text.averagesTooltipLabel,
                color: colors.scale.blue[3],
              },
            ]}
            dataOptions={dataOptions}
            forceLegend
          />
        )
      }
    </ChartTile>
  );
};

const SelectBoxes = styled(Box)`
  column-gap: ${space[5]};
  row-gap: ${space[4]};
  flex-wrap: wrap;

  > div {
    min-width: 207px;
    flex: 1 0;

    @media ${mediaQueries.lg} {
      flex: 0 33%;
    }
    @media ${mediaQueries.xl} {
      flex: 0 25%;
    }
  }
`;
