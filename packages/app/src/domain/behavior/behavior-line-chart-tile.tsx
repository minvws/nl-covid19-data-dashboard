import { colors, NlBehaviorValue, VrBehaviorArchived_20221019Value } from '@corona-dashboard/common';
import { dropRightWhile, dropWhile } from 'lodash';
import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { InlineTooltip } from '~/components/inline-tooltip';
import { MetadataProps } from '~/components/metadata';
import { SeriesConfig, TimeSeriesChart } from '~/components/time-series-chart';
import { TimelineEventConfig } from '~/components/time-series-chart/components/timeline';
import { BoldText } from '~/components/typography';
import { SiteText } from '~/locale';
import { space } from '~/style/theme';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { SelectBehavior } from './components/select-behavior';
import { BehaviorIdentifier } from './logic/behavior-types';

type ValueType = NlBehaviorValue | VrBehaviorArchived_20221019Value;
type ValueKey = keyof ValueType;

interface BehaviorLineChartTileProps {
  values: ValueType[];
  metadata: MetadataProps;
  currentId: BehaviorIdentifier;
  setCurrentId: React.Dispatch<React.SetStateAction<BehaviorIdentifier>>;
  behaviorOptions?: BehaviorIdentifier[];
  timelineEvents?: TimelineEventConfig[];
  useDatesAsRange?: boolean;
  text: SiteText['pages']['behavior_page'];
}

export function BehaviorLineChartTile({ values, metadata, currentId, setCurrentId, behaviorOptions, timelineEvents, useDatesAsRange, text }: BehaviorLineChartTileProps) {
  const selectedComplianceValueKey = `${currentId}_compliance` as ValueKey;
  const selectedSupportValueKey = `${currentId}_support` as ValueKey;

  const complianceValuesHasGap = useDataHasGaps<ValueType>(values, selectedComplianceValueKey);
  const supportValuesHasGap = useDataHasGaps<ValueType>(values, selectedSupportValueKey);

  const breakpoints = useBreakpoints();

  return (
    <ChartTile title={text.shared.line_chart.title} metadata={metadata} description={text.shared.line_chart.description}>
      <Box spacing={4}>
        <Box display="flex" alignItems={{ lg: 'center' }} spacing={{ _: 3, lg: 0 }} flexDirection={{ _: 'column', lg: 'row' }} paddingBottom={space[3]}>
          <Box paddingRight={space[3]} width={breakpoints.lg ? '50%' : '100%'}>
            <SelectBehavior label={text.nl.select_behaviour_label} value={currentId} onChange={setCurrentId} options={behaviorOptions} />
          </Box>

          {(complianceValuesHasGap || supportValuesHasGap) && (
            <InlineTooltip content={text.shared.line_chart.tooltip_witte_gaten_beschrijving}>
              <BoldText>{text.shared.line_chart.tooltip_witte_gaten_label}</BoldText>
            </InlineTooltip>
          )}
        </Box>

        <TimeSeriesChart<ValueType, SeriesConfig<ValueType>>
          accessibility={{
            key: 'behavior_line_chart',
          }}
          values={values}
          seriesConfig={[
            {
              type: 'gapped-line',
              metricProperty: selectedComplianceValueKey,
              label: text.shared.line_chart.compliance_label,
              shortLabel: text.shared.line_chart.compliance_short_label,
              strokeWidth: 3,
              color: colors.blue6,
            },
            {
              type: 'gapped-line',
              metricProperty: selectedSupportValueKey,
              label: text.shared.line_chart.support_label,
              shortLabel: text.shared.line_chart.support_short_label,
              strokeWidth: 3,
              color: colors.yellow3,
            },
          ]}
          dataOptions={{
            isPercentage: true,
            useDatesAsRange: useDatesAsRange,
            timelineEvents: timelineEvents,
          }}
          numGridLines={2}
          tickValues={[0, 25, 50, 75, 100]}
        />
      </Box>
    </ChartTile>
  );
}

/**
 * Trim all the null values on the left and the right side of the array.
 * If there are still null values left we can assume there is a gap in the data.
 */
export function useDataHasGaps<T>(values: T[], key: keyof T) {
  return useMemo(() => {
    const trimmedLeftValues = dropWhile(values, (i) => !isPresent(i[key]));
    const trimmedLeftAndRightValues = dropRightWhile(trimmedLeftValues, (i) => !isPresent(i[key]));

    return trimmedLeftAndRightValues.some((i) => !isPresent(i[key]));
  }, [key, values]);
}
