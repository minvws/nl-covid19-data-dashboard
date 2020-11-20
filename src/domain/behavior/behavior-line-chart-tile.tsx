import css from '@styled-system/css';
import { useState } from 'react';
import styled from 'styled-components';
import { isDefined } from 'ts-is-present';
import { Box, Spacer } from '~/components-styled/base';
import { Tile } from '~/components-styled/layout';
import { Select } from '~/components-styled/select';
import siteText from '~/locale/index';
import { NationalBehaviorValue } from '~/types/data';
import {
  BehaviorIdentifier,
  behaviorIdentifiers,
  BehaviorType,
} from './behavior-types';
import { BehaviorLineChart, Value } from './components/behavior-line-chart';
import { BehaviorTypeControl } from './components/behavior-type-control';

interface BehaviorLineChartTileProps {
  values: NationalBehaviorValue[];
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
        values.flatMap((x) => x[valueKey]).filter(Boolean).length > 1;

      return hasEnoughData
        ? {
            id,
            label,
            valueKey,
            isEnabled: hasEnoughData,
          }
        : undefined;
    })
    .filter(isDefined);

  return (
    <Tile
      /**
       * The mb here could alternatively be applied using a <Spacer/> in the
       * page markup. It's a choice, whether we like to include the bottom
       * margin on all our commonly used components or keep everything flexible
       * and use spacers in the context where the component is used.
       */
      mb={4}
      /**
       * The ml and mr negative margins should not be part of this component
       * ideally, but are the results of the page layout having paddings even on
       * small screens. We can remove this once we make all page section
       * elements full-width and remove the padding from the page layout.
       */
      ml={{ _: -4, sm: 0 }}
      mr={{ _: -4, sm: 0 }}
    >
      <Header>
        <Box mr={{ lg: '1em' }} mb={{ lg: '1em' }}>
          <h3>{title}</h3>
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
          values
            .map((value) =>
              valueKey in value
                ? ({
                    label,
                    date: value.week_start_unix,
                    value: value[valueKey],
                    week: {
                      start: value.week_start_unix,
                      end: value.week_end_unix,
                    },
                  } as Value)
                : undefined
            )
            .filter(isDefined)
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
