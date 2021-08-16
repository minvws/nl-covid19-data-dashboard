import { NlBehaviorValue, VrBehaviorValue } from '@corona-dashboard/common';
import { dropRightWhile, dropWhile } from 'lodash';
import { useMemo } from 'react';
import { isDefined, isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { InlineTooltip } from '~/components/inline-tooltip';
import { MetadataProps } from '~/components/metadata';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
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
}

export function BehaviorLineChartTile({
  values,
  metadata,
  currentId,
  setCurrentId,
  behaviorOptions,
}: BehaviorLineChartTileProps) {
  const { siteText } = useIntl();
  const chartText = siteText.gedrag_common.line_chart;

  const selectedComplianceValueKey =
    `${currentId}_compliance` as keyof NlBehaviorValue;
  const selectedSupportValueKey =
    `${currentId}_support` as keyof NlBehaviorValue;

  const complianceValuesHasGap = useDataHasGaps(
    values,
    selectedComplianceValueKey
  );
  const supportValuesHasGap = useDataHasGaps(values, selectedSupportValueKey);

  return (
    <ChartTile
      title={chartText.title}
      metadata={metadata}
      description={chartText.description}
    >
      <Box spacing={4}>
        <Box
          display="flex"
          alignItems={{ lg: 'center' }}
          spacing={{ _: 3, lg: 0 }}
          flexDirection={{ _: 'column', lg: 'row' }}
        >
          <Box pr={3}>
            <SelectBehavior
              value={currentId}
              onChange={setCurrentId}
              options={behaviorOptions}
            />
          </Box>

          {(complianceValuesHasGap || supportValuesHasGap) && (
            <InlineTooltip content={chartText.tooltip_witte_gaten_beschrijving}>
              <InlineText fontWeight="bold">
                {chartText.tooltip_witte_gaten_label}
              </InlineText>
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
              label: chartText.compliance_label,
              shortLabel: chartText.compliance_short_label,
              strokeWidth: 3,
              color: colors.data.cyan,
            },
            {
              type: 'gapped-line',
              metricProperty: selectedSupportValueKey,
              label: chartText.support_label,
              shortLabel: chartText.support_short_label,
              strokeWidth: 3,
              color: colors.data.yellow,
            },
          ]}
          dataOptions={{
            isPercentage: true,
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
 * Trimm all the null values on the left and the right side of the array.
 * If there are still null values left we can assume there is a gap in the data.
 */
export function useDataHasGaps(
  values: NlBehaviorValue[] | VrBehaviorValue[],
  key: keyof NlBehaviorValue
) {
  return useMemo(() => {
    const trimmedLeftValues = dropWhile(values, (i) => !isPresent(i[key]));
    const trimmedLeftAndRightValues = dropRightWhile(
      trimmedLeftValues,
      (i) => !isPresent(i[key])
    );

    return trimmedLeftAndRightValues.some((i) => !isPresent(i[key]));
  }, [key, values]);
}
