import {
  NationalBehaviorValue,
  VrBehaviorValue,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { Box, Spacer } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { MetadataProps } from '~/components/metadata';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { SelectBehavior } from './components/select-behavior';
import { BehaviorIdentifier } from './logic/behavior-types';

interface BehaviorLineChartTileProps {
  values: NationalBehaviorValue[] | VrBehaviorValue[];
  metadata: MetadataProps;
  currentId: BehaviorIdentifier;
  setCurrentId: React.Dispatch<React.SetStateAction<BehaviorIdentifier>>;
}

export function BehaviorLineChartTile({
  values,
  metadata,
  currentId,
  setCurrentId,
}: BehaviorLineChartTileProps) {
  const { siteText } = useIntl();
  const chartText = siteText.gedrag_common.line_chart;

  const selectedComplianceValueKey =
    `${currentId}_compliance` as keyof NationalBehaviorValue;
  const selectedSupportValueKey =
    `${currentId}_support` as keyof NationalBehaviorValue;

  return (
    <ChartTile title={chartText.title} metadata={metadata}>
      <Text css={css({ maxWidth: '30em' })}>{chartText.description}</Text>
      <Box>
        <SelectBehavior value={currentId} onChange={setCurrentId} />
      </Box>

      <Spacer mb={4} />

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
        dataOptions={{
          isPercentage: true,
        }}
        numGridLines={2}
        tickValues={[0, 25, 50, 75, 100]}
      />
    </ChartTile>
  );
}
