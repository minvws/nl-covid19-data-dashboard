import {
  NationalBehaviorValue,
  RegionalBehaviorValue,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { useState } from 'react';
import styled from 'styled-components';
import { isDefined, isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { PercentageBar } from '~/components/percentage-bar';
import { Tile } from '~/components/tile';
import { Heading } from '~/components/typography';
import { useIntl } from '~/intl';
import {
  BehaviorIdentifier,
  behaviorIdentifiers,
  BehaviorTrendType,
  BehaviorType,
} from './behavior-types';
import { BehaviorIcon } from './components/behavior-icon';
import { BehaviorTrend } from './components/behavior-trend';
import { BehaviorTypeControl } from './components/behavior-type-control';

type BehaviorValue = NationalBehaviorValue | RegionalBehaviorValue;

interface BehaviorTileProps {
  behavior: BehaviorValue;
  title: string;
  introduction: Record<BehaviorType, string>;
  footer: Record<BehaviorType, string>;
  footerAsterisk: Record<BehaviorType, string>;
}

export interface BehaviorFormatted {
  id: BehaviorIdentifier;
  description: string;
  percentage: number;
  trend?: BehaviorTrendType;
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
    borderBottomColor: 'lightGray',
    px: 3,
    py: 2,
  })
);

/* Format raw list of behaviors into list for compliance or for support */
function useFormatBehaviorType(
  behavior: BehaviorValue,
  type: BehaviorType
): BehaviorFormatted[] {
  const { siteText } = useIntl();

  return behaviorIdentifiers
    .map((identifier) => {
      const percentage = behavior[
        `${identifier}_${type}` as keyof BehaviorValue
      ] as number | null;
      const trend = (behavior[
        `${identifier}_${type}_trend` as keyof BehaviorValue
      ] ?? undefined) as BehaviorTrendType | null;

      return isPresent(percentage)
        ? {
            id: identifier,
            description: siteText.gedrag_onderwerpen[identifier],
            percentage,
            trend: trend || undefined,
          }
        : undefined;
    })
    .filter(isDefined);
}

/* Sort lists of formatted compliance and support behaviors */
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

function useFormatAndSortBehavior(behavior: BehaviorValue): {
  sortedCompliance: BehaviorFormatted[];
  sortedSupport: BehaviorFormatted[];
} {
  const compliance = useFormatBehaviorType(behavior, 'compliance');
  const support = useFormatBehaviorType(behavior, 'support');

  return sortBehavior(compliance, support);
}

export function BehaviorTableTile({
  behavior,
  title,
  introduction,
  footer,
  footerAsterisk,
}: BehaviorTileProps) {
  const { sortedCompliance, sortedSupport } =
    useFormatAndSortBehavior(behavior);
  const [behaviorType, setBehaviorType] = useState<BehaviorType>('compliance');

  const { siteText, formatPercentage } = useIntl();
  const commonText = siteText.gedrag_common;

  return (
    <Tile>
      <Heading level={3}>{title}</Heading>
      <Box display="flex" justifyContent="start">
        <BehaviorTypeControl value={behaviorType} onChange={setBehaviorType} />
      </Box>

      <p>{introduction[behaviorType]}</p>

      <div css={css({ overflow: 'auto' })}>
        <table css={css({ width: '100%', borderCollapse: 'collapse' })}>
          <thead>
            <tr>
              <HeaderCell colSpan={2}>
                {commonText.basisregels.header_percentage}
              </HeaderCell>
              <th />
              <HeaderCell>
                <span
                  css={css({
                    display: 'inline-block',
                    minWidth: [180, 200, 250, 180],
                  })}
                >
                  {commonText.basisregels.header_basisregel}
                </span>
              </HeaderCell>
              <HeaderCell>
                <span css={css({ display: 'inline-block', minWidth: 100 })}>
                  {commonText.basisregels.header_trend}
                </span>
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {(behaviorType === 'compliance'
              ? sortedCompliance
              : sortedSupport
            ).map((behavior) => (
              <tr key={behavior.id}>
                <Cell>{formatPercentage(behavior.percentage)}%</Cell>
                <Cell color="data.primary">
                  <PercentageBar percentage={behavior.percentage} />
                </Cell>
                <Cell>
                  <Box minWidth={32}>
                    <BehaviorIcon name={behavior.id} />
                  </Box>
                </Cell>
                <Cell>{behavior.description}</Cell>
                <Cell>
                  <BehaviorTrend trend={behavior.trend} />
                </Cell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p css={css({ color: 'annotation' })}>{footer[behaviorType]}</p>
      <p css={css({ color: 'annotation', m: 0 })}>
        {footerAsterisk[behaviorType]}
      </p>
    </Tile>
  );
}
