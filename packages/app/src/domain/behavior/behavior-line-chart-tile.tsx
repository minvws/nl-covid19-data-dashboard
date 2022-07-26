import {
  colors,
  NlBehaviorValue,
  VrBehaviorValue,
} from '@corona-dashboard/common';
import { dropRightWhile, dropWhile } from 'lodash';
import { useMemo } from 'react';
import { isDefined, isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { InlineTooltip } from '~/components/inline-tooltip';
import { MetadataProps } from '~/components/metadata';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TimelineEventConfig } from '~/components/time-series-chart/components/timeline';
import { BoldText } from '~/components/typography';
import { SiteText } from '~/locale';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { SelectBehavior } from './components/select-behavior';
import {
  BehaviorIdentifier,
  behaviorIdentifiers,
} from './logic/behavior-types';
interface BehaviorLineChartTileProps {
  values: NlBehaviorValue[] | VrBehaviorValue[];
  metadata: MetadataProps;
  currentId: BehaviorIdentifier;
  setCurrentId: React.Dispatch<React.SetStateAction<BehaviorIdentifier>>;
  behaviorOptions?: BehaviorIdentifier[];
  timelineEvents?: TimelineEventConfig[];
  useDatesAsRange?: boolean;
  text: SiteText['pages']['behavior_page'];
}

export function BehaviorLineChartTile({
  values,
  metadata,
  currentId,
  setCurrentId,
  behaviorOptions,
  timelineEvents,
  useDatesAsRange,
  text,
}: BehaviorLineChartTileProps) {
  const selectedComplianceValueKey =
    `${currentId}_compliance` as keyof NlBehaviorValue;
  const selectedSupportValueKey =
    `${currentId}_support` as keyof NlBehaviorValue;

  const complianceValuesHasGap = useDataHasGaps(
    values,
    selectedComplianceValueKey
  );
  const supportValuesHasGap = useDataHasGaps(values, selectedSupportValueKey);

  const breakpoints = useBreakpoints();

  return (
    <ChartTile
      title={text.shared.line_chart.title}
      metadata={metadata}
      description={text.shared.line_chart.description}
    >
      <Box spacing={4}>
        <Box
          display="flex"
          alignItems={{ lg: 'center' }}
          spacing={{ _: 3, lg: 0 }}
          flexDirection={{ _: 'column', lg: 'row' }}
          pb={3}
        >
          <Box pr={3} width={breakpoints.lg ? '50%' : '100%'}>
            <SelectBehavior
              label={text.nl.select_behaviour_label}
              value={currentId}
              onChange={setCurrentId}
              options={behaviorOptions}
            />
          </Box>

          {(complianceValuesHasGap || supportValuesHasGap) && (
            <InlineTooltip
              content={text.shared.line_chart.tooltip_witte_gaten_beschrijving}
            >
              <BoldText>
                {text.shared.line_chart.tooltip_witte_gaten_label}
              </BoldText>
            </InlineTooltip>
          )}
        </Box>

        <TimeSeriesChart
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
              color: colors.data.cyan,
            },
            {
              type: 'gapped-line',
              metricProperty: selectedSupportValueKey,
              label: text.shared.line_chart.support_label,
              shortLabel: text.shared.line_chart.support_short_label,
              strokeWidth: 3,
              color: colors.data.yellow,
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

export function getBehaviorChartOptions<T>(value: T) {
  return behaviorIdentifiers
    .map((key) => {
      if (`${key}_compliance` in value || `${key}_support` in value) {
        return key;
      }
    })
    .filter(isDefined);
}

/**
 * Trim all the null values on the left and the right side of the array.
 * If there are still null values left we can assume there is a gap in the data.
 */
export function useDataHasGaps<T>(values: T[], key: keyof T) {
  return useMemo(() => {
    const trimmedLeftValues = dropWhile(values, (i) => !isPresent(i[key]));
    const trimmedLeftAndRightValues = dropRightWhile(
      trimmedLeftValues,
      (i) => !isPresent(i[key])
    );

    return trimmedLeftAndRightValues.some((i) => !isPresent(i[key]));
  }, [key, values]);
}
