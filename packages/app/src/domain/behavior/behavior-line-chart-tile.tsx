import css from '@styled-system/css';
import { useState } from 'react';
import styled from 'styled-components';
import { isPresent } from 'ts-is-present';
import { Box, Spacer } from '~/components-styled/base';
import { Tile } from '~/components-styled/tile';
import { Select } from '~/components-styled/select';
import { Heading } from '~/components-styled/typography';
import siteText from '~/locale/index';
import { NationalBehaviorValue, RegionalBehaviorValue } from '~/types/data';
import {
  BehaviorIdentifier,
  behaviorIdentifiers,
  BehaviorType,
} from './behavior-types';
import { BehaviorLineChart, Value } from './components/behavior-line-chart';
import { BehaviorTypeControl } from './components/behavior-type-control';

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
  const [type, setType] = useState<BehaviorType>('compliance');
  const [currentId, setCurrentId] = useState<BehaviorIdentifier>('wash_hands');

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

      <Box display="flex" justifyContent="start">
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

      <BehaviorLineChart
        values={behaviorIdentifierWithData.map(({ valueKey, label }) =>
          (values as NationalBehaviorValue[])
            .map((value) =>
              valueKey in value
                ? ({
                    label,
                    date: value.date_start_unix,
                    value: value[valueKey],
                    week: {
                      start: value.date_start_unix,
                      end: value.date_end_unix,
                    },
                  } as Value)
                : undefined
            )
            .filter(isPresent)
        )}
        linesConfig={behaviorIdentifierWithData.map(({ id }) => ({
          id,
          isSelected: id === currentId,
          onClick: setCurrentId,
        }))}
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
