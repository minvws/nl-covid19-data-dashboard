import css from '@styled-system/css';
import { useState } from 'react';
import styled from 'styled-components';
import { Box } from '~/components-styled/base';
import { Tile } from '~/components-styled/layout';
import { PercentageBar } from '~/components-styled/percentage-bar';
import { NationalBehaviorValue, RegionalBehaviorValue } from '~/types/data';
import { formatPercentage } from '~/utils/formatNumber';
import {
  behaviorIdentifiers,
  BehaviorIdentifier,
  BehaviorTrendType,
  BehaviorType,
} from './behavior-types';
import { BehaviorIcon } from './components/behavior-icon';
import { BehaviorTrend } from './components/behavior-trend';
import { BehaviorTypeControl } from './components/behavior-type-control';
import siteText from '~/locale/index';

const commonText = siteText.gedrag_common;

type BehaviorValue = NationalBehaviorValue | RegionalBehaviorValue;

interface BehaviorTileProps {
  behavior: BehaviorValue;
  title: string;
  introduction: Record<BehaviorType, string>;
  footer: Record<BehaviorType, string>;
}

interface BehaviorFormatted {
  id: BehaviorIdentifier;
  description: string;
  percentage: number | undefined;
  trend: BehaviorTrendType | undefined;
}

const HeaderCell = styled.th(
  css({
    px: 3,
    py: 2,
    textAlign: 'left',
  })
);

const Cell = styled.td((x) =>
  css({
    color: x.color,
    borderBottom: '1px solid',
    borderBottomColor: 'lightGrey',
    px: 3,
    py: 2,
    whiteSpace: ['nowrap', null, 'normal'],
  })
);

/* Format raw list of behaviors into list for compliance or for support */
function formatBehaviorType(
  behavior: BehaviorValue,
  type: BehaviorType
): BehaviorFormatted[] {
  return behaviorIdentifiers.map((identifier) => {
    const percentage = behavior[
      `${identifier}_${type}` as keyof BehaviorValue
    ] as number | null;
    const trend = (behavior[
      `${identifier}_${type}_trend` as keyof BehaviorValue
    ] ?? undefined) as BehaviorTrendType | null;

    return {
      id: identifier,
      description: siteText.gedrag_onderwerpen[identifier],
      percentage: percentage ?? undefined,
      trend: trend ?? undefined,
    };
  });
}

/* Sort lists of formatted compliance and support behaviours */
function sortBehavior(
  compliance: BehaviorFormatted[],
  support: BehaviorFormatted[]
): {
  sortedCompliance: BehaviorFormatted[];
  sortedSupport: BehaviorFormatted[];
} {
  /* Sort compliance on percentage, decreasing; percentage can be null */
  const sortedCompliance = compliance.sort(
    (a, b) => (b.percentage ?? 0) - (a.percentage ?? 0)
  );

  /* Sort support based on the order of compliance */
  const sortedSupport = support.sort((a, b) => {
    return (
      sortedCompliance.findIndex((x) => x.id === a.id) -
      sortedCompliance.findIndex((x) => x.id === b.id)
    );
  });

  return { sortedCompliance, sortedSupport };
}

function formatAndSortBehavior(
  behavior: BehaviorValue
): {
  sortedCompliance: BehaviorFormatted[];
  sortedSupport: BehaviorFormatted[];
} {
  const compliance = formatBehaviorType(behavior, 'compliance');
  const support = formatBehaviorType(behavior, 'support');

  return sortBehavior(compliance, support);
}

export function BehaviorTableTile({
  behavior,
  title,
  introduction,
  footer,
}: BehaviorTileProps) {
  const { sortedCompliance, sortedSupport } = formatAndSortBehavior(behavior);
  const [behaviorType, setBehaviorType] = useState<BehaviorType>('compliance');

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
      <h3>{title}</h3>
      <Box display="flex" justifyContent="start">
        <BehaviorTypeControl value={behaviorType} onChange={setBehaviorType} />
      </Box>

      <p>{introduction[behaviorType]}</p>

      <div css={css({ overflow: 'auto' })}>
        <table css={css({ width: '100%' })}>
          <thead>
            <tr>
              <HeaderCell colSpan={2}>
                {commonText.basisregels.header_percentage}
              </HeaderCell>
              <th />
              <HeaderCell>
                {commonText.basisregels.header_basisregel}
              </HeaderCell>
              <HeaderCell>{commonText.basisregels.header_trend}</HeaderCell>
            </tr>
          </thead>
          <tbody>
            {(behaviorType === 'compliance'
              ? sortedCompliance
              : sortedSupport
            ).map((behavior) => (
              <tr key={behavior.id}>
                <Cell>{formatPercentage(behavior.percentage ?? 0)}%</Cell>
                <Cell
                  color={behaviorType === 'compliance' ? 'blue' : 'blueDark'}
                >
                  <PercentageBar percentage={behavior.percentage ?? 0} />
                </Cell>
                <Cell>
                  <Box minWidth={32}>
                    <BehaviorIcon name={behavior.id} />
                  </Box>
                </Cell>
                <Cell>
                  <Box minWidth={220}>{behavior.description}</Box>
                </Cell>
                <Cell>
                  <BehaviorTrend trend={behavior.trend} />
                </Cell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p css={css({ color: 'gray' })}>{footer[behaviorType]}</p>
    </Tile>
  );
}
