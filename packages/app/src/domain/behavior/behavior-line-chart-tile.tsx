import { NlBehaviorValue, VrBehaviorValue } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { isDefined, isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { MetadataProps } from '~/components/metadata';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { SelectBehavior } from './components/select-behavior';
import { BehaviorIdentifier } from './logic/behavior-types';
import { useBehaviorLookupKeys } from './logic/use-behavior-lookup-keys';

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

  return (
    <ChartTile
      title={chartText.title}
      metadata={metadata}
      description={chartText.description}
    >
      <Box spacing={4}>
        <SelectBehavior
          value={currentId}
          onChange={setCurrentId}
          options={behaviorOptions}
        />

        <TimeSeriesChart
          accessibility={{
            key: 'behavior_line_chart',
          }}
          values={values}
          seriesConfig={[
            {
              type: 'line',
              metricProperty: selectedComplianceValueKey,
              label: chartText.compliance_label,
              shortLabel: chartText.compliance_short_label,
              strokeWidth: 3,
              color: colors.data.cyan,
            },
            {
              type: 'line',
              metricProperty: selectedSupportValueKey,
              label: chartText.support_label,
              shortLabel: chartText.support_short_label,
              strokeWidth: 3,
              color: colors.data.yellow,
            },
          ]}
          dataOptions={{ isPercentage: true }}
          numGridLines={2}
          tickValues={[0, 25, 50, 75, 100]}
        />
      </Box>
    </ChartTile>
  );
}

export function useBehaviorChartOptions(
  values: NlBehaviorValue[] | VrBehaviorValue[]
) {
  const behaviorLookupKeys = useBehaviorLookupKeys();

  return useMemo(() => {
    return behaviorLookupKeys
      .map((x) => {
        const complianceValues = values
          .map((value) => value[x.complianceKey])
          .filter(isPresent);
        const supportValues = values
          .map((value) => value[x.supportKey])
          .filter(isPresent);

        if (complianceValues.length && supportValues.length) {
          return x.key;
        }
      })
      .filter(isDefined);
  }, [values, behaviorLookupKeys]);
}
