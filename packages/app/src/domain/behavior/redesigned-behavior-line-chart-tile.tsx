import {
  NationalBehaviorValue,
  RegionalBehaviorValue,
} from '@corona-dashboard/common';
import { useState } from 'react';
import { isPresent } from 'ts-is-present';
import { Box, Spacer } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { Select } from '~/components/select';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { BehaviorIdentifier, behaviorIdentifiers } from './behavior-types';

interface BehaviorLineChartTileProps {
  values: NationalBehaviorValue[] | RegionalBehaviorValue[];
}

export function BehaviorLineChartTile({ values }: BehaviorLineChartTileProps) {
  const { siteText } = useIntl();

  const [currentId, setCurrentId] = useState<BehaviorIdentifier>('wash_hands');
  const selectedComplianceValueKey = `${currentId}_compliance` as keyof NationalBehaviorValue;
  const selectedSupportValueKey = `${currentId}_support` as keyof NationalBehaviorValue;

  const behaviorIdentifierWithData = behaviorIdentifiers
    .map((id) => {
      const label = siteText.gedrag_onderwerpen[id];

      /**
       * We'll only render behaviors with 2 or more values, otherwise it cannot
       * result in a "line" in our line-chart.
       */
      const complianceHasEnoughData =
        (values as NationalBehaviorValue[])
          .map((x) => x[selectedComplianceValueKey])
          .filter(isPresent).length > 1;
      const supportHasEnoughData =
        (values as NationalBehaviorValue[])
          .map((x) => x[selectedSupportValueKey])
          .filter(isPresent).length > 1;

      return complianceHasEnoughData || supportHasEnoughData
        ? {
            id,
            label,
          }
        : undefined;
    })
    .filter(isPresent);

  return (
    <ChartTile title={'titleeeee'} metadata={{}}>
      <p>Description Texttttt</p>
      <Box>
        <Select
          value={currentId}
          onChange={setCurrentId}
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
            shortLabel: 'Percentage naleving',
            label: 'Naleving: gedragsregel volgen in dagelijks leven',
            strokeWidth: 3,
            color: colors.data.primary,
          },
          {
            type: 'line',
            metricProperty: selectedSupportValueKey,
            shortLabel: 'Percentage draagvlak',
            label: 'Draagvlak: achter een gedragsregal te staan',
            strokeWidth: 3,
            color: colors.data.emphasis,
          },
        ]}
        dataOptions={{
          isPercentage: true,
        }}
        tickValues={[0, 25, 50, 75, 100]}
      />
    </ChartTile>
  );
}
