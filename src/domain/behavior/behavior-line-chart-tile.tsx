import css from '@styled-system/css';
import { useState } from 'react';
import styled from 'styled-components';
import { isDefined } from 'ts-is-present';
import { Box, Spacer } from '~/components-styled/base';
import { Tile } from '~/components-styled/layout';
import { Metadata, MetadataProps } from '~/components-styled/metadata';
import { Select } from '~/components-styled/select';
import siteText from '~/locale/index';
import { NationalBehaviorValue } from '~/types/data';
import {
  BehaviorIdentifier,
  behaviorIdentifiers,
  GedragText,
} from './behavior-types';
import { BehaviorLineChart, Value } from './components/behavior-line-chart';
import {
  BehaviorTypeControl,
  BehaviorTypeControlOption,
} from './components/behavior-type-control';

interface BehaviorLineChartTileProps {
  text: GedragText;
  values: NationalBehaviorValue[];
  metadata: MetadataProps;
}

export function BehaviorLineChartTile({
  text,
  values,
  metadata,
}: BehaviorLineChartTileProps) {
  const [type, setType] = useState<BehaviorTypeControlOption>('compliance');
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
          <h3>{text.basisregels_over_tijd.title}</h3>
        </Box>
      </Header>

      <Box display="flex" justifyContent="start">
        <BehaviorTypeControl value={type} onChange={setType} />
      </Box>

      <Box
        display="flex"
        alignItems="baseline"
        flexDirection={{ _: 'column', lg: 'row' }}
      >
        <Box flex="1" mr={{ lg: 2 }}>
          <p>{text.basisregels_over_tijd.intro[type]}</p>
        </Box>
        <Box flex="1" ml={{ lg: 2 }}>
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

      {/* Using a spacer to push the footer down */}
      <Spacer m="auto" />
      <Metadata {...metadata} />
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
