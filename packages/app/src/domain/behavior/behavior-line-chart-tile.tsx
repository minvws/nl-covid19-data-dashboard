import {
  NationalBehaviorValue,
  RegionalBehaviorValue,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { useState } from 'react';
import styled from 'styled-components';
import { isPresent } from 'ts-is-present';
import { Box, Spacer } from '~/components-styled/base';
import { Select } from '~/components-styled/select';
import { Tile } from '~/components-styled/tile';
import { TimeSeriesChart } from '~/components-styled/time-series-chart';
import { Heading } from '~/components-styled/typography';
import { colors } from '~/style/theme';
import {
  BehaviorIdentifier,
  behaviorIdentifiers,
  BehaviorType,
} from './behavior-types';
import { BehaviorTypeControl } from './components/behavior-type-control';
import { useIntl } from '~/intl';

interface BehaviorLineChartTileProps {
  values: NationalBehaviorValue[] | RegionalBehaviorValue[];
  title: string;
  introduction: Record<BehaviorType, string>;
}

export function BehaviorLineChartTile({
  title,
  introduction,
  values,
}: BehaviorLineChartTileProps) {
  const { siteText } = useIntl();

  const [type, setType] = useState<BehaviorType>('compliance');
  const [currentId, setCurrentId] = useState<BehaviorIdentifier>('wash_hands');
  const selectedValueKey = `${currentId}_${type}` as keyof NationalBehaviorValue;

  const behaviorIdentifierWithData = behaviorIdentifiers
    .map((id) => {
      const label = siteText.gedrag_onderwerpen[id];
      const valueKey = `${id}_${type}` as keyof NationalBehaviorValue;

      /**
       * We'll only render behaviors with 2 or more values, otherwise it cannot
       * result in a "line" in our line-chart.
       */
      const hasEnoughData =
        (values as NationalBehaviorValue[])
          .map((x) => x[valueKey])
          .filter(isPresent).length > 1;

      return hasEnoughData
        ? {
            id,
            label,
            valueKey,
            isEnabled: hasEnoughData,
          }
        : undefined;
    })
    .filter(isPresent);

  return (
    <Tile>
      <Header>
        <Box mr={{ lg: '1em' }} mb={{ lg: '1em' }}>
          <Heading level={3}>{title}</Heading>
        </Box>
      </Header>

      <Box display="flex" justifyContent="start" mb={3}>
        <BehaviorTypeControl value={type} onChange={setType} />
      </Box>

      <Box
        display={{ lg: 'flex' }}
        alignItems="baseline"
        flexDirection={{ lg: 'row' }}
      >
        <Box flex="1" mr={{ lg: 2 }}>
          <p>{introduction[type]}</p>
        </Box>
        <Box flex="1" display="flex" justifyContent="flex-end" ml={{ lg: 2 }}>
          <Select
            value={currentId}
            onChange={setCurrentId}
            options={behaviorIdentifierWithData.map(({ id, label }) => ({
              value: id,
              label,
            }))}
          />
        </Box>
      </Box>

      <Spacer mb={3} />

      <TimeSeriesChart
        title={
          type === 'compliance'
            ? siteText.gedrag_common.compliance
            : siteText.gedrag_common.support
        }
        values={values}
        ariaLabelledBy=""
        seriesConfig={[...behaviorIdentifierWithData]
          .sort((x) => (x.valueKey === selectedValueKey ? 1 : -1))
          .map((x) => ({
            type: 'line' as const,
            metricProperty: x.valueKey,
            label: x.label,
            strokeWidth: x.valueKey === selectedValueKey ? 3 : 2,
            color:
              x.valueKey === selectedValueKey ? colors.data.primary : '#E7E7E7',
          }))}
        disableLegend
        dataOptions={{
          isPercentage: true,
        }}
        tickValues={[0, 25, 50, 75, 100]}
        onSeriesClick={(config) => {
          const id = config.metricProperty.replace(`_${type}`, '');
          setCurrentId(id as BehaviorIdentifier);
        }}
        markNearestPointOnly
      />
    </Tile>
  );
}

const Header = styled.header(
  css({
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: ['column', null, null, 'row'],
  })
);
