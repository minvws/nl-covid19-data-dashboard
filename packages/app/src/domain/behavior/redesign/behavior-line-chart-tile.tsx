import {
  NationalBehaviorValue,
  RegionalBehaviorValue,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { isPresent } from 'ts-is-present';
import { Box, Spacer } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { MetadataProps } from '~/components/metadata';
import { Select } from '~/components/select';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { BehaviorIdentifier, behaviorIdentifiers } from '../behavior-types';
import { BehaviorIcon } from '../components/behavior-icon';

interface BehaviorLineChartTileProps {
  values: NationalBehaviorValue[] | RegionalBehaviorValue[];
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

  const behaviorIdentifierWithData = behaviorIdentifiers
    .map((id) => {
      const label = siteText.gedrag_onderwerpen[id];

      /**
       * We'll only render behaviors with 2 or more values, otherwise it cannot
       * result in a "line" in our line-chart.
       */
      const complianceHasEnoughData =
        (values as NationalBehaviorValue[])
          .map((x) => x[`${id}_compliance` as keyof NationalBehaviorValue])
          .filter(isPresent).length > 1;
      const supportHasEnoughData =
        (values as NationalBehaviorValue[])
          .map((x) => x[`${id}_support` as keyof NationalBehaviorValue])
          .filter(isPresent).length > 1;

      return complianceHasEnoughData || supportHasEnoughData
        ? {
            id,
            label,
          }
        : undefined;
    })
    .filter(isPresent);

  const selectedComplianceValueKey =
    `${currentId}_compliance` as keyof NationalBehaviorValue;
  const selectedSupportValueKey =
    `${currentId}_support` as keyof NationalBehaviorValue;

  return (
    <ChartTile title={chartText.title} metadata={metadata}>
      <Text css={css({ maxWidth: '30em' })}>{chartText.description}</Text>
      <Box>
        <Select
          value={currentId}
          onChange={setCurrentId}
          icon={<BehaviorIcon name={currentId} size={20} />}
          options={behaviorIdentifierWithData.map(({ id, label }) => ({
            value: id,
            label,
          }))}
        />
      </Box>

      <Spacer mb={4} />

      <TimeSeriesChart
        values={values}
        ariaLabelledBy=""
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
